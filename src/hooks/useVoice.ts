import { useState, useEffect, useCallback } from 'react';

export function useVoice() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }
    setIsSupported(true);
    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = 'en-US';

    recog.onresult = (event: any) => {
      const text: string = event.results[0][0].transcript;
      setTranscript(text);
      setIsListening(false);
    };
    recog.onerror = () => setIsListening(false);
    recog.onend = () => setIsListening(false);
    setRecognition(recog);
  }, []);

  const startListening = useCallback(() => {
    if (!recognition) return;
    setTranscript('');
    setIsListening(true);
    try { recognition.start(); } catch { setIsListening(false); }
  }, [recognition]);

  const stopListening = useCallback(() => {
    recognition?.stop();
    setIsListening(false);
  }, [recognition]);

  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return { transcript, isListening, startListening, stopListening, speak, isSupported };
}
