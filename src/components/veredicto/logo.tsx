import Link from 'next/link';

type LogoProps = {
  compact?: boolean;
};

export function Logo({ compact = false }: LogoProps) {
  return (
    <Link href="/" className="inline-flex items-center gap-3 sm:gap-4">
      <span className="font-headline text-[1.9rem] font-semibold tracking-[-0.04em] text-brand-light">
        Veredicto
      </span>
      <span className={`${compact ? 'hidden sm:block' : 'block'} text-[11px] font-medium uppercase tracking-[0.24em] text-brand-gray`}>
        The Obsidian Lens
      </span>
    </Link>
  );
}
