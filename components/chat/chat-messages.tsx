'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import { Message } from '@/lib/types/chat';
import TypewriterText from './typewriter-text';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  t: (key: string) => string;
  currentTheme: any;
  playTextToSpeech: (text: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  t,
  currentTheme,
  playTextToSpeech,
  messagesEndRef
}) => {
  return (
    <div className={`flex-1 overflow-y-auto ${currentTheme.messagesArea}`}>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-4xl mx-auto w-full">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message._id as string}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-l-2xl rounded-tr-2xl shadow-md'
                    : 'bg-gradient-to-r from-white to-slate-50/80 dark:bg-gradient-to-r dark:from-slate-800 dark:to-slate-900/40 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-r-2xl rounded-tl-2xl shadow-sm'
                } p-4`}
              >
                {message.role === 'ai' && !message.isHistorical && !message.isStreaming ? (
                  <TypewriterText 
                    text={message.content} 
                    messageId={message._id as string} 
                    onType={() => messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })}
                  />
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">{message.content}</p>
                )}

                <div className="flex items-center justify-between mt-2 select-none border-t border-slate-100/50 dark:border-slate-700/30 pt-1.5">
                  <p
                    className={`text-[10px] font-bold ${
                      message.role === 'user' ? 'text-cyan-100' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>

                  {message.role === 'ai' && !message.isStreaming && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => playTextToSpeech(message.content)}
                      className="ml-2 h-6 w-6 p-0 text-slate-550 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <Volume2 className="h-4 w-4" />
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
              <div className="bg-gradient-to-r from-white to-slate-50 dark:bg-gradient-to-r dark:from-slate-800 dark:to-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-r-2xl rounded-tl-2xl p-4 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1 select-none">
                    <div className="w-2 h-2 bg-slate-400 dark:bg-slate-550 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-slate-400 dark:bg-slate-550 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-slate-400 dark:bg-slate-550 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{t('typingIndicator') || 'Analyzing details...'}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
