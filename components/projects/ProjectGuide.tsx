'use client';
// ProjectGuide — replaces the (empty) project finder. BudgetKatta does not host
// a project list: MahaRERA is the source of truth, so we teach users how to
// check any project there (district -> project -> completion date) and keep the
// RERA-number helper in <ReraStats />.
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { MAHARERA_PROJECTS_URL, RERA_DISTRICTS } from '@/lib/reraStats';
import type { Bi } from '@/lib/homeFinanceContent';

const NOTE: Bi = {
  mr: 'RERA नोंदणी किंवा प्रकल्पाची माहिती दिसणे म्हणजे कर्जमंजुरीची हमी नाही. बँकेची मंजुरी अर्जदार, मालमत्ता आणि बँकेच्या तपासणीवर अवलंबून असते.',
  en: 'A RERA registration or project listing is not a guarantee of loan approval. Bank approval depends on the applicant, the property and the bank own checks.',
};

const STEPS: { title: Bi; body: Bi }[] = [
  {
    title: { mr: 'MahaRERA पोर्टल उघडा', en: 'Open the MahaRERA portal' },
    body: {
      mr: 'खालील बटणावरून अधिकृत पोर्टलवर जा आणि "Registered Projects" मध्ये प्रकल्प शोधा.',
      en: 'Use the button below to reach the official portal and search under "Registered Projects".',
    },
  },
  {
    title: { mr: 'जिल्हा निवडा', en: 'Select the district' },
    body: {
      mr: `जिल्हा निवडून search करा: ${RERA_DISTRICTS.map((d) => d.mr).join(', ')}.`,
      en: `Pick the district and search: ${RERA_DISTRICTS.map((d) => d.en).join(', ')}.`,
    },
  },
  {
    title: { mr: 'प्रकल्प उघडा व पूर्णत्व दिनांक पाहा', en: 'Open the project and read the completion date' },
    body: {
      mr: 'प्रत्येक प्रकल्पाचा पूर्णत्व दिनांक (completion date) दिसतो. दिनांक पुढचा असेल तर प्रकल्प "चालू" आहे; दिनांक होऊन गेला असेल तर प्रकल्प "संपलेला" असू शकतो किंवा मुदतवाढ घेतलेली असू शकते — प्रकल्पाची स्थिती तपासा.',
      en: 'Each project shows a completion date. A future date means the project is ongoing; a past date means it may be finished or may have an extension — check the project status.',
    },
  },
  {
    title: { mr: 'क्रमांक व बिल्डरचे नाव जुळवा', en: 'Match the number and promoter name' },
    body: {
      mr: 'बिल्डर/जाहिरातीत दिलेला RERA क्रमांक आणि बिल्डरचे नाव पोर्टलवरील माहितीशी जुळते का ते पाहा. क्रमांक खाली दिलेल्या checker ने तपासता येतो.',
      en: 'Check that the RERA number and promoter name in the advertisement match the portal. You can use the number checker below.',
    },
  },
  {
    title: { mr: 'बँकेला विचारा', en: 'Ask the bank' },
    body: {
      mr: 'तुमच्या बँकेकडे हा प्रकल्प कर्जासाठी मान्य आहे का ते लेखी विचारा. मान्यता बँकेनुसार ठरते.',
      en: 'Ask your bank, in writing, whether this project is approved for lending. Approval is the bank own decision.',
    },
  },
];

export default function ProjectGuide() {
  const mr = useLanguageStore((s) => s.language) === 'mr';
  const lang = mr ? 'mr' : 'en';
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-6 text-center">
        <h1 className="font-display text-3xl font-extrabold text-slate-100 md:text-4xl font-deva">
          {mr ? 'चालू प्रकल्प कसा तपासायचा' : 'How to check an ongoing project'}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400 font-deva">
          {mr
            ? 'घर घेण्यापूर्वी प्रकल्प MahaRERA मध्ये नोंदणीकृत आहे का आणि तो चालू आहे का ते स्वतः तपासा — पाच सोप्या पायऱ्या.'
            : 'Before buying, check for yourself that the project is MahaRERA-registered and still ongoing — five simple steps.'}
        </p>
      </header>

      <p className="mb-6 flex gap-2 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-sm text-amber-200 font-deva">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        {NOTE[lang]}
      </p>

      <ol className="space-y-3">
        {STEPS.map((s, i) => (
          <li key={s.title.en} className="glass-card flex gap-4 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400 font-display font-extrabold text-slate-950">
              {i + 1}
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-slate-100 font-deva">{s.title[lang]}</h2>
              <p className="mt-1 text-sm text-slate-300 font-deva">{s.body[lang]}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 text-center">
        <a
          href={MAHARERA_PROJECTS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-amber-400 px-6 font-bold text-slate-950 hover:bg-amber-300 font-deva"
        >
          {mr ? 'MahaRERA वर प्रकल्प शोधा' : 'Search projects on MahaRERA'}
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
