type RecommendationLabel = 'Seguir' | 'Revisar' | 'Frenar';

export type CaseResearchSource = {
  title: string;
  url: string;
  snippet: string;
};

export type CaseResearchResult = {
  researched: boolean;
  query: string;
  summary: string;
  recommendation: {
    label: RecommendationLabel;
    summary: string;
  };
  sources: CaseResearchSource[];
  attachmentsProcessed: string[];
  contextFragments: string[];
};

export function buildInitialCaseContext({
  prompt,
  attachments,
}: {
  prompt: string;
  attachments: string[];
}) {
  const cleanPrompt = prompt.trim();
  const attachmentText = attachments.length ? `Archivos adjuntos: ${attachments.join(', ')}.` : '';

  if (!cleanPrompt && !attachments.length) {
    return 'Consulta abierta del usuario. Aun no hay detalles suficientes y necesito una primera orientacion clara.';
  }

  return `Caso inicial del usuario: ${cleanPrompt || 'La consulta se inicio principalmente con archivos adjuntos.'} ${attachmentText}`.trim();
}

export function buildAgentResearchBrief({
  initialContext,
  research,
}: {
  initialContext: string;
  research: CaseResearchResult;
}) {
  const sourceLines = research.sources.length
    ? research.sources
        .map((source, index) => `${index + 1}. ${source.title} - ${source.url} - ${source.snippet}`)
        .join('\n')
    : 'No hubo fuentes publicas fuertes, pero si un contexto inicial del caso.';

  const attachmentLines = research.attachmentsProcessed.length
    ? research.attachmentsProcessed.map((item) => `- ${item}`).join('\n')
    : 'No hubo adjuntos procesados.';

  const contextLines = research.contextFragments.length
    ? research.contextFragments.map((item, index) => `${index + 1}. ${item}`).join('\n')
    : 'No hubo fragmentos adicionales extraidos del caso.';

  return [
    'CONTEXTO DEL CASO',
    initialContext,
    '',
    'INVESTIGACION PREVIA',
    `Consulta buscada: ${research.query}`,
    `Resumen: ${research.summary}`,
    `Recomendacion inicial: ${research.recommendation.label} - ${research.recommendation.summary}`,
    '',
    'ADJUNTOS PROCESADOS',
    attachmentLines,
    '',
    'HALLAZGOS CLAVE DEL CASO',
    contextLines,
    '',
    'FUENTES REVISADAS',
    sourceLines,
    '',
    'INSTRUCCIONES DE RESPUESTA',
    '- Empieza asumiendo que ya estudiaste el caso.',
    '- Resume primero la recomendacion principal en voz clara y corta.',
    '- Usa las fuentes solo como apoyo, nunca inventes ninguna.',
    '- Haz una sola pregunta de seguimiento si hace falta.',
  ].join('\n');
}
