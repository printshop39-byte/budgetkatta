'use client';
import Link from 'next/link';
import Image from 'next/image';

// Brand lockup: green price-tag "B" mark + BudgetKatta wordmark.
// Shared by the navbar (header + mobile drawer) and footer so the logo
// can never drift out of sync. `onClick` lets the mobile drawer close on tap.
export default function Logo({
  onClick,
  className = '',
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link href="/" onClick={onClick} className={`flex shrink-0 items-center gap-2 ${className}`}>
      <Image
        src="/logo-mark.png"
        alt=""
        width={30}
        height={32}
        priority
        className="h-8 w-auto"
      />
      <span className="font-display text-lg font-bold text-slate-200">
        Budget<span className="text-bk-orange">Katta</span>
      </span>
    </Link>
  );
}
