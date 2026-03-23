import Link from 'next/link';

import { Icon } from '@/components/veredicto/icon';
import { MarketingShell } from '@/components/veredicto/marketing-shell';
import { Reveal, RevealGroup, RevealItem } from '@/components/veredicto/motion';

export default function HowItWorksPage() {
  return (
    <MarketingShell>
      <header className="mb-24 text-center md:text-left">
        <Reveal>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-brand-accent">
            Ingenieria de Precision
          </h4>
          <h1 className="max-w-4xl font-headline text-5xl font-extrabold tracking-tight text-brand-light md:text-7xl">
            La anatomia de una{' '}
            <span className="bg-[linear-gradient(135deg,_#FF7A50_0%,_#FF4B2A_100%)] bg-clip-text italic text-transparent pr-2">
              decision infalible.
            </span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-brand-muted md:text-xl">
            Descubre como Veredicto transforma datos en bruto en claridad estrategica mediante nuestra arquitectura propietaria de tres capas.
          </p>
        </Reveal>
      </header>

      <RevealGroup as="section" className="mb-32 grid grid-cols-1 gap-6 md:grid-cols-12 md:auto-rows-fr">
        {/* Step 1 */}
        <RevealItem className="md:col-span-7">
          <div className="surface-tint group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-brand-gray/20 p-10 shadow-sm transition-all duration-500 hover:border-brand-gray/40 hover:bg-[#15181D] md:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,75,42,0.06)_0%,_rgba(11,12,16,0)_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative z-10 flex h-full flex-col">
              <div className="mb-12">
                <span className="font-headline text-6xl font-black text-brand-accent/20">01</span>
                <h2 className="mt-4 font-headline text-3xl font-bold tracking-tight text-brand-light">Extraccion de Datos</h2>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-brand-muted">
                  Nuestra primera capa utiliza OCR avanzado y conectores API de baja latencia para ingerir documentos legales, financieros y tecnicos sin perdida de fidelidad.
                </p>
              </div>
              <div className="mt-auto grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-4 rounded-2xl border border-brand-gray/10 bg-brand-base/50 p-5 backdrop-blur-sm">
                  <Icon name="description" className="text-xl text-brand-accent" />
                  <span className="text-sm font-semibold tracking-wide text-brand-light">Ingesta Multi-formato</span>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-brand-gray/10 bg-brand-base/50 p-5 backdrop-blur-sm">
                  <Icon name="security" className="text-xl text-brand-accent" />
                  <span className="text-sm font-semibold tracking-wide text-brand-light">Cifrado End-to-End</span>
                </div>
              </div>
            </div>
          </div>
        </RevealItem>

        <RevealItem className="md:col-span-5">
          <div className="surface-tint flex h-full items-center justify-center rounded-[2rem] border border-brand-gray/20 p-10 shadow-sm transition-all duration-500 hover:border-brand-gray/40 hover:bg-[#15181D] md:p-12">
            <div className="grid w-full max-w-[240px] grid-cols-2 gap-3">
              <div className="aspect-square rounded-2xl border border-brand-gray/10 bg-brand-base/50" />
              <div className="aspect-square rounded-2xl border border-brand-gray/10 bg-brand-base/50" />
              <div className="aspect-square rounded-2xl border border-brand-gray/10 bg-brand-base/50" />
              <div className="flex aspect-square items-center justify-center rounded-2xl border border-brand-accent/20 bg-brand-accent/10 shadow-[inset_0_0_20px_rgba(255,75,42,0.1)]">
                <Icon name="cloud_done" className="text-4xl text-brand-accent" />
              </div>
            </div>
          </div>
        </RevealItem>

        {/* Step 2 */}
        <RevealItem className="md:col-span-12">
          <div className="surface-tint group relative flex flex-col gap-12 overflow-hidden rounded-[2rem] border border-brand-gray/20 p-10 shadow-sm transition-all duration-500 hover:border-brand-gray/40 hover:bg-[#15181D] md:flex-row md:items-center md:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(255,75,42,0.06)_0%,_rgba(11,12,16,0)_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative z-10 flex-1">
              <span className="font-headline text-6xl font-black text-brand-accent/20">02</span>
              <h2 className="mt-4 font-headline text-4xl font-extrabold tracking-tight text-brand-light md:text-5xl">
                Motor de Analisis <span className="bg-[linear-gradient(135deg,_#FF7A50_0%,_#FF4B2A_100%)] bg-clip-text italic text-transparent">Obsidian</span>
              </h2>
              <p className="mb-8 mt-6 max-w-2xl text-lg leading-relaxed text-brand-muted">
                El nucleo de Veredicto. Una red neuronal disenada para la deteccion de anomalias, lectura profunda de contextos legales y reconocimiento de patrones de riesgo latentes.
              </p>
            </div>
            <div className="relative z-10 flex aspect-square w-full max-w-sm items-center justify-center rounded-full border border-brand-accent/20 bg-brand-base/80 p-6 shadow-[0_0_80px_rgba(255,75,42,0.1)] backdrop-blur-xl md:w-1/3">
              <div className="relative flex h-full w-full items-center justify-center rounded-full border border-dashed border-brand-accent/40">
                <div className="absolute inset-0 m-auto h-1/2 w-1/2 rounded-full bg-brand-accent opacity-20 blur-3xl" />
                <Icon name="visibility" className="absolute text-6xl text-brand-accent drop-shadow-[0_0_15px_rgba(255,75,42,0.5)]" />
              </div>
            </div>
          </div>
        </RevealItem>

        {/* Step 3 */}
        <RevealItem className="md:col-span-4">
          <div className="surface-tint group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-brand-gray/20 p-10 shadow-sm transition-all duration-500 hover:border-brand-gray/40 hover:bg-[#15181D]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,75,42,0.06)_0%,_rgba(11,12,16,0)_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative z-10 flex h-full flex-col">
              <span className="font-headline text-6xl font-black text-brand-accent/20">03</span>
              <h2 className="mt-4 font-headline text-2xl font-bold tracking-tight text-brand-light">Generacion de Veredicto</h2>
              <p className="mb-10 mt-4 text-base leading-relaxed text-brand-muted">
                Traduccion de hallazgos complejos en una puntuacion de riesgo sintetizada y un plan de accion ejecutivo instantaneo.
              </p>
              
              <div className="mt-auto space-y-4">
                <div className="h-2 w-full overflow-hidden rounded-full bg-brand-gray/20">
                  <div className="h-full w-3/4 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                </div>
                <div className="flex justify-between px-1 text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                  <span className="text-emerald-400">Seguir</span>
                  <span>Revisar</span>
                  <span>Frenar</span>
                </div>
              </div>
            </div>
          </div>
        </RevealItem>

        <RevealItem className="md:col-span-8">
          <div className="surface-tint group relative flex h-full flex-col items-start justify-between overflow-hidden rounded-[2rem] border border-brand-gray/20 p-10 shadow-sm transition-all duration-500 hover:border-brand-gray/40 hover:bg-[#15181D] md:flex-row md:items-center md:p-12">
            <div className="relative z-10 max-w-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-gray/30 bg-brand-base">
                <Icon name="assignment_turned_in" className="text-2xl text-brand-accent" />
              </div>
              <h3 className="mb-3 text-3xl font-bold tracking-tight text-brand-light">Entregable Premium</h3>
              <p className="text-lg leading-relaxed text-brand-muted">Cada analisis culmina en un informe interactivo con validez tecnica y referencias enlazadas, listo para presentar a comites directivos.</p>
            </div>
            <Link 
              href="/panel" 
              className="relative z-10 mt-8 rounded-full border border-brand-accent/20 bg-brand-accent px-8 py-4 text-base font-bold text-white shadow-[0_16px_46px_rgba(255,75,42,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 hover:translate-y-[-1px] hover:bg-[#E53D1E] hover:shadow-[0_22px_64px_rgba(255,75,42,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] md:mt-0"
            >
              Ver Ejemplo de Reporte
            </Link>
          </div>
        </RevealItem>
      </RevealGroup>
    </MarketingShell>
  );
}
