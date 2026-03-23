import { AnalysisLoadingRedirect } from '@/components/veredicto/analysis-loading-redirect';
import { Icon } from '@/components/veredicto/icon';

type LoadingAnalysisPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function LoadingAnalysisPage({ searchParams }: LoadingAnalysisPageProps) {
  const resolvedSearchParams = await searchParams;
  const source = typeof resolvedSearchParams.fuente === 'string' ? resolvedSearchParams.fuente : 'fuente analizada';

  return (
    <main className="relative flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_50%,_rgba(255,75,42,0.12)_0%,_rgba(255,75,42,0.04)_35%,_rgba(11,12,16,0)_100%)] blur-[140px]" />

      <div className="relative z-10 mb-16 flex flex-col items-center">
        <div className="relative flex h-64 w-64 items-center justify-center rounded-full shadow-[0_0_120px_20px_rgba(255,75,42,0.08)] lg:h-80 lg:w-80">
          <div className="absolute inset-0 animate-pulse rounded-full border border-brand-accent/20" />
          <div className="absolute inset-8 animate-pulse rounded-full border border-brand-accent/10" />
          <div className="absolute inset-16 animate-pulse rounded-full border border-brand-gray/10" />
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-brand-accent/20 bg-brand-base shadow-[0_0_50px_rgba(255,75,42,0.12)] lg:h-36 lg:w-36">
            <Icon name="visibility" className="text-5xl text-brand-accent lg:text-6xl" />
          </div>
        </div>
      </div>

      <div className="relative z-10 mb-12 text-center">
        <h2 className="font-headline mb-3 text-4xl font-extrabold tracking-tight text-brand-light lg:text-5xl">
          Estamos revisando tu caso
        </h2>
        <p className="mx-auto max-w-xl text-base leading-relaxed text-brand-muted">
          Veredicto esta leyendo la informacion que compartiste, buscando antecedentes y preparando una respuesta clara para ti.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <AnalysisLoadingRedirect source={source} />
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-6 py-8 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gray/60 md:gap-10">
        <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Buscando fuentes</div>
        <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />Preparando respuesta</div>
        <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand-light/70" />Abriendo consulta</div>
      </div>
    </main>
  );
}
