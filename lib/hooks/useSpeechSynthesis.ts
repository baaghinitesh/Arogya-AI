import { useState, useCallback, useRef, useEffect } from 'react';
import { SpeechSynthesisState, ChatLanguage } from '@/lib/types/chat';

export interface UseSpeechSynthesisOptions {
  language?: ChatLanguage;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  onPause?: () => void;
  onResume?: () => void;
}

export interface UseSpeechSynthesisReturn extends SpeechSynthesisState {
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
  speak: (text: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setVoice: (voice: SpeechSynthesisVoice) => void;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
  setVolume: (volume: number) => void;
}

const getLanguageCode = (lang: ChatLanguage): string => {
  const codes: Record<ChatLanguage, string> = {
    en: 'en-US',
    hi: 'hi-IN',
    od: 'or-IN'
  };
  return codes[lang] || 'en-US';
};

export const useSpeechSynthesis = (options: UseSpeechSynthesisOptions = {}): UseSpeechSynthesisReturn => {
  const {
    language = 'en',
    rate = 1,
    pitch = 1,
    volume = 1,
    onStart,
    onEnd,
    onError,
    onPause,
    onResume
  } = options;

  const [state, setState] = useState<SpeechSynthesisState>({
    isSpeaking: false,
    isPaused: false,
  });

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speechRate, setSpeechRate] = useState(rate);
  const [speechPitch, setSpeechPitch] = useState(pitch);
  const [speechVolume, setSpeechVolume] = useState(volume);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Load available voices
  const loadVoices = useCallback(() => {
    if (!isSupported) return;

    const availableVoices = speechSynthesis.getVoices();
    setVoices(availableVoices);

    // Auto-select best voice for the current language
    if (!selectedVoice && availableVoices.length > 0) {
      const langCode = getLanguageCode(language);
      const preferredVoice = availableVoices.find(voice => 
        voice.lang.startsWith(langCode.split('-')[0])
      ) || availableVoices[0];
      
      setSelectedVoice(preferredVoice);
    }
  }, [isSupported, language, selectedVoice]);

  useEffect(() => {
    if (!isSupported) return;

    loadVoices();
    
    // Load voices when they become available
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [loadVoices, isSupported]);

  const speak = useCallback((text: string) => {
    if (!isSupported || !text.trim()) {
      const error = isSupported ? 'No text provided' : 'Speech synthesis not supported';
      setState(prev => ({ ...prev, error }));
      onError?.(error);
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text.trim());
    
    // Set voice and speech parameters
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.lang = getLanguageCode(language);
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    utterance.volume = speechVolume;

    // Event listeners
    utterance.onstart = () => {
      setState(prev => ({
        ...prev,
        isSpeaking: true,
        isPaused: false,
        currentText: text,
        error: undefined
      }));
      onStart?.();
    };

    utterance.onend = () => {
      setState(prev => ({
        ...prev,
        isSpeaking: false,
        isPaused: false,
        currentText: undefined
      }));
      onEnd?.();
    };

    utterance.onerror = (event) => {
      const errorMessage = `Speech synthesis error: ${event.error}`;
      setState(prev => ({
        ...prev,
        isSpeaking: false,
        isPaused: false,
        currentText: undefined,
        error: errorMessage
      }));
      onError?.(errorMessage);
    };

    utterance.onpause = () => {
      setState(prev => ({ ...prev, isPaused: true }));
      onPause?.();
    };

    utterance.onresume = () => {
      setState(prev => ({ ...prev, isPaused: false }));
      onResume?.();
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [isSupported, selectedVoice, language, speechRate, speechPitch, speechVolume, onStart, onEnd, onError, onPause, onResume]);

  const pause = useCallback(() => {
    if (isSupported && state.isSpeaking && !state.isPaused) {
      speechSynthesis.pause();
    }
  }, [isSupported, state.isSpeaking, state.isPaused]);

  const resume = useCallback(() => {
    if (isSupported && state.isSpeaking && state.isPaused) {
      speechSynthesis.resume();
    }
  }, [isSupported, state.isSpeaking, state.isPaused]);

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel();
      setState(prev => ({
        ...prev,
        isSpeaking: false,
        isPaused: false,
        currentText: undefined
      }));
    }
  }, [isSupported]);

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
  }, []);

  const setRate = useCallback((rate: number) => {
    setSpeechRate(Math.max(0.1, Math.min(10, rate)));
  }, []);

  const setPitch = useCallback((pitch: number) => {
    setSpeechPitch(Math.max(0, Math.min(2, pitch)));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setSpeechVolume(Math.max(0, Math.min(1, volume)));
  }, []);

  return {
    ...state,
    isSupported,
    voices,
    speak,
    pause,
    resume,
    stop,
    setVoice,
    setRate,
    setPitch,
    setVolume,
  };
};