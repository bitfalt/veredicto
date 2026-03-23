'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { marketingNav } from '@/lib/veredicto/content';

import { Logo } from './logo';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 z-50 w-full transition-[background-color,border-color] duration-500"
      style={{
        backgroundColor: scrolled
          ? 'rgba(11, 12, 16, 0.82)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
        borderBottom: scrolled
          ? '1px solid rgba(236,240,235,0.06)'
          : '1px solid transparent',
      }}
    >
      <div className="mx-auto px-6 pt-4 pb-4">
        <div
          className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between rounded-full px-5 transition-all duration-500"
          style={{
            backgroundColor: scrolled
              ? 'rgba(18, 20, 24, 0.62)'
              : 'rgba(18, 20, 24, 0.56)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: scrolled
              ? 'rgba(95,100,104,0.3)'
              : 'rgba(95,100,104,0.15)',
            boxShadow: scrolled
              ? '0 14px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(236,240,235,0.08)'
              : '0 14px 34px rgba(0,0,0,0.2), inset 0 1px 0 rgba(236,240,235,0.06)',
          }}
        >
          <Logo compact />
          <nav className="hidden items-center gap-8 font-headline tracking-tight md:flex">
            {marketingNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-brand-muted transition-colors duration-200 hover:text-brand-light"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/inicio-de-sesion"
              className="rounded-full border border-brand-gray/30 bg-brand-light/[0.04] px-5 py-2 text-sm font-medium text-brand-light backdrop-blur-md transition-all duration-300 hover:border-brand-accent/40 hover:bg-brand-light/[0.08]"
            >
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
