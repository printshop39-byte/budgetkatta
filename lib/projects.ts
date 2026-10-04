// lib/projects.ts — "कर्जासाठी पात्र प्रकल्प" (blueprint §3).
//
// DATA RULE: every entry must be verified against the official MahaRERA page
// and the bank's own approved-project list before it is added. Entries that
// lack a RERA number, an official source or a verification date must NOT be
// added — the type below makes those fields mandatory. PROJECTS ships empty on
// purpose; the page shows an honest empty state and a MahaRERA self-check link.
import type { Bi } from '@/lib/homeFinanceContent';

export type ProjectStatus = 'ready' | 'under-construction';

export type Project = {
  id: string;
  name: string;
  builder: string;
  city: string;
  area: string;
  mapUrl?: string;
  /** e.g. ['1 BHK', '2 BHK'] */
  homeTypes: string[];
  /** Carpet areas offered, sq ft, e.g. '420–560'. */
  sizes: string;
  /** Indicative price range in ₹. */
  priceMin: number;
  priceMax: number;
  reraNumber: string;
  status: ProjectStatus;
  /** Banks that state they lend on this project (per their own approved list). */
  loanBanks: string[];
  sourceUrl: string;
  /** ISO date (YYYY-MM-DD) the entry was last checked against the source. */
  verifiedOn: string;
};

export const PROJECTS: Project[] = [];

export const MAHARERA_SEARCH_URL = 'https://maharera.maharashtra.gov.in/projects-search-result';

export type ProjectFilters = {
  query: string;
  city: string;
  homeType: string;
  status: '' | ProjectStatus;
  /** Max price in ₹ (0 = any). */
  maxPrice: number;
  loanOnly: boolean;
};

export const EMPTY_FILTERS: ProjectFilters = { query: '', city: '', homeType: '', status: '', maxPrice: 0, loanOnly: false };

export function filterProjects(list: Project[], f: ProjectFilters): Project[] {
  const q = f.query.trim().toLowerCase();
  return list.filter((p) => {
    if (q && !`${p.name} ${p.builder} ${p.area} ${p.city}`.toLowerCase().includes(q)) return false;
    if (f.city && p.city !== f.city) return false;
    if (f.homeType && !p.homeTypes.includes(f.homeType)) return false;
    if (f.status && p.status !== f.status) return false;
    if (f.maxPrice > 0 && p.priceMin > f.maxPrice) return false;
    if (f.loanOnly && p.loanBanks.length === 0) return false;
    return true;
  });
}

export const PROJECT_NOTE: Bi = {
  mr: 'RERA नोंदणी किंवा प्रकल्पाची माहिती दिसणे म्हणजे कर्जमंजुरीची हमी नाही. बँकेची मंजुरी अर्जदार, मालमत्ता आणि बँकेच्या तपासणीवर अवलंबून असते.',
  en: 'A RERA registration or project listing is not a guarantee of loan approval. Bank approval depends on the applicant, the property and the bank’s own checks.',
};
