'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SpeakerWaveIcon } from '@heroicons/react/24/outline';
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
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
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
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-l-2xl rounded-tr-2xl'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-r-2xl rounded-tl-2xl shadow-sm'
                } p-4`}
              >
                {message.role === 'ai' && !message.isStreaming ? (
                  <TypewriterText text={message.content} messageId={message._id as string} />
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}

                <div className="flex items-center justify-between mt-2">
                  <p
                    className={`text-xs ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
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
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
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
  );
};

export default ChatMessages;
