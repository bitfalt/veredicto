import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/lib/env';
import { getFirecrawlClient } from '@/lib/firecrawl/server';

export async function POST(request: NextRequest) {
  if (!env.firecrawlApiKey) {
    return NextResponse.json(
      { error: 'Missing FIRECRAWL_API_KEY.' },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as { query?: string; limit?: number };
    const query = body.query?.trim();
    const limit = body.limit ?? 5;

    if (!query) {
      return NextResponse.json(
        { error: 'A search query is required.' },
        { status: 400 },
      );
    }

    const firecrawl = getFirecrawlClient();
    const results = await firecrawl.search(query, {
      limit,
      scrapeOptions: { formats: ['markdown'] },
    });

    return NextResponse.json(results);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: `Firecrawl search failed: ${message}` },
      { status: 500 },
    );
  }
}
