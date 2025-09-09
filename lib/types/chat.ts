import { ObjectId } from 'mongodb';

export interface Message {
  _id?: ObjectId | string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  metadata?: {
    tokens?: number;
    model?: string;
    confidence?: number;
  };
}

export interface ChatSession {
  _id?: ObjectId | string;
  userId: string;
  title: string;
  language: 'en' | 'hi' | 'od';
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  metadata?: {
    totalMessages: number;
    lastActivity: Date;
    category?: string;
    tags?: string[];
  };
}

export interface CreateChatSessionRequest {
  userId: string;
  language: 'en' | 'hi' | 'od';
  initialMessage?: string;
}

export interface SendMessageRequest {
  sessionId: string;
  message: string;
  userId: string;
}

export interface ChatHistoryGroup {
  label: string;
  sessions: ChatSession[];
}

export type ChatLanguage = 'en' | 'hi' | 'od';

export interface SpeechRecognitionState {
  isListening: boolean;
  transcript: string;
  confidence: number;
  error?: string;
}

export interface SpeechSynthesisState {
  isSpeaking: boolean;
  isPaused: boolean;
  currentText?: string;
  error?: string;
}