'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  duration = 2400,
}) => {
  const { t } = useTranslation();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasShown = sessionStorage.getItem('arogya_splash_shown');
      if (hasShown) {
        setShowSplash(false);
        onComplete();
        return;
      }
    }

    const timer = setTimeout(() => {
      setShowSplash(false);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('arogya_splash_shown', 'true');
      }
      setTimeout(onComplete, 500);
    }, duration);

    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(135deg, #ecfeff 0%, #f0fdfa 30%, #f0fdf4 60%, #ecfeff 100%)',
          }}
        >
          {/* Animated background orbs */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-cyan-400 to-teal-300 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-tl from-emerald-400 to-cyan-300 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-teal-300 to-cyan-300 rounded-full blur-3xl"
          />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(#0891b2 1px, transparent 1px), linear-gradient(90deg, #0891b2 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Main content */}
          <div className="relative flex flex-col items-center text-center px-8 max-w-lg">

            {/* Logo mark */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, type: 'spring', stiffness: 200, damping: 16 }}
              className="mb-8 relative"
            >
              {/* Outer glow ring */}
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 blur-md"
              />
              {/* Inner ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-2 rounded-full border-2 border-dashed border-cyan-300/50"
              />

              {/* Logo circle */}
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 shadow-2xl flex items-center justify-center">
                {/* Inner shine */}
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                {/* Cross / health symbol */}
                <svg
                  className="w-12 h-12 text-white relative z-10"
                  fill="none"
                  viewBox="0 0 48 48"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                >
                  <rect x="18" y="6" width="12" height="36" rx="3" fill="currentColor" stroke="none" />
                  <rect x="6" y="18" width="36" height="12" rx="3" fill="currentColor" stroke="none" />
                </svg>
              </div>
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
            >
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-1">
                <span className="bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent animate-gradient">
                  Arogya
                </span>
                <span className="text-slate-700"> AI</span>
              </h1>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
              className="mt-3 text-base md:text-lg text-slate-500 font-medium tracking-wide max-w-xs"
            >
              {t('tagline') || 'Your AI-powered health companion'}
            </motion.p>

            {/* Divider line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6, ease: 'easeOut' }}
              className="mt-6 w-16 h-0.5 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full"
            />

            {/* Loading dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.3 }}
              className="flex items-center space-x-2 mt-8"
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scaleY: [1, 2.5, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    delay: i * 0.12,
                    ease: 'easeInOut',
                  }}
                  className="w-1 h-4 rounded-full bg-gradient-to-b from-cyan-500 to-teal-500"
                />
              ))}
            </motion.div>

            {/* Subtle status text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.4 }}
              className="mt-4 text-xs text-slate-400 tracking-widest uppercase"
            >
              Loading your health assistant…
            </motion.p>
          </div>

          {/* Floating health icons — decorative */}
          {[
            { icon: '❤️', top: '15%', left: '10%', delay: 0.6, size: 'text-2xl' },
            { icon: '🩺', top: '20%', right: '12%', delay: 0.9, size: 'text-xl' },
            { icon: '💊', bottom: '20%', left: '8%', delay: 1.1, size: 'text-lg' },
            { icon: '🌿', bottom: '15%', right: '10%', delay: 0.7, size: 'text-2xl' },
            { icon: '⚕️', top: '50%', left: '5%', delay: 1.3, size: 'text-xl' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.35, 0.35, 0],
                scale: [0, 1, 1, 0.8],
                y: [0, -12, 12, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: item.delay,
                ease: 'easeInOut',
              }}
              className={`absolute ${item.size} select-none pointer-events-none`}
              style={{
                top: item.top,
                left: (item as any).left,
                right: (item as any).right,
                bottom: item.bottom,
              }}
            >
              {item.icon}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
