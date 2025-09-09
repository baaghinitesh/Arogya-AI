'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatSession, Message, ChatLanguage, SpeechRecognitionState, SpeechSynthesisState } from '@/lib/types/chat';

interface ChatStore {
  // Current session state
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  isLoading: boolean;
  error: string | null;
  
  // UI state
  isSidebarOpen: boolean;
  isGenerating: boolean;
  searchQuery: string;
  currentLanguage: ChatLanguage;
  
  // Speech recognition state
  speechRecognition: SpeechRecognitionState;
  speechSynthesis: SpeechSynthesisState;
  
  // Actions
  setCurrentSession: (session: ChatSession | null) => void;
  setSessions: (sessions: ChatSession[]) => void;
  addSession: (session: ChatSession) => void;
  updateSession: (sessionId: string, updates: Partial<ChatSession>) => void;
  deleteSession: (sessionId: string) => void;
  
  addMessage: (sessionId: string, message: Message) => void;
  updateMessage: (sessionId: string, messageId: string, updates: Partial<Message>) => void;
  
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsGenerating: (generating: boolean) => void;
  
  // UI actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setCurrentLanguage: (language: ChatLanguage) => void;
  
  // Speech actions
  setSpeechRecognition: (state: Partial<SpeechRecognitionState>) => void;
  setSpeechSynthesis: (state: Partial<SpeechSynthesisState>) => void;
  
  // Utility actions
  reset: () => void;
  clearError: () => void;
}

const initialState = {
  currentSession: null,
  sessions: [],
  isLoading: false,
  error: null,
  isSidebarOpen: true,
  isGenerating: false,
  searchQuery: '',
  currentLanguage: 'en' as ChatLanguage,
  speechRecognition: {
    isListening: false,
    transcript: '',
    confidence: 0,
  },
  speechSynthesis: {
    isSpeaking: false,
    isPaused: false,
  },
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Session actions
      setCurrentSession: (session) => 
        set({ currentSession: session }),
      
      setSessions: (sessions) => 
        set({ sessions }),
      
      addSession: (session) => 
        set((state) => ({ 
          sessions: [session, ...state.sessions],
          currentSession: session 
        })),
      
      updateSession: (sessionId, updates) => 
        set((state) => ({
          sessions: state.sessions.map(session => 
            session._id?.toString() === sessionId 
              ? { ...session, ...updates, updatedAt: new Date() }
              : session
          ),
          currentSession: 
            state.currentSession?._id?.toString() === sessionId 
              ? { ...state.currentSession, ...updates, updatedAt: new Date() }
              : state.currentSession
        })),
      
      deleteSession: (sessionId) => 
        set((state) => ({
          sessions: state.sessions.filter(session => 
            session._id?.toString() !== sessionId
          ),
          currentSession: 
            state.currentSession?._id?.toString() === sessionId 
              ? null 
              : state.currentSession
        })),
      
      // Message actions
      addMessage: (sessionId, message) => 
        set((state) => {
          const updatedSessions = state.sessions.map(session => {
            if (session._id?.toString() === sessionId) {
              return {
                ...session,
                messages: [...session.messages, message],
                updatedAt: new Date(),
                metadata: {
                  ...session.metadata,
                  totalMessages: session.messages.length + 1,
                  lastActivity: new Date(),
                }
              };
            }
            return session;
          });
          
          const updatedCurrentSession = state.currentSession?._id?.toString() === sessionId
            ? {
                ...state.currentSession,
                messages: [...state.currentSession.messages, message],
                updatedAt: new Date(),
                metadata: {
                  ...state.currentSession.metadata,
                  totalMessages: state.currentSession.messages.length + 1,
                  lastActivity: new Date(),
                }
              }
            : state.currentSession;
          
          return {
            sessions: updatedSessions,
            currentSession: updatedCurrentSession,
          };
        }),
      
      updateMessage: (sessionId, messageId, updates) => 
        set((state) => {
          const updatedSessions = state.sessions.map(session => {
            if (session._id?.toString() === sessionId) {
              return {
                ...session,
                messages: session.messages.map(msg => 
                  msg._id?.toString() === messageId 
                    ? { ...msg, ...updates }
                    : msg
                ),
                updatedAt: new Date(),
              };
            }
            return session;
          });
          
          const updatedCurrentSession = state.currentSession?._id?.toString() === sessionId
            ? {
                ...state.currentSession,
                messages: state.currentSession.messages.map(msg => 
                  msg._id?.toString() === messageId 
                    ? { ...msg, ...updates }
                    : msg
                ),
                updatedAt: new Date(),
              }
            : state.currentSession;
          
          return {
            sessions: updatedSessions,
            currentSession: updatedCurrentSession,
          };
        }),
      
      // Loading and error actions
      setIsLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      
      // UI actions
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setCurrentLanguage: (language) => set({ currentLanguage: language }),
      
      // Speech actions
      setSpeechRecognition: (state) => 
        set((prevState) => ({
          speechRecognition: { ...prevState.speechRecognition, ...state }
        })),
      
      setSpeechSynthesis: (state) => 
        set((prevState) => ({
          speechSynthesis: { ...prevState.speechSynthesis, ...state }
        })),
      
      // Utility actions
      reset: () => set(initialState),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'arogya-chat-store',
      partialize: (state) => ({
        sessions: state.sessions,
        currentLanguage: state.currentLanguage,
        isSidebarOpen: state.isSidebarOpen,
      }),
    }
  )
);