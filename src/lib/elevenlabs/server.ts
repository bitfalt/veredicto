import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

import { env } from '@/lib/env';

export function getElevenLabsClient() {
  if (!env.elevenLabsApiKey) {
    throw new Error('ELEVENLABS_API_KEY is not set.');
  }

  return new ElevenLabsClient({ apiKey: env.elevenLabsApiKey });
}
