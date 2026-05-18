import type { PropsWithChildren } from 'react';

export const StatPill = ({ children }: PropsWithChildren) => (
  <div className="rounded-2xl border border-zinc-200/80 bg-white/60 px-3 py-2 text-sm text-zinc-700 dark:border-white/[0.08] dark:bg-white/[0.055] dark:text-[#D7DEE8] dark:shadow-[0_10px_28px_rgba(0,0,0,0.18)]">
    {children}
  </div>
);
