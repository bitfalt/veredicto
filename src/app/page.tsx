import Link from 'next/link';

import { HeroBackground } from '@/components/veredicto/hero-lava-background';
import { Icon } from '@/components/veredicto/icon';
import { MarketingShell } from '@/components/veredicto/marketing-shell';
import {
  HeroReveal,
  HeroScene,
  Reveal,
  RevealGroup,
  RevealItem,
  ScaleReveal,
  SectionScene,
} from '@/components/veredicto/motion';

export default function HomePage() {
  return (
    <MarketingShell>
      {/* ── Hero ── */}
      <HeroScene
        className="relative left-1/2 flex min-h-[100dvh] w-screen -translate-x-1/2 items-center justify-center overflow-hidden bg-brand-base"
        background={<HeroBackground />}
      >
        <div className="flex w-full justify-center px-6 pb-32 pt-34 md:px-10 lg:px-12">
          <div className="w-full max-w-[76rem] text-center">
          <div className="mx-auto max-w-[58rem] text-center">
            <HeroReveal i={0}>
              <span className="inline-block rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-muted backdrop-blur-md">
                Inteligencia Analitica de Confianza
              </span>
            </HeroReveal>

            <HeroReveal i={1}>
              <h1 className="mx-auto mt-6 max-w-4xl text-balance font-headline text-[3.25rem] font-extrabold leading-[1.05] tracking-tight text-brand-light sm:text-6xl md:text-7xl lg:text-[5rem]">
                Antes de firmar, pagar o creer, obten un{' '}
                <span className="bg-[linear-gradient(135deg,_#FF7A50_0%,_#FF4B2A_100%)] bg-clip-text italic text-transparent pr-2">
                  veredicto
                </span>
                claro.
              </h1>
            </HeroReveal>

            <HeroReveal i={2}>
              <p className="mx-auto mt-7 max-w-[42rem] text-base font-normal leading-8 text-brand-muted md:text-lg md:leading-8">
                Nuestra plataforma utiliza modelos de riesgo avanzados para analizar contratos, anuncios y propuestas, entregandote una evaluacion de seguridad en segundos.
              </p>
            </HeroReveal>

            <HeroReveal i={3}>
              <div className="mx-auto mt-10 flex w-fit flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/panel"
                  className="rounded-full border border-brand-accent/20 bg-brand-accent px-8 py-4 text-base font-semibold text-white shadow-[0_16px_46px_rgba(255,75,42,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-md transition-all duration-300 hover:translate-y-[-1px] hover:bg-[#E53D1E] hover:shadow-[0_22px_64px_rgba(255,75,42,0.3),inset_0_1px_0_rgba(255,255,255,0.3)]"
                >
                  Probar demo
                </Link>
                <Link
                  href="/como-funciona"
                  className="rounded-full border border-brand-gray/30 bg-white/[0.02] px-8 py-4 text-base font-medium text-brand-light backdrop-blur-md transition-all duration-300 hover:border-brand-gray/50 hover:bg-white/[0.05]"
                >
                  Ver como funciona
                </Link>
              </div>
            </HeroReveal>
          </div>
          </div>
        </div>
      </HeroScene>

      {/* ── Use Cases ── */}
      <SectionScene className="relative -mt-28 mb-32 bg-[linear-gradient(180deg,_rgba(11,12,16,0)_0%,_rgba(11,12,16,0.68)_8%,_rgba(11,12,16,0.94)_20%,_rgba(11,12,16,1)_34%,_rgba(11,12,16,1)_100%)] pb-20 pt-36">
        <Reveal>
          <div className="mb-16 text-left">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-brand-accent">Casos de Uso</h2>
            <h3 className="font-headline text-4xl font-bold tracking-tight text-brand-light md:text-5xl">Donde la precision importa.</h3>
          </div>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-12 md:auto-rows-fr md:h-[600px]">
          <RevealItem className="md:col-span-8">
            <article className="surface-tint group relative h-full overflow-hidden rounded-[2rem] border border-brand-gray/20 shadow-sm transition-all duration-500 hover:border-brand-gray/40 hover:bg-[#15181D]">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,75,42,0.06)_0%,_rgba(11,12,16,0)_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative z-10 flex h-full flex-col justify-between p-10 md:p-12">
                <div>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-gray/30 bg-brand-base">
                    <Icon name="contract" className="text-2xl text-brand-accent" />
                  </div>
                  <h4 className="mb-3 text-3xl font-bold tracking-tight text-brand-light">Contratos y Legal</h4>
                  <p className="max-w-md text-lg leading-relaxed text-brand-muted">
                    Analiza clausulas abusivas o riesgos ocultos en documentos legales complejos antes de comprometerte.
                  </p>
                </div>
                <div className="mt-8 flex gap-3">
                  <span className="rounded-full border border-brand-gray/30 bg-brand-base px-4 py-1.5 text-xs font-medium tracking-wide text-brand-light">Clausulas</span>
                  <span className="rounded-full border border-brand-gray/30 bg-brand-base px-4 py-1.5 text-xs font-medium tracking-wide text-brand-light">PDF</span>
                </div>
              </div>
            </article>
          </RevealItem>

          <RevealItem className="md:col-span-4">
            <article className="surface-tint group relative h-full rounded-[2rem] border border-brand-gray/20 p-10 shadow-sm transition-all duration-500 hover:border-brand-gray/40 hover:bg-[#15181D] md:p-12">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-gray/30 bg-brand-base">
                <Icon name="real_estate_agent" className="text-2xl text-brand-accent" />
              </div>
              <h4 className="mb-3 text-3xl font-bold tracking-tight text-brand-light">Inmobiliaria</h4>
              <p className="text-lg leading-relaxed text-brand-muted">Evita fraudes en anuncios de alquiler o venta detectando patrones sospechosos.</p>
            </article>
          </RevealItem>

          <RevealItem className="md:col-span-4">
            <article className="surface-tint group relative h-full rounded-[2rem] border border-brand-gray/20 p-10 shadow-sm transition-all duration-500 hover:border-brand-gray/40 hover:bg-[#15181D] md:p-12">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-gray/30 bg-brand-base">
                <Icon name="payments" className="text-2xl text-brand-accent" />
              </div>
              <h4 className="mb-3 text-3xl font-bold tracking-tight text-brand-light">Inversiones</h4>
              <p className="text-lg leading-relaxed text-brand-muted">Veredictos sobre plataformas de inversion y promesas de rentabilidad dudosa.</p>
            </article>
          </RevealItem>

          <RevealItem className="md:col-span-8">
            <article className="surface-tint group relative h-full overflow-hidden rounded-[2rem] border border-brand-gray/20 p-10 shadow-sm transition-all duration-500 hover:border-brand-gray/40 hover:bg-[#15181D] md:p-12">
              <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
                <div className="md:w-3/5">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-gray/30 bg-brand-base">
                    <Icon name="ads_click" className="text-2xl text-brand-accent" />
                  </div>
                  <h4 className="mb-3 text-3xl font-bold tracking-tight text-brand-light">Anuncios y Ofertas</h4>
                  <p className="max-w-md text-lg leading-relaxed text-brand-muted">Verificacion inmediata de veracidad en ofertas de empleo y comercio electronico.</p>
                </div>
                <div className="hidden h-32 w-48 rounded-2xl border border-brand-gray/20 bg-brand-base p-5 shadow-2xl md:block">
                  <div className="mb-3 h-2 w-full rounded-full bg-brand-gray/20" />
                  <div className="mb-3 h-2 w-3/4 rounded-full bg-brand-gray/20" />
                  <div className="mb-3 h-2 w-5/6 rounded-full bg-brand-gray/20" />
                  <div className="mt-6 h-2 w-1/2 rounded-full bg-brand-accent/80" />
                </div>
              </div>
            </article>
          </RevealItem>
        </RevealGroup>
      </SectionScene>

      {/* ── Verdict Levels ── */}
      <SectionScene
        className="relative mx-auto mb-32 max-w-5xl"
        topGlowClassName="bg-[radial-gradient(ellipse_at_top,_rgba(255,132,72,0.09)_0%,_rgba(255,132,72,0.02)_26%,_rgba(11,12,16,0)_64%)]"
        bottomGlowClassName="bg-[radial-gradient(ellipse_at_bottom,_rgba(255,184,110,0.05)_0%,_rgba(255,184,110,0.015)_18%,_rgba(11,12,16,0)_58%)]"
      >
        <Reveal>
          <div className="mb-20 text-center">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-brand-accent">Evaluacion de riesgo</h2>
            <h3 className="font-headline text-4xl font-bold tracking-tight text-brand-light md:text-5xl">Un veredicto en tres niveles</h3>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-brand-muted">Nuestro motor de analisis categoriza el riesgo con precision quirurgica, traduciendo complejidad legal y operativa en una simple luz de semaforo.</p>
          </div>
        </Reveal>

        <RevealGroup className="space-y-6">
          {([
            [
              <svg key="seguir" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>,
              'Seguir', 
              'Sin riesgos detectados. El analisis muestra total transparencia y cumplimiento normativo. El equipo recibe una ruta de accion sugerida para continuar.', 
              'border-emerald-500/20 bg-emerald-500/[0.04]', 
              'bg-[radial-gradient(ellipse_at_left,_rgba(16,185,129,0.06)_0%,_rgba(0,0,0,0)_60%)]'
            ],
            [
              <svg key="revisar" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>,
              'Revisar', 
              'Existen puntos ambiguos o falta de informacion. Veredicto identifica inconsistencias y preguntas abiertas antes de avanzar. Recomendamos validacion manual.', 
              'border-amber-500/20 bg-amber-500/[0.04]', 
              'bg-[radial-gradient(ellipse_at_left,_rgba(245,158,11,0.06)_0%,_rgba(0,0,0,0)_60%)]'
            ],
            [
              <svg key="frenar" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>,
              'Frenar', 
              'Riesgo critico detectado. Se encuentran banderas rojas, patrones fraudulentos confirmados o vacios legales graves que elevan el riesgo operativo.', 
              'border-brand-accent/20 bg-brand-accent/[0.04]', 
              'bg-[radial-gradient(ellipse_at_left,_rgba(255,75,42,0.06)_0%,_rgba(0,0,0,0)_60%)]'
            ],
          ] as const).map(([iconSvg, title, body, badgeTone, glowTone]) => (
            <RevealItem key={title as string}>
              <div className="surface-tint-soft group relative flex flex-col items-start gap-8 overflow-hidden rounded-[2rem] border border-brand-gray/10 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-brand-gray/30 hover:bg-brand-surface/80 md:flex-row md:items-center md:p-10">
                {/* Subtle soft background glow for the semantic color */}
                <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${glowTone}`} />

                {/* Inner Icon Container */}
                <div className={`relative z-10 flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-[1.25rem] border shadow-inner ${badgeTone}`}>
                  {iconSvg}
                </div>

                {/* Text Content */}
                <div className="relative z-10 flex-1">
                  <h4 className="mb-2.5 font-headline text-2xl font-bold tracking-tight text-brand-light">{title}</h4>
                  <p className="max-w-[44rem] text-base leading-relaxed text-brand-muted md:text-lg">{body}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </SectionScene>

      {/* ── Final CTA ── */}
      <SectionScene
        className="relative mb-32"
        topGlowClassName="bg-[radial-gradient(ellipse_at_top,_rgba(255,75,42,0.1)_0%,_rgba(255,75,42,0.025)_24%,_rgba(11,12,16,0)_62%)]"
        bottomGlowClassName="bg-[radial-gradient(ellipse_at_bottom,_rgba(255,184,110,0.065)_0%,_rgba(255,184,110,0.015)_18%,_rgba(11,12,16,0)_56%)]"
      >
      <ScaleReveal>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-brand-gray/20 bg-[linear-gradient(180deg,_rgba(18,20,24,0.6)_0%,_rgba(11,12,16,0.8)_100%)] p-12 text-center shadow-[0_24px_64px_rgba(0,0,0,0.4)] backdrop-blur-2xl md:p-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,75,42,0.12)_0%,_rgba(11,12,16,0)_70%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,_rgba(255,255,255,0)_0%,_rgba(255,75,42,0.4)_50%,_rgba(255,255,255,0)_100%)]" />
          <div className="relative z-10">
            <h2 className="font-headline text-4xl font-extrabold tracking-tight text-brand-light md:text-5xl lg:text-6xl">
              Empieza a decidir con seguridad hoy.
            </h2>
            <div className="mt-12 flex flex-col items-center justify-center gap-6 md:flex-row">
              <Link
                href="/inicio-de-sesion"
                className="rounded-full border border-brand-accent/20 bg-brand-accent px-10 py-5 text-lg font-bold text-white shadow-[0_16px_46px_rgba(255,75,42,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 hover:translate-y-[-1px] hover:bg-[#E53D1E] hover:shadow-[0_22px_64px_rgba(255,75,42,0.3),inset_0_1px_0_rgba(255,255,255,0.3)]"
              >
                Probar plataforma gratis
              </Link>
              <Link 
                href="/inicio-de-sesion" 
                className="group flex items-center gap-2 text-lg font-semibold text-brand-muted transition-colors hover:text-brand-accent"
              >
                Contactar ventas
                <Icon name="arrow_forward" className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </ScaleReveal>
      </SectionScene>
    </MarketingShell>
  );
}
