'use client';

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Square, Mic, X } from 'lucide-react';
import { useChat } from '@/contexts/chat-context';
import { useTranslation } from 'react-i18next';
import { getBackgroundTheme } from '@/lib/config/background';

const MAX_CHARS = 4000;
const MAX_HEIGHT_PX = 180;

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
    backgroundTheme,
  } = useChat();

  const currentTheme = getBackgroundTheme(backgroundTheme);
  const charCount = inputMessage.length;
  const isNearLimit = charCount > MAX_CHARS * 0.85;
  const isAtLimit = charCount >= MAX_CHARS;
  const hasText = inputMessage.length > 0;

  /* ── Auto-resize: grow until MAX_HEIGHT_PX, then scroll ── */
  const autoResize = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const sh = el.scrollHeight;
    if (sh <= MAX_HEIGHT_PX) {
      el.style.height = `${sh}px`;
      el.style.overflowY = 'hidden';
    } else {
      el.style.height = `${MAX_HEIGHT_PX}px`;
      el.style.overflowY = 'scroll';
    }
  }, [inputRef]);

  useEffect(() => {
    autoResize();
  }, [inputMessage, autoResize]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_CHARS) setInputMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputMessage.trim()) sendMessage();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = e.clipboardData.getData('text');
    const el = inputRef.current;
    const selStart = el?.selectionStart ?? inputMessage.length;
    const selEnd = el?.selectionEnd ?? inputMessage.length;
    const next = inputMessage.slice(0, selStart) + pasted + inputMessage.slice(selEnd);
    if (next.length > MAX_CHARS) {
      e.preventDefault();
      setInputMessage(next.slice(0, MAX_CHARS));
    }
  };

  const handleClear = () => {
    setInputMessage('');
    inputRef.current?.focus();
  };

  /* ── Border colour based on state ── */
  const borderClass = speechRecognition.isListening
    ? 'border-rose-400 dark:border-rose-600'
    : isAtLimit
    ? 'border-amber-400 dark:border-amber-500'
    : 'border-slate-200 dark:border-slate-700 focus-within:border-teal-500 dark:focus-within:border-teal-500';

  return (
    <div
      className={`${currentTheme.inputArea} border-t border-slate-200/80 dark:border-slate-800
        px-3 pt-2.5 pb-2 sm:px-4 sm:pt-3 sm:pb-2.5
        bg-white/80 dark:bg-slate-900/80 backdrop-blur-md`}
    >
      <div className="max-w-4xl mx-auto">

        {/* ── Unified input pill ── */}
        <div
          className={`flex items-end rounded-2xl border transition-all duration-200 shadow-sm
            bg-white dark:bg-slate-800/90
            focus-within:shadow-md focus-within:shadow-teal-500/10
            ${borderClass}
            ${speechRecognition.isListening ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''}
          `}
        >
          {/* Mic button — left inside pill */}
          <button
            type="button"
            onClick={speechRecognition.isListening ? stopVoiceRecognition : startVoiceRecognition}
            title={speechRecognition.isListening ? t('stopListening') : t('startListening')}
            className={`flex-shrink-0 self-end mb-2 ml-2 h-8 w-8 rounded-full flex items-center justify-center
              transition-all duration-200 cursor-pointer
              ${speechRecognition.isListening
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 scale-105'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400'
              }`}
          >
            <div className={speechRecognition.isListening ? 'animate-pulse' : ''}>
              {speechRecognition.isListening
                ? <Square className="h-3.5 w-3.5 fill-white" />
                : <Mic className="h-3.5 w-3.5" />
              }
            </div>
          </button>

          {/* Textarea */}
          <div className="flex-1 relative min-w-0">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              disabled={speechRecognition.isListening}
              rows={1}
              style={{ height: '44px', overflowY: 'hidden', resize: 'none' }}
              className={`
                w-full px-3 py-3 text-sm sm:text-[0.9rem] leading-relaxed
                bg-transparent outline-none
                text-slate-800 dark:text-slate-100
                placeholder:text-slate-400 dark:placeholder:text-slate-500
                disabled:cursor-not-allowed disabled:opacity-60
                [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
              `}
              placeholder={
                speechRecognition.isListening
                  ? (t('listening') || 'Listening...')
                  : (t('messagePlaceholder') || 'Ask Arogya anything…  Shift+Enter for new line')
              }
            />

            {/* Char counter — floats inside textarea bottom-right when near limit */}
            <AnimatePresence>
              {isNearLimit && (
                <motion.span
                  key="counter"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className={`absolute bottom-1.5 right-1 text-[9px] font-semibold tabular-nums pointer-events-none select-none px-1.5 py-0.5 rounded-full
                    ${isAtLimit
                      ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-400 dark:text-slate-500'
                    }`}
                >
                  {charCount}/{MAX_CHARS}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Right side: clear + send/stop */}
          <div className="flex-shrink-0 flex items-end gap-1 mb-2 mr-2">
            {/* Clear button */}
            <AnimatePresence>
              {hasText && !speechRecognition.isListening && (
                <motion.button
                  key="clear"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.12 }}
                  onClick={handleClear}
                  title="Clear"
                  type="button"
                  className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600
                    text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200
                    flex items-center justify-center transition-all duration-150 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Send / Stop button */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.button
                  key="stop"
                  type="button"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.13 }}
                  onClick={stopResponse}
                  title="Stop generating"
                  className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-500 to-red-600
                    hover:from-rose-600 hover:to-red-700 hover:scale-105
                    text-white shadow-md shadow-rose-500/25
                    flex items-center justify-center transition-all duration-200 cursor-pointer"
                >
                  <Square className="h-3.5 w-3.5 fill-white" />
                </motion.button>
              ) : (
                <motion.button
                  key="send"
                  type="button"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.13 }}
                  onClick={() => sendMessage()}
                  disabled={!inputMessage.trim()}
                  title={t('sendMessage') || 'Send  (Enter)'}
                  className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600
                    hover:from-cyan-600 hover:to-teal-700 hover:scale-105
                    text-white shadow-md shadow-teal-600/25
                    disabled:opacity-35 disabled:scale-100 disabled:cursor-not-allowed
                    flex items-center justify-center transition-all duration-200 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5 translate-x-px" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Voice listening indicator */}
        <AnimatePresence>
          {speechRecognition.isListening && (
            <motion.div
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 3 }}
              className="flex items-center justify-center gap-2 mt-1.5"
            >
              <span className="flex gap-0.5 items-end h-3.5">
                {[0, 1, 2, 3, 2, 1].map((h, i) => (
                  <span
                    key={i}
                    className="w-0.5 rounded-full bg-rose-500"
                    style={{
                      height: `${4 + h * 3}px`,
                      animation: 'pulse 0.8s ease-in-out infinite',
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </span>
              <p className="text-[11px] text-rose-500 font-semibold tracking-wide">
                {speechRecognition.transcript || t('listening') || 'Listening…'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default ChatInput;
