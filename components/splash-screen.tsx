'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/theme-context';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

const SplashContent: React.FC<{ tagline: string; isDark: boolean }> = ({ tagline, isDark }) => {
  const bg = isDark
    ? 'linear-gradient(135deg, #0f172a 0%, #0f1f2e 40%, #0d1f1a 100%)'
    : 'linear-gradient(135deg, #ecfeff 0%, #f0fdfa 30%, #f0fdf4 60%, #ecfeff 100%)';

  const orb1 = isDark
    ? 'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(20,184,166,0.2))'
    : 'linear-gradient(135deg, #67e8f9, #5eead4)';
  const orb2 = isDark
    ? 'linear-gradient(315deg, rgba(52,211,153,0.2), rgba(6,182,212,0.15))'
    : 'linear-gradient(315deg, #6ee7b7, #67e8f9)';

  const brandSecondary = isDark ? '#94a3b8' : '#334155';
  const taglineColor   = '#64748b';
  const statusColor    = isDark ? '#475569' : '#94a3b8';
  const dotColor       = isDark ? 'rgba(20,184,166,0.2)' : 'rgba(8,145,178,0.08)';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', background: bg,
      }}
    >
      {/* Orb 1 */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '-8rem', left: '-8rem',
          width: '24rem', height: '24rem', borderRadius: '9999px',
          background: orb1, filter: 'blur(64px)',
        }}
      />
      {/* Orb 2 */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          position: 'absolute', bottom: '-8rem', right: '-8rem',
          width: '24rem', height: '24rem', borderRadius: '9999px',
          background: orb2, filter: 'blur(64px)',
        }}
      />
      {/* Orb 3 */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '16rem', height: '16rem', borderRadius: '9999px',
          background: 'linear-gradient(90deg, #5eead4, #67e8f9)', filter: 'blur(64px)',
        }}
      />

      {/* Dot pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: isDark ? 0.15 : 0.04,
        backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
      }} />

      {/* Main content */}
      <div style={{
        position: 'relative', display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center', padding: '0 2rem', maxWidth: '32rem',
      }}>
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, type: 'spring', stiffness: 200, damping: 16 }}
          style={{ marginBottom: '2rem', position: 'relative' }}
        >
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            style={{
              position: 'absolute', inset: 0, borderRadius: '9999px',
              background: 'linear-gradient(90deg, #22d3ee, #2dd4bf)', filter: 'blur(6px)',
            }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', inset: '-0.5rem', borderRadius: '9999px',
              border: `2px dashed ${isDark ? 'rgba(34,211,238,0.3)' : 'rgba(103,232,249,0.5)'}`,
            }}
          />
          <div style={{
            position: 'relative', width: '6rem', height: '6rem', borderRadius: '9999px',
            background: 'linear-gradient(135deg, #06b6d4, #14b8a6, #10b981)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              position: 'absolute', inset: '0.25rem', borderRadius: '9999px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)',
            }} />
            <svg width="48" height="48" viewBox="0 0 48 48" fill="white" style={{ position: 'relative', zIndex: 1 }}>
              <rect x="18" y="6" width="12" height="36" rx="3" />
              <rect x="6" y="18" width="36" height="12" rx="3" />
            </svg>
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
        >
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 3.75rem)', fontWeight: 700,
            letterSpacing: '-0.025em', marginBottom: '0.25rem', lineHeight: 1.1,
          }}>
            <span style={{
              background: 'linear-gradient(90deg, #0891b2, #0d9488, #059669)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Arogya
            </span>
            <span style={{ color: brandSecondary }}> AI</span>
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
          style={{
            marginTop: '0.75rem', fontSize: '1rem', color: taglineColor,
            fontWeight: 500, letterSpacing: '0.025em', maxWidth: '20rem',
          }}
        >
          {tagline}
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6, ease: 'easeOut' }}
          style={{
            marginTop: '1.5rem', width: '4rem', height: '2px',
            background: 'linear-gradient(90deg, #22d3ee, #2dd4bf)', borderRadius: '9999px',
          }}
        />

        {/* Loading bars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.3 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{ scaleY: [1, 2.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }}
              style={{
                width: '4px', height: '16px', borderRadius: '9999px',
                background: 'linear-gradient(180deg, #06b6d4, #14b8a6)',
              }}
            />
          ))}
        </motion.div>

        {/* Status text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.4 }}
          style={{
            marginTop: '1rem', fontSize: '0.7rem', color: statusColor,
            letterSpacing: '0.15em', textTransform: 'uppercase',
          }}
        >
          Loading your health assistant…
        </motion.p>
      </div>

      {/* Floating icons */}
      {[
        { icon: '❤️', top: '15%', left: '10%',  delay: 0.6, fontSize: '1.5rem'   },
        { icon: '🩺', top: '20%', right: '12%', delay: 0.9, fontSize: '1.25rem'  },
        { icon: '💊', bottom: '20%', left: '8%', delay: 1.1, fontSize: '1.125rem' },
        { icon: '🌿', bottom: '15%', right: '10%', delay: 0.7, fontSize: '1.5rem' },
        { icon: '⚕️', top: '50%', left: '5%',   delay: 1.3, fontSize: '1.25rem'  },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.35, 0.35, 0], scale: [0, 1, 1, 0.8], y: [0, -12, 12, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: item.delay, ease: 'easeInOut' }}
          style={{
            position: 'absolute', fontSize: item.fontSize,
            userSelect: 'none', pointerEvents: 'none',
            top: (item as any).top, left: (item as any).left,
            right: (item as any).right, bottom: (item as any).bottom,
          }}
        >
          {item.icon}
        </motion.div>
      ))}
    </motion.div>
  );
};

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, duration = 2400 }) => {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const tagline = t('tagline') || 'Your AI-powered health companion';
  const [showSplash, setShowSplash] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasShown = sessionStorage.getItem('arogya_splash_shown');
    if (hasShown) { onComplete(); return; }
    setShowSplash(true);
    const timer = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem('arogya_splash_shown', 'true');
      setTimeout(onComplete, 500);
    }, duration);
    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {showSplash && <SplashContent tagline={tagline} isDark={mode === 'dark'} />}
    </AnimatePresence>,
    document.body
  );
};

export default SplashScreen;
