'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/language-context';
import { useChat, ChatProvider } from '@/contexts/chat-context';
import Sidebar from '@/components/chat/sidebar';
import ChatHeader from '@/components/chat/chat-header';
import ChatMessages from '@/components/chat/chat-messages';
import ChatInput from '@/components/chat/chat-input';
import WelcomeScreen from '@/components/chat/welcome-screen';
import { getBackgroundTheme } from '@/lib/config/background';

// Language options
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'od', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
];

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterfaceInner: React.FC<ChatInterfaceProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  const {
    sessions,
    currentSession,
    messages,
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
    createNewSession,
    sendMessage,
    handleSelectSession,
    playTextToSpeech
  } = useChat();

  const currentTheme = getBackgroundTheme(backgroundTheme);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll when messages update
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <div className={`flex h-[calc(100vh-80px)] mt-20 ${currentTheme.chatContainer} ${className} overflow-hidden font-sans antialiased text-slate-800 dark:text-slate-100 relative`}>
      {/* Sidebar - listing user conversation sessions */}
      <Sidebar />

      {/* Mobile Drawer Backdrop Overlay */}
      {!isSidebarCollapsed && (
        <div 
          onClick={() => setIsSidebarCollapsed(true)} 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-10 lg:hidden cursor-pointer"
        />
      )}

      {/* Main Chat Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/40 dark:bg-slate-900/40 backdrop-blur-sm relative">
        {/* Header - theme controls, language select, profile menu */}
        <ChatHeader
          backgroundTheme={backgroundTheme}
          setBackgroundTheme={setBackgroundTheme}
          currentLanguage={currentLanguage}
          changeLanguage={changeLanguage}
          languages={languages}
          currentTheme={currentTheme}
        />

        {/* Secure Guest Access Modal */}
        {!isAuthLoading && isGuest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 max-w-md w-full text-center shadow-2xl space-y-6"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center text-teal-600 dark:text-teal-400 text-3xl animate-pulse">
                🛡️
              </div>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Secure Patient Access Required
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Arogya AI is a protected medical system. To ensure HIPAA compliance, secure medical records privacy, and WhatsApp synchronization, guest chatting is disabled on the web portal.
                </p>
                <p className="text-xs font-bold text-teal-600 dark:text-teal-400">
                  Please log in or register your number to start chatting with your AI Health Assistant.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <a
                  href="/register"
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/10 hover:shadow-xl transition-all text-center cursor-pointer text-sm"
                >
                  Register New Account
                </a>
                <a
                  href="/sign-in"
                  className="w-full py-3 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-bold rounded-2xl transition-all text-center cursor-pointer text-sm"
                >
                  Sign In / Log In
                </a>
              </div>
            </motion.div>
          </div>
        )}

        {/* Messaging Area / Welcome Screen */}
        <div className="flex-1 overflow-y-auto flex flex-col min-h-0 relative">
          {currentSession ? (
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              t={t}
              currentTheme={currentTheme}
              playTextToSpeech={playTextToSpeech}
              messagesEndRef={messagesEndRef}
            />
          ) : (
            <WelcomeScreen
              userName={user?.name || ''}
              onPromptSelected={(prompt) => sendMessage(prompt)}
              currentTheme={currentTheme}
            />
          )}
        </div>

        {/* Chat Input Area (Always visible at bottom) */}
        <ChatInput inputRef={inputRef} />
      </div>
    </div>
  );
};

const ChatInterface: React.FC<ChatInterfaceProps> = (props) => {
  return (
    <ChatProvider>
      <ChatInterfaceInner {...props} />
    </ChatProvider>
  );
};

export default ChatInterface;
