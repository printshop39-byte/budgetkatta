import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calculator, FileText } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { getDocuments, type ProductType, type ProfileType } from '@/lib/documentChecklists';
import DocumentChecklist from '@/components/shared/DocumentChecklist';

// Local-SEO content pages per loan type, e.g. /loans/home-loan. Each gives a
// short bilingual overview plus the document checklist for that loan, with a
// CTA into the EMI calculator on /loans.
type LoanContent = {
  product: ProductType;
  profile: ProfileType;
  title: { mr: string; en: string };
  description: string;
  intro: { mr: string; en: string };
  points: { mr: string; en: string }[];
};

const LOANS: Record<string, LoanContent> = {
  'home-loan': {
    product: 'HOME_LOAN',
    profile: 'SALARIED',
    title: { mr: 'गृहकर्ज (Home Loan)', en: 'Home Loan' },
    description: 'गृहकर्जाचे व्याजदर, पात्रता, आवश्यक कागदपत्रे आणि EMI कॅल्क्युलेटर — मराठीत सोप्या भाषेत.',
    intro: {
      mr: 'घर खरेदी, बांधकाम किंवा नूतनीकरणासाठी गृहकर्ज. दीर्घ मुदत व तुलनेने कमी व्याजदर हे याचे वैशिष्ट्य.',
      en: 'A loan for buying, building or renovating a home — typically long-tenure with comparatively low interest.',
    },
    points: [
      { mr: 'मुदत साधारणत: २० ते ३० वर्षांपर्यंत', en: 'Tenure usually 20–30 years' },
      { mr: 'मालमत्ता तारण (collateral) म्हणून ठेवली जाते', en: 'The property is held as collateral' },
      { mr: 'कलम 80C व 24(b) अंतर्गत करसवलत', en: 'Tax benefits under sections 80C and 24(b)' },
    ],
  },
  'personal-loan': {
    product: 'PERSONAL_LOAN',
    profile: 'SALARIED',
    title: { mr: 'वैयक्तिक कर्ज (Personal Loan)', en: 'Personal Loan' },
    description: 'वैयक्तिक कर्जाचे व्याजदर, पात्रता आणि आवश्यक कागदपत्रे. विनातारण कर्जाची संपूर्ण माहिती.',
    intro: {
      mr: 'कोणत्याही वैयक्तिक गरजेसाठी विनातारण (unsecured) कर्ज. झटपट मंजुरी पण व्याजदर जास्त असतो.',
      en: 'An unsecured loan for any personal need — quick to approve but at a higher interest rate.',
    },
    points: [
      { mr: 'तारण लागत नाही (unsecured)', en: 'No collateral required (unsecured)' },
      { mr: 'मुदत साधारणत: १ ते ५ वर्षे', en: 'Tenure usually 1–5 years' },
      { mr: 'उत्पन्न व क्रेडिट स्कोअर महत्त्वाचा', en: 'Income and credit score matter most' },
    ],
  },
  'vehicle-loan': {
    product: 'VEHICLE_LOAN',
    profile: 'SALARIED',
    title: { mr: 'वाहन कर्ज (Vehicle Loan)', en: 'Vehicle Loan' },
    description: 'दुचाकी/चारचाकी वाहन कर्जाचे व्याजदर, पात्रता आणि आवश्यक कागदपत्रांची माहिती.',
    intro: {
      mr: 'नवीन किंवा जुने वाहन खरेदीसाठी कर्ज. वाहन हेच तारण असते.',
      en: 'A loan to buy a new or used vehicle, where the vehicle itself is the collateral.',
    },
    points: [
      { mr: 'वाहन तारण म्हणून ठेवले जाते', en: 'The vehicle serves as collateral' },
      { mr: 'मुदत साधारणत: ३ ते ७ वर्षे', en: 'Tenure usually 3–7 years' },
      { mr: 'किंमतीच्या ८०–९०% पर्यंत कर्ज', en: 'Up to 80–90% of the on-road price' },
    ],
  },
  'education-loan': {
    product: 'EDUCATION_LOAN',
    profile: 'STUDENT',
    title: { mr: 'शैक्षणिक कर्ज (Education Loan)', en: 'Education Loan' },
    description: 'उच्च शिक्षणासाठी कर्ज — व्याजदर, पात्रता, सह-अर्जदार व आवश्यक कागदपत्रांची माहिती.',
    intro: {
      mr: 'भारतात किंवा परदेशात उच्च शिक्षणासाठी कर्ज. शिक्षण पूर्ण झाल्यावर परतफेड सुरू होते.',
      en: 'A loan for higher studies in India or abroad, with repayment typically starting after the course.',
    },
    points: [
      { mr: 'सह-अर्जदार (पालक) सहसा आवश्यक', en: 'A co-applicant (parent) is usually required' },
      { mr: 'मोरॅटोरियम — कोर्स काळात हप्ता नाही', en: 'Moratorium — no EMI during the course' },
      { mr: 'कलम 80E अंतर्गत व्याजावर करसवलत', en: 'Tax benefit on interest under section 80E' },
    ],
  },
  'gold-loan': {
    product: 'GOLD_LOAN',
    profile: 'SALARIED',
    title: { mr: 'गोल्ड लोन (Gold Loan)', en: 'Gold Loan' },
    description: 'सोने तारण ठेवून झटपट कर्ज — व्याजदर, पात्रता आणि आवश्यक कागदपत्रांची माहिती.',
    intro: {
      mr: 'सोन्याचे दागिने तारण ठेवून मिळणारे झटपट कर्ज. कमी कागदपत्रे व जलद मंजुरी.',
      en: 'A quick loan against pledged gold jewellery — minimal paperwork and fast approval.',
    },
    points: [
      { mr: 'सोने तारण म्हणून ठेवले जाते', en: 'Gold is pledged as collateral' },
      { mr: 'कमी कागदपत्रे, जलद मंजुरी', en: 'Minimal documents, fast approval' },
      { mr: 'सोन्याच्या मूल्याच्या ७५% पर्यंत कर्ज', en: 'Up to 75% of the gold value' },
    ],
  },
  'business-loan': {
    product: 'BUSINESS_LOAN',
    profile: 'BUSINESS',
    title: { mr: 'व्यवसाय कर्ज (Business Loan)', en: 'Business Loan' },
    description: 'व्यवसाय वाढीसाठी कर्ज — व्याजदर, पात्रता आणि आवश्यक कागदपत्रांची माहिती.',
    intro: {
      mr: 'व्यवसाय सुरू करण्यासाठी किंवा वाढवण्यासाठी कर्ज. खेळते भांडवल व विस्तारासाठी उपयुक्त.',
      en: 'A loan to start or grow a business — useful for working capital and expansion.',
    },
    points: [
      { mr: 'खेळते भांडवल किंवा विस्तारासाठी', en: 'For working capital or expansion' },
      { mr: 'ITR व व्यवसाय पुरावा आवश्यक', en: 'ITR and business proof required' },
      { mr: 'तारणी व विनातारणी दोन्ही प्रकार', en: 'Both secured and unsecured options' },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(LOANS).map((type) => ({ type }));
}

export async function generateMetadata({ params }: { params: { type: string } }): Promise<Metadata> {
  const loan = LOANS[params.type];
  if (!loan) return {};
  return pageMetadata({
    title: `${loan.title.mr} | ${loan.title.en}`,
    description: loan.description,
    path: `/loans/${params.type}`,
  });
}

export default function LoanTypePage({ params }: { params: { type: string } }) {
  const loan = LOANS[params.type];
  if (!loan) notFound();
  const documents = getDocuments(loan.product, loan.profile);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <nav className="mb-4 text-sm text-slate-400 font-deva">
        <Link href="/loans" className="hover:text-amber-300">
          कर्ज
        </Link>{' '}
        / <span className="text-slate-300">{loan.title.mr}</span>
      </nav>

      <header className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-slate-100 font-deva md:text-4xl">{loan.title.mr}</h1>
        <p className="mt-3 text-slate-300 font-deva">{loan.intro.mr}</p>
        <ul className="mt-4 space-y-2">
          {loan.points.map((p) => (
            <li key={p.en} className="flex items-start gap-2 text-sm text-slate-400 font-deva">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              {p.mr}
            </li>
          ))}
        </ul>
        <Link
          href="/loans"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-500 font-deva"
        >
          <Calculator className="h-4 w-4" />
          EMI कॅल्क्युलेटर वापरा
        </Link>
      </header>

      <section>
        <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-slate-100 font-deva">
          <FileText className="h-5 w-5 text-amber-400" />
          आवश्यक कागदपत्रे | Required Documents
        </h2>
        <DocumentChecklist documents={documents} />
      </section>

      <p className="mt-10 text-xs leading-relaxed text-slate-500 font-deva">
        टीप: माहिती RBI/बँकांच्या उपलब्ध डेटावर आधारित आहे. अंतिम पात्रता व कागदपत्रे बँकेनुसार बदलू शकतात — अर्जापूर्वी बँकेशी खात्री करा.
      </p>
    </div>
  );
}
