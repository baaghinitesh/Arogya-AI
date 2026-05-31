'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, Bars3Icon, XMarkIcon, UserPlusIcon, ArrowRightEndOnRectangleIcon, SunIcon, MoonIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { useLanguage } from '../contexts/language-context';
import { useTheme } from '../contexts/theme-context';
import WhatsAppButton from './whatsapp-button';
import LogoUploader from './logo-uploader';

const Navbar = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const { mode: themeMode, toggleMode: toggleThemeMode } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Check auth state once on mount only
  useEffect(() => {
    setMounted(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    fetch('/api/user', { signal: controller.signal })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        clearTimeout(timeoutId);
        setUser(data?.phone_number ? data : null);
        setAuthChecked(true);
      })
      .catch(() => {
        clearTimeout(timeoutId);
        setAuthChecked(true);
      });

    return () => controller.abort();
  }, []); // ← no pathname dependency — avoids re-fetch on every navigation

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const diff = currentScrollY - lastScrollY.current;
          if (diff < -6 || currentScrollY < 60) setIsVisible(true);
          else if (diff > 6 && currentScrollY > 80) {
            setIsVisible(false);
            setIsMobileMenuOpen(false);
          }
          setIsScrolled(currentScrollY > 20);
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Normalize pathname by removing locale prefix if present (e.g., /hi/chat -> /chat)
  const normalizedPath = pathname ? pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') : '';
  const isAuthPage = 
    normalizedPath.startsWith('/sign-in') || 
    normalizedPath.startsWith('/sign-up') || 
    normalizedPath.startsWith('/register') ||
    normalizedPath.startsWith('/chat') ||
    normalizedPath.startsWith('/improved-chat');
  if (isAuthPage) return null;

  const navItems = [
    { key: 'home', href: '/' },
    { key: 'about', href: '/about' },
    { key: 'chatHere', href: '/chat' },
    { key: 'contact', href: '/contact' },
    { key: 'docs', href: '/docs', label: 'Docs' },
  ];

  const isLoggedIn = authChecked && !!user;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
      transition={{ y: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg border-gray-200/60 dark:border-slate-800/60'
          : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md border-gray-200/50 dark:border-slate-800/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group shrink-0">
            <LogoUploader />
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent group-hover:from-teal-600 group-hover:to-cyan-600 transition-all duration-300">
              Arogya AI
            </span>
          </Link>

          {/* Desktop nav links — centered */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                prefetch={true}
                className={`font-medium transition-colors duration-200 relative group text-sm lg:text-base ${
                  pathname === item.href
                    ? 'text-teal-600 dark:text-teal-400'
                    : 'text-gray-755 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400'
                }`}
              >
                {item.label ?? t(item.key)}
                <span className={`absolute inset-x-0 -bottom-1 h-0.5 bg-teal-600 transform transition-transform duration-200 ${
                  pathname === item.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            ))}
          </div>

          {/* Desktop right side: language + auth + theme + chat + whatsapp */}
          <div className="hidden md:flex items-center space-x-2.5 shrink-0">
            {/* 1. Small Global Dark/Light Theme Toggle */}
            {mounted && (
              <button
                onClick={toggleThemeMode}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-750/80 hover:border-teal-350 dark:hover:border-teal-400 text-gray-700 dark:text-gray-200 hover:scale-105 transition-all shadow-sm cursor-pointer shrink-0"
                title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {themeMode === 'dark' ? (
                  <SunIcon className="w-5 h-5 text-amber-500" />
                ) : (
                  <MoonIcon className="w-5 h-5 text-indigo-500" />
                )}
              </button>
            )}

            {/* 2. Language dropdown (Globe/Code circle) */}
            <Menu as="div" className="relative notranslate shrink-0">
              <MenuButton className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-750/80 hover:border-teal-350 dark:hover:border-teal-400 text-xs font-bold text-gray-700 dark:text-gray-200 transition-all shadow-sm cursor-pointer shrink-0 notranslate hover:scale-105">
                <span className="notranslate">{currentLanguage.code.toUpperCase()}</span>
              </MenuButton>
              <MenuItems className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 py-1 z-50 notranslate max-h-[300px] overflow-y-auto">
                {supportedLanguages.map((language) => (
                  <MenuItem key={language.code}>
                    {({ active }) => (
                      <button
                        onClick={() => changeLanguage(language.code)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 notranslate ${
                          active
                            ? 'bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400'
                            : 'text-gray-800 dark:text-slate-200'
                        } ${
                          currentLanguage.code === language.code
                            ? 'font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-slate-800'
                            : ''
                        }`}
                      >
                        {language.nativeName}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>

            {/* 3. Small Circle Chat Icon Link */}
            <Link
              href="/chat"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-750/80 hover:border-teal-355 dark:hover:border-teal-450 text-gray-700 dark:text-gray-200 hover:scale-105 transition-all shadow-sm cursor-pointer shrink-0"
              title="Arogya AI Web Chat Portal"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </Link>

            {/* 4. Small Circle WhatsApp Button */}
            <WhatsAppButton variant="navbar" message="Hi! I'd like to know more about Arogya AI health services." />

            {/* 5. Account/Profile Dropdown Menu */}
            {authChecked && (
              <Menu as="div" className="relative shrink-0">
                <MenuButton className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-750/80 hover:border-teal-350 dark:hover:border-teal-400 text-gray-700 dark:text-gray-200 transition-all shadow-sm cursor-pointer shrink-0 hover:scale-105" title="Account Settings">
                  {isLoggedIn ? (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.[0]?.toUpperCase() ?? '👤'}
                    </div>
                  ) : (
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </MenuButton>
                
                <MenuItems className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 py-1.5 z-50">
                  {isLoggedIn ? (
                    <>
                      <div className="px-4 py-2.5 border-b border-gray-100 dark:border-slate-700 mb-1">
                        <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">Signed in as</p>
                        <p className="text-sm font-bold text-gray-800 dark:text-slate-100 truncate mt-0.5">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user.phone_number}</p>
                      </div>
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            href="/chat"
                            className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                              active ? 'bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400' : 'text-gray-700 dark:text-slate-300'
                            }`}
                          >
                            Go to Web Portal
                          </Link>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={async () => {
                              const { signOut } = await import('@/app/(login)/actions');
                              await signOut();
                              window.location.reload();
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                              active ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-slate-300'
                            }`}
                          >
                            Sign Out
                          </button>
                        )}
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            href="/sign-in"
                            className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                              active ? 'bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400' : 'text-gray-700 dark:text-slate-300'
                            }`}
                          >
                            Sign In
                          </Link>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            href="/register"
                            className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                              active ? 'bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400' : 'text-gray-700 dark:text-slate-300'
                            }`}
                          >
                            Register
                          </Link>
                        )}
                      </MenuItem>
                    </>
                  )}
                </MenuItems>
              </Menu>
            )}
          </div>

          {/* Mobile Theme Toggle & Menu controls */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Compact Mobile Theme Toggle */}
            {mounted && (
              <button
                onClick={toggleThemeMode}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-650 dark:text-gray-300 transition-colors duration-200 cursor-pointer"
                title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {themeMode === 'dark' ? (
                  <SunIcon className="w-5 h-5 text-amber-500" />
                ) : (
                  <MoonIcon className="w-5 h-5 text-indigo-500" />
                )}
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-650 dark:text-gray-300 transition-colors duration-200 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <XMarkIcon className="w-5.5 h-5.5" /> : <Bars3Icon className="w-5.5 h-5.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-200 dark:border-slate-800"
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  prefetch={true}
                  className={`block font-medium py-2.5 px-3 rounded-lg transition-colors duration-200 ${
                    pathname === item.href
                      ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-slate-800/50'
                      : 'text-gray-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-slate-800/30'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label ?? t(item.key)}
                </Link>
              ))}

              {/* Mobile auth buttons */}
              {authChecked && !isLoggedIn && (
                <div className="flex gap-2 pt-3 pb-1">
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white text-sm font-bold shadow-md"
                  >
                    <UserPlusIcon className="w-4 h-4" />
                    Register
                  </Link>
                  <Link
                    href="/sign-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-250 text-sm font-bold hover:bg-gray-50 dark:hover:bg-slate-800/40"
                  >
                    <ArrowRightEndOnRectangleIcon className="w-4 h-4" />
                    Sign In
                  </Link>
                </div>
              )}

              {authChecked && isLoggedIn && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/20 border border-teal-100/30 dark:border-teal-900/30 mt-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {user.name?.[0]?.toUpperCase() ?? '👤'}
                  </div>
                  <span className="text-sm font-semibold text-teal-700 dark:text-teal-400 truncate">
                    {user.name ?? user.phone_number}
                  </span>
                </div>
              )}

              {/* Language selector */}
              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 mt-2 notranslate">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">Language</p>
                <div className="grid grid-cols-2 gap-1.5 notranslate">
                  {supportedLanguages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => { changeLanguage(language.code); setIsMobileMenuOpen(false); }}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 text-left notranslate ${
                        currentLanguage.code === language.code
                          ? 'bg-teal-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 font-semibold'
                          : 'text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {language.nativeName}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <WhatsAppButton variant="mobile" message="Hi! I'd like to know more about Arogya AI health services." className="w-full" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
