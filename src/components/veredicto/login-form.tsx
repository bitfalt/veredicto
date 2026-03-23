'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

import { signIn, signUp } from '@/lib/auth-client';



type Mode = 'sign-in' | 'sign-up';

type LoginFlow = 'email' | 'google';

function getAuthErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = (error as { message?: unknown }).message;
    return typeof msg === 'string' ? msg : fallback;
  }
  return fallback;
}

export function LoginForm({
  nextPath = '/panel',
  googleEnabled = false,
  initialError,
}: {
  nextPath?: string;
  googleEnabled?: boolean;
  googleConfigMissing?: string[];
  initialError?: string | null;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [activeFlow, setActiveFlow] = useState<LoginFlow | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialError) {
      setError(initialError);
    }
  }, [initialError]);

  const isPending = activeFlow !== null;
  const errorCallbackURL = `/inicio-de-sesion?next=${encodeURIComponent(nextPath)}&provider=google&status=error`;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActiveFlow('email');
    setError(null);

    try {
      if (mode === 'sign-up') {
        const result = await signUp.email({ email, password, name, callbackURL: nextPath });
        if (result.error) {
          setError(result.error.message ?? 'No pude crear la cuenta.');
          return;
        }
      } else {
        const result = await signIn.email({ email, password, callbackURL: nextPath });
        if (result.error) {
          setError(result.error.message ?? 'No pude iniciar sesion.');
          return;
        }
      }

      router.replace(nextPath);
      router.refresh();
    } catch (caught) {
      setError(getAuthErrorMessage(caught, 'No pude autenticarte.'));
    } finally {
      setActiveFlow(null);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!googleEnabled) {
      setError('El acceso con Google no esta disponible.');
      return;
    }

    setActiveFlow('google');
    setError(null);

    try {
      const result = await signIn.social({
        provider: 'google',
        callbackURL: nextPath,
        errorCallbackURL,
        newUserCallbackURL: nextPath,
      });

      if (result.error) {
        setError(result.error.message ?? 'No pude iniciar sesion con Google.');
      }
    } catch (caught) {
      setError(getAuthErrorMessage(caught, 'No pude abrir el login con Google.'));
    } finally {
      setActiveFlow(null);
    }
  };

  return (
    <div className="space-y-5">
      <button
        type="button"
        disabled={!googleEnabled || isPending}
        onClick={handleGoogleSignIn}
        className="relative flex w-full items-center justify-center gap-3 rounded-xl border border-brand-gray/20 bg-white px-4 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continuar con Google
      </button>

      {!googleEnabled && (
        <p className="text-center text-xs text-brand-muted">
          Google no disponible — usa email abajo
        </p>
      )}

      <div className="relative flex items-center gap-3">
        <div className="h-px flex-1 bg-brand-gray/20" />
        <span className="text-[10px] uppercase tracking-widest text-brand-gray">
          o
        </span>
        <div className="h-px flex-1 bg-brand-gray/20" />
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {mode === 'sign-up' && (
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl border border-brand-gray/20 bg-brand-base/50 px-4 py-3 text-sm text-brand-light placeholder:text-brand-gray outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30"
          />
        )}

        <input
          type="email"
          placeholder="Correo electronico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-xl border border-brand-gray/20 bg-brand-base/50 px-4 py-3 text-sm text-brand-light placeholder:text-brand-gray outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30"
        />

        <input
          type="password"
          placeholder="Contrasena"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full rounded-xl border border-brand-gray/20 bg-brand-base/50 px-4 py-3 text-sm text-brand-light placeholder:text-brand-gray outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30"
        />

        {error && (
          <p className="text-sm text-brand-accent">{error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-brand-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-[#E53D1E] disabled:opacity-50"
        >
          {isPending ? 'Procesando...' : mode === 'sign-in' ? 'Entrar' : 'Crear cuenta'}
        </button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
          className="text-sm text-brand-muted hover:text-brand-light"
        >
          {mode === 'sign-in' ? 'No tienes cuenta? Crea una' : 'Ya tienes cuenta? Entra'}
        </button>
      </div>
    </div>
  );
}
