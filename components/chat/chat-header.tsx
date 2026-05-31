'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { backgroundThemes } from '@/lib/config/background';
import { ChatLanguage } from '@/lib/types/chat';
import { Menu, ArrowLeft, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useChat } from '@/contexts/chat-context';
import { useTheme } from '@/contexts/theme-context';
import { SUPPORTED_LANGUAGES } from '@/contexts/language-context';

interface ChatHeaderProps {
  backgroundTheme: string;
  setBackgroundTheme: (value: string) => void;
  currentLanguage: { code: ChatLanguage | string };
  changeLanguage: (value: string) => void;
  languages: { code: string; name: string; flag: string }[];
  currentTheme: any;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  backgroundTheme,
  setBackgroundTheme,
  currentLanguage,
  changeLanguage,
  languages,
  currentTheme
}) => {
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useChat();
  const { mode: themeMode, toggleMode: toggleThemeMode } = useTheme();

  return (
    <div className={`${currentTheme.inputArea} border-b border-slate-200 dark:border-slate-800 py-1.5 px-3 sm:px-4 shadow-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0`}>
      <div className="flex items-center justify-between flex-wrap gap-2 max-w-7xl mx-auto w-full">
        {/* Title & Navigation Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5 min-w-0">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="lg:hidden p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors shrink-0"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Back to Home Exit Button - prominently rendered next to title on all viewports */}
          <Link
            href="/"
            className="p-1.5 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 hover:bg-slate-105 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors shrink-0 flex items-center justify-center border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 shadow-sm"
            title="Back to Home Website"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          
          <h1 className="text-xs sm:text-sm md:text-base font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent select-none tracking-tight truncate">
            Arogya AI Assistant
          </h1>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Small Symmetrical Theme Mode Toggle Button */}
          <button
            onClick={toggleThemeMode}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-655 dark:text-slate-350 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors shadow-sm cursor-pointer shrink-0"
            title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {themeMode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>
          
          {/* Language Selector */}
          <Select value={currentLanguage.code} onValueChange={(value) => changeLanguage(value)}>
            <SelectTrigger className="w-28 sm:w-36 h-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm text-xs cursor-pointer rounded-lg notranslate">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-850 shadow-lg rounded-xl notranslate max-h-[300px] overflow-y-auto">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code} className="text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer rounded-lg notranslate">
                  <span className="flex items-center space-x-2 notranslate">
                    <span>{lang.code === 'en' ? '🇺🇸' : '🇮🇳'}</span>
                    <span className="hidden sm:inline text-sm font-semibold">{lang.nativeName}</span>
                    <span className="sm:hidden text-xs font-bold">{lang.code.toUpperCase()}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
