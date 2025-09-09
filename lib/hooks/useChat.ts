import { useState, useCallback, useEffect } from 'react';
import apiClient, { ChatMessage, ChatResponse, ApiResponse } from '../api/client';

export interface UseChatOptions {
  autoCreateSession?: boolean;
  language?: 'en' | 'hi' | 'od';
  onError?: (error: string) => void;
  onResponse?: (response: ChatResponse) => void;
}

export interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<boolean>;
  clearMessages: () => void;
  loadHistory: () => Promise<void>;
  isConnected: boolean;
}

export const useChat = (options: UseChatOptions = {}): UseChatReturn => {
  const {
    autoCreateSession = true,
    language = 'en',
    onError,
    onResponse
  } = options;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize session on mount
  useEffect(() => {
    if (autoCreateSession) {
      initializeSession();
    }
  }, [autoCreateSession, language]);

  const initializeSession = async () => {
    try {
      const response = await apiClient.createSession(language);
      if (response.success) {
        setIsConnected(true);
        await loadHistory();
      } else {
        setError(response.error || 'Failed to initialize session');
        setIsConnected(false);
      }
    } catch (err) {
      setError('Failed to connect to the server');
      setIsConnected(false);
    }
  };

  const sendMessage = useCallback(async (message: string): Promise<boolean> => {
    if (!message.trim()) return false;

    setIsLoading(true);
    setError(null);

    // Add user message immediately for better UX
    const userMessage: ChatMessage = {
      message: message.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
      language,
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response: ApiResponse<ChatResponse> = await apiClient.sendChatMessage(
        message.trim(),
        language
      );

      if (response.success && response.data) {
        // Add bot response
        const botMessage: ChatMessage = {
          message: response.data.response,
          sender: 'bot',
          timestamp: new Date().toISOString(),
          language,
          metadata: {
            confidence: response.data.confidence,
            suggestions: response.data.suggestions,
            followUpQuestions: response.data.followUpQuestions,
            requiresHuman: response.data.requiresHuman,
          },
        };

        setMessages(prev => [...prev, botMessage]);
        onResponse?.(response.data);
        return true;
      } else {
        const errorMsg = response.error || 'Failed to get response';
        setError(errorMsg);
        onError?.(errorMsg);
        return false;
      }
    } catch (err) {
      const errorMsg = 'Network error. Please check your connection.';
      setError(errorMsg);
      onError?.(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [language, onError, onResponse]);

  const loadHistory = useCallback(async () => {
    try {
      const response = await apiClient.getChatHistory();
      if (response.success && response.data) {
        setMessages(response.data);
      }
    } catch (err) {
      console.warn('Failed to load chat history:', err);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    loadHistory,
    isConnected,
  };
};