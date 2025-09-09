'use client';

// Global types for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  PaperAirplaneIcon,
  StopIcon,
  MicrophoneIcon,
  PaperClipIcon,
  SpeakerWaveIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  HeartIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ArrowPathIcon,
  ShareIcon,
  ClipboardIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/language-context';
import { ChatSession, Message, ChatLanguage, SpeechRecognitionState, SpeechSynthesisState } from '@/lib/types/chat';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';

// Mock user data - in production, get from auth context
const mockUser = {
  id: 'user_123',
  name: 'User',
  avatar: '/placeholder-avatar.png'
};

const ChatInterface: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const router = useRouter();

  // State management
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Voice support
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognitionState>({
    isListening: false,
    transcript: '',
    confidence: 0
  });
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesisState>({
    isSpeaking: false,
    isPaused: false
  });

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any | null>(null);

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

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = getLanguageCode(currentLanguage.code as ChatLanguage);

        recognitionRef.current.onstart = () => {
          setSpeechRecognition(prev => ({ ...prev, isListening: true, error: undefined }));
        };

        recognitionRef.current.onresult = (event) => {
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

        recognitionRef.current.onerror = (event) => {
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
        setIsSidebarOpen(false); // Close sidebar on mobile after creating session
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
    setIsStreaming(true);

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
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startVoiceRecording = () => {
    if (recognitionRef.current && !speechRecognition.isListening) {
      recognitionRef.current.start();
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current && speechRecognition.isListening) {
      recognitionRef.current.stop();
    }
  };

  const playTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(currentLanguage.code as ChatLanguage);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setSpeechSynthesis(prev => ({ ...prev, isSpeaking: true, currentText: text }));
      };

      utterance.onend = () => {
        setSpeechSynthesis(prev => ({ ...prev, isSpeaking: false, currentText: undefined }));
      };

      utterance.onerror = (event) => {
        setSpeechSynthesis(prev => ({ ...prev, isSpeaking: false, error: event.error }));
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeechSynthesis(prev => ({ ...prev, isSpeaking: false, currentText: undefined }));
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Add toast notification here if needed
  };

  const groupSessionsByDate = (sessions: ChatSession[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const groups = {
      today: [] as ChatSession[],
      yesterday: [] as ChatSession[],
      lastWeek: [] as ChatSession[],
      older: [] as ChatSession[]
    };

    sessions.forEach(session => {
      const sessionDate = new Date(session.updatedAt);
      const sessionDay = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());

      if (sessionDay.getTime() === today.getTime()) {
        groups.today.push(session);
      } else if (sessionDay.getTime() === yesterday.getTime()) {
        groups.yesterday.push(session);
      } else if (sessionDay.getTime() >= lastWeek.getTime()) {
        groups.lastWeek.push(session);
      } else {
        groups.older.push(session);
      }
    });

    return groups;
  };

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sessionGroups = groupSessionsByDate(filteredSessions);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Custom Top Bar (replaces navbar) */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 h-16 flex items-center px-4">
        <div className="flex items-center justify-between w-full">
          {/* Left - Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Back</span>
          </button>

          {/* Center - Title */}
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-gray-900">Arogya AI Chat</h1>
          </div>

          {/* Right - Language Selector */}
          <Menu as="div" className="relative">
            <MenuButton className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <span className="text-sm font-medium text-gray-800">{currentLanguage.nativeName}</span>
              <ChevronDownIcon className="w-4 h-4 text-gray-600" />
            </MenuButton>
            <MenuItems className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
              {supportedLanguages.map((language) => (
                <MenuItem key={language.code}>
                  {({ active }) => (
                    <button
                      onClick={() => changeLanguage(language.code)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        active ? 'bg-blue-50 text-blue-700' : 'text-gray-800'
                      } ${currentLanguage.code === language.code ? 'font-semibold text-blue-700 bg-blue-50' : ''}`}
                    >
                      {language.nativeName} ({language.name})
                    </button>
                  )}
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>
      </div>

      {/* Left Panel - Conversation Library */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col mt-16 overflow-hidden lg:w-80 lg:block ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
        {/* New Chat Button */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={createNewSession}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto">
          {Object.entries(sessionGroups).map(([groupKey, groupSessions]) => {
            if (groupSessions.length === 0) return null;
            
            const groupLabels = {
              today: 'Today',
              yesterday: 'Yesterday', 
              lastWeek: 'Previous 7 Days',
              older: 'Older'
            };

            return (
              <div key={groupKey} className="p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {groupLabels[groupKey as keyof typeof groupLabels]}
                </h3>
                <div className="space-y-2">
                  {groupSessions.map((session) => (
                    <button
                      key={session._id as string}
                      onClick={() => {
                        setCurrentSession(session);
                        setMessages(session.messages);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentSession?._id === session._id
                          ? 'bg-blue-50 border-blue-200 border'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium text-sm text-gray-900 mb-1 truncate">
                        {session.title}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center justify-between">
                        <span>{session.messages.length} messages</span>
                        <span>{new Date(session.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Profile & Settings */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{mockUser.name}</div>
              <div className="text-sm text-gray-500">Free Plan</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Cog6ToothIcon className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </button>
            <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col mt-16">
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden p-4 border-b border-gray-200">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? (
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {!currentSession ? (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center">
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
        ) : (
          /* Chat Interface */
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message._id as string}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-3xl ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === 'user' 
                            ? 'bg-blue-500' 
                            : 'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}>
                          {message.role === 'user' ? (
                            <UserIcon className="w-5 h-5 text-white" />
                          ) : (
                            <HeartIcon className="w-5 h-5 text-white" />
                          )}
                        </div>

                        {/* Message Content */}
                        <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`px-4 py-3 rounded-2xl max-w-full ${
                            message.role === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-white border border-gray-200 text-gray-900'
                          }`}>
                            <div className="whitespace-pre-wrap break-words">
                              {message.isStreaming ? (
                                <span className="animate-pulse">Typing...</span>
                              ) : (
                                message.content
                              )}
                            </div>
                          </div>
                          
                          {/* Message Actions */}
                          {message.role === 'ai' && !message.isStreaming && (
                            <div className="flex items-center space-x-2 mt-2">
                              <button
                                onClick={() => playTextToSpeech(message.content)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                title="Play audio"
                              >
                                <SpeakerWaveIcon className="w-4 h-4 text-gray-500" />
                              </button>
                              <button
                                onClick={() => copyToClipboard(message.content)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                title="Copy"
                              >
                                <ClipboardIcon className="w-4 h-4 text-gray-500" />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Like">
                                <HandThumbUpIcon className="w-4 h-4 text-gray-500" />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Dislike">
                                <HandThumbDownIcon className="w-4 h-4 text-gray-500" />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Regenerate">
                                <ArrowPathIcon className="w-4 h-4 text-gray-500" />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Share">
                                <ShareIcon className="w-4 h-4 text-gray-500" />
                              </button>
                            </div>
                          )}
                          
                          <div className={`text-xs text-gray-500 mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-end space-x-3">
                  {/* File Upload */}
                  <button
                    onClick={handleFileUpload}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <PaperClipIcon className="w-5 h-5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={(e) => {
                      // Handle file upload
                      console.log('File selected:', e.target.files?.[0]);
                    }}
                  />

                  {/* Input Field */}
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask Arogya AI anything..."
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32"
                      rows={1}
                      style={{
                        minHeight: '48px',
                        height: 'auto',
                        resize: 'none'
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                      }}
                    />
                    
                    {/* Voice Input Button */}
                    <button
                      onClick={speechRecognition.isListening ? stopVoiceRecording : startVoiceRecording}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
                        speechRecognition.isListening 
                          ? 'bg-red-500 text-white' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <MicrophoneIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Send Button */}
                  <button
                    onClick={isStreaming ? () => setIsStreaming(false) : sendMessage}
                    disabled={!inputMessage.trim() && !isStreaming}
                    className={`p-3 rounded-xl transition-colors ${
                      inputMessage.trim() || isStreaming
                        ? isStreaming
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isStreaming ? (
                      <StopIcon className="w-5 h-5" />
                    ) : (
                      <PaperAirplaneIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                {/* Voice Recognition Feedback */}
                {speechRecognition.isListening && (
                  <div className="mt-2 text-sm text-blue-600">
                    🎤 Listening... {speechRecognition.transcript && `"${speechRecognition.transcript}"`}
                  </div>
                )}
                
                {/* Speech Synthesis Feedback */}
                {speechSynthesis.isSpeaking && (
                  <div className="mt-2 flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg">
                    <span className="text-sm text-blue-700">🔊 Playing audio...</span>
                    <button
                      onClick={stopTextToSpeech}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Stop
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatInterface;