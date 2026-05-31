'use client';

import React, { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  messageId: string;
  onType?: () => void;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text, messageId, onType }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // Restart typewriter if message content or message ID changes
  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
    setIsAnimating(true);
  }, [messageId, text]);

  // Handle character-by-character or chunk-by-chunk typing
  useEffect(() => {
    if (isAnimating && currentIndex < text.length) {
      // Dynamic chunking: print larger chunks if text is long to keep animation fast
      const step = text.length > 500 ? 5 : text.length > 150 ? 3 : 1;
      
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, Math.min(currentIndex + step, text.length)));
        setCurrentIndex((prev) => Math.min(prev + step, text.length));
      }, 8); // Responsive 8ms delay
      
      return () => clearTimeout(timeout);
    } else if (currentIndex >= text.length) {
      setIsAnimating(false);
    }
  }, [currentIndex, text, isAnimating]);

  // Trigger onType scroll callback whenever text grows
  useEffect(() => {
    if (isAnimating && displayText) {
      onType?.();
    }
  }, [displayText, onType, isAnimating]);

  // Click to reveal the entire message instantly
  const handleRevealAll = () => {
    if (isAnimating) {
      setDisplayText(text);
      setCurrentIndex(text.length);
      setIsAnimating(false);
      onType?.();
    }
  };

  return (
    <span
      onClick={handleRevealAll}
      className={isAnimating ? 'cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors duration-150 relative select-none' : 'whitespace-pre-wrap'}
      title={isAnimating ? 'Click to show full message instantly' : undefined}
    >
      {displayText}
      {isAnimating && (
        <span className="inline-block w-1.5 h-3.5 bg-teal-500/80 ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  );
};

export default React.memo(TypewriterText);
