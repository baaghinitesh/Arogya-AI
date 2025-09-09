# Arogya AI - WhatsApp Health Assistant Frontend

A production-ready Next.js frontend for Arogya AI, a WhatsApp-first health assistant designed specifically for Odisha with web chat fallback capabilities.

## 🚀 Features

### Core Features
- **WhatsApp-First Design**: Primary interaction through WhatsApp with seamless wa.me integration
- **Advanced Web Chat Interface**: ChatGPT-style three-column layout with conversation library
- **Multilingual Support**: Full support for English, Hindi (हिन्दी), and Odia (ଓଡ଼ିଆ)
- **AI-Powered Health Assistance**: Intelligent symptom assessment and health guidance
- **Voice Support**: Free client-side speech recognition and text-to-speech
- **Mobile-First Responsive Design**: Optimized for all devices with progressive enhancement

### UI/UX Features
- **Animated Splash Screen**: 2-second branded intro with smooth animations
- **Glass-Effect Navbar**: Modern design with scroll behavior and mobile responsiveness
- **Real-time Chat Interface**: Message bubbles, typing indicators, and smooth scrolling
- **Contact Form**: Validation and file upload capabilities
- **Logo Uploader**: Dynamic branding with favicon generation

### Chat Interface Features
- **Three-Column Layout**: Conversation library, chat stage, and collapsible sidebar
- **Session Management**: Persistent chat sessions with MongoDB storage
- **Smart Grouping**: Conversations organized by Today/Yesterday/Last 7 Days/Older
- **Real-time Streaming**: Word-by-word AI response streaming with typing indicators
- **Voice Integration**: Speech-to-text input and text-to-speech output (free Web APIs)
- **File Upload Support**: Image, PDF, and document sharing capabilities
- **Message Actions**: Copy, like/dislike, regenerate, and share functionality
- **Search & Filter**: Find conversations across history with full-text search

### Technical Features
- **SEO Optimized**: Meta tags, structured data (JSON-LD), sitemap generation
- **Accessibility First**: ARIA attributes, keyboard navigation, screen reader support
- **PWA Ready**: Manifest, service worker ready, offline capabilities
- **Backend Integration**: RESTful API with MongoDB for chat persistence
- **Type-Safe**: Full TypeScript implementation with proper typing

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS 4.x
- **Animations**: Framer Motion
- **Internationalization**: react-i18next
- **UI Components**: Headless UI + Heroicons
- **HTTP Client**: Axios
- **State Management**: React Context + SWR
- **Form Handling**: Native React with validation
- **SEO**: Next.js Metadata API + JSON-LD

## 🗄️ Database Schema

### MongoDB Chat Sessions

The chat interface uses MongoDB to store conversation sessions:

```typescript
interface ChatSession {
  _id: ObjectId;
  userId: string;
  title: string;  // Auto-generated from first message
  language: 'en' | 'hi' | 'od';
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  metadata: {
    totalMessages: number;
    lastActivity: Date;
    category?: string;
    tags?: string[];
  };
}

interface Message {
  _id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  metadata?: {
    tokens?: number;
    model?: string;
    confidence?: number;
  };
}
```

### API Endpoints

#### Chat Sessions
```typescript
// Get user's chat sessions
GET /api/chat/sessions?userId={userId}

// Create new chat session
POST /api/chat/sessions
{
  "userId": "user_123",
  "language": "en",
  "initialMessage": "Hello" // optional
}

// Update session (e.g., title)
PATCH /api/chat/sessions/{sessionId}
{
  "title": "Health Consultation"
}

// Delete session (soft delete)
DELETE /api/chat/sessions/{sessionId}
```

#### Chat Messages
```typescript
// Send message and get AI response
POST /api/chat/messages
{
  "sessionId": "session_id",
  "message": "I have a fever",
  "userId": "user_123"
}

// Response
{
  "userMessage": { /* Message object */ },
  "aiMessage": { /* AI response message */ },
  "success": true
}
```

## 💬 Chat Interface Usage

### Navigation
- **Access**: Visit `/chat` to open the chat interface
- **Back Navigation**: Top-left back arrow returns to home page
- **Language Switch**: Top-right dropdown changes conversation language
- **Mobile Support**: Sidebar collapses to hamburger menu on mobile

### Chat Management
1. **New Chat**: Click "New Chat" button to start fresh conversation
2. **Session History**: Browse past conversations in left sidebar
3. **Search**: Use search bar to find specific conversations
4. **Auto-grouping**: Sessions automatically grouped by recency

### Voice Features (Free & Client-Side)
- **Speech Input**: Click microphone button to speak your message
- **Text-to-Speech**: Click speaker icon on AI messages to hear responses
- **Language Support**: Voice recognition works in English, Hindi, and Odia
- **No API Costs**: Uses browser's built-in Web Speech API

