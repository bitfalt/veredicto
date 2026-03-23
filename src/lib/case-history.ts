import fs from 'node:fs/promises';
import path from 'node:path';

import { type CaseResearchResult } from '@/lib/agents/case-context';

export type CaseHistoryItem = {
  id: string;
  title: string;
  meta: string;
  kind: 'PDF' | 'DOCX' | 'AUDIO' | 'LINK' | 'TEXT';
  updatedAt: string;
  verdict: 'Seguir' | 'Revisar' | 'Frenar';
  summary: string;
  sources: Array<{ title: string; url: string }>;
};

const storageDir = path.join(process.cwd(), 'data');
const storagePath = path.join(storageDir, 'case-history.json');

async function ensureStore() {
  await fs.mkdir(storageDir, { recursive: true });
  try {
    await fs.access(storagePath);
  } catch {
    await fs.writeFile(storagePath, '[]', 'utf8');
  }
}

export async function getCaseHistory(): Promise<CaseHistoryItem[]> {
  await ensureStore();
  const raw = await fs.readFile(storagePath, 'utf8');
  try {
    return JSON.parse(raw) as CaseHistoryItem[];
  } catch {
    return [];
  }
}

export async function saveCaseHistoryItem(item: CaseHistoryItem) {
  const current = await getCaseHistory();
  const next = [item, ...current].slice(0, 30);
  await fs.writeFile(storagePath, JSON.stringify(next, null, 2), 'utf8');
}

export function buildHistoryItem({
  prompt,
  attachmentsProcessed,
  research,
}: {
  prompt: string;
  attachmentsProcessed: string[];
  research: CaseResearchResult;
}): CaseHistoryItem {
  const firstAttachment = attachmentsProcessed[0] ?? '';
  const firstUrl = research.sources[0]?.url ?? '';

  const kind: CaseHistoryItem['kind'] = firstAttachment.toLowerCase().endsWith('.pdf')
    ? 'PDF'
    : firstAttachment.toLowerCase().endsWith('.docx')
      ? 'DOCX'
      : /(\.mp3|\.wav|\.m4a|\.mpeg|\.mp4)$/i.test(firstAttachment)
        ? 'AUDIO'
        : firstUrl
          ? 'LINK'
          : 'TEXT';

  return {
    id: `${Date.now()}-${Math.random()}`,
    title: prompt.trim().slice(0, 72) || firstAttachment || 'Consulta sin titulo',
    meta: research.summary,
    kind,
    updatedAt: new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    verdict: research.recommendation.label,
    summary: research.summary,
    sources: research.sources.map((source) => ({ title: source.title, url: source.url })),
  };
}
