import React from 'react';

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  className?: string;
}

export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <span className={`sr-only ${className}`}>
      {children}
    </span>
  );
};