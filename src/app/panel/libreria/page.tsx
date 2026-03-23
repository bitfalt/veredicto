import Link from 'next/link';

import { Icon } from '@/components/veredicto/icon';
import { RiskBadge } from '@/components/veredicto/risk-badge';
import { getCaseHistory } from '@/lib/case-history';
import { libraryAssets } from '@/lib/veredicto/content';

const typeIconMap: Record<string, string> = {
  PDF: 'description',
  DOCX: 'description',
  AUDIO: 'audio_file',
  LINK: 'link',
  TEXT: 'subject',
};

export default async function LibraryPage() {
  const history = await getCaseHistory();
  const assets = history.length > 0 ? history : libraryAssets;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <header className="space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gray">Historial</p>
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-brand-light md:text-5xl">
          Todo lo que ya revisaste
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-brand-muted">
          Busca casos anteriores, abre un documento o vuelve a consultar un analisis sin perderte en menus complejos.
        </p>
      </header>

      <section className="surface-tint-soft flex flex-col gap-4 rounded-[2rem] border border-brand-gray/10 p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-5">
        <div className="group relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-brand-gray transition-colors group-focus-within:text-brand-light">
            <Icon name="search" className="text-lg" />
          </div>
          <input
            className="w-full rounded-2xl border border-brand-gray/10 bg-brand-base px-12 py-4 text-base text-brand-light outline-none transition-all placeholder:text-brand-gray/50 focus:border-brand-gray/30 focus:ring-1 focus:ring-brand-gray/20"
            placeholder="Buscar por nombre, fecha o tipo de archivo"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {['Todo', 'Documentos', 'Audios', 'Links'].map((filter, index) => (
            <button
              key={filter}
              className={
                index === 0
                  ? 'rounded-full border border-brand-gray/20 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-brand-light'
                  : 'rounded-full border border-transparent px-5 py-2.5 text-sm font-medium text-brand-muted transition-colors hover:text-brand-light'
              }
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="surface-tint-soft overflow-hidden rounded-[2rem] border border-brand-gray/10 backdrop-blur-xl">
        <div className="hidden grid-cols-[minmax(0,1.6fr)_120px_120px_110px] gap-4 border-b border-brand-gray/10 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gray md:grid">
          <span>Caso</span>
          <span>Tipo</span>
          <span>Actualizado</span>
          <span>Veredicto</span>
        </div>

        <div className="divide-y divide-brand-gray/10">
          {assets.map((asset) => (
            <Link
              key={asset.title}
              href="/panel"
              className="grid gap-4 px-6 py-5 transition-colors hover:bg-white/[0.02] md:grid-cols-[minmax(0,1.6fr)_120px_120px_110px] md:items-center"
            >
              <div className="flex min-w-0 items-start gap-4">
                <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand-gray/10 bg-brand-base text-brand-accent">
                  <Icon name={typeIconMap[asset.kind] ?? 'description'} className="text-xl" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-brand-light md:text-lg">{asset.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-brand-muted">{asset.meta}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-brand-muted md:block">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gray md:hidden">Tipo</span>
                <span>{asset.kind}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-brand-muted md:block">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gray md:hidden">Actualizado</span>
                <span>{asset.updatedAt}</span>
              </div>

              <div className="flex items-center gap-3 md:justify-start">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gray md:hidden">Veredicto</span>
                <RiskBadge value={asset.verdict as 'Seguir' | 'Revisar' | 'Frenar'} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
