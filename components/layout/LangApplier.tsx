'use client';
// Syncs the active language to <html lang>. The layout renders lang="mr"
// statically; without this the attribute stays "mr" in English mode, which
// breaks language-specific typography rules (globals.css) and gives screen
// readers the wrong language.
import { useEffect } from 'react';
import { useLanguageStore } from '@/store/languageStore';

export default function LangApplier() {
  const language = useLanguageStore((s) => s.language);

  useEffect(() => {
    document.documentElement.lang = language === 'mr' ? 'mr' : 'en';
  }, [language]);

  return null;
}
