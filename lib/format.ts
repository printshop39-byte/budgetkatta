// lib/format.ts — Indian numbering currency formatter (shared by all calculators).
export const formatCurrency = (num: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
