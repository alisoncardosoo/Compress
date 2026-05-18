import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button = ({ children, className = '', variant = 'secondary', ...props }: PropsWithChildren<ButtonProps>) => {
  const variants = {
    primary:
      'bg-apple text-white shadow-soft hover:bg-[#0577ee] disabled:bg-blue-300 dark:bg-[#0A84FF] dark:shadow-[0_12px_30px_rgba(10,132,255,0.28),0_1px_0_rgba(255,255,255,0.22)_inset] dark:hover:bg-[#1f8fff] dark:hover:shadow-[0_16px_38px_rgba(10,132,255,0.36),0_1px_0_rgba(255,255,255,0.24)_inset] dark:disabled:bg-[#1f3a5f]',
    secondary:
      'bg-white/75 text-zinc-900 ring-1 ring-zinc-200/80 hover:bg-white dark:bg-[rgba(255,255,255,0.07)] dark:text-[#F5F7FA] dark:ring-white/[0.10] dark:shadow-[0_10px_26px_rgba(0,0,0,0.20),0_1px_0_rgba(255,255,255,0.05)_inset] dark:hover:bg-[rgba(255,255,255,0.12)] dark:hover:ring-white/[0.16]',
    ghost:
      'text-zinc-600 hover:bg-zinc-900/5 dark:text-[#D7DEE8] dark:hover:bg-[rgba(255,255,255,0.10)] dark:hover:text-[#F5F7FA]',
  };

  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
