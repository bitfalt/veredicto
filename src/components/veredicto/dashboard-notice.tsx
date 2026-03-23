'use client';

type DashboardNoticeProps = {
  bienvenida?: string;
  estado?: string;
  fuente?: string;
};

export function DashboardNotice({ bienvenida, estado, fuente }: DashboardNoticeProps) {

  if (!bienvenida && !estado) {
    return null;
  }

  const message = bienvenida
    ? 'Todo listo. Ya puedes contar tu caso, pegar un enlace o empezar hablando.'
    : `Tu consulta ya esta lista para ${fuente ?? 'el ultimo caso analizado'}. Puedes continuar cuando quieras.`;

  return (
    <div className="rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/10 px-6 py-5 text-sm font-medium tracking-wide text-emerald-100 shadow-sm backdrop-blur-md">
      {message}
    </div>
  );
}
