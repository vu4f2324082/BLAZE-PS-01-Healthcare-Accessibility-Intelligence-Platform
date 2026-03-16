'use client';

import { useVoice } from '@/hooks/useVoice';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff } from 'lucide-react';

/**
 * TASK-09 / TASK-21
 * Global floating Voice Assistant button.
 * - Starts Web Speech recognition
 * - When transcript is ready: speaks it back + navigates to /search?q=<transcript>
 * - Hidden + no-crash when browser doesn't support Web Speech API
 */
export default function VoiceAssistant() {
  const { isListening, startListening, stopListening, transcript, speak, isSupported } = useVoice();
  const router = useRouter();
  const [banner, setBanner] = useState('');

  // TASK-21: When transcript changes → speak feedback + push search route
  useEffect(() => {
    if (!transcript) return;
    const text = transcript.trim();
    if (!text) return;

    setBanner(`Searching for: "${text}"`);
    speak(`Searching for: ${text}`);
    router.push(`/search?q=${encodeURIComponent(text)}`);

    // Dismiss banner after 4 seconds
    const t = setTimeout(() => setBanner(''), 4000);
    return () => clearTimeout(t);
  }, [transcript]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isSupported) return null;

  return (
    <>
      {/* TASK-21: Voice search active banner */}
      {banner && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4"
        >
          <Mic size={16} className="text-primary-400" />
          {banner}
        </div>
      )}

      {/* Floating mic button */}
      <button
        id="voice-assistant-btn"
        onClick={isListening ? stopListening : startListening}
        aria-label={isListening ? 'Stop voice search' : 'Activate voice search'}
        aria-pressed={isListening}
        title="Voice Search — speak to find accessible facilities"
        className={`fixed bottom-8 right-8 z-50 p-5 rounded-full shadow-2xl transition-all focus:outline-none focus:ring-4 focus:ring-primary-400 text-white
          ${isListening
            ? 'bg-red-500 animate-pulse scale-110 shadow-red-500/40'
            : 'bg-primary-600 hover:bg-primary-700 hover:scale-105 shadow-primary-500/30'
          }`}
      >
        {isListening ? <MicOff size={28} /> : <Mic size={28} />}
      </button>
    </>
  );
}
