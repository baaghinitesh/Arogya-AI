// Background themes configuration for chat interface
export interface BackgroundTheme {
  name: string;
  displayName: string;
  chatContainer: string;
  messagesArea: string;
  inputArea: string;
  sidebar: string;
}

export const backgroundThemes: Record<string, BackgroundTheme> = {
  default: {
    name: 'default',
    displayName: 'Default',
    chatContainer: 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
    messagesArea: 'bg-gradient-to-b from-gray-50/50 to-white/50',
    inputArea: 'bg-white/90 backdrop-blur-sm',
    sidebar: 'bg-white/80 backdrop-blur-sm'
  },
  ocean: {
    name: 'ocean',
    displayName: 'Ocean',
    chatContainer: 'bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100',
    messagesArea: 'bg-gradient-to-b from-blue-50/50 to-cyan-50/50',
    inputArea: 'bg-blue-50/90 backdrop-blur-sm',
    sidebar: 'bg-blue-50/80 backdrop-blur-sm'
  },
  forest: {
    name: 'forest',
    displayName: 'Forest',
    chatContainer: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100',
    messagesArea: 'bg-gradient-to-b from-green-50/50 to-emerald-50/50',
    inputArea: 'bg-green-50/90 backdrop-blur-sm',
    sidebar: 'bg-green-50/80 backdrop-blur-sm'
  },
  sunset: {
    name: 'sunset',
    displayName: 'Sunset',
    chatContainer: 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-100',
    messagesArea: 'bg-gradient-to-b from-orange-50/50 to-red-50/50',
    inputArea: 'bg-orange-50/90 backdrop-blur-sm',
    sidebar: 'bg-orange-50/80 backdrop-blur-sm'
  },
  minimal: {
    name: 'minimal',
    displayName: 'Minimal',
    chatContainer: 'bg-gray-50',
    messagesArea: 'bg-white',
    inputArea: 'bg-white border-t border-gray-200',
    sidebar: 'bg-white border-r border-gray-200'
  },
  dark: {
    name: 'dark',
    displayName: 'Dark',
    chatContainer: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
    messagesArea: 'bg-gradient-to-b from-gray-800/50 to-gray-900/50',
    inputArea: 'bg-gray-800/90 backdrop-blur-sm',
    sidebar: 'bg-gray-800/80 backdrop-blur-sm'
  }
};

export const getBackgroundTheme = (themeName: string): BackgroundTheme => {
  return backgroundThemes[themeName] || backgroundThemes.default;
};