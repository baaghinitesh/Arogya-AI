'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { useChat } from '@/contexts/chat-context';
import { ChatSession } from '@/lib/types/chat';

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const {
    sessions,
    currentSession,
    isSidebarCollapsed: isCollapsed,
    setIsSidebarCollapsed,
    searchQuery,
    setSearchQuery: onSearchChange,
    createNewSession: onCreateNewSession,
    handleSelectSession: onSelectSession,
    renameSession,
    deleteSession
  } = useChat();

  // Local inline editing states
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');

  // Mobile responsiveness listener
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startEditing = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation(); // Avoid triggering session selection
    setEditingSessionId(session._id?.toString() || null);
    setTempTitle(session.title);
  };

  const cancelEditing = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingSessionId(null);
    setTempTitle('');
  };

  const saveTitle = async (e: React.MouseEvent | React.KeyboardEvent, sessionId: string) => {
    e.stopPropagation();
    if (tempTitle.trim() && tempTitle.trim() !== '') {
      await renameSession(sessionId, tempTitle.trim());
    }
    cancelEditing();
  };

  const handleKeyDown = (e: React.KeyboardEvent, sessionId: string) => {
    if (e.key === 'Enter') {
      saveTitle(e, sessionId);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation(); // Avoid triggering session selection
    if (confirm(t('confirmDeleteChat', 'Are you sure you want to delete this chat session?'))) {
      await deleteSession(sessionId);
    }
  };

  // Framer Motion Animation Variants for responsive resizing
  const sidebarVariants = {
    desktop: {
      width: isCollapsed ? 70 : 290,
      x: 0
    },
    mobile: {
      width: 290,
      x: isCollapsed ? -290 : 0
    }
  };

  return (
    <motion.div
      initial={false}
      animate={isMobile ? 'mobile' : 'desktop'}
      variants={sidebarVariants}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      className={`bg-white/95 dark:bg-slate-900/95 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-lg z-20 h-full font-sans select-none ${
        isMobile ? 'fixed inset-y-0 left-0' : 'relative'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-150 dark:border-slate-800 shrink-0">
        <div className="flex items-center justify-between gap-2 h-8">
          {(!isCollapsed || isMobile) && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold bg-gradient-to-r from-cyan-600 to-teal-655 bg-clip-text text-transparent text-base tracking-tight truncate"
            >
              ⚕️ {t('chatHere') || 'Arogya AI Portal'}
            </motion.h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarCollapsed(!isCollapsed)}
            className="text-slate-500 hover:text-slate-800 dark:text-slate-450 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-1.5 h-8 w-8 shrink-0 cursor-pointer transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed && !isMobile ? (
              <ChevronRightIcon className="h-4.5 w-4.5" />
            ) : (
              <ChevronLeftIcon className="h-4.5 w-4.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Start New Chat Button */}
      <div className="p-3 shrink-0">
        <Button
          onClick={onCreateNewSession}
          className="w-full bg-gradient-to-r from-cyan-600 via-cyan-655 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md shadow-teal-500/10 hover:shadow-lg transition-all duration-200 h-11 flex items-center justify-center p-0 cursor-pointer"
          title={isCollapsed && !isMobile ? 'Start a New Chat' : undefined}
        >
          <PlusIcon className="h-5 w-5 shrink-0" />
          {(!isCollapsed || isMobile) && <span className="ml-2 text-sm tracking-wide">{t('newChat') || 'New Chat'}</span>}
        </Button>
      </div>

      {/* Search Input Bar */}
      {(!isCollapsed || isMobile) && (
        <div className="px-3 pb-3 shrink-0">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder={t('searchChats') || 'Search chats...'}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all duration-200 font-semibold"
            />
          </div>
        </div>
      )}

      {/* History Chat Sessions List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-8">
            {(!isCollapsed || isMobile) && (
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-550">
                {searchQuery ? t('noChatsFound') || 'No chats found' : t('noChatsYet') || 'No chats yet'}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-1.5 font-semibold">
            {filteredSessions.map((session) => {
              const active = currentSession?._id === session._id;
              const isEditing = editingSessionId === session._id?.toString();

              return (
                <motion.div
                  key={session._id as string}
                  whileHover={{ x: isCollapsed && !isMobile ? 0 : 2 }}
                  transition={{ duration: 0.15 }}
                  className="group relative"
                >
                  {isEditing ? (
                    /* Inline Title Editing View */
                    <div className="w-full flex items-center gap-1.5 p-2 bg-slate-50 dark:bg-slate-850 rounded-xl border border-teal-500/80">
                      <input
                        type="text"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, session._id?.toString() || '')}
                        autoFocus
                        className="flex-1 bg-transparent px-1.5 py-0.5 text-xs text-slate-800 dark:text-slate-100 font-bold focus:outline-none min-w-0"
                      />
                      <button
                        onClick={(e) => saveTitle(e, session._id?.toString() || '')}
                        className="text-emerald-600 hover:text-emerald-700 p-1 rounded hover:bg-emerald-50 dark:hover:bg-emerald-950/20 shrink-0 cursor-pointer"
                        title="Save title"
                      >
                        <CheckIcon className="w-4 h-4 font-bold" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="text-rose-500 hover:text-rose-600 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20 shrink-0 cursor-pointer"
                        title="Cancel"
                      >
                        <XMarkIcon className="w-4 h-4 font-bold" />
                      </button>
                    </div>
                  ) : (
                    /* Normal Session Row View */
                    <>
                      <Button
                        variant={active ? "secondary" : "ghost"}
                        className={`w-full justify-start text-left p-2.5 h-auto transition-all duration-200 rounded-xl cursor-pointer ${
                          isCollapsed && !isMobile ? 'px-2 flex justify-center' : 'pr-16'
                        } ${
                          active
                            ? 'bg-teal-50/80 dark:bg-teal-950/20 border border-teal-200/50 dark:border-teal-900/60 text-teal-850 dark:text-teal-400 font-bold shadow-sm'
                            : 'text-slate-655 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/75 border border-transparent'
                        }`}
                        onClick={() => onSelectSession(session)}
                        title={isCollapsed && !isMobile ? session.title : undefined}
                      >
                        {isCollapsed && !isMobile ? (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-sm animate-pulse" style={{ animationDuration: '4s' }}>
                            {session.title.charAt(0).toUpperCase()}
                          </div>
                        ) : (
                          <div className="w-full flex items-start gap-2.5 overflow-hidden">
                            <ChatBubbleLeftRightIcon className={`w-4 h-4 mt-0.5 shrink-0 ${active ? 'text-teal-600 dark:text-teal-400' : 'text-slate-405'}`} />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-xs truncate leading-snug">{session.title}</p>
                              <p className="text-[10px] text-slate-405 dark:text-slate-500 font-bold mt-0.5">
                                {new Date(session.updatedAt).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        )}
                      </Button>

                      {/* Floating Action Icons on Hover */}
                      {(!isCollapsed || isMobile) && (
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 items-center gap-1.5 flex lg:hidden group-hover:flex bg-gradient-to-l from-white via-white pl-3 dark:from-slate-900 dark:via-slate-900 h-8">
                          <button
                            onClick={(e) => startEditing(e, session)}
                            className="p-1 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-all cursor-pointer"
                            title="Rename chat"
                          >
                            <PencilIcon className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, session._id?.toString() || '')}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                            title="Delete chat"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sidebar Footer */}
      {(!isCollapsed || isMobile) && (
        <div className="p-3 border-t border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/30 shrink-0">
          <p className="text-[10px] font-extrabold text-slate-405 dark:text-slate-500 text-center flex items-center justify-center gap-1">
            🔒 Protected Health Portal
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Sidebar;