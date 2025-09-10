'use client';

import React, { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  messageId: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text, messageId }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
    setIsAnimating(true);
  }, [messageId]);

  useEffect(() => {
    if (isAnimating && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else if (currentIndex >= text.length) {
      setIsAnimating(false);
    }
  }, [currentIndex, text, isAnimating]);

  return <span>{displayText}</span>;
};

export default React.memo(TypewriterText);
