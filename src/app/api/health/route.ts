import { NextResponse } from 'next/server';

import { env } from '@/lib/env';

export function GET() {
  return NextResponse.json({
    ok: true,
    appUrl: env.appUrl,
    hasElevenLabs: Boolean(env.elevenLabsApiKey && env.elevenLabsAgentId),
    hasFirecrawl: Boolean(env.firecrawlApiKey),
  });
}
