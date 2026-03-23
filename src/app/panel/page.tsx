import Link from 'next/link';

import { AnalysisComposer } from '@/components/veredicto/analysis-composer';
import { DashboardNotice } from '@/components/veredicto/dashboard-notice';
import { Icon } from '@/components/veredicto/icon';

type PanelHomePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PanelHomePage({ searchParams }: PanelHomePageProps) {
  const resolvedSearchParams = await searchParams;
  const bienvenida = typeof resolvedSearchParams.bienvenida === 'string' ? resolvedSearchParams.bienvenida : undefined;
  const estado = typeof resolvedSearchParams.estado === 'string' ? resolvedSearchParams.estado : undefined;
  const fuente = typeof resolvedSearchParams.fuente === 'string' ? resolvedSearchParams.fuente : undefined;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex justify-end">
        <Link 
          href="/inicio-de-sesion" 
          className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-gray/10 bg-brand-surface/40 text-brand-gray transition-colors hover:border-brand-gray/30 hover:text-brand-light"
          title="Cerrar sesión"
        >
          <Icon name="logout" className="text-[1.125rem] translate-x-0.5" />
        </Link>
      </div>

      <div className="mx-auto w-full max-w-4xl space-y-8">
        <DashboardNotice bienvenida={bienvenida} estado={estado} fuente={fuente} />

        <div className="flex flex-1 flex-col">
          <AnalysisComposer />
        </div>
      </div>
    </div>
  );
}
