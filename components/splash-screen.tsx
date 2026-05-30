'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LogoUploader from './logo-uploader';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete, 
  duration = 1200 
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
      setTimeout(onComplete, 300); // Snappy exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-cyan-50/70 via-white to-emerald-50/70"
        >
          {/* Background Pattern with Cyan and Emerald Blobs */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-emerald-500 rounded-full blur-3xl"></div>
            <div className="absolute top-3/4 left-1/2 w-24 h-24 bg-teal-500 rounded-full blur-2xl"></div>
          </div>

          <div className="relative text-center px-8">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.6, 
                type: "spring", 
                stiffness: 220, 
                damping: 18 
              }}
              className="mb-8 flex justify-center"
            >
              <div className="relative">
                {/* Pulsing Cyan ring */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 0 }}
                  transition={{ 
                    duration: 1.2, 
                    repeat: Infinity, 
                    repeatType: "loop" 
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full blur-sm"
                />
                
                {/* Logo container */}
                <div className="relative w-20 h-20 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full shadow-2xl flex items-center justify-center overflow-hidden">
                  <LogoUploader size="lg" />
                  {/* Fallback if no logo */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl"
                  >
                    A
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Brand Name Animation */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent bg-300% animate-gradient">
                Arogya AI
              </span>
            </motion.h1>

            {/* Tagline Animation */}
            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed"
            >
              {t('tagline')}
            </motion.p>

            {/* Loading Animation (Cyan/Teal/Emerald dots) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="flex justify-center mt-8"
            >
              <div className="flex space-x-2">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0.3 }}
                    animate={{ 
                      scale: [0.8, 1.2, 0.8], 
                      opacity: [0.3, 1, 0.3] 
                    }}
                    transition={{
                      duration: 1.0,
                      repeat: Infinity,
                      delay: index * 0.15,
                      ease: "easeInOut"
                    }}
                    className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                  />
                ))}
              </div>
            </motion.div>

            {/* Health Icons Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="absolute inset-0 pointer-events-none overflow-hidden"
            >
              {/* Floating health icons */}
              <motion.div
                animate={{ 
                  y: [-15, 15, -15],
                  x: [-8, 8, -8],
                  rotate: [0, 4, -4, 0]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute top-1/4 left-1/4 text-cyan-300 opacity-20"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </motion.div>
              
              <motion.div
                animate={{ 
                  y: [15, -15, 15],
                  x: [8, -8, 8],
                  rotate: [0, -4, 4, 0]
                }}
                transition={{ 
                  duration: 6.5, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 0.8
                }}
                className="absolute bottom-1/4 right-1/4 text-teal-300 opacity-20"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.div>
              
              <motion.div
                animate={{ 
                  y: [-12, 12, -12],
                  x: [-4, 4, -4],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 5.5, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1.5
                }}
                className="absolute top-3/4 left-1/2 text-emerald-300 opacity-20"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;