'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Icon } from './icon';
import { Logo } from './logo';

const navItems = [
  { label: 'Nuevo Análisis', href: '/panel', icon: 'star' },
  { label: 'Historial', href: '/panel/libreria', icon: 'list' },
  { label: 'Configuración', href: '/panel/configuracion', icon: 'settings' },
];

export function PanelSidebar() {
  const pathname = usePathname();

  return (
    <aside className="z-40 flex w-full shrink-0 flex-col rounded-[2.5rem] bg-[#121418] px-8 py-12 lg:h-[calc(100vh-3rem)] lg:w-80">
      <div className="mb-16">
        <Logo />
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const isActive = item.href === '/panel'
            ? pathname === '/panel'
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-4 rounded-2xl px-5 py-4 text-[15px] font-semibold transition-all duration-300',
                isActive
                  ? 'bg-white/[0.04] text-brand-light'
                  : 'text-brand-gray hover:bg-white/[0.02] hover:text-brand-light',
              )}
            >
              <Icon 
                name={item.icon} 
                className={cn('text-xl', isActive ? 'text-brand-light' : 'text-brand-gray group-hover:text-brand-light')} 
              />
              <span className="tracking-wide">{item.label}</span>
            </Link>
          );
        })}
        </nav>
    </aside>
  );
}
