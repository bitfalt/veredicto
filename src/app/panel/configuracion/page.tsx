import Link from 'next/link';

import { Icon } from '@/components/veredicto/icon';

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gray">{label}</p>
      <div className="rounded-2xl border border-brand-gray/10 bg-brand-base px-5 py-4 text-base text-brand-light">
        {value}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <header className="space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gray">Configuracion</p>
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-brand-light md:text-5xl">
          Tu cuenta, sin complicaciones
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-brand-muted">
          Todo lo importante en un solo lugar: tu perfil, tu seguridad y la voz con la que Veredicto te acompana.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="surface-tint-soft rounded-[2rem] border border-brand-gray/10 p-8 backdrop-blur-xl">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-brand-gray/10 bg-brand-base text-brand-light">
                <Icon name="person" className="text-2xl" />
              </div>
              <div>
                <h2 className="font-headline text-2xl font-bold text-brand-light">Julian Montenegro</h2>
                <p className="text-base text-brand-muted">Abogado senior - Madrid, ES</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InfoField label="Nombre" value="Julian Montenegro" />
              <InfoField label="Correo" value="j.montenegro@veredicto.ia" />
              <div className="md:col-span-2">
                <InfoField
                  label="Descripcion"
                  value="Especialista en derecho civil y analisis de riesgos contractuales. Usuario de Veredicto desde 2023."
                />
              </div>
            </div>
          </div>

          <div className="surface-tint-soft rounded-[2rem] border border-brand-gray/10 p-8 backdrop-blur-xl">
            <h2 className="font-headline text-2xl font-bold text-brand-light">Seguridad</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-brand-gray/10 bg-brand-base/60 px-5 py-4">
                <div className="flex items-center gap-4">
                  <Icon name="lock" className="text-brand-muted" />
                  <div>
                    <p className="font-semibold text-brand-light">Contrasena</p>
                    <p className="text-sm text-brand-muted">Ultimo cambio hace 3 meses</p>
                  </div>
                </div>
                <button className="rounded-full border border-brand-gray/20 px-4 py-2 text-sm font-semibold text-brand-light transition-colors hover:bg-white/[0.04]">
                  Cambiar
                </button>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-brand-gray/10 bg-brand-base/60 px-5 py-4">
                <div className="flex items-center gap-4">
                  <Icon name="phonelink_lock" className="text-emerald-400" />
                  <div>
                    <p className="font-semibold text-brand-light">Doble verificacion</p>
                    <p className="text-sm text-brand-muted">Activa y funcionando</p>
                  </div>
                </div>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Activa
                </span>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="surface-tint-soft rounded-[2rem] border border-brand-gray/10 p-8 backdrop-blur-xl">
            <h2 className="font-headline text-2xl font-bold text-brand-light">Voz del agente</h2>
            <p className="mt-3 text-base leading-relaxed text-brand-muted">
              Elige una voz clara y tranquila para que la consulta se sienta cercana y facil de seguir.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-brand-accent/20 bg-brand-accent/5 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent">
                    <Icon name="record_voice_over" className="text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-light">Analista Directo</p>
                    <p className="text-sm text-brand-muted">Actual - Claro y seguro</p>
                  </div>
                </div>
                <Icon name="check_circle" className="text-brand-accent" />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-brand-gray/10 bg-brand-base/60 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gray/10 text-brand-muted">
                    <Icon name="volume_up" className="text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-light">Mediador Calmo</p>
                    <p className="text-sm text-brand-muted">Mas suave y sereno</p>
                  </div>
                </div>
                <Icon name="play_circle" className="text-brand-muted" />
              </div>
            </div>
          </div>

          <div className="surface-tint-soft rounded-[2rem] border border-brand-gray/10 p-8 backdrop-blur-xl">
            <h2 className="font-headline text-2xl font-bold text-brand-light">Tu plan</h2>
            <p className="mt-3 text-base leading-relaxed text-brand-muted">
              Tienes acceso a analisis avanzados, voz AI y biblioteca compartida. Puedes mejorar tu plan cuando lo necesites.
            </p>
            <Link
              href="/precios"
              className="mt-6 inline-flex rounded-full border border-brand-accent/20 bg-brand-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(255,75,42,0.15)] transition-all hover:bg-[#E53D1E]"
            >
              Ver opciones
            </Link>
          </div>
        </aside>
      </section>

      <div className="flex flex-wrap justify-end gap-3 text-sm">
        <Link href="/panel" className="rounded-full border border-brand-gray/20 px-5 py-3 font-semibold text-brand-light">
          Volver
        </Link>
        <Link
          href="/panel?estado=configuracion-guardada"
          className="rounded-full border border-brand-accent/20 bg-brand-accent px-5 py-3 font-semibold text-white shadow-[0_10px_30px_rgba(255,75,42,0.15)] transition-all hover:bg-[#E53D1E]"
        >
          Guardar cambios
        </Link>
      </div>
    </div>
  );
}
