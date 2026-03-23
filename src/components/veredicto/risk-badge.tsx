import { cn } from '@/lib/utils';

const toneMap = {
  Seguir: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Revisar: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Frenar: 'bg-brand-accent/10 text-brand-accent border-brand-accent/20',
} as const;

type RiskBadgeProps = {
  value: keyof typeof toneMap;
  className?: string;
};

export function RiskBadge({ value, className }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm',
        toneMap[value],
        className,
      )}
    >
      {value}
    </span>
  );
}
