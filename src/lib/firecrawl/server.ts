import Firecrawl from '@mendable/firecrawl-js';

import { env } from '@/lib/env';

export function getFirecrawlClient() {
  if (!env.firecrawlApiKey) {
    throw new Error('FIRECRAWL_API_KEY is not set.');
  }

  return new Firecrawl({ apiKey: env.firecrawlApiKey });
}
