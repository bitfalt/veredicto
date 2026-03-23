const isProduction = process.env.NODE_ENV === 'production';

function optionalNumber(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  betterAuthSecret: process.env.BETTER_AUTH_SECRET,
  betterAuthUrl: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  databasePath: process.env.DATABASE_PATH ?? './data/veredicto.sqlite',
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY,
  elevenLabsAgentId: process.env.ELEVENLABS_AGENT_ID,
  firecrawlApiKey: process.env.FIRECRAWL_API_KEY,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  polarAccessToken: process.env.POLAR_ACCESS_TOKEN,
  polarWebhookSecret: process.env.POLAR_WEBHOOK_SECRET,
  polarServer: (process.env.POLAR_SERVER === 'sandbox' ? 'sandbox' : 'production') as 'sandbox' | 'production',
  polarProProductId: process.env.POLAR_PRODUCT_ID_PRO,
  polarSuccessUrl: process.env.POLAR_SUCCESS_URL,
  polarReturnUrl: process.env.POLAR_RETURN_URL,
  freeEvaluationsLimit: optionalNumber(process.env.FREE_EVALUATIONS_LIMIT, 2),
  useLocalAgentSimulation:
    process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_USE_LOCAL_AGENT_SIMULATION === 'true',
  isProduction,
};

export function requireEnv(name: keyof typeof env, message?: string) {
  const value = env[name];
  if (!value) {
    throw new Error(message ?? `Missing environment variable: ${String(name)}`);
  }
  return value;
}

export function isGoogleAuthConfigured() {
  const clientId = env.googleClientId?.trim();
  const clientSecret = env.googleClientSecret?.trim();
  return Boolean(clientId && clientSecret);
}

export function getGoogleAuthConfig() {
  const clientId = env.googleClientId?.trim() ?? null;
  const clientSecret = env.googleClientSecret?.trim() ?? null;

  const missing: string[] = [];
  if (!clientId) missing.push('GOOGLE_CLIENT_ID');
  if (!clientSecret) missing.push('GOOGLE_CLIENT_SECRET');

  return {
    clientId,
    clientSecret,
    isConfigured: missing.length === 0,
    missing,
  };
}

export function getGoogleOAuthConfig() {
  return getGoogleAuthConfig();
}

export function isPolarConfigured() {
  return Boolean(env.polarAccessToken && env.polarProProductId);
}

export function isAuthConfigured() {
  return Boolean(env.betterAuthSecret);
}
