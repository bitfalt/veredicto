import Link from 'next/link';

import { MarketingShell } from '@/components/veredicto/marketing-shell';
import { Reveal, RevealGroup, RevealItem } from '@/components/veredicto/motion';

const tiers = [
  {
    tag: 'Entrada',
    name: 'Basico',
    price: 'Gratis',
    features: ['3 analisis mensuales', 'AI Voice (Estandar)', 'Sin soporte prioritario', 'Historial (7 dias)'],
    cta: 'Empezar ahora',
    highlighted: false,
  },
  {
    tag: 'Recomendado',
    name: 'Pro',
    price: '29 EUR / mes',
    features: ['50 analisis mensuales', 'AI Voice (Velocidad 2x)', 'Soporte prioritario', 'Historial ilimitado'],
    cta: 'Suscribirse',
    highlighted: true,
  },
  {
    tag: 'Prestigio',
    name: 'Elite',
    price: '99 EUR / mes',
    features: ['Analisis ilimitados', 'AI Voice (Real-time Ultra)', 'Soporte dedicado 24/7', 'Exportacion forense e historial'],
    cta: 'Activar Elite',
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <header className="mb-24 text-center">
        <Reveal>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-brand-accent">
            Acceso Premium
          </h4>
          <h1 className="mx-auto max-w-4xl font-headline text-5xl font-extrabold tracking-tight text-brand-light md:text-7xl">
            Planes de <span className="bg-[linear-gradient(135deg,_#FF7A50_0%,_#FF4B2A_100%)] bg-clip-text italic text-transparent pr-2">Inversion</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-brand-muted md:text-xl">
            Accede a la precision absoluta. Elige el nivel de acceso que mejor se adapte a tu escala de analisis y opera con total seguridad.
          </p>
        </Reveal>
      </header>

      <RevealGroup as="section" className="mb-32 grid gap-8 md:grid-cols-3">
        {tiers.map((tier) => (
          <RevealItem key={tier.name}>
            <article
              className={
                tier.highlighted
                  ? 'surface-tint-strong relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-brand-accent/40 shadow-[0_0_60px_rgba(255,75,42,0.1)] backdrop-blur-xl md:-mt-8 md:mb-8'
                  : 'surface-tint-soft relative flex h-full flex-col rounded-[2rem] border border-brand-gray/20 p-10 backdrop-blur-xl transition-all duration-500 hover:border-brand-gray/40 hover:bg-brand-surface/80 md:p-12'
              }
            >
              {tier.highlighted && (
                <>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,75,42,0.1)_0%,_rgba(11,12,16,0)_70%)]" />
                  <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,_rgba(255,255,255,0)_0%,_rgba(255,75,42,0.8)_50%,_rgba(255,255,255,0)_100%)]" />
                </>
              )}

              <div className={tier.highlighted ? 'relative z-10 flex h-full flex-col p-10 md:p-12' : 'relative z-10 flex h-full flex-col'}>
                <div className="mb-10">
                  <span className={`text-xs font-bold uppercase tracking-[0.2em] ${tier.highlighted ? 'text-brand-accent' : 'text-brand-gray'}`}>
                    {tier.tag}
                  </span>
                  <h3 className="mt-4 font-headline text-3xl font-bold tracking-tight text-brand-light">{tier.name}</h3>
                  <div className="mt-6 font-headline text-5xl font-extrabold tracking-tight text-brand-light">{tier.price}</div>
                </div>

                <ul className="mb-12 flex-1 space-y-5 text-base">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-4">
                      {feature.startsWith('Sin') ? (
                        <svg className="h-5 w-5 shrink-0 text-brand-gray opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : (
                        <svg className={`h-5 w-5 shrink-0 ${tier.highlighted ? 'text-brand-accent' : 'text-emerald-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      <span className={feature.startsWith('Sin') ? 'text-brand-gray line-through decoration-brand-gray/50' : 'text-brand-muted'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/inicio-de-sesion"
                  className={
                    tier.highlighted
                      ? 'rounded-full border border-brand-accent/20 bg-brand-accent py-4 text-center text-lg font-bold text-white shadow-[0_16px_46px_rgba(255,75,42,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 hover:translate-y-[-1px] hover:bg-[#E53D1E] hover:shadow-[0_22px_64px_rgba(255,75,42,0.3),inset_0_1px_0_rgba(255,255,255,0.3)]'
                      : 'rounded-full border border-brand-gray/30 bg-white/[0.02] py-4 text-center text-lg font-semibold text-brand-light backdrop-blur-md transition-all duration-300 hover:border-brand-gray/50 hover:bg-white/[0.05]'
                  }
                >
                  {tier.cta}
                </Link>
              </div>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </MarketingShell>
  );
}
