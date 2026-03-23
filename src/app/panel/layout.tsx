import { PanelSidebar } from '@/components/veredicto/panel-sidebar';

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-brand-base text-brand-light">
      <div className="mx-auto flex h-screen w-full max-w-[90rem] flex-col p-4 lg:flex-row lg:p-6">
        <PanelSidebar />
        <main className="flex-1 overflow-y-auto px-4 py-8 lg:px-12 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
