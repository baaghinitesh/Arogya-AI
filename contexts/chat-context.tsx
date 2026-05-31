'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/contexts/language-context';
import {
  ChatSession,
  Message,
  ChatLanguage,
  SpeechRecognitionState
} from '@/lib/types/chat';

interface ChatContextType {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  messages: Message[];
  inputMessage: string;
  setInputMessage: (msg: string) => void;
  isLoading: boolean;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  backgroundTheme: string;
  setBackgroundTheme: (theme: string) => void;
  user: any;
  isGuest: boolean;
  isAuthLoading: boolean;
  speechRecognition: SpeechRecognitionState;
  
  loadChatSessions: () => Promise<void>;
  createNewSession: () => Promise<ChatSession | null>;
  sendMessage: (overrideMessage?: string, overrideSessionId?: string) => Promise<void>;
  stopResponse: () => void;
  handleSelectSession: (session: ChatSession) => Promise<void>;
  renameSession: (sessionId: string, newTitle: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  startVoiceRecognition: () => void;
  stopVoiceRecognition: () => void;
  playTextToSpeech: (text: string) => void;
  setCurrentSession: (session: ChatSession | null) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Voice support language resolver
const getLanguageCode = (lang: string): string => {
  const codes: Record<string, string> = {
    en: 'en-US',
    hi: 'hi-IN',
    od: 'or-IN'
  };
  return codes[lang] || 'en-US';
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentLanguage } = useLanguage();

  // State Management
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
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognitionState>({
    isListening: false,
    transcript: '',
    confidence: 0
  });

  // Refs for Web API and AbortController
  const recognitionRef = useRef<any | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load chat sessions from API
  const loadChatSessions = useCallback(async () => {
    const currentUserId = user?.phone_number || 'guest_user';
    if (currentUserId === 'guest_user') return;
    
    try {
      const response = await fetch(`/api/chat/sessions?userId=${encodeURIComponent(currentUserId)}`);
      const data = await response.json();
      if (response.ok) {
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
    }
  }, [user]);

  // Create new session - Reuses existing session if completely empty
  const createNewSession = async (): Promise<ChatSession | null> => {
    // Prevent creating duplicate empty sessions
    if (currentSession && messages.length === 0) {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
      return currentSession;
    }

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
        if (typeof window !== 'undefined') {
          localStorage.setItem('arogya-current-session-id', data.session._id?.toString() || '');
        }
        setSessions(prev => [data.session, ...prev]);
        
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

  // Send message - supports aborting and auto-session creation on welcome screen
  const sendMessage = async (overrideMessage?: string, overrideSessionId?: string) => {
    const messageToSend = (overrideMessage ?? inputMessage).trim();
    if (!messageToSend || isLoading) return;

    let sessionId = overrideSessionId ?? currentSession?._id;

    // Clear input only if we're using the standard input text area
    if (!overrideMessage) setInputMessage('');
    setIsLoading(true);

    // 1. Auto-create session if we are on the welcome screen
    if (!sessionId) {
      const newSession = await createNewSession();
      if (!newSession) {
        setIsLoading(false);
        return;
      }
      sessionId = newSession._id;
    }

    // Initialize AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Push User message instantly
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
        signal: controller.signal,
        body: JSON.stringify({
          sessionId,
          message: messageToSend,
          userId: currentUserId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Swap temp user message with DB userMessage and append AI reply
        setMessages(prev => [...prev.slice(0, -1), data.userMessage, data.aiMessage]);

        // Dynamically update conversation title if auto-titled by backend (first message)
        if (data.updatedTitle) {
          setSessions(prev =>
            prev.map(s => s._id === sessionId ? { ...s, title: data.updatedTitle } : s)
          );
          setCurrentSession(prev => prev && prev._id === sessionId ? { ...prev, title: data.updatedTitle } : prev);
        }
      } else {
        throw new Error(data.error || 'Failed to generate response');
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('API call aborted by user');
        const stoppedMessage: Message = {
          _id: `stopped-${Date.now()}`,
          role: 'ai',
          content: '⏹️ Generation stopped.',
          timestamp: new Date(),
          isHistorical: true
        };
        setMessages(prev => [...prev, stoppedMessage]);
      } else {
        console.error('Failed to send message:', error);
        const errorMessage: Message = {
          _id: `error-${Date.now()}`,
          role: 'ai',
          content: '⚠️ I encountered an error communicating with the healthcare server. Please check your connection and try again.',
          timestamp: new Date(),
          isHistorical: true
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Stop response generation
  const stopResponse = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  // Select session and fetch SQLite messages
  const handleSelectSession = async (session: ChatSession) => {
    setCurrentSession(session);
    setMessages([]); // Responsive instant clean
    if (typeof window !== 'undefined') {
      localStorage.setItem('arogya-current-session-id', session._id?.toString() || '');
    }
    
    if (window.innerWidth < 1024) {
      setIsSidebarCollapsed(true);
    }

    try {
      const response = await fetch(`/api/chat/sessions/${session._id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.session) {
          setMessages(data.session.messages || []);
          if (data.session.title && data.session.title !== 'Chat') {
            setCurrentSession(prev => prev && prev._id === session._id ? { ...prev, title: data.session.title } : prev);
            setSessions(prev =>
              prev.map(s => s._id === session._id ? { ...s, title: data.session.title } : s)
            );
          }
        }
      }
    } catch (error) {
      console.error('Failed to load session messages:', error);
    }
  };

  // Rename session title inside SQLite and state array
  const renameSession = async (sessionId: string, newTitle: string) => {
    if (!newTitle.trim()) return;

    try {
      const response = await fetch(`/api/chat/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle.trim() }),
      });

      if (response.ok) {
        setSessions(prev =>
          prev.map(s => s._id === sessionId ? { ...s, title: newTitle.trim() } : s)
        );
        setCurrentSession(prev => prev && prev._id === sessionId ? { ...prev, title: newTitle.trim() } : prev);
      }
    } catch (error) {
      console.error('Failed to rename chat session:', error);
    }
  };

  // Delete session from SQLite and update state list
  const deleteSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSessions(prev => prev.filter(s => s._id !== sessionId));
        if (currentSession?._id === sessionId) {
          setCurrentSession(null);
          setMessages([]);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('arogya-current-session-id');
          }
        }
      }
    } catch (error) {
      console.error('Failed to delete chat session:', error);
    }
  };

