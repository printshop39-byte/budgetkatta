'use client';
// Popular Tools — quick-access shortcut grid to the most-used calculators and
// the bank directory. Bilingual, links into the existing routes.
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PiggyBank, Calculator, TrendingUp, Coins, Landmark, Mic, Users, GraduationCap } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

type Tool = {
  href: string;
  icon: typeof PiggyBank;
  label: { mr: string; en: string };
  desc: { mr: string; en: string };
};

const TOOLS: Tool[] = [
  { href: '/fds', icon: PiggyBank, label: { mr: 'FD कॅल्क्युलेटर', en: 'FD Calculator' }, desc: { mr: 'मुदत ठेव परतावा', en: 'Fixed deposit returns' } },
  { href: '/loans', icon: Calculator, label: { mr: 'EMI कॅल्क्युलेटर', en: 'EMI Calculator' }, desc: { mr: 'कर्जाचा मासिक हप्ता', en: 'Monthly loan instalment' } },
  { href: '/sip', icon: TrendingUp, label: { mr: 'SIP कॅल्क्युलेटर', en: 'SIP Calculator' }, desc: { mr: 'गुंतवणूक वाढ', en: 'Investment growth' } },
  { href: '/rates', icon: Coins, label: { mr: 'सोने/चांदी दर', en: 'Gold / Silver Rate' }, desc: { mr: 'आजचे बाजारभाव', en: 'Today’s market rates' } },
  { href: '/directory', icon: Landmark, label: { mr: 'बँक डिरेक्टरी', en: 'Bank Directory' }, desc: { mr: 'जवळची शाखा शोधा', en: 'Find a nearby branch' } },
  { href: '/directory', icon: Mic, label: { mr: 'व्हॉईस सर्च', en: 'Voice Search' }, desc: { mr: 'बोलून शाखा शोधा', en: 'Search by speaking' } },
  { href: '/loans/women#women-finder', icon: Users, label: { mr: 'महिला Loan Finder', en: 'Women Loan Finder' }, desc: { mr: 'व्यवसाय, बचत गट, subsidy', en: 'Business, SHG, subsidy' } },
  { href: '/education-loan#calc', icon: GraduationCap, label: { mr: 'विद्यार्थी Loan Finder', en: 'Student Loan Finder' }, desc: { mr: 'Vidyalaxmi, Moratorium EMI', en: 'Vidyalaxmi, Moratorium EMI' } },
];

export default function PopularTools() {
  const { language } = useLanguageStore();

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-8 text-center">
        <h2 className="font-display text-3xl font-extrabold text-slate-100 font-deva md:text-4xl">
          {language === 'mr' ? 'लोकप्रिय साधने' : 'Popular Tools'}
        </h2>
        <p className="mt-2 text-slate-400 font-deva">
          {language === 'mr'
            ? 'एका क्लिकवर सर्वाधिक वापरली जाणारी कॅल्क्युलेटर्स आणि डिरेक्टरी.'
            : 'The most-used calculators and the bank directory, one click away.'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
        {TOOLS.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.label.en}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={tool.href}
                className="group flex h-full flex-col items-center gap-2.5 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-center backdrop-blur-sm transition-colors hover:border-amber-400/40 hover:bg-slate-900"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-400 transition-transform group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-sm font-bold text-slate-200 font-deva">{tool.label[language]}</span>
                <span className="text-xs text-slate-400 font-deva">{tool.desc[language]}</span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
