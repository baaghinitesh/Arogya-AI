'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Square, Mic } from 'lucide-react';
import { useChat } from '@/contexts/chat-context';
import { useTranslation } from 'react-i18next';
import { getBackgroundTheme } from '@/lib/config/background';

interface ChatInputProps {
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}

const ChatInput: React.FC<ChatInputProps> = ({ inputRef }) => {
  const { t } = useTranslation();
  const {
    inputMessage,
    setInputMessage,
    sendMessage,
    stopResponse,
    isLoading,
    speechRecognition,
    startVoiceRecognition,
    stopVoiceRecognition,
    backgroundTheme
  } = useChat();

  const currentTheme = getBackgroundTheme(backgroundTheme);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`${currentTheme.inputArea} border-t border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md`}>
      <div className="flex items-end space-x-2 sm:space-x-3 max-w-4xl mx-auto">
        {/* Voice Input Button */}
        <div className="flex-shrink-0">
          <Button
            variant={speechRecognition.isListening ? 'default' : 'outline'}
            size="lg"
            onClick={speechRecognition.isListening ? stopVoiceRecognition : startVoiceRecognition}
            title={speechRecognition.isListening ? t('stopListening') : t('startListening')}
            className={`h-12 w-12 rounded-full border-2 transition-all duration-200 flex items-center justify-center p-0 cursor-pointer ${
              speechRecognition.isListening
                ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20 scale-105'
                : 'border-slate-250 dark:border-slate-700 text-slate-600 dark:text-slate-350 hover:border-teal-400 hover:text-teal-650 hover:scale-105 bg-white dark:bg-slate-800'
            }`}
          >
            <div className={speechRecognition.isListening ? 'animate-pulse' : ''}>
              {speechRecognition.isListening ? (
                <Square className="h-5.5 w-5.5 fill-white" />
              ) : (
                <Mic className="h-5.5 w-5.5" />
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
            placeholder={speechRecognition.isListening ? t('listening') : t('messagePlaceholder') || 'Ask Arogya anything...'}
            className="min-h-[48px] max-h-[120px] resize-none bg-white/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-705 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-teal-500 focus:ring-teal-500 rounded-2xl overflow-hidden shadow-sm"
            onKeyDown={handleKeyDown}
            disabled={speechRecognition.isListening}
          />
        </div>

        {/* Action Button: Send or Stop */}
        <div className="flex-shrink-0">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="stop-btn"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  onClick={stopResponse}
                  size="lg"
                  title="Stop generating"
                  className="h-12 w-12 rounded-full bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-750 hover:scale-105 text-white shadow-lg shadow-rose-500/25 flex items-center justify-center transition-all duration-200 cursor-pointer p-0"
                >
                  <Square className="h-5 w-5 fill-white" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="send-btn"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  onClick={() => sendMessage()}
                  disabled={!inputMessage.trim()}
                  size="lg"
                  title={t('sendMessage')}
                  className="h-12 w-12 rounded-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 hover:scale-105 text-white shadow-lg shadow-teal-600/25 disabled:opacity-40 transition-all duration-200 cursor-pointer p-0 flex items-center justify-center"
                >
                  <Send className="h-5 w-5 ml-0.5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {speechRecognition.isListening && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-rose-500 font-semibold mt-2 text-center"
        >
          🎤 {speechRecognition.transcript || t('listening') || 'Listening...'}
        </motion.p>
      )}
    </div>
  );
};

export default ChatInput;