### Message Features
- **Streaming Responses**: AI replies appear word-by-word with typing effect
- **Message Actions**: Hover over AI messages for copy, like, regenerate options
- **File Upload**: Click paperclip to attach images or documents
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for new line

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/arogyaai/frontend.git
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   NEXT_PUBLIC_WHATSAPP_NUMBER=1234567890
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Home page: `http://localhost:3000`
   - Chat interface: `http://localhost:3000/chat`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
API_SECRET_KEY=your-secret-key-here

# WhatsApp Integration
NEXT_PUBLIC_WHATSAPP_NUMBER=1234567890
WHATSAPP_API_TOKEN=your-whatsapp-api-token

# RASA Configuration
RASA_API_URL=http://localhost:5005
RASA_MODEL_NAME=arogya_model

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/arogya_db

# Feature Flags
ENABLE_WHATSAPP_INTEGRATION=true
ENABLE_FILE_UPLOAD=true
ENABLE_ANALYTICS=true
```

### Site Configuration

Update `lib/config.ts` to customize:
- Site metadata and SEO settings
- Contact information
- Social media links
- WhatsApp number
- Supported languages

## 🏗️ Project Structure

```
├── app/                          # Next.js App Router
│   ├── (routes)/                 # Route groups
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── sitemap.ts               # SEO sitemap
│   ├── robots.ts                # SEO robots.txt
│   └── manifest.ts              # PWA manifest
├── components/                   # Reusable components
│   ├── accessibility/           # A11y components
│   ├── seo/                     # SEO components
│   ├── navbar.tsx               # Navigation
│   ├── whatsapp-button.tsx      # WhatsApp integration
│   ├── splash-screen.tsx        # Loading screen
│   └── logo-uploader.tsx        # Dynamic branding
├── contexts/                     # React contexts
│   ├── language-context.tsx     # i18n management
│   └── theme-context.tsx        # Theme switching
├── lib/                         # Utilities and configuration
│   ├── api/                     # Backend integration
│   ├── hooks/                   # Custom React hooks
│   ├── i18n.ts                  # Internationalization
│   ├── config.ts                # Site configuration
│   └── utils.ts                 # Helper functions
└── public/                      # Static assets
```

## 🌐 Backend Integration

### API Client Setup

The application includes a comprehensive API client (`lib/api/client.ts`) that handles:

- **Authentication**: JWT token management with automatic refresh
- **Session Management**: User session tracking and context
- **Health Chat**: Real-time messaging with RASA backend
- **Health Assessment**: Symptom analysis and recommendations
- **Contact Forms**: File upload and form submission
- **WhatsApp Integration**: Link generation and interaction tracking

### Backend Requirements

Your backend should implement the following endpoints:

#### Health Chat API
```typescript
POST /api/chat/message
{
  "message": "I have a fever",
  "language": "en",
  "context": {},
  "timestamp": "2024-01-01T00:00:00Z"
}

Response:
{
  "response": "I understand you have a fever...",
  "confidence": 0.95,
  "suggestions": ["rest", "hydration"],
  "followUpQuestions": ["How long have you had this fever?"],
  "requiresHuman": false
}
```

#### Health Assessment API
```typescript
POST /api/health/assess
{
  "symptoms": ["fever", "headache"],
  "additional_info": {},
  "timestamp": "2024-01-01T00:00:00Z"
}

Response:
{
  "symptoms": ["fever", "headache"],
  "severity": "medium",
  "recommendations": ["Monitor temperature", "Stay hydrated"],
  "shouldSeekMedicalAttention": false,
  "estimatedWaitTime": 30
}
```

#### Session Management API
```typescript
POST /api/session/create
{
  "language": "en",
  "timestamp": "2024-01-01T00:00:00Z"
}

Response:
{
  "sessionId": "uuid-here",
  "userId": "optional-user-id",
  "language": "en",
  "startTime": "2024-01-01T00:00:00Z",
  "context": {}
}
```

### RASA Integration

The frontend is designed to work with RASA for natural language processing:

1. **Message Processing**: User messages are sent to RASA through the backend
2. **Intent Recognition**: RASA identifies health-related intents
3. **Entity Extraction**: Symptoms and health information are extracted
4. **Response Generation**: Contextual health guidance is provided

### Python Backend Example

Here's a minimal Python FastAPI backend structure:

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests

app = FastAPI()

class ChatMessage(BaseModel):
    message: str
    language: str = "en"
    context: dict = {}

class ChatResponse(BaseModel):
    response: str
    confidence: float
    suggestions: list = []
    followUpQuestions: list = []
    requiresHuman: bool = False

@app.post("/api/chat/message", response_model=ChatResponse)
async def chat_message(message: ChatMessage):
    # Forward to RASA
    rasa_response = requests.post(
        "http://localhost:5005/webhooks/rest/webhook",
        json={"sender": "user", "message": message.message}
    )
    
    # Process RASA response
    return ChatResponse(
        response=rasa_response.json()[0]["text"],
        confidence=0.95,
        suggestions=[],
        followUpQuestions=[],
        requiresHuman=False
    )
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** automatically on push to main branch

```bash
npm install -g vercel
vercel
```

### Docker Deployment

```bash
# Build Docker image
docker build -t arogya-ai-frontend .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=https://your-api.com \
  -e NEXT_PUBLIC_WHATSAPP_NUMBER=1234567890 \
  arogya-ai-frontend
