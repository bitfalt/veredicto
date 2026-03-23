import fs from 'node:fs/promises';
import path from 'node:path';

import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

const projectRoot = '/Users/ritxiel/Developer/ElevenLabs-Firecrawl';
const envPath = path.join(projectRoot, '.env');

const SYSTEM_PROMPT = `Eres Veredicto, un especialista de riesgo claro, calmado y muy confiable.

Contexto de producto:
- La aplicacion te entregara un caso ya investigado con resumen, recomendacion inicial y fuentes.
- Tu trabajo no es volver a pedir todo desde cero, sino conversar como un experto que ya estudio el caso.

Reglas:
- Habla siempre en espanol claro, natural y facil de seguir.
- Empieza con una conclusion breve y luego explica lo mas importante.
- Prioriza lenguaje humano sobre jerga legal o tecnica.
- Si hay fuentes, mencionalas solo como apoyo y nunca inventes ninguna.
- Haz como maximo una pregunta de seguimiento a la vez.
- Si el usuario cambia de tema o interrumpe, adapta la conversacion de inmediato.
- Mantente conciso, util y sereno.
- Si el riesgo es alto, dilo con claridad y explica por que.
- Si el caso no tiene suficiente informacion, pide exactamente el dato minimo que falta.`;

function parseEnvFile(raw) {
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    env[key] = value;
  }
  return env;
}

function upsertEnv(raw, key, value) {
  const line = `${key}=${value}`;
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(raw)) return raw.replace(regex, line);
  return `${raw.trimEnd()}\n${line}\n`;
}

async function main() {
  const rawEnv = await fs.readFile(envPath, 'utf8');
  const env = parseEnvFile(rawEnv);

  if (!env.ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY is missing in .env');
  }

  const client = new ElevenLabsClient({ apiKey: env.ELEVENLABS_API_KEY });

  const agent = await client.conversationalAi.agents.create({
    name: 'Veredicto Specialist',
    conversationConfig: {
      agent: {
        firstMessage:
          'Ya revise tu caso. Voy a resumirte lo importante y luego puedes interrumpirme cuando quieras para preguntar algo puntual.',
        language: 'es',
        prompt: {
          prompt: SYSTEM_PROMPT,
          llm: 'gemini-2.5-flash',
          temperature: 0.35,
        },
      },
      tts: {
        modelId: 'eleven_flash_v2_5',
        voiceId: 'EXAVITQu4vr4xnSDxMaL',
      },
    },
  });

  if (!agent.agentId) {
    throw new Error('Agent creation succeeded but no agentId was returned.');
  }

  const updatedEnv = upsertEnv(rawEnv, 'ELEVENLABS_AGENT_ID', agent.agentId);
  await fs.writeFile(envPath, updatedEnv, 'utf8');

  console.log(`Created ElevenLabs agent: ${agent.agentId}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
