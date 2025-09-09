'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { ChatSession } from '@/lib/types/chat';

interface SidebarProps {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  isCollapsed: boolean;
  searchQuery: string;
  onToggleCollapse: () => void;
  onCreateNewSession: () => void;
  onSelectSession: (session: ChatSession) => void;
  onSearchChange: (query: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSession,
  isCollapsed,
  searchQuery,
  onToggleCollapse,
  onCreateNewSession,
  onSelectSession,
  onSearchChange,
}) => {
  const { t } = useTranslation();

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 60 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white/80 backdrop-blur-sm border-r border-gray-200 flex flex-col shadow-lg z-10"
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="font-semibold text-gray-800 text-lg">{t('chatHere')}</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          onClick={onCreateNewSession}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
          size={isCollapsed ? "sm" : "default"}
          title={isCollapsed ? 'New Chat' : undefined}
        >
          <PlusIcon className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">{t('newChat') || 'New Chat'}</span>}
        </Button>
      </div>

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="px-4 pb-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchChats') || 'Search chats...'}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all duration-200"
            />
          </div>
        </div>
      )}

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-8">
            {!isCollapsed && (
              <p className="text-sm text-gray-500">
                {searchQuery ? t('noChatsFound') || 'No chats found' : t('noChatsYet') || 'No chats yet'}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredSessions.map((session) => (
              <motion.div
                key={session._id as string}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.1 }}
              >
                <Button
                  variant={currentSession?._id === session._id ? "secondary" : "ghost"}
                  className={`w-full justify-start text-left p-3 h-auto hover:bg-gray-100 transition-all duration-200 ${
                    isCollapsed ? 'px-2' : ''
                  } ${
                    currentSession?._id === session._id 
                      ? 'bg-blue-50 border-blue-200 text-blue-800 shadow-sm' 
                      : 'text-gray-700'
                  }`}
                  onClick={() => onSelectSession(session)}
                  title={isCollapsed ? session.title : undefined}
                >
                  {isCollapsed ? (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-sm font-bold">
                      {session.title.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <div className="w-full">
                      <p className="font-medium text-sm truncate mb-1">{session.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.updatedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 bg-gray-50/50">
          <p className="text-xs text-gray-500 text-center">
            {t('sidebarFooter') || 'Your chat history is private'}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Sidebar;