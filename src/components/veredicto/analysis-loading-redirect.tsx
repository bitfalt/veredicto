'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const phases = [
  'Leyendo la informacion...',
  'Buscando antecedentes utiles...',
  'Revisando posibles riesgos...',
  'Preparando una respuesta clara...',
];

type AnalysisLoadingRedirectProps = {
  source: string;
};

export function AnalysisLoadingRedirect({ source }: AnalysisLoadingRedirectProps) {
  const router = useRouter();
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const phaseTimer = window.setInterval(() => {
      setPhaseIndex((current) => (current < phases.length - 1 ? current + 1 : current));
    }, 1100);

    const redirectTimer = window.setTimeout(() => {
      const params = new URLSearchParams({
        estado: 'veredicto-listo',
        fuente: source,
      });
      void router.push(`/panel?${params.toString()}`);
    }, 4200);

    return () => {
      window.clearInterval(phaseTimer);
      window.clearTimeout(redirectTimer);
    };
  }, [router, source]);

  return (
    <div className="space-y-4">
      {phases.map((phase, index) => {
        const completed = index < phaseIndex;
        const current = index === phaseIndex;

        return (
          <div
            key={phase}
            className={`flex items-center justify-between rounded-2xl p-3 text-sm transition ${
              current
                ? 'animate-pulse border border-brand-gray/10 bg-white/[0.03]'
                : completed
                  ? ''
                  : 'opacity-30'
            }`}
          >
            <div className="flex items-center gap-4">
              {completed ? (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-accent text-white">✓</div>
              ) : current ? (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-brand-accent/40 text-brand-accent">
                  <span className="h-1.5 w-1.5 animate-ping rounded-full bg-brand-accent" />
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full border-2 border-brand-gray/20" />
              )}
              <span className="font-medium tracking-wide text-brand-light">{phase}</span>
            </div>
            <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${completed ? 'bg-brand-accent/10 text-brand-accent' : current ? 'bg-brand-accent/15 text-brand-accent' : 'border border-brand-gray/10 text-brand-gray'}`}>
              {completed ? 'listo' : current ? 'en curso' : 'pendiente'}
            </span>
          </div>
        );
      })}
    </div>
  );
}
