'use client';
// VoiceSearchAgent — floating mic FAB that captures speech via the Web Speech API
// and hands the transcript to the parent for fuzzy directory search. Degrades
// gracefully when the browser has no SpeechRecognition support.
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Mic } from 'lucide-react';

interface Props {
  language: 'mr' | 'en';
  onResult: (transcript: string) => void;
  note?: { text: string; ok: boolean } | null;
}

export default function VoiceSearchAgent({ language, onResult, note }: Props) {
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState('');
  const [open, setOpen] = useState(false);
  const recRef = useRef<any>(null);

  // Example searches — real, server-matchable terms (cities / pincode) that both
  // demonstrate the feature and actually return results when tapped.
  const examples = language === 'mr'
    ? ['पुणे', 'मुंबई', 'नागपूर', '411001']
    : ['Pune', 'Mumbai', 'Nagpur', '411001'];

  const runExample = (term: string) => {
    setHeard(term);
    setOpen(true);
    onResult(term);
  };

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSupported(!!SR);
    // Open the hint once so users notice they can search by voice, then let them
    // dismiss it by interacting. (Auto-shown only on first mount.)
    const hintTimer = setTimeout(() => setOpen(true), 1200);
    return () => {
      clearTimeout(hintTimer);
      try {
        recRef.current?.abort();
      } catch {
        /* noop */
      }
    };
  }, []);

  const start = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      setOpen(true);
      return;
    }
    const rec = new SR();
    rec.lang = language === 'mr' ? 'mr-IN' : 'en-IN';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.continuous = false;

    rec.onresult = (e: any) => {
      const txt = e.results?.[0]?.[0]?.transcript ?? '';
      setHeard(txt);
      if (txt.trim()) onResult(txt.trim());
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);

    recRef.current = rec;
    setHeard('');
    setOpen(true);
    setListening(true);
    try {
      rec.start();
    } catch {
      setListening(false);
    }
  };

  const stop = () => {
    try {
      recRef.current?.stop();
    } catch {
      /* noop */
    }
    setListening(false);
  };

  const toggle = () => {
    setOpen(true);
    if (listening) stop();
    else start();
  };

  const heardLabel = language === 'mr' ? 'तुम्ही म्हणालात:' : 'You said:';
  const listeningLabel = language === 'mr' ? 'ऐकत आहे…' : 'Listening…';
  const hintLabel =
    language === 'mr' ? 'बँक, पिनकोड किंवा शहर बोला' : 'Speak a bank, pincode or city';
  const unsupportedLabel =
    language === 'mr'
      ? 'या ब्राउझरमध्ये व्हॉइस सपोर्ट नाही. कृपया ड्रॉपडाउन वापरा.'
      : 'Voice is not supported in this browser. Please use the dropdowns.';

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">
      {/* Tooltip / feedback panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            role="status"
            aria-live="polite"
            className="max-w-[260px] rounded-2xl border border-slate-700/60 bg-slate-900/90 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            {!supported ? (
              <p className="text-xs font-semibold leading-relaxed text-rose-300 font-deva">{unsupportedLabel}</p>
            ) : listening ? (
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                </span>
                <p className="text-sm font-bold text-amber-300 font-deva">{listeningLabel}</p>
              </div>
            ) : (
              <p className="text-xs font-medium text-slate-400 font-deva">{hintLabel}</p>
            )}

            {heard && (
              <p className="mt-2 text-xs leading-relaxed text-slate-300 font-deva">
                {heardLabel} <span className="font-bold text-slate-100">{heard}</span>
              </p>
            )}

            {/* Tappable example searches (also a fallback when voice is unsupported) */}
            {!listening && (
              <div className="mt-3">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 font-deva">
                  {language === 'mr' ? 'उदाहरणे — बोला किंवा टॅप करा' : 'Examples — say or tap'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {examples.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => runExample(ex)}
                      className="rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-[11px] font-semibold text-slate-300 transition-colors hover:border-amber-400/50 hover:text-amber-300 font-deva"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {note && (
              <p
                className={`mt-2 text-xs font-semibold leading-relaxed font-deva ${
                  note.ok ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                {note.text}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB + prominent "speak to search" label */}
      <button
        onClick={toggle}
        aria-label={listening ? listeningLabel : hintLabel}
        aria-pressed={listening}
        className={`group relative flex h-14 items-center gap-2 rounded-full pl-4 pr-5 text-slate-950 shadow-lg transition-all duration-300 ${
          listening
            ? 'bg-amber-300 shadow-[0_0_34px_rgba(251,191,36,0.75)]'
            : 'bg-gradient-to-tr from-amber-400 to-yellow-500 shadow-[0_0_22px_rgba(251,191,36,0.45)] hover:shadow-[0_0_32px_rgba(251,191,36,0.7)]'
        }`}
      >
        {listening && (
          <span className="absolute inset-0 animate-ping rounded-full bg-amber-400/60" />
        )}
        <span className="relative flex items-center gap-2">
          {listening ? <Mic className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
          <span className="text-sm font-extrabold font-deva">
            {listening ? listeningLabel : language === 'mr' ? 'बोलून शोधा' : 'Search by voice'}
          </span>
        </span>
      </button>
    </div>
  );
}
