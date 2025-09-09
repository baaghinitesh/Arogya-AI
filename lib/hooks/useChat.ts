import { useState, useCallback, useRef } from 'react';
import { ChatSession, Message, CreateChatSessionRequest, SendMessageRequest } from '@/lib/types/chat';

export interface UseChatOptions {
  onError?: (error: string) => void;
  onSessionCreated?: (session: ChatSession) => void;
  onMessageSent?: (userMessage: Message, aiMessage: Message) => void;
}

export interface UseChatReturn {
  // State
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;

  // Actions
  loadSessions: (userId: string) => Promise<void>;
  createSession: (request: CreateChatSessionRequest) => Promise<ChatSession | null>;
  setCurrentSession: (session: ChatSession | null) => void;
  sendMessage: (request: SendMessageRequest) => Promise<void>;
  updateSessionTitle: (sessionId: string, title: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  clearError: () => void;
  stopStreaming: () => void;
}

export const useChat = (options: UseChatOptions = {}): UseChatReturn => {
  const { onError, onSessionCreated, onMessageSent } = options;

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSessionState] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    onError?.(errorMessage);
  }, [onError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadSessions = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/chat/sessions?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load sessions');
      }

      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Failed to load sessions');
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const createSession = useCallback(async (request: CreateChatSessionRequest): Promise<ChatSession | null> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const data = await response.json();
      const newSession = data.session;
      
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionState(newSession);
      setMessages(newSession.messages || []);
      
      onSessionCreated?.(newSession);
      return newSession;
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Failed to create session');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, onSessionCreated]);

  const setCurrentSession = useCallback((session: ChatSession | null) => {
    setCurrentSessionState(session);
    setMessages(session?.messages || []);
  }, []);

  const sendMessage = useCallback(async (request: SendMessageRequest) => {
    if (isStreaming) return;

    try {
      setIsLoading(true);
      setIsStreaming(true);

      // Create abort controller for this request
      abortControllerRef.current = new AbortController();

      // Add user message immediately for better UX
      const userMessage: Message = {
        _id: `temp-${Date.now()}`,
        role: 'user',
        content: request.message.trim(),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Replace temp user message with the actual ones from server
      setMessages(prev => [...prev.slice(0, -1), data.userMessage, data.aiMessage]);
      
      // Update current session with new messages
      if (currentSession) {
        const updatedSession: ChatSession = {
          ...currentSession,
          messages: [...currentSession.messages, data.userMessage, data.aiMessage],
          updatedAt: new Date(),
        };
        setCurrentSessionState(updatedSession);
        
        // Update in sessions list
        setSessions(prev => prev.map(s => 
          s._id === currentSession._id ? updatedSession : s
        ));
      }

      onMessageSent?.(data.userMessage, data.aiMessage);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was aborted, don't show error
        return;
      }
      handleError(err instanceof Error ? err.message : 'Failed to send message');
      
      // Remove the temporary user message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [currentSession, isStreaming, handleError, onMessageSent]);

  const updateSessionTitle = useCallback(async (sessionId: string, title: string) => {
    try {
      const response = await fetch(`/api/chat/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error('Failed to update session title');
      }

      const data = await response.json();
      const updatedSession = data.session;

      setSessions(prev => prev.map(s => 
        s._id === sessionId ? updatedSession : s
      ));

      if (currentSession?._id === sessionId) {
        setCurrentSessionState(updatedSession);
      }
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Failed to update session title');
    }
  }, [currentSession, handleError]);

  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete session');
      }

      setSessions(prev => prev.filter(s => s._id !== sessionId));
      
      if (currentSession?._id === sessionId) {
        setCurrentSessionState(null);
        setMessages([]);
      }
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Failed to delete session');
    }
  }, [currentSession, handleError]);

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  }, []);

  return {
    // State
    sessions,
    currentSession,
    messages,
    isLoading,
    isStreaming,
    error,

    // Actions
    loadSessions,
    createSession,
    setCurrentSession,
    sendMessage,
    updateSessionTitle,
    deleteSession,
    clearError,
    stopStreaming,
  };
};