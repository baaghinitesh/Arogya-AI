'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, Bars3Icon, XMarkIcon, UserPlusIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { useLanguage } from '../contexts/language-context';
import WhatsAppButton from './whatsapp-button';
import LogoUploader from './logo-uploader';

const Navbar = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Check auth state once on mount only
  useEffect(() => {
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
          ? 'bg-white/90 backdrop-blur-md shadow-lg border-gray-200/60'
          : 'bg-white/80 backdrop-blur-md shadow-md border-gray-200/50'
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
                    ? 'text-teal-600'
                    : 'text-gray-700 hover:text-teal-600'
                }`}
              >
                {item.label ?? t(item.key)}
                <span className={`absolute inset-x-0 -bottom-1 h-0.5 bg-teal-600 transform transition-transform duration-200 ${
                  pathname === item.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            ))}
          </div>

          {/* Desktop right side: language + auth buttons + whatsapp */}
          <div className="hidden md:flex items-center space-x-3 shrink-0">
            {/* Language dropdown */}
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200 hover:bg-white/80 transition-all duration-200 text-sm font-medium text-gray-800">
                <span>{currentLanguage.nativeName}</span>
                <ChevronDownIcon className="w-3.5 h-3.5 text-gray-500" />
              </MenuButton>
              <MenuItems className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                {supportedLanguages.map((language) => (
                  <MenuItem key={language.code}>
                    {({ active }) => (
                      <button
                        onClick={() => changeLanguage(language.code)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                          active ? 'bg-teal-50 text-teal-600' : 'text-gray-800'
                        } ${currentLanguage.code === language.code ? 'font-semibold text-teal-600 bg-teal-50' : ''}`}
                      >
                        {language.nativeName} ({language.name})
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>

            {/* Auth buttons — only show after auth check to avoid flash */}
            {authChecked && (
              isLoggedIn ? (
                /* Logged in: show user indicator */
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-100">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.[0]?.toUpperCase() ?? '👤'}
                  </div>
                  <span className="text-sm font-semibold text-teal-700 max-w-[80px] truncate">
                    {user.name ?? user.phone_number}
                  </span>
                </div>
              ) : (
                /* Not logged in: Register + Sign In */
                <div className="flex items-center gap-2">
                  <Link
                    href="/register"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 text-white text-sm font-bold shadow-md shadow-teal-600/20 hover:shadow-lg hover:shadow-teal-600/30 transition-all"
                  >
                    <UserPlusIcon className="w-4 h-4" />
                    <span>Register</span>
                  </Link>
                  <Link
                    href="/sign-in"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-bold hover:border-teal-300 hover:text-teal-600 transition-all"
                  >
                    <ArrowRightEndOnRectangleIcon className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                </div>
              )
            )}

            <WhatsAppButton variant="navbar" message="Hi! I'd like to know more about Arogya AI health services." />
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
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
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  prefetch={true}
                  className={`block font-medium py-2.5 px-3 rounded-lg transition-colors duration-200 ${
                    pathname === item.href
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50'
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
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50"
                  >
                    <ArrowRightEndOnRectangleIcon className="w-4 h-4" />
                    Sign In
                  </Link>
                </div>
              )}

              {authChecked && isLoggedIn && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-teal-50 border border-teal-100 mt-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {user.name?.[0]?.toUpperCase() ?? '👤'}
                  </div>
                  <span className="text-sm font-semibold text-teal-700 truncate">
                    {user.name ?? user.phone_number}
                  </span>
                </div>
              )}

              {/* Language selector */}
              <div className="pt-3 border-t border-gray-100 mt-2">
                <p className="text-xs font-semibold text-gray-500 mb-2 px-1">Language</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {supportedLanguages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => { changeLanguage(language.code); setIsMobileMenuOpen(false); }}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 text-left ${
                        currentLanguage.code === language.code
                          ? 'bg-teal-100 text-teal-600 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
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
