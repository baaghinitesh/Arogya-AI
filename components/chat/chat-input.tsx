'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PaperAirplaneIcon, StopIcon, MicrophoneIcon } from '@heroicons/react/24/outline';
import { SpeechRecognitionState } from '@/lib/types/chat';

interface ChatInputProps {
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  inputMessage: string;
  setInputMessage: (msg: string) => void;
  sendMessage: (overrideMessage?: string, overrideSessionId?: string) => Promise<void>;
  isLoading: boolean;
  speechRecognition: SpeechRecognitionState;
  startVoiceRecognition: () => void;
  stopVoiceRecognition: () => void;
  t: (key: string) => string;
  currentTheme: any;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputRef,
  inputMessage,
  setInputMessage,
  sendMessage,
  isLoading,
  speechRecognition,
  startVoiceRecognition,
  stopVoiceRecognition,
  t,
  currentTheme
}) => {
  return (
    <div className={`${currentTheme.inputArea} border-t border-gray-200 p-3 sm:p-4`}>
      <div className="flex items-end space-x-2 sm:space-x-3">
        {/* Voice Input Button */}
        <div className="flex-shrink-0">
          <Button
            variant={speechRecognition.isListening ? 'default' : 'outline'}
            size="lg"
            onClick={speechRecognition.isListening ? stopVoiceRecognition : startVoiceRecognition}
            title={speechRecognition.isListening ? t('stopListening') : t('startListening')}
            className={`h-12 w-12 rounded-full border-2 transition-all duration-200 ${
              speechRecognition.isListening
                ? 'bg-red-500 border-red-500 text-white shadow-lg'
                : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:scale-105'
            }`}
          >
            <div className={speechRecognition.isListening ? 'animate-pulse' : ''}>
              {speechRecognition.isListening ? (
                <StopIcon className="h-5 w-5" />
              ) : (
                <MicrophoneIcon className="h-5 w-5" />
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
            placeholder={speechRecognition.isListening ? t('listening') : t('messagePlaceholder')}
            className="min-h-[48px] max-h-[120px] resize-none bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400 overflow-hidden"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            disabled={speechRecognition.isListening}
          />
        </div>

        {/* Send Button */}
        <div className="flex-shrink-0">
          <Button
            onClick={() => sendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            size="lg"
            title={t('sendMessage')}
            className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 text-white shadow-lg disabled:opacity-50 transition-all duration-200"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {speechRecognition.isListening && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-500 mt-2 text-center"
        >
          🎤 {speechRecognition.transcript || t('listening')}
        </motion.p>
      )}
    </div>
  );
};

export default ChatInput;
