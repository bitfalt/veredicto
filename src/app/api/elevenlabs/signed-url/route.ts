import { NextResponse } from 'next/server';

import { env } from '@/lib/env';
import { getElevenLabsClient } from '@/lib/elevenlabs/server';

export async function GET() {
  if (!env.elevenLabsApiKey || !env.elevenLabsAgentId) {
    return NextResponse.json(
      { error: 'Missing ELEVENLABS_API_KEY or ELEVENLABS_AGENT_ID.' },
      { status: 500 },
    );
  }

  try {
    const client = getElevenLabsClient();
    const signedUrl = await client.conversationalAi.conversations.getSignedUrl({
      agentId: env.elevenLabsAgentId,
      includeConversationId: true,
    });

    return NextResponse.json(signedUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: `Failed to create signed URL: ${message}` },
      { status: 500 },
    );
  }
}
