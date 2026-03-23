import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';

import { type CaseResearchResult, type CaseResearchSource } from '@/lib/agents/case-context';
import { buildHistoryItem, saveCaseHistoryItem } from '@/lib/case-history';
import { env } from '@/lib/env';
import { getElevenLabsClient } from '@/lib/elevenlabs/server';
import { getFirecrawlClient } from '@/lib/firecrawl/server';

type NormalizedPayload = {
  prompt: string;
  attachments: File[];
  attachmentNames: string[];
};

function stripMarkdown(value: string) {
  return value
    .replace(/[#>*_`~\-]+/g, ' ')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function shorten(value: string, max = 220) {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trimEnd()}...`;
}

function deriveRecommendation(text: string): CaseResearchResult['recommendation'] {
  const value = text.toLowerCase();

  if (/(estafa|fraude|demasiado barato|riesgo alto|promesas sin respaldo|urgente|vendedor no verificable|presion para pago)/.test(value)) {
    return {
      label: 'Frenar',
      summary: 'Hay senales de alerta serias. Conviene pausar antes de seguir.',
    };
  }

  if (/(contrato|clausula|licencia|ambigua|documento|revision|terminos|condiciones)/.test(value)) {
    return {
      label: 'Revisar',
      summary: 'Hay zonas grises que merecen revision manual antes de decidir.',
    };
  }

  return {
    label: 'Seguir',
    summary: 'No aparecen alertas graves de inmediato, aunque siempre conviene revisar con calma.',
  };
}

function extractUrls(text: string) {
  return Array.from(text.matchAll(/https?:\/\/[^\s]+/g)).map((match) => match[0]);
}

function removeUrls(text: string) {
  return text.replace(/https?:\/\/[^\s]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function pickSnippet(result: Record<string, unknown>) {
  const directSnippet =
    (typeof result.description === 'string' && result.description) ||
    (typeof result.snippet === 'string' && result.snippet) ||
    (typeof result.summary === 'string' && result.summary) ||
    '';

  if (directSnippet) return shorten(stripMarkdown(directSnippet));

  const markdown = typeof result.markdown === 'string' ? result.markdown : '';
  if (markdown) return shorten(stripMarkdown(markdown));

  return 'Fuente encontrada durante la investigacion.';
}

function normalizeSearchResults(payload: unknown): CaseResearchSource[] {
  const candidate = payload as {
    data?: { web?: Array<Record<string, unknown>> };
    web?: Array<Record<string, unknown>>;
    results?: Array<Record<string, unknown>>;
  };

  const rawResults = candidate.data?.web ?? candidate.web ?? candidate.results ?? [];

  return rawResults
    .map((item) => {
      const title = typeof item.title === 'string' ? item.title : 'Fuente encontrada';
      const url = typeof item.url === 'string' ? item.url : '';
      const snippet = pickSnippet(item);

      if (!url) return null;

      return { title, url, snippet } satisfies CaseResearchSource;
    })
    .filter((item): item is CaseResearchSource => Boolean(item));
}

async function normalizeRequest(request: NextRequest): Promise<NormalizedPayload> {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('multipart/form-data')) {
    const form = await request.formData();
    const prompt = String(form.get('prompt') ?? '').trim();
    const files = form.getAll('files').filter((entry): entry is File => entry instanceof File && entry.size > 0);

    return {
      prompt,
      attachments: files,
      attachmentNames: files.map((file) => file.name),
    };
  }

  const body = (await request.json()) as { prompt?: string; attachments?: string[] };
  const attachmentNames = Array.isArray(body.attachments) ? body.attachments.filter(Boolean) : [];

  return {
    prompt: body.prompt?.trim() ?? '',
    attachments: [],
    attachmentNames,
  };
}

async function extractPdfText(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return result.text ?? '';
  } finally {
    await parser.destroy();
  }
}

async function extractDocxText(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await mammoth.extractRawText({ buffer });
  return result.value ?? '';
}

async function extractAudioText(file: File) {
  if (!env.elevenLabsApiKey) return '';

  const client = getElevenLabsClient();
  const transcription = await client.speechToText.convert({
    modelId: 'scribe_v2',
    languageCode: 'es',
    file,
  });

  if ('text' in transcription && typeof transcription.text === 'string') {
    return transcription.text;
  }

  if ('transcripts' in transcription && Array.isArray(transcription.transcripts)) {
    return transcription.transcripts.map((item) => item.text).join(' ');
  }

  return '';
}

async function extractFileContext(file: File) {
  const fileName = file.name;
  const lower = fileName.toLowerCase();

  try {
    if (lower.endsWith('.pdf')) {
      const text = await extractPdfText(file);
      return {
        name: fileName,
        text: shorten(stripMarkdown(text), 1200),
      };
    }

    if (lower.endsWith('.docx')) {
      const text = await extractDocxText(file);
      return {
        name: fileName,
        text: shorten(stripMarkdown(text), 1200),
      };
    }

    if (lower.endsWith('.txt')) {
      const text = await file.text();
      return {
        name: fileName,
        text: shorten(stripMarkdown(text), 1200),
      };
    }

    if (/(\.mp3|\.wav|\.m4a|\.mpeg|\.mp4)$/i.test(lower)) {
      const text = await extractAudioText(file);
      return {
        name: fileName,
        text: shorten(stripMarkdown(text), 1200),
      };
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'No se pudo procesar el archivo';
    return {
      name: fileName,
      text: `No pude extraer este archivo correctamente: ${reason}`,
    };
  }

  return {
    name: fileName,
    text: 'Formato no soportado para extraccion automatica. Usa PDF, DOCX, TXT o audio.',
  };
}

async function scrapeDirectUrls(urls: string[]) {
  if (!env.firecrawlApiKey || urls.length === 0) return [] as CaseResearchSource[];

  const firecrawl = getFirecrawlClient();
  const directSources: CaseResearchSource[] = [];

  for (const url of urls.slice(0, 3)) {
    try {
      const result = await firecrawl.scrape(url, {
        formats: ['markdown'],
        onlyMainContent: true,
        timeout: 30000,
      });

      directSources.push({
        title: (result as Record<string, unknown>).metadata && typeof (result as any).metadata?.title === 'string'
          ? (result as any).metadata.title
          : url,
        url,
        snippet: shorten(stripMarkdown(typeof (result as any).markdown === 'string' ? (result as any).markdown : '')), 
      });
    } catch {
      directSources.push({
        title: url,
        url,
        snippet: 'No se pudo extraer el contenido principal de este enlace, pero se tuvo en cuenta en la investigacion.',
      });
    }
  }

  return directSources;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, attachments, attachmentNames } = await normalizeRequest(request);

    if (!prompt && attachments.length === 0 && attachmentNames.length === 0) {
      return NextResponse.json({ error: 'Prompt or attachments are required.' }, { status: 400 });
    }

    const fileContexts = attachments.length ? await Promise.all(attachments.map(extractFileContext)) : [];
    const contextFragments = fileContexts
      .map((item) => `${item.name}: ${item.text}`.trim())
      .filter(Boolean)
      .slice(0, 4);

    const directUrls = extractUrls(prompt);
    const searchQueryBase = removeUrls(prompt);
    const query = `${searchQueryBase} ${contextFragments.join(' ')}`.trim().slice(0, 600);
    const recommendation = deriveRecommendation(`${prompt} ${contextFragments.join(' ')}`);

    if (!env.firecrawlApiKey) {
      const fallbackResult = {
        researched: false,
        query,
        summary: `Estoy usando un modo local de investigacion. ${attachmentNames.length ? `Adjuntos detectados: ${attachmentNames.join(', ')}.` : ''} Ya tengo un contexto inicial para ayudarte.`,
        recommendation,
        sources: [],
        attachmentsProcessed: attachmentNames,
        contextFragments,
      } satisfies CaseResearchResult;

      await saveCaseHistoryItem(buildHistoryItem({
        prompt,
        attachmentsProcessed: attachmentNames,
        research: fallbackResult,
      }));

      return NextResponse.json(fallbackResult);
    }

    const firecrawl = getFirecrawlClient();
    const [directSources, searchResults] = await Promise.all([
      scrapeDirectUrls(directUrls),
      query
        ? firecrawl.search(query, {
            limit: 4,
            scrapeOptions: { formats: ['markdown'] },
          })
        : Promise.resolve([]),
    ]);

    const searchSources = normalizeSearchResults(searchResults);
    const sources = [...directSources, ...searchSources].filter(
      (source, index, all) => all.findIndex((item) => item.url === source.url) === index,
    ).slice(0, 5);

    const summary = sources.length
      ? `Revise ${sources.length} fuentes relevantes y ${attachmentNames.length} adjuntos. ${sources[0] ? `La pista mas fuerte apunta a ${sources[0].title}.` : ''}`
      : `Revise ${attachmentNames.length} adjuntos y ya tengo un contexto inicial para ayudarte, aunque no aparecieron fuentes publicas fuertes.`;

    const result = {
      researched: true,
      query,
      summary,
      recommendation,
      sources,
      attachmentsProcessed: attachmentNames,
      contextFragments,
    } satisfies CaseResearchResult;

    await saveCaseHistoryItem(buildHistoryItem({
      prompt,
      attachmentsProcessed: attachmentNames,
      research: result,
    }));

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: `Case research failed: ${message}` },
      { status: 500 },
    );
  }
}
