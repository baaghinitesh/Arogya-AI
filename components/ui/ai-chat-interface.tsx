'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, MicOff, Volume2, VolumeX, Plus, Settings, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useSpeechRecognition } from '@/lib/hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '@/lib/hooks/useSpeechSynthesis'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  language?: string
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
]

const translations = {
  en: {
    newChat: 'New Chat',
    settings: 'Settings',
    typeMessage: 'Type your health question here...',
    send: 'Send',
    listening: 'Listening...',
    speak: 'Speak',
    stop: 'Stop',
    aiTyping: 'AI is typing...',
    selectLanguage: 'Select Language',
    chatHistory: 'Chat History',
    collapse: 'Collapse',
    expand: 'Expand',
  },
  hi: {
    newChat: 'नई चैट',
    settings: 'सेटिंग्स',
    typeMessage: 'यहाँ अपना स्वास्थ्य प्रश्न टाइप करें...',
    send: 'भेजें',
    listening: 'सुन रहा है...',
    speak: 'बोलें',
    stop: 'रोकें',
    aiTyping: 'AI टाइप कर रहा है...',
    selectLanguage: 'भाषा चुनें',
    chatHistory: 'चैट इतिहास',
    collapse: 'छुपाएं',
    expand: 'विस्तार करें',
  },
  or: {
    newChat: 'ନୂତନ ଚାଟ୍',
    settings: 'ସେଟିଂସ୍',
    typeMessage: 'ଏଠାରେ ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରଶ୍ନ ଟାଇପ୍ କରନ୍ତୁ...',
    send: 'ପଠାନ୍ତୁ',
    listening: 'ଶୁଣୁଛି...',
    speak: 'କୁହନ୍ତୁ',
    stop: 'ବନ୍ଦ କରନ୍ତୁ',
    aiTyping: 'AI ଟାଇପ୍ କରୁଛି...',
    selectLanguage: 'ଭାଷା ବାଛନ୍ତୁ',
    chatHistory: 'ଚାଟ୍ ଇତିହାସ',
    collapse: 'ଲୁଚାନ୍ତୁ',
    expand: 'ବିସ୍ତାର କରନ୍ତୁ',
  },
}

export default function AIChatInterface() {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi' | 'or'>('en')
  const [message, setMessage] = useState('')
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Custom chat state management
  const [messages, setMessages] = useState<Message[]>([])
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    isSupported: speechSupported 
  } = useSpeechRecognition()
  const { 
    speak, 
    stop: stopSpeaking, 
    isSpeaking, 
    isSupported: ttsSupported 
  } = useSpeechSynthesis()

  const t = translations[currentLanguage]

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [message])

  // Update message from speech transcript
  useEffect(() => {
    if (transcript) {
      setMessage(transcript)
    }
  }, [transcript])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load sessions on component mount
  useEffect(() => {
    loadSessions()
  }, [])

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
      }
    }
    
    // Check on mount
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/chat/sessions')
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions || [])
      }
    } catch (error) {
      console.error('Failed to load sessions:', error)
    }
  }

  const createNewSession = async () => {
    try {
      const response = await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: `New Chat ${new Date().toLocaleTimeString()}`,
          language: currentLanguage 
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setCurrentSessionId(data.session._id || data.session.id)
        setMessages([])
        await loadSessions()
      }
    } catch (error) {
      console.error('Failed to create session:', error)
    }
  }

  const loadMessages = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/sessions/${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        const session = data.session
        if (session && session.messages) {
          const formattedMessages = session.messages.map((msg: any) => ({
            id: msg._id || msg.id || `msg-${Date.now()}-${Math.random()}`,
            content: msg.content,
            sender: msg.role === 'user' ? 'user' : 'ai',
            timestamp: new Date(msg.timestamp),
            language: msg.language || currentLanguage
          }))
          setMessages(formattedMessages)
        }
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading || !currentSessionId) return

    const messageText = message.trim()
    setMessage('')
    setIsLoading(true)
    setIsTyping(true)

    // Add user message immediately
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      content: messageText,
      sender: 'user',
      timestamp: new Date(),
      language: currentLanguage
    }
    setMessages(prev => [...prev, userMessage])

    try {
      const response = await fetch(`/api/chat/sessions/${currentSessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageText,
          language: currentLanguage 
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          content: data.response || 'Thank you for your message. How can I help you with your health concerns?',
          sender: 'ai',
          timestamp: new Date(),
          language: currentLanguage
        }
        
        // Simulate typing delay
        setTimeout(() => {
          setMessages(prev => [...prev, aiMessage])
          setIsTyping(false)
        }, 1500)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      setIsTyping(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const handleSpeakMessage = (text: string) => {
    if (isSpeaking) {
      stopSpeaking()
    } else {
      speak(text, currentLanguage)
    }
  }

  const TypewriterText = ({ text }: { text: string }) => {
    const [displayText, setDisplayText] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayText(prev => prev + text[currentIndex])
          setCurrentIndex(prev => prev + 1)
        }, 30)
        return () => clearTimeout(timeout)
      }
    }, [currentIndex, text])

    return <span>{displayText}</span>
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Left Sidebar - Chat History */}
      <motion.div
        initial={false}
        animate={{ width: sidebarCollapsed ? 60 : 280 }}
        className="bg-white/80 backdrop-blur-sm border-r border-slate-200 flex flex-col shadow-lg"
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h2 className="font-semibold text-slate-800">{t.chatHistory}</h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-slate-600 hover:text-slate-800"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button
            onClick={createNewSession}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            size={sidebarCollapsed ? "sm" : "default"}
          >
            <Plus className="h-4 w-4" />
            {!sidebarCollapsed && <span className="ml-2">{t.newChat}</span>}
          </Button>
        </div>

        {/* Sessions List */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2">
            {sessions.map((session) => (
              <motion.div
                key={session.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={currentSessionId === session._id || currentSessionId === session.id ? "secondary" : "ghost"}
                  className={`w-full justify-start text-left p-3 h-auto ${
                    sidebarCollapsed ? 'px-2' : ''
                  }`}
                  onClick={() => {
                    const sessionId = session._id || session.id
                    setCurrentSessionId(sessionId)
                    loadMessages(sessionId)
                  }}
                >
                  {sidebarCollapsed ? (
                    <div className="w-6 h-6 rounded bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center text-white text-xs font-bold">
                      {session.title.charAt(0)}
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium text-sm truncate">{session.title}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(session.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        {/* Settings */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-slate-200">
            <Button variant="ghost" className="w-full justify-start text-slate-600">
              <Settings className="h-4 w-4 mr-2" />
              {t.settings}
            </Button>
          </div>
        )}
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Arogya AI Assistant
              </h1>
            </div>
            
            {/* Language Selector */}
            <Select value={currentLanguage} onValueChange={(value: 'en' | 'hi' | 'or') => setCurrentLanguage(value)}>
              <SelectTrigger className="w-32 sm:w-40 bg-white border-slate-300 text-slate-700 shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 shadow-lg">
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code} className="text-slate-700 hover:bg-slate-50">
                    <span className="flex items-center space-x-2">
                      <span>{lang.flag}</span>
                      <span className="hidden sm:inline">{lang.name}</span>
                      <span className="sm:hidden">{lang.code.toUpperCase()}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 bg-gradient-to-b from-slate-50/50 to-white/50">
          <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] sm:max-w-[70%] ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-l-2xl rounded-tr-2xl'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-r-2xl rounded-tl-2xl shadow-sm'
                } p-4`}>
                  {msg.sender === 'ai' ? (
                    <TypewriterText text={msg.content} />
                  ) : (
                    <p>{msg.content}</p>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <p className={`text-xs ${
                      msg.sender === 'user' ? 'text-blue-100' : 'text-slate-500'
                    }`}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                    
                    {msg.sender === 'ai' && ttsSupported && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSpeakMessage(msg.content)}
                        className="ml-2 h-6 w-6 p-0 text-slate-500 hover:text-slate-700"
                      >
                        {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-slate-200 rounded-r-2xl rounded-tl-2xl p-4 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                      </div>
                      <span className="text-sm text-slate-500">{t.aiTyping}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="bg-white/90 backdrop-blur-sm border-t border-slate-200 p-3 sm:p-4">
          <div className="flex items-end space-x-2 sm:space-x-3">
            {/* Voice Input Button */}
            {speechSupported && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={isListening ? "default" : "outline"}
                  size="lg"
                  onClick={handleVoiceToggle}
                  title={isListening ? t.stop : t.speak}
                  className={`h-12 w-12 rounded-full border-2 touch-manipulation ${
                    isListening 
                      ? 'bg-red-500 border-red-500 text-white shadow-lg animate-pulse' 
                      : 'border-slate-300 text-slate-600 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  {isListening ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <MicOff className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </Button>
              </motion.div>
            )}

            {/* Text Input */}
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isListening ? t.listening : t.typeMessage}
                className="min-h-[48px] max-h-[120px] resize-none bg-white border-slate-300 text-slate-800 placeholder-slate-500 focus:border-blue-400 focus:ring-blue-400 overflow-hidden"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                disabled={isListening}
              />
            </div>

            {/* Send Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                size="lg"
                title={t.send}
                className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg disabled:opacity-50 touch-manipulation"
              >
                <Send className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
          
          {isListening && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-500 mt-2 text-center"
            >
              {t.listening}
            </motion.p>
          )}
        </div>
      </div>

      {/* Right Panel - Collapsible */}
      <motion.div
        initial={false}
        animate={{ width: rightPanelCollapsed ? 60 : 300 }}
        className="bg-white/80 backdrop-blur-sm border-l border-slate-200 flex flex-col shadow-lg"
      >
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {!rightPanelCollapsed && (
              <h2 className="font-semibold text-slate-800">Quick Actions</h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
              className="text-slate-600 hover:text-slate-800"
            >
              {rightPanelCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {!rightPanelCollapsed && (
          <div className="p-4 space-y-3">
            <Button variant="outline" className="w-full justify-start text-slate-700 border-slate-300">
              Health Check
            </Button>
            <Button variant="outline" className="w-full justify-start text-slate-700 border-slate-300">
              Symptoms Analysis
            </Button>
            <Button variant="outline" className="w-full justify-start text-slate-700 border-slate-300">
              Medicine Info
            </Button>
            <Button variant="outline" className="w-full justify-start text-slate-700 border-slate-300">
              Emergency Help
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  )
}