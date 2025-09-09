'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';
import WhatsAppButton from '@/components/whatsapp-button';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

const ChatPage = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m Arogya AI, your health assistant for Odisha. How can I help you today? You can ask me about symptoms, health concerns, or general health advice.',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage: string): string => {
    // Simple rule-based responses for demo
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('fever') || lowerMessage.includes('बुखार') || lowerMessage.includes('ଜ୍ୱର')) {
      return "I understand you're experiencing fever. Here are some general recommendations:\n\n1. Rest and stay hydrated\n2. Monitor your temperature regularly\n3. Take paracetamol if needed (follow dosage instructions)\n4. If fever persists for more than 3 days or exceeds 103°F, please consult a doctor immediately.\n\n⚠️ This is general advice. For persistent symptoms, please seek medical attention.";
    }
    
    if (lowerMessage.includes('headache') || lowerMessage.includes('सिर दर्द') || lowerMessage.includes('ମୁଣ୍ଡ ବ୍ୟଥା')) {
      return "For headache relief, consider these steps:\n\n1. Rest in a quiet, dark room\n2. Apply a cold or warm compress\n3. Stay hydrated\n4. Avoid screens for a while\n5. Gentle neck and shoulder stretches may help\n\nIf headaches are severe, frequent, or accompanied by other symptoms, please consult a healthcare provider.";
    }
    
    if (lowerMessage.includes('cough') || lowerMessage.includes('खांसी') || lowerMessage.includes('କାଶ')) {
      return "For cough management:\n\n1. Stay hydrated with warm liquids\n2. Honey and warm water can be soothing\n3. Avoid irritants like smoke\n4. Use a humidifier if air is dry\n5. Rest your voice\n\nSeek medical attention if cough persists for more than 2 weeks, produces blood, or is accompanied by high fever.";
    }
    
    return "Thank you for your question. I'm here to provide general health guidance, but I'd recommend consulting with a healthcare professional for proper diagnosis and treatment. \n\nFor immediate medical assistance, you can also reach out through WhatsApp for more personalized support. Is there anything specific about your symptoms you'd like to discuss?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: simulateAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center space-x-2 p-4 bg-gray-100 rounded-2xl max-w-xs"
    >
      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
        <HeartIcon className="w-4 h-4 text-white" />
      </div>
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2
            }}
            className="w-2 h-2 bg-gray-400 rounded-full"
          />
        ))}
      </div>
      <span className="text-sm text-gray-500">{t('typingIndicator')}</span>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-5rem)] flex flex-col">
        {/* Chat Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-t-2xl p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <HeartIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Arogya AI</h1>
                <p className="text-sm text-gray-500">Health Assistant for Odisha</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <WhatsAppButton 
                variant="navbar"
                message="I'd like to continue our health conversation on WhatsApp"
              >
                Switch to WhatsApp
              </WhatsAppButton>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto bg-white/50 backdrop-blur-sm p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-xs md:max-w-md lg:max-w-lg ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-blue-500' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}>
                    {message.sender === 'user' ? (
                      <UserIcon className="w-4 h-4 text-white" />
                    ) : (
                      <HeartIcon className="w-4 h-4 text-white" />
                    )}
                  </div>
                  
                  {/* Message Bubble */}
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
                  } shadow-sm`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-b-2xl p-4 border-t border-gray-200">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              "I have a fever",
              "मुझे सिरदर्द है", 
              "ମୋର କାଶ ହେଉଛି",
              "General health tips"
            ].map((quickMessage, index) => (
              <button
                key={index}
                onClick={() => setInputValue(quickMessage)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors duration-200"
              >
                {quickMessage}
              </button>
            ))}
          </div>

          {/* Input Field */}
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('messagePlaceholder')}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                disabled={isTyping}
              />
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className={`p-3 rounded-full transition-all duration-200 ${
                inputValue.trim() && !isTyping
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 mt-3 text-center">
            ⚠️ This is an AI assistant providing general health information. 
            For medical emergencies or serious symptoms, please consult a healthcare professional immediately.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;