  // Fetch Authenticated User details on mount
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    fetch('/api/user', { signal: controller.signal })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        clearTimeout(timeoutId);
        if (data && data.phone_number) {
          setUser(data);
          setIsGuest(false);
        } else {
          setIsGuest(true);
        }
      })
      .catch(() => {
        clearTimeout(timeoutId);
        setIsGuest(true);
      })
      .finally(() => setIsAuthLoading(false));

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  // Reload sessions when user loads
  useEffect(() => {
    if (user !== null) {
      loadChatSessions();
    }
  }, [user, loadChatSessions]);

  // Auto-restore active session from localStorage on mount/reload once sessions list is loaded
  useEffect(() => {
    if (sessions.length > 0 && currentSession === null && typeof window !== 'undefined') {
      const savedSessionId = localStorage.getItem('arogya-current-session-id');
      if (savedSessionId) {
        const matchedSession = sessions.find(s => s._id === savedSessionId);
        if (matchedSession) {
          handleSelectSession(matchedSession);
        }
      }
    }
  }, [sessions, currentSession, handleSelectSession]);

  // Voice speech synthesis
  const playTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // Cancel any existing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(currentLanguage.code);
      speechSynthesis.speak(utterance);
    }
  };

  // Web Speech API Voice listener
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

  // Initialize Speech Recognition based on selected language
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = getLanguageCode(currentLanguage.code);

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

  // Handle mobile resize
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

  return (
    <ChatContext.Provider
      value={{
        sessions,
        currentSession,
        messages,
        inputMessage,
        setInputMessage,
        isLoading,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        searchQuery,
        setSearchQuery,
        backgroundTheme,
        setBackgroundTheme,
        user,
        isGuest,
        isAuthLoading,
        speechRecognition,
        
        loadChatSessions,
        createNewSession,
        sendMessage,
        stopResponse,
        handleSelectSession,
        renameSession,
        deleteSession,
        startVoiceRecognition,
        stopVoiceRecognition,
        playTextToSpeech,
        setCurrentSession,
        setMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
