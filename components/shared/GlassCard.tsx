import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  gold?: boolean;
  className?: string;
}

export default function GlassCard({ children, gold = false, className = '' }: GlassCardProps) {
  return (
    <div className={`glass-card ${gold ? 'glass-card-gold' : ''} p-5 ${className}`}>
      {children}
    </div>
  );
}
