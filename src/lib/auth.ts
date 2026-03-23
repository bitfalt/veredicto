import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';

import { getDb } from '@/lib/db';
import { env, getGoogleOAuthConfig } from '@/lib/env';

const db = getDb();

const googleAuthConfig = getGoogleOAuthConfig();
const betterAuthBaseURL = env.betterAuthUrl.replace(/\/$/, '');

export const auth = betterAuth({
  database: db,
  secret: env.betterAuthSecret ?? 'dev-only-secret-change-me-please-replace-before-production',
  baseURL: env.betterAuthUrl,
  trustedOrigins: [env.appUrl],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: googleAuthConfig.isConfigured
    ? {
        google: {
          clientId: googleAuthConfig.clientId!,
          clientSecret: googleAuthConfig.clientSecret!,
          redirectURI: `${betterAuthBaseURL}/api/auth/callback/google`,
        },
      }
    : undefined,
  user: {
    additionalFields: {},
  },
  plugins: [nextCookies()],
});

export type AuthSession = typeof auth.$Infer.Session;
