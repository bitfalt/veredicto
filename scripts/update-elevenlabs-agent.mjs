import fs from 'node:fs/promises';
import path from 'node:path';

import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

const SYSTEM_PROMPT = `Eres Veredicto, un especialista de riesgo claro, calmado y muy confiable.

Contexto de producto:
- La aplicacion te entregara un caso ya investigado con resumen, recomendacion inicial y fuentes.
- Tu trabajo no es volver a pedir todo desde cero, sino conversar como un experto que ya estudio el caso.

Reglas:
- Habla siempre en espanol claro, natural y facil de seguir.
- Empieza con una conclusion breve y luego desarrolla la idea completa sin cortarte a mitad de frase.
- En tu primera respuesta da una explicacion util en 3 partes: conclusion, razones principales y siguiente paso recomendado.
- Prioriza lenguaje humano sobre jerga legal o tecnica.
- Si hay fuentes, mencionalas solo como apoyo y nunca inventes ninguna.
- Haz como maximo una pregunta de seguimiento a la vez, y solo despues de haber explicado bien tu punto.
- Si el usuario cambia de tema o interrumpe, adapta la conversacion de inmediato.
- Mantente util y sereno, pero no excesivamente breve si el caso requiere contexto.
- Si el riesgo es alto, dilo con claridad y explica por que.
- Si el caso no tiene suficiente informacion, pide exactamente el dato minimo que falta.
- No repitas la misma conclusion varias veces si el usuario no ha aportado informacion nueva.
- Si el usuario guarda silencio, espera con calma y evita insistir de inmediato.`;

const projectRoot = '/Users/ritxiel/Developer/ElevenLabs-Firecrawl';
const envPath = path.join(projectRoot, '.env');

function parseEnvFile(raw) {
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return env;
}

async function main() {
  const rawEnv = await fs.readFile(envPath, 'utf8');
  const env = parseEnvFile(rawEnv);

  if (!env.ELEVENLABS_API_KEY || !env.ELEVENLABS_AGENT_ID) {
    throw new Error('Missing ELEVENLABS_API_KEY or ELEVENLABS_AGENT_ID in .env');
  }

  const client = new ElevenLabsClient({ apiKey: env.ELEVENLABS_API_KEY });

  await client.conversationalAi.agents.update(env.ELEVENLABS_AGENT_ID, {
    conversationConfig: {
      agent: {
        disableFirstMessageInterruptions: true,
        firstMessage:
          'Ya revise tu caso. Primero voy a explicarte la conclusion principal y despues, si quieres, profundizamos juntos.',
        prompt: {
          prompt: SYSTEM_PROMPT,
          temperature: 0.25,
        },
      },
      turn: {
        turnEagerness: 'patient',
        turnTimeout: 26,
        silenceEndCallTimeout: -1,
        speculativeTurn: false,
        softTimeoutConfig: {
          timeoutSeconds: -1,
          message: '...',
          useLlmGeneratedMessage: false,
        },
      },
    },
  });

  console.log(`Updated ElevenLabs agent turn settings: ${env.ELEVENLABS_AGENT_ID}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
