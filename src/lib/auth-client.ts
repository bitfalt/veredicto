'use client';

import { createAuthClient } from 'better-auth/react';

import { env } from '@/lib/env';

export const authClient = createAuthClient({
  baseURL: env.appUrl,
});

export const { signIn, signOut, signUp, useSession } = authClient;
