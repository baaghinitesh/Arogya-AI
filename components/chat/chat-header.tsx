'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { backgroundThemes } from '@/lib/config/background';
import { ChatLanguage } from '@/lib/types/chat';
import { Menu } from 'lucide-react';
import { useChat } from '@/contexts/chat-context';

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

  return (
    <div className={`${currentTheme.inputArea} border-b border-slate-200 dark:border-slate-800 p-4 shadow-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0`}>
      <div className="flex items-center justify-between flex-wrap gap-2 max-w-7xl mx-auto w-full">
        {/* Title & Hamburger Menu for mobile */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="lg:hidden p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
            title="Toggle Sidebar"
          >
            <Menu className="w-5.5 h-5.5" />
          </button>
          
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-600 to-teal-650 bg-clip-text text-transparent select-none tracking-tight">
            Arogya AI Assistant
          </h1>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Background Theme Selector */}
          <Select value={backgroundTheme} onValueChange={setBackgroundTheme}>
            <SelectTrigger className="w-24 sm:w-32 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm text-xs sm:text-sm cursor-pointer rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-850 shadow-lg rounded-xl">
              {Object.values(backgroundThemes).map((theme) => (
                <SelectItem key={theme.name} value={theme.name} className="text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm cursor-pointer rounded-lg">
                  {theme.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Language Selector */}
          <Select value={currentLanguage.code} onValueChange={(value) => changeLanguage(value)}>
            <SelectTrigger className="w-28 sm:w-40 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm text-xs sm:text-sm cursor-pointer rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-850 shadow-lg rounded-xl">
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code} className="text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer rounded-lg">
                  <span className="flex items-center space-x-2">
                    <span>{lang.flag}</span>
                    <span className="hidden sm:inline text-sm font-semibold">{lang.name}</span>
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
