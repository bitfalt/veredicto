import Link from 'next/link';

import { LoginForm } from '@/components/veredicto/login-form';
import { Logo } from '@/components/veredicto/logo';
import { getGoogleOAuthConfig } from '@/lib/env';

type LoginPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function getFirstSearchParam(value: string | string[] | undefined) {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function buildInitialAuthError(searchParams: { [key: string]: string | string[] | undefined }) {
  const error = getFirstSearchParam(searchParams.error);
  const errorDescription = getFirstSearchParam(searchParams.error_description);
  const provider = getFirstSearchParam(searchParams.provider);

  if (!error && !errorDescription) {
    return null;
  }

  const normalizedError = (error ?? '').trim().toLowerCase();
  if (normalizedError === 'access_denied') {
    return 'La autenticacion con Google fue cancelada. Vuelve a intentarlo si quieres.';
  }

  if (normalizedError === 'configuration_error') {
    return 'No se pudo iniciar Google porque faltan credenciales o la configuracion del proveedor.';
  }

  if (errorDescription) {
    try {
      return decodeURIComponent(errorDescription);
    } catch {
      return errorDescription;
    }
  }

  if (normalizedError) {
    const providerSuffix = provider ? ` (proveedor: ${provider})` : '';
    return `Error de inicio con Google${providerSuffix}: ${error}`;
  }

  return 'No se pudo completar la autenticacion con Google.';
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const requestedNextPath = typeof resolvedSearchParams.next === 'string' ? resolvedSearchParams.next : '/panel';
  const nextPath = requestedNextPath.startsWith('/') ? requestedNextPath : '/panel';
  const googleAuthConfig = getGoogleOAuthConfig();
  const initialError = buildInitialAuthError(resolvedSearchParams);

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-brand-base px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center text-center">
          <Logo />
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gray">
            Portal de Acceso
          </p>
        </div>

        <div className="rounded-2xl border border-brand-gray/20 bg-brand-base/50 p-8 backdrop-blur-sm">
          <h2 className="mb-6 font-headline text-2xl font-bold tracking-tight text-brand-light">
            Bienvenido
          </h2>

          <LoginForm
            nextPath={nextPath}
            googleEnabled={googleAuthConfig.isConfigured}
            googleConfigMissing={googleAuthConfig.missing}
            initialError={initialError}
          />
        </div>

        <p className="mt-8 text-center text-sm text-brand-muted">
          ¿Necesitas mas de 2 evaluaciones?{' '}
          <Link href="/precios" className="font-semibold text-brand-light hover:text-brand-accent">
            Ver planes
          </Link>
        </p>
      </div>
    </main>
  );
}
