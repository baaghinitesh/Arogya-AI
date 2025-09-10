'use client';

import React from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';

interface WelcomeScreenProps {
  onPromptSelected: (prompt: string) => void;
  currentTheme: any;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onPromptSelected, currentTheme }) => {
  const prompts = [
    'What are the symptoms of fever?',
    'How can I manage my headache?',
    'Tips for better sleep',
    'Healthy diet recommendations'
  ];

  return (
    <div className={`flex-1 flex items-center justify-center ${currentTheme.messagesArea}`}>
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <HeartIcon className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Arogya AI</h2>
        <p className="text-gray-600 mb-8">
          Your AI-powered health assistant. Start a new conversation to get personalized health guidance in your
          preferred language.
        </p>
        <div className="grid grid-cols-1 gap-3">
          {prompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => onPromptSelected(prompt)}
              className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <span className="text-sm text-gray-700">{prompt}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
