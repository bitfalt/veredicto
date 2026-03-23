import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireSession(redirectTo = '/inicio-de-sesion') {
  const session = await getSession();
  if (!session) {
    redirect(redirectTo);
  }
  return session;
}
