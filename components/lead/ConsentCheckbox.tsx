'use client';
// ConsentCheckbox — one explicit, unticked-by-default consent control shared by
// every lead form, with the policy link beside the wording.
import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';
import { CONSENT_LINK_LABEL, CONSENT_TEXT } from '@/lib/consent';

export default function ConsentCheckbox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  const lang = useLanguageStore((s) => s.language) === 'mr' ? 'mr' : 'en';
  return (
    <div className="flex items-start gap-2.5 pt-1">
      <input
        id="bk-consent"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 accent-amber-400"
      />
      <label htmlFor="bk-consent" className="text-xs leading-relaxed text-slate-400 font-deva">
        {CONSENT_TEXT[lang]}{' '}
        <Link href="/privacy" target="_blank" className="font-semibold text-amber-400 underline">
          {CONSENT_LINK_LABEL[lang]}
        </Link>
      </label>
    </div>
  );
}
