'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  PaperAirplaneIcon,
  StopIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/language-context';
import {
  ChatSession,
  Message,
  ChatLanguage,
  SpeechRecognitionState
} from '@/lib/types/chat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Sidebar from '@/components/chat/sidebar';
import ChatHeader from '@/components/chat/chat-header';
import ChatMessages from '@/components/chat/chat-messages';
import ChatInput from '@/components/chat/chat-input';
import WelcomeScreen from '@/components/chat/welcome-screen';
import { getBackgroundTheme, backgroundThemes } from '@/lib/config/background';

// Global types for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Dynamic authenticated user details loaded reactively


// Language options for the chat interface
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'od', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
];

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  // State management
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [backgroundTheme, setBackgroundTheme] = useState('default');
  const [user, setUser] = useState<any>(null);
  const [isGuest, setIsGuest] = useState(true);
  
  // Voice support
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognitionState>({
    isListening: false,
    transcript: '',
    confidence: 0
  });

  // Get current background theme
  const currentTheme = getBackgroundTheme(backgroundTheme);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const recognitionRef = useRef<any | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [inputMessage]);

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Fetch authenticated user details on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const data = await res.json();
          if (data && data.phone_number) {
            setUser(data);
            setIsGuest(false);
          } else {
            setIsGuest(true);
          }
        }
      } catch (e) {
        console.error('Failed to fetch user session:', e);
        setIsGuest(true);
      }
    };
    fetchUser();
  }, []);

  // Load chat sessions when user state is initialized
  useEffect(() => {
    if (user !== undefined) {
      loadChatSessions();
    }
  }, [user]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = getLanguageCode(currentLanguage.code as ChatLanguage);

        recognitionRef.current.onstart = () => {
          setSpeechRecognition(prev => ({ ...prev, isListening: true, error: undefined }));
        };

        recognitionRef.current.onresult = (event: any) => {
          const result = event.results[event.resultIndex];
          setSpeechRecognition(prev => ({
            ...prev,
            transcript: result[0].transcript,
            confidence: result[0].confidence
          }));
          
          if (result.isFinal) {
            setInputMessage(result[0].transcript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          setSpeechRecognition(prev => ({
            ...prev,
            isListening: false,
            error: event.error
          }));
        };

        recognitionRef.current.onend = () => {
          setSpeechRecognition(prev => ({ ...prev, isListening: false }));
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
    };
  }, [currentLanguage]);

  const getLanguageCode = (lang: ChatLanguage): string => {
    const codes = {
      en: 'en-US',
      hi: 'hi-IN',
      od: 'or-IN'
    };
    return codes[lang] || 'en-US';
  };

  const loadChatSessions = async () => {
    const currentUserId = user?.phone_number || 'guest_user';
    try {
      const response = await fetch(`/api/chat/sessions?userId=${currentUserId}`);
      const data = await response.json();
      if (response.ok) {
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
    }
  };

  // createNewSession now returns the created session (or null)
  const createNewSession = async (): Promise<ChatSession | null> => {
    const currentUserId = user?.phone_number || 'guest_user';
    try {
      const response = await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          language: currentLanguage.code as ChatLanguage,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setCurrentSession(data.session);
        setMessages([]);
        setSessions(prev => [data.session, ...prev]);
        // Auto-collapse sidebar on mobile after creating session
        if (window.innerWidth < 1024) {
          setIsSidebarCollapsed(true);
        }
        return data.session;
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    }
    return null;
  };

  /**
   * sendMessage - sends a message.
   * If `overrideMessage` is provided, it will be used instead of inputMessage.
   * If `overrideSessionId` is provided, that sessionId will be used (useful after createNewSession()).
   */
  const sendMessage = async (overrideMessage?: string, overrideSessionId?: string) => {
    const messageToSend = (overrideMessage ?? inputMessage).trim();
    const sessionId = overrideSessionId ?? currentSession?._id;
    if (!messageToSend || !sessionId || isLoading) return;

    // Clear input only if we're using the normal input (not if caller passed an override message).
    if (!overrideMessage) setInputMessage('');
    setIsLoading(true);

    // Add user message immediately (temp)
    const userMessage: Message = {
      _id: `temp-${Date.now()}`,
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    const currentUserId = user?.phone_number || 'guest_user';
    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message: messageToSend,
          userId: currentUserId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // replace temp user message with server userMessage and append aiMessage
        setMessages(prev => [...prev.slice(0, -1), data.userMessage, data.aiMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceRecognition = () => {
    if (recognitionRef.current && !speechRecognition.isListening) {
      recognitionRef.current.start();
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current && speechRecognition.isListening) {
      recognitionRef.current.stop();
    }
  };

  const playTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(currentLanguage.code as ChatLanguage);
      speechSynthesis.speak(utterance);
    }
  };

  // Handler for welcome quick prompts: create a session and immediately send the prompt
  const handleQuickPrompt = async (prompt: string) => {
    const session = await createNewSession();
    if (session) {
      // send using the freshly created session id (avoid race with state update)
      await sendMessage(prompt, session._id?.toString());
    }
  };

  const handleSelectSession = (session: ChatSession) => {
    setCurrentSession(session);
    setMessages(session.messages || []);
    if (window.innerWidth < 1024) {
      setIsSidebarCollapsed(true);
    }
  };

  return (
    <div className={`flex h-[calc(100vh-80px)] mt-20 ${currentTheme.chatContainer} ${className}`}>
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        currentSession={currentSession}
        isCollapsed={isSidebarCollapsed}
        searchQuery={searchQuery}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onCreateNewSession={createNewSession}
        onSelectSession={handleSelectSession}
        onSearchChange={setSearchQuery}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ChatHeader
          backgroundTheme={backgroundTheme}
          setBackgroundTheme={setBackgroundTheme}
          currentLanguage={currentLanguage}
          changeLanguage={changeLanguage}
          languages={languages}
          currentTheme={currentTheme}
        />

        {isGuest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 max-w-lg w-full text-center shadow-2xl space-y-6"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 text-3xl animate-pulse">
                🛡️
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Secure Patient Access Required
                </h2>
                <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
                  Arogya AI is a protected medical system. To ensure HIPAA compliance, secure medical records privacy, and WhatsApp synchronization, guest chatting is disabled on the web portal.
                </p>
                <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 mt-2">
                  Please log in or register your number to start chatting with your AI Health Assistant.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Link
                  href="/register"
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/10 hover:shadow-xl transition-all text-center cursor-pointer"
                >
                  Register New Account
                </Link>
                <Link
                  href="/sign-in"
                  className="w-full py-3.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-2xl transition-all text-center cursor-pointer"
                >
                  Sign In / Log In
                </Link>
              </div>
            </motion.div>
          </div>
        )}

        {currentSession ? (
          <>
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              t={t}
              currentTheme={currentTheme}
              playTextToSpeech={playTextToSpeech}
              messagesEndRef={messagesEndRef}
            />

            <ChatInput
              inputRef={inputRef}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              sendMessage={sendMessage}
              isLoading={isLoading}
              speechRecognition={speechRecognition}
              startVoiceRecognition={startVoiceRecognition}
              stopVoiceRecognition={stopVoiceRecognition}
              t={t}
              currentTheme={currentTheme}
            />
          </>
        ) : (
          <WelcomeScreen onPromptSelected={handleQuickPrompt} currentTheme={currentTheme} />
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
