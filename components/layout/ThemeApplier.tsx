'use client';
// Syncs the persisted theme store to <html data-theme>. The initial value is
// set by an inline script in <head> (see layout.tsx) to avoid a flash.
import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

export default function ThemeApplier() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return null;
}
