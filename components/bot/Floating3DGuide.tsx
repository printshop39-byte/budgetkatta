'use client';
// ============================================================
// Floating3DGuide.tsx
// AI-powered guide — Desktop: interactive Spline 3D robot | Mobile: compact card
// Chat replies come from /api/chat (Gemini placeholder for now).
// Leads are forwarded to n8n via sendLeadToN8N.
// Spline scene URL comes from NEXT_PUBLIC_SPLINE_SCENE_URL. If it's missing,
// a premium animated fallback robot is shown instead. The Spline runtime is
// lazy-loaded (dynamic, ssr:false) and only on desktop, so mobile stays light.
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useLanguageStore } from '@/store/languageStore';
import { useBotStore } from '@/store/botStore';
import { getTranslation } from '@/lib/i18n';
import { sendLeadToN8N } from '@/lib/leadAutomation';
import { isVapiConfigured, startVoiceCall, voiceComingSoonMessage } from '@/lib/vapi';
import type { LeadModule } from '@/types';

// Lazy-load Spline only on the client; never bundled into the initial payload.
const Spline = dynamic(() => import('@splinetool/react-spline/next'), {
  ssr: false,
  loading: () => <SplineFallback loading />,
});

const SPLINE_SCENE_URL = process.env.NEXT_PUBLIC_SPLINE_SCENE_URL;

// Premium animated fallback shown when no Spline scene is configured (or while loading).
function SplineFallback({ loading = false }: { loading?: boolean }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-bk-dark via-bk-card to-bk-dark">
      <div className="pointer-events-none absolute h-28 w-28 rounded-full bg-bk-gold/20 blur-2xl animate-pulse-gold" />
      <motion.span
        className="relative text-5xl"
        animate={{ y: [0, -10, 0], rotate: [0, -4, 4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        🤖
      </motion.span>
      {loading && (
        <span className="absolute bottom-2 text-[10px] uppercase tracking-wider text-slate-400">
          loading 3D…
        </span>
      )}
    </div>
  );
}

interface Message {
  role: 'bot' | 'user';
  text: string;
}

const quickActions: { key: string; module: LeadModule; icon: string }[] = [
  { key: 'bot.quick_fd', module: 'FD', icon: '🏦' },
  { key: 'bot.quick_loan', module: 'LOAN', icon: '💰' },
  { key: 'bot.quick_sip', module: 'SIP', icon: '📈' },
  { key: 'bot.quick_ins', module: 'INSURANCE', icon: '🛡️' },
];

export default function Floating3DGuide() {
  const { isOpen, setOpen: setIsOpen } = useBotStore();
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { language } = useLanguageStore();
  const t = getTranslation(language);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'bot', text: t('bot.greeting') }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Keyboard a11y: focus the input when the panel opens; Escape closes it.
  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  async function fetchReply(userMsg: string): Promise<string> {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, language }),
      });
      const json = await res.json();
      return json.reply ?? t('state.error');
    } catch {
      return t('state.error');
    }
  }

  async function startVoiceAssistant() {
    if (!isVapiConfigured()) {
      // Surface "coming soon" as a bot message instead of an alert.
      setMessages((prev) => [...prev, { role: 'bot', text: voiceComingSoonMessage(language) }]);
      return;
    }
    await startVoiceCall(language);
  }

  async function handleSend() {
    if (!inputText.trim()) return;
    const userMsg = inputText.trim();
    setInputText('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    sendLeadToN8N({
      selectedLanguage: language,
      interestedModule: 'GENERAL',
      userQuery: userMsg,
      sourcePage: 'CHATBOT',
      timestamp: new Date().toISOString(),
    });

    const reply = await fetchReply(userMsg);
    setIsLoading(false);
    setMessages((prev) => [...prev, { role: 'bot', text: reply }]);
  }

  async function handleQuickAction(key: string, module: LeadModule) {
    const query = t(key);
    setMessages((prev) => [...prev, { role: 'user', text: query }]);
    sendLeadToN8N({
      selectedLanguage: language,
      interestedModule: module,
      userQuery: query,
      sourcePage: 'BOT_QUICK_ACTION',
      timestamp: new Date().toISOString(),
    });
    setIsLoading(true);
    const reply = await fetchReply(query);
    setIsLoading(false);
    setMessages((prev) => [...prev, { role: 'bot', text: reply }]);
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-bk-gold to-amber-600 text-2xl shadow-lg shadow-bk-gold/30 animate-pulse-gold"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Guide"
      >
        {isOpen ? '✕' : '🤖'}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 w-80 overflow-hidden glass-card md:w-96"
          >
            {/* Desktop: interactive Spline 3D robot (lazy) with animated fallback */}
            {!isMobile && (
              <div className="h-36 overflow-hidden rounded-t-2xl bg-bk-dark">
                {SPLINE_SCENE_URL ? (
                  <Spline scene={SPLINE_SCENE_URL} />
                ) : (
                  <SplineFallback />
                )}
              </div>
            )}

            {/* Mobile: compact avatar */}
            {isMobile && (
              <div className="flex items-center gap-3 border-b border-slate-800 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-xl">
                  🤖
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200 font-deva">{t('bot.title')}</p>
                  <p className="text-xs text-amber-400">● Online</p>
                </div>
              </div>
            )}

            <div ref={scrollRef} className="h-48 space-y-2 overflow-y-auto p-3 scroll-smooth">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed font-deva ${
                      msg.role === 'user' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800/60 text-slate-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-xl bg-slate-800/60 px-3 py-2">
                    <span className="animate-pulse text-xs text-slate-400">...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 px-3 pb-2">
              {quickActions.map((action) => (
                <button
                  key={action.key}
                  onClick={() => handleQuickAction(action.key, action.module)}
                  className="rounded-lg border border-slate-800 bg-slate-800/60 px-2 py-1 text-xs text-slate-300 transition-all hover:border-amber-400/40 hover:bg-amber-400/20 hover:text-amber-400 font-deva"
                >
                  {action.icon} {t(action.key)}
                </button>
              ))}
              <button
                onClick={startVoiceAssistant}
                className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-2 py-1 text-xs text-amber-400 transition-all hover:bg-amber-400/20 font-deva"
              >
                🎤 {t('btn.voice')}
              </button>
            </div>

            <div className="flex items-center gap-2 border-t border-slate-800 p-3">
              <input
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                aria-label={t('bot.type_here')}
                placeholder={t('bot.type_here')}
                className="flex-1 rounded-xl border border-slate-800 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus:border-amber-400/50 font-deva"
              />
              <button
                onClick={handleSend}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 font-bold text-slate-950 transition-colors hover:bg-amber-500"
                aria-label={t('bot.send')}
              >
                →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
