import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ChatMessage {
  message: string;
  sender: 'user' | 'bot';
  timestamp: string;
  language?: 'en' | 'hi' | 'od';
  metadata?: Record<string, any>;
}

export interface ChatResponse {
  response: string;
  confidence: number;
  suggestions?: string[];
  followUpQuestions?: string[];
  requiresHuman?: boolean;
}

export interface HealthAssessment {
  symptoms: string[];
  severity: 'low' | 'medium' | 'high' | 'emergency';
  recommendations: string[];
  shouldSeekMedicalAttention: boolean;
  estimatedWaitTime?: number;
}

export interface UserSession {
  sessionId: string;
  userId?: string;
  language: 'en' | 'hi' | 'od';
  startTime: string;
  context: Record<string, any>;
}

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;
  private authToken: string | null = null;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for adding authentication
    this.client.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        
        // Add session ID if available
        const sessionId = this.getSessionId();
        if (sessionId) {
          config.headers['X-Session-ID'] = sessionId;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for handling common errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuth();
          // Redirect to login if needed
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication methods
  setAuthToken(token: string) {
    this.authToken = token;
    localStorage.setItem('arogya_auth_token', token);
  }

  clearAuth() {
    this.authToken = null;
    localStorage.removeItem('arogya_auth_token');
    localStorage.removeItem('arogya_session_id');
  }

  loadAuthFromStorage() {
    const token = localStorage.getItem('arogya_auth_token');
    if (token) {
      this.authToken = token;
    }
  }

  // Session management
  private getSessionId(): string | null {
    return localStorage.getItem('arogya_session_id');
  }

  private setSessionId(sessionId: string) {
    localStorage.setItem('arogya_session_id', sessionId);
  }

  // Generic API methods
  private async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.request({
        method,
        url: endpoint,
        data,
        ...config,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error(`API Error [${method} ${endpoint}]:`, error);

      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'An unexpected error occurred';

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Health Chat API methods
  async sendChatMessage(
    message: string, 
    language: 'en' | 'hi' | 'od' = 'en',
    context?: Record<string, any>
  ): Promise<ApiResponse<ChatResponse>> {
    const payload = {
      message: message.trim(),
      language,
      context,
      timestamp: new Date().toISOString(),
    };

    return this.makeRequest<ChatResponse>('POST', '/api/chat/message', payload);
  }

  async getChatHistory(sessionId?: string): Promise<ApiResponse<ChatMessage[]>> {
    const params = sessionId ? { session_id: sessionId } : {};
    return this.makeRequest<ChatMessage[]>('GET', '/api/chat/history', undefined, { params });
  }

  async assessHealthSymptoms(
    symptoms: string[],
    additionalInfo?: Record<string, any>
  ): Promise<ApiResponse<HealthAssessment>> {
    const payload = {
      symptoms,
      additional_info: additionalInfo,
      timestamp: new Date().toISOString(),
    };

    return this.makeRequest<HealthAssessment>('POST', '/api/health/assess', payload);
  }

  // Session management API methods
  async createSession(language: 'en' | 'hi' | 'od' = 'en'): Promise<ApiResponse<UserSession>> {
    const payload = {
      language,
      timestamp: new Date().toISOString(),
    };

    const response = await this.makeRequest<UserSession>('POST', '/api/session/create', payload);
    
    if (response.success && response.data?.sessionId) {
      this.setSessionId(response.data.sessionId);
    }

    return response;
  }

  async updateSessionContext(context: Record<string, any>): Promise<ApiResponse<void>> {
    return this.makeRequest<void>('PUT', '/api/session/context', { context });
  }

  async endSession(): Promise<ApiResponse<void>> {
    const response = await this.makeRequest<void>('POST', '/api/session/end');
    localStorage.removeItem('arogya_session_id');
    return response;
  }

  // Contact form API methods
  async submitContactForm(formData: {
    name: string;
    email: string;
    subject?: string;
    message: string;
    file?: File;
  }): Promise<ApiResponse<void>> {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('message', formData.message);
    
    if (formData.subject) {
      data.append('subject', formData.subject);
    }
    
    if (formData.file) {
      data.append('file', formData.file);
    }

    return this.makeRequest<void>('POST', '/api/contact/submit', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  // WhatsApp integration methods
  async generateWhatsAppLink(
    message: string,
    phoneNumber: string = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890'
  ): Promise<string> {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  }

  async logWhatsAppInteraction(action: 'click' | 'redirect', message: string): Promise<void> {
    try {
      await this.makeRequest('POST', '/api/analytics/whatsapp', {
        action,
        message,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      // Don't throw errors for analytics logging
      console.warn('Failed to log WhatsApp interaction:', error);
    }
  }

  // Health check methods
  async healthCheck(): Promise<ApiResponse<{ status: string; version: string }>> {
    return this.makeRequest('GET', '/api/health');
  }

  async getApiStatus(): Promise<ApiResponse<{
    api: boolean;
    database: boolean;
    rasa: boolean;
    whatsapp: boolean;
  }>> {
    return this.makeRequest('GET', '/api/status');
  }
}

// Create a singleton instance
const apiClient = new ApiClient();

// Load authentication token from localStorage on initialization
if (typeof window !== 'undefined') {
  apiClient.loadAuthFromStorage();
}

export default apiClient;