```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Accessibility tests
npm run test:a11y
```

### Linting and Type Checking
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type-check
```

## 🌍 Internationalization

### Adding New Languages

1. **Update site config** in `lib/config.ts`:
   ```typescript
   languages: [
     { code: 'en', name: 'English', nativeName: 'English' },
     { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
     { code: 'od', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
     { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' } // New language
   ]
   ```

2. **Add translations** in `lib/i18n.ts`:
   ```typescript
   const resources = {
     en: { translation: { ... } },
     hi: { translation: { ... } },
     od: { translation: { ... } },
     bn: { translation: { ... } } // New translations
   };
   ```

3. **Update SEO** in `app/layout.tsx` for language alternates

### Translation Keys

All text content uses translation keys. Common patterns:
- Navigation: `home`, `about`, `contact`
- Actions: `startChat`, `tryWebChat`, `sendMessage`
- Content: `heroTitle`, `heroSubtitle`, `featuresTitle`

## 🔒 Security

### Input Validation
- All forms include client-side validation
- File uploads are restricted by type and size
- User input is sanitized before API calls

### Authentication
- JWT token management with secure storage
- Automatic token refresh
- Session timeout handling

### Privacy
- No personal health data stored locally
- HIPAA-compliant design patterns
- Clear privacy policy integration points

## 📊 Analytics

### Built-in Analytics
- WhatsApp interaction tracking
- Chat engagement metrics
- Form submission tracking
- Error logging and monitoring

### Integration Options
- Google Analytics 4
- Mixpanel for user behavior
- Sentry for error monitoring
- Custom analytics endpoints

## 🎨 Customization

### Theming
The application uses Tailwind CSS for consistent theming:

```css
/* Custom theme colors in globals.css */
:root {
  --primary: 217 91% 59%;
  --secondary: 240 4.8% 95.9%;
  --accent: 240 4.8% 95.9%;
}
```

### Component Customization
All components are built with customization in mind:
- Props for styling overrides
- CSS class composition
- Theme-aware color schemes

### Brand Customization
- Logo uploader for dynamic branding
- Configurable site metadata
- Customizable color schemes
- Flexible layout options

## 🐛 Troubleshooting

### Common Issues

**1. API Connection Failed**
```bash
# Check API endpoint
curl http://localhost:8000/api/health

# Verify environment variables
echo $NEXT_PUBLIC_API_BASE_URL
```

**2. WhatsApp Links Not Working**
- Verify `NEXT_PUBLIC_WHATSAPP_NUMBER` is set correctly
- Check if number includes country code
- Test wa.me links manually

**3. Translations Not Loading**
- Check browser console for i18n errors
- Verify language codes match in config and i18n
- Clear browser cache and localStorage

**4. Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Run type check
npm run type-check
```

### Performance Optimization

**1. Image Optimization**
- Use Next.js Image component
- Implement proper placeholder images
- Configure image CDN if needed

**2. Bundle Analysis**
```bash
npm run analyze
```

**3. Lighthouse Audit**
- Run regular performance audits
- Monitor Core Web Vitals
- Optimize loading priorities

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** with proper testing
4. **Follow code standards**: Run linting and type checks
5. **Commit changes**: Use conventional commits
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open Pull Request** with detailed description

### Code Standards

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with Next.js configuration
- **Formatting**: Prettier with consistent rules
- **Commits**: Conventional commit messages
- **Testing**: Required for new features

### Issue Reporting

When reporting issues, please include:
- Browser and device information
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)
- Environment configuration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋 Support

### Getting Help

- **Documentation**: Check this README and inline comments
- **Issues**: Create GitHub issues for bugs and feature requests
- **Email**: support@arogyaai.com
- **WhatsApp**: Contact through the app's WhatsApp integration

### Community

- **GitHub Discussions**: For general questions and community support
- **Contributing Guide**: See CONTRIBUTING.md for development guidelines
- **Code of Conduct**: See CODE_OF_CONDUCT.md for community standards

---

## 🎯 Roadmap

### Upcoming Features
- [ ] Voice message support
- [ ] Offline capabilities with service workers
- [ ] Advanced health assessment algorithms
- [ ] Integration with local healthcare providers
- [ ] Telemedicine video calling
- [ ] Health history tracking
- [ ] Appointment booking system
- [ ] Prescription management
- [ ] Emergency services integration
- [ ] Community health forums

### Technical Improvements
- [ ] Server-side rendering optimization
- [ ] Advanced caching strategies
- [ ] Performance monitoring dashboard
- [ ] Automated accessibility testing
- [ ] Multi-region deployment
- [ ] Advanced security features
- [ ] API rate limiting
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Machine learning integration

---

Built with ❤️ for the people of Odisha by the Arogya AI team.