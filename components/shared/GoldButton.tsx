import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface GoldButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'solid' | 'outline';
}

export default function GoldButton({
  children,
  variant = 'solid',
  className = '',
  ...props
}: GoldButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold font-deva transition-colors disabled:opacity-50';
  const styles =
    variant === 'solid'
      ? 'bg-bk-gold hover:bg-bk-gold-light text-bk-dark'
      : 'border border-bk-gold/40 text-bk-gold hover:bg-bk-gold/10';

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
