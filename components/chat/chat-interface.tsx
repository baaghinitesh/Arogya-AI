'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { ChatSession, Message, ChatLanguage, SpeechRecognitionState, SpeechSynthesisState } from '@/lib/types/chat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Sidebar from '@/components/chat/sidebar';
import { getBackgroundTheme, backgroundThemes } from '@/lib/config/background';

// Global types for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Mock user data - in production, get from auth context
const mockUser = {
  id: 'user_123',
  name: 'User',
  avatar: '/placeholder-avatar.png'
};

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
  
  // Voice support
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognitionState>({
    isListening: false,
    transcript: '',
    confidence: 0
  });

  // Get current background theme
  const currentTheme = getBackgroundTheme(backgroundTheme);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
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

  // Load chat sessions
  useEffect(() => {
    loadChatSessions();
  }, []);

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
        recognitionRef.current.stop();
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
    try {
      const response = await fetch(`/api/chat/sessions?userId=${mockUser.id}`);
      const data = await response.json();
      if (response.ok) {
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
    }
  };

  const createNewSession = async () => {
    try {
      const response = await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: mockUser.id,
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
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentSession || isLoading) return;

    const message = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message immediately
    const userMessage: Message = {
      _id: `temp-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: currentSession._id,
          message,
          userId: mockUser.id,
        }),
      });

      const data = await response.json();
      if (response.ok) {
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

  // Memoized Typewriter effect component to prevent re-renders
  const TypewriterText = React.memo(({ text, messageId }: { text: string; messageId: string }) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
      // Reset animation when message changes
      setDisplayText('');
      setCurrentIndex(0);
      setIsAnimating(true);
    }, [messageId]);

    useEffect(() => {
      if (isAnimating && currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, 30);
        return () => clearTimeout(timeout);
      } else if (currentIndex >= text.length) {
        setIsAnimating(false);
      }
    }, [currentIndex, text, isAnimating]);

    return <span>{displayText}</span>;
  });

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
        onSelectSession={setCurrentSession}
        onSearchChange={setSearchQuery}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className={`${currentTheme.inputArea} border-b border-gray-200 p-4 shadow-sm`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Arogya AI Assistant
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Background Theme Selector */}
              <Select value={backgroundTheme} onValueChange={setBackgroundTheme}>
                <SelectTrigger className="w-24 sm:w-32 bg-white border-gray-300 text-gray-700 shadow-sm text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-lg">
                  {Object.values(backgroundThemes).map((theme) => (
                    <SelectItem key={theme.name} value={theme.name} className="text-gray-700 hover:bg-gray-50 text-sm">
                      {theme.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Language Selector */}
              <Select value={currentLanguage.code} onValueChange={(value) => changeLanguage(value)}>
                <SelectTrigger className="w-32 sm:w-40 bg-white border-gray-300 text-gray-700 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-lg">
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code} className="text-gray-700 hover:bg-gray-50">
                      <span className="flex items-center space-x-2">
                        <span>{lang.flag}</span>
                        <span className="hidden sm:inline">{lang.name}</span>
                        <span className="sm:hidden">{lang.code.toUpperCase()}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {currentSession ? (
          <>
            {/* Messages Area */}
            <div className={`flex-1 overflow-y-auto ${currentTheme.messagesArea}`}>
              <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message._id as string}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] sm:max-w-[70%] ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-l-2xl rounded-tr-2xl'
                          : 'bg-white border border-gray-200 text-gray-800 rounded-r-2xl rounded-tl-2xl shadow-sm'
                      } p-4`}>
                        {message.role === 'ai' && !message.isStreaming ? (
                          <TypewriterText text={message.content} messageId={message._id as string} />
                        ) : (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <p className={`text-xs ${
                            message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                          
                          {message.role === 'ai' && !message.isStreaming && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => playTextToSpeech(message.content)}
                              className="ml-2 h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                            >
                              <SpeakerWaveIcon className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Typing Indicator */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white border border-gray-200 rounded-r-2xl rounded-tl-2xl p-4 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                          </div>
                          <span className="text-sm text-gray-500">{t('typingIndicator')}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className={`${currentTheme.inputArea} border-t border-gray-200 p-3 sm:p-4`}>
              <div className="flex items-end space-x-2 sm:space-x-3">
                {/* Voice Input Button */}
                <div className="flex-shrink-0">
                  <Button
                    variant={speechRecognition.isListening ? "default" : "outline"}
                    size="lg"
                    onClick={speechRecognition.isListening ? stopVoiceRecognition : startVoiceRecognition}
                    title={speechRecognition.isListening ? t('stopListening') : t('startListening')}
                    className={`h-12 w-12 rounded-full border-2 touch-manipulation transition-all duration-200 ${
                      speechRecognition.isListening 
                        ? 'bg-red-500 border-red-500 text-white shadow-lg' 
                        : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:scale-105'
                    }`}
                  >
                    <div className={speechRecognition.isListening ? 'animate-pulse' : ''}>
                      {speechRecognition.isListening ? (
                        <StopIcon className="h-5 w-5" />
                      ) : (
                        <MicrophoneIcon className="h-5 w-5" />
                      )}
                    </div>
                  </Button>
                </div>

                {/* Text Input */}
                <div className="flex-1 relative">
                  <Textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={speechRecognition.isListening ? t('listening') : t('messagePlaceholder')}
                    className="min-h-[48px] max-h-[120px] resize-none bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400 overflow-hidden"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    onFocus={(e) => {
                      // Prevent any side effects from focus events
                      e.preventDefault();
                    }}
                    onClick={(e) => {
                      // Prevent any side effects from click events
                      e.stopPropagation();
                    }}
                    disabled={speechRecognition.isListening}
                  />
                </div>

                {/* Send Button */}
                <div className="flex-shrink-0">
                  <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    size="lg"
                    title={t('sendMessage')}
                    className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 text-white shadow-lg disabled:opacity-50 touch-manipulation transition-all duration-200"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {speechRecognition.isListening && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500 mt-2 text-center"
                >
                  🎤 {speechRecognition.transcript || t('listening')}
                </motion.p>
              )}
            </div>
          </>
        ) : (
          // Welcome Screen
          <div className={`flex-1 flex items-center justify-center ${currentTheme.messagesArea}`}>
            <div className="text-center max-w-md mx-auto p-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to Arogya AI
              </h2>
              <p className="text-gray-600 mb-8">
                Your AI-powered health assistant. Start a new conversation to get personalized health guidance in your preferred language.
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {[
                    "What are the symptoms of fever?",
                    "How can I manage my headache?", 
                    "Tips for better sleep",
                    "Healthy diet recommendations"
                  ].map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        createNewSession();
                        setInputMessage(prompt);
                      }}
                      className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                    >
                      <span className="text-sm text-gray-700">{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;