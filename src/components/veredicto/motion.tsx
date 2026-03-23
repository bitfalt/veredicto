'use client';

import { motion, type Variants, useScroll, useTransform } from 'framer-motion';
import { type ReactNode, useRef } from 'react';

import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Motion System – Veredicto                                          */
/*                                                                     */
/*  Cohesive animation primitives for scroll-based reveals.            */
/*  All timing, easing, and distances are centralised here so the      */
/*  entire landing feels like one continuous choreography.              */
/*                                                                     */
/*  Easing: cubic-bezier(0.25, 0.1, 0.25, 1) – smooth, confident      */
/*  Distance: 20-28px vertical – subtle, never exaggerated             */
/*  Duration: 0.65-0.8s – unhurried but never sluggish                 */
/*  Stagger: 0.09s – perceptible rhythm without waiting                */
/* ------------------------------------------------------------------ */

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const VIEWPORT_OPTS = { once: true, margin: '-60px' as const };

/* ---- Reveal ---- */
/* Fade + subtle translate-up. For sections, headings, paragraphs. */

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** 'section' renders a <section>, default renders <div> */
  as?: 'section' | 'div';
}

export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const Tag = as === 'section' ? motion.section : motion.div;
  return (
    <Tag
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_OPTS}
      transition={{ delay }}
      className={className}
    >
      {children}
    </Tag>
  );
}

/* ---- RevealGroup ---- */
/* Staggers direct children. Each child should be wrapped in Reveal. */

const staggerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section';
}

export function RevealGroup({ children, className, as = 'div' }: RevealGroupProps) {
  const Tag = as === 'div' ? motion.div : motion.section;
  return (
    <Tag
      variants={staggerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_OPTS}
      className={className}
    >
      {children}
    </Tag>
  );
}

/* ---- RevealItem ---- */
/* A child inside RevealGroup – inherits stagger timing. */

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

interface RevealItemProps {
  children: ReactNode;
  className?: string;
}

export function RevealItem({ children, className }: RevealItemProps) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

/* ---- HeroReveal ---- */
/* Entrance animation for the hero content. Slightly longer, top-down. */

const heroVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASE,
      delay: 0.15 + i * 0.12,
    },
  }),
};

interface HeroRevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger index (0 = badge, 1 = headline, 2 = subtitle, 3 = CTA) */
  i?: number;
}

export function HeroReveal({ children, className, i = 0 }: HeroRevealProps) {
  return (
    <motion.div
      custom={i}
      variants={heroVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---- ScaleReveal ---- */
/* Subtle scale + fade for CTA blocks / special cards. */

const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

interface ScaleRevealProps {
  children: ReactNode;
  className?: string;
}

export function ScaleReveal({ children, className }: ScaleRevealProps) {
  return (
    <motion.div
      variants={scaleVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_OPTS}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface HeroSceneProps {
  background: ReactNode;
  children: ReactNode;
  className?: string;
}

export function HeroScene({ background, children, className }: HeroSceneProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.88, 0.72]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.95, 0.82]);
  const bottomFadeOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.55, 0.92]);

  return (
    <motion.section
      ref={ref}
      className={className}
    >
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY, scale: bgScale, opacity: bgOpacity }}
      >
        {background}
      </motion.div>

      <motion.div
        className="relative z-10"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {children}
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-56 bg-[linear-gradient(180deg,_rgba(11,12,16,0)_0%,_rgba(11,12,16,0.42)_38%,_rgba(11,12,16,0.78)_72%,_rgba(11,12,16,1)_100%)]"
        style={{ opacity: bottomFadeOpacity }}
      />
    </motion.section>
  );
}

interface SectionSceneProps {
  children: ReactNode;
  className?: string;
  topGlowClassName?: string;
  bottomGlowClassName?: string;
}

export function SectionScene({
  children,
  className,
  topGlowClassName = 'bg-[radial-gradient(ellipse_at_top,_rgba(255,75,42,0.08)_0%,_rgba(255,75,42,0.02)_24%,_rgba(11,12,16,0)_66%)]',
  bottomGlowClassName = 'bg-[radial-gradient(ellipse_at_bottom,_rgba(255,184,110,0.06)_0%,_rgba(255,184,110,0.015)_20%,_rgba(11,12,16,0)_62%)]',
}: SectionSceneProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['4%', '-4%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.82, 1, 1, 0.9]);
  const topGlowOpacity = useTransform(scrollYProgress, [0, 0.35, 1], [0.25, 0.7, 0.3]);
  const bottomGlowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 0.55, 0.35]);

  return (
    <motion.section ref={ref} className={className} style={{ y, opacity }}>
      <motion.div
        className={cn('pointer-events-none absolute inset-x-0 top-0 h-40', topGlowClassName)}
        style={{ opacity: topGlowOpacity }}
      />
      <motion.div
        className={cn('pointer-events-none absolute inset-x-0 bottom-0 h-40', bottomGlowClassName)}
        style={{ opacity: bottomGlowOpacity }}
      />
      <div className="relative z-10">{children}</div>
    </motion.section>
  );
}
