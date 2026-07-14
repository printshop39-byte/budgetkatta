import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import MoneyHealthPromo from '@/components/home/MoneyHealthPromo';
import BuyBuildTransfer from '@/components/home/BuyBuildTransfer';
import PropertyTools from '@/components/home/PropertyTools';
import HomeInsuranceSection from '@/components/home/HomeInsuranceSection';
import OfficialSources from '@/components/home/OfficialSources';
import TrustSection from '@/components/trust/TrustSection';
import FinalHealthCTA from '@/components/home/FinalHealthCTA';
import HomeFAQ from '@/components/home/HomeFAQ';
import JsonLd from '@/components/seo/JsonLd';
import { HOMEPAGE_SECTIONS as S } from '@/lib/homepageConfig';
import { HOME_FAQ } from '@/lib/homeFinanceContent';

// ── Sections HIDDEN in the narrowed home-finance scope ──────────────────────
// Still imported so a single flag flip in lib/homepageConfig.ts restores them
// with no rebuild. Nothing here is deleted — routes/components stay intact.
import PopularTools from '@/components/home/PopularTools';
import SegmentEntryCards from '@/components/schemes/SegmentEntryCards';
import CalculatorsHub from '@/components/CalculatorsHub';
import SmartAdvisory from '@/components/SmartAdvisory';
import EducationHub from '@/components/EducationHub';
import BentoGrid from '@/components/BentoGrid';
import ScrollMorphCoin from '@/components/home/ScrollMorphCoin';
import BrokerOffers from '@/components/BrokerOffers';
import CreditCardOffers from '@/components/CreditCardOffers';

// FAQ structured data — built from the SAME focused home-finance FAQs that are
// visible on the page (HOME_FAQ), in the Marathi that the homepage renders by
// default, so the JSON-LD never advertises questions the page doesn't show.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: HOME_FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q.mr,
    acceptedAnswer: { '@type': 'Answer', text: f.a.mr },
  })),
};

export const metadata: Metadata = {
  title: { absolute: 'BudgetKatta — Home Loan, Property Budget & Home Insurance' },
  description:
    'Home-loan readiness, EMI, property-budget, down-payment, construction-finance and home-insurance educational tools for Maharashtra.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden bg-slate-950 text-slate-100 selection:bg-amber-400/30 selection:text-amber-100">
      {/* Background decorations (premium organic blobs) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full filter blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-[800px] right-0 w-[400px] h-[400px] bg-yellow-500/10 rounded-full filter blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[1000px] left-[-100px] w-[600px] h-[600px] bg-amber-400/5 rounded-full filter blur-[140px] -z-10 pointer-events-none" />

      {/* ── Home-finance homepage (narrowed scope) ── */}
      {S.hero && <HeroSection />}
      {/* Free "Financial Readiness for a Home Goal" is the primary path */}
      {S.readinessPromo && <MoneyHealthPromo />}
      {/* Buy / Build / Transfer — the three home-finance journeys */}
      {S.buyBuildTransfer && <BuyBuildTransfer />}
      {/* Property-focused tools (Available vs Coming next) */}
      {S.propertyTools && <PropertyTools />}
      {/* Home & property insurance — educational only */}
      {S.homeInsurance && <HomeInsuranceSection />}
      {/* Official sources (RBI / NHB / MahaRERA / IGR Maharashtra / IRDAI) */}
      {S.officialSources && <OfficialSources />}
      {/* Privacy & official-source trust badges */}
      {S.trust && <TrustSection />}
      {/* Closing readiness CTA */}
      {S.finalReadinessCta && <FinalHealthCTA />}
      {/* Focused home-finance FAQ (JSON-LD above is built from the same list) */}
      {S.faq && <HomeFAQ />}

      {/* ── Hidden in the narrowed scope — restore via lib/homepageConfig.ts ──
          These render only if their flag is flipped back to `true`. Kept here
          (not deleted) so no rebuild is needed to bring a category back. */}
      {S.popularTools && <PopularTools />}
      {S.segmentEntryCards && (
        <SegmentEntryCards
          heading={{
            mr: 'महिला व विद्यार्थ्यांसाठी कर्ज योजना',
            en: 'Loan schemes for women & students',
            sub: {
              mr: 'सरकारी योजना, scholarship व subsidy — तुमच्यासाठी योग्य पर्याय शोधा.',
              en: 'Government schemes, scholarships & subsidies — find the right option for you.',
            },
          }}
        />
      )}
      {S.calculatorsHub && <CalculatorsHub />}
      {S.smartAdvisory && <SmartAdvisory />}
      {S.educationHub && <EducationHub />}
      {S.bentoGrid && <BentoGrid />}
      {S.scrollMorphCoin && <ScrollMorphCoin />}
      {S.brokerOffers && <BrokerOffers />}
      {S.creditCardOffers && <CreditCardOffers />}

      <JsonLd data={faqSchema} />
    </div>
  );
}
