import type { HTMLAttributes, PropsWithChildren } from 'react';

interface GlassPanelProps extends PropsWithChildren, HTMLAttributes<HTMLElement> {}

export const GlassPanel = ({ children, className = '', ...props }: GlassPanelProps) => (
  <section
    className={`rounded-mac border border-white/70 bg-white/70 shadow-glass backdrop-blur-2xl transition-shadow duration-300 dark:border-white/[0.08] dark:bg-[rgba(18,24,38,0.72)] dark:shadow-[0_28px_90px_rgba(0,0,0,0.46),0_1px_0_rgba(255,255,255,0.05)_inset,0_0_0_1px_rgba(255,255,255,0.025)_inset] ${className}`}
    {...props}
  >
    {children}
  </section>
);
