import Link from 'next/link';

import { Logo } from './logo';
import { Navbar } from './navbar';

type MarketingShellProps = {
  children: React.ReactNode;
};

export function MarketingShell({ children }: MarketingShellProps) {
  return (
    <div className="min-h-screen bg-brand-base text-brand-light">
      <Navbar />

      <main className="mx-auto min-h-screen w-full max-w-7xl px-6 pt-32 pb-24">{children}</main>

      <footer className="border-t border-brand-gray/10 bg-brand-base py-16">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 md:flex-row md:justify-between">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-7 text-brand-muted">
              Veredictos claros para contratos, proveedores, ofertas y decisiones donde el riesgo no admite improvisacion.
            </p>
          </div>
          <div className="flex gap-12 text-sm text-brand-muted">
            <div className="space-y-3">
              <p className="font-headline font-bold text-brand-light">Explorar</p>
              <Link href="/como-funciona" className="block transition-colors duration-200 hover:text-brand-accent">
                Como funciona
              </Link>
              <Link href="/precios" className="block transition-colors duration-200 hover:text-brand-accent">
                Precios
              </Link>
            </div>
            <div className="space-y-3">
              <p className="font-headline font-bold text-brand-light">Tu cuenta</p>
              <Link href="/inicio-de-sesion" className="block transition-colors duration-200 hover:text-brand-accent">
                Entrar
              </Link>
              <Link href="/panel" className="block transition-colors duration-200 hover:text-brand-accent">
                Ir al panel
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
