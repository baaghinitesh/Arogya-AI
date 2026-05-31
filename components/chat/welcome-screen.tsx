'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  SparklesIcon, 
  UserIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

interface WelcomeScreenProps {
  userName: string;
  onPromptSelected: (prompt: string) => void;
  currentTheme: any;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  userName, 
  onPromptSelected, 
  currentTheme 
}) => {
  const { t } = useTranslation();

  const prompts = [
    {
      title: t('symptomQueryTitle', 'Assess Symptoms'),
      desc: t('symptomQueryDesc', '“What are the typical symptoms of a high fever?”'),
      prompt: 'What are the symptoms of fever?'
    },
    {
      title: t('headacheQueryTitle', 'Manage Headache'),
      desc: t('headacheQueryDesc', '“How can I manage or relieve a severe headache?”'),
      prompt: 'How can I manage my headache?'
    },
    {
      title: t('sleepQueryTitle', 'Better Sleep Tips'),
      desc: t('sleepQueryDesc', '“Can you give me actionable tips for deeper, better sleep?”'),
      prompt: 'Tips for better sleep'
    },
    {
      title: t('dietQueryTitle', 'Healthy Diet Plan'),
      desc: t('dietQueryDesc', '“Recommend balanced foods and healthy diet tips.”'),
      prompt: 'Healthy diet recommendations'
    }
  ];

  return (
    <div className={`flex-1 flex flex-col items-center justify-center p-4 sm:p-8 ${currentTheme.messagesArea} overflow-y-auto`}>
      <div className="max-w-2xl w-full text-center space-y-8 my-auto">
        {/* Animated Brand Logo Container */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative w-20 h-20 bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-teal-500/20"
        >
          <HeartIcon className="w-10 h-10 text-white animate-pulse" />
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md animate-bounce" style={{ animationDuration: '3s' }}>
            <SparklesIcon className="w-3.5 h-3.5 text-white" />
          </div>
        </motion.div>

        {/* Personalized Welcome Header */}
        <div className="space-y-3">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight"
          >
            {userName ? (
              <span className="flex items-center justify-center gap-2 flex-wrap">
                👋 Hello, <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">{userName}</span>
              </span>
            ) : (
              t('welcomeHeader', 'Welcome to Arogya AI')
            )}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm sm:text-base leading-relaxed font-medium"
          >
            {t('welcomeSubtitle', 'Your intelligent, HIPAA-compliant healthcare companion. Describe your symptoms or select a prompt below to begin.')}
          </motion.p>
        </div>

        {/* Modern 2x2 Interactive Quick Action Prompt Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto"
        >
          {prompts.map((item, index) => (
            <button
              key={index}
              onClick={() => onPromptSelected(item.prompt)}
              className="group p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm hover:bg-teal-500/[0.04] dark:hover:bg-teal-400/[0.03] text-left border border-slate-200 dark:border-slate-800 hover:border-teal-400/80 dark:hover:border-teal-500/80 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02] cursor-pointer flex gap-3.5 items-start"
            >
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-all duration-300 shrink-0">
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
              </div>
              <div className="space-y-1 overflow-hidden">
                <span className="font-bold text-sm text-slate-850 dark:text-slate-200 block group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {item.title}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {item.desc}
                </span>
              </div>
            </button>
          ))}
        </motion.div>

        {/* Privacy Trust Badge */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100/80 dark:bg-slate-850/80 border border-slate-200/50 dark:border-slate-800 rounded-full text-[10px] sm:text-xs font-bold text-slate-405 text-slate-500 dark:text-slate-400 select-none"
        >
          <ShieldCheckIcon className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>HIPAA Secure &amp; End-to-End Encrypted Patient Portal</span>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
