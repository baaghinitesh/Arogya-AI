'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { backgroundThemes } from '@/lib/config/background';
import { ChatLanguage } from '@/lib/types/chat';

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
  return (
    <div className={`${currentTheme.inputArea} border-b border-gray-200 p-4 shadow-sm`}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Arogya AI Assistant
          </h1>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Background Theme Selector */}
          <Select value={backgroundTheme} onValueChange={setBackgroundTheme}>
            <SelectTrigger className="w-24 sm:w-32 bg-white border-gray-300 text-gray-700 shadow-sm text-xs sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 shadow-lg">
              {Object.values(backgroundThemes).map((theme) => (
                <SelectItem key={theme.name} value={theme.name} className="text-gray-700 hover:bg-gray-50 text-sm">
                  {theme.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Language Selector */}
          <Select value={currentLanguage.code} onValueChange={(value) => changeLanguage(value)}>
            <SelectTrigger className="w-32 sm:w-40 bg-white border-gray-300 text-gray-700 shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 shadow-lg">
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code} className="text-gray-700 hover:bg-gray-50">
                  <span className="flex items-center space-x-2">
                    <span>{lang.flag}</span>
                    <span className="hidden sm:inline">{lang.name}</span>
                    <span className="sm:hidden">{lang.code.toUpperCase()}</span>
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
