import { NextRequest, NextResponse } from 'next/server';
import { ChatSession, CreateChatSessionRequest } from '@/lib/types/chat';

// GET /api/chat/sessions - Get all chat sessions for a user from FastAPI backend
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (userId === 'guest_user') {
      return NextResponse.json({ sessions: [] });
    }

    // Clean guest/phone prefixes
    const phone_number = userId.startsWith('phone_') ? userId.replace('phone_', '') : userId;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    
    // Fetch conversations list from FastAPI (backed by SQLite/Redis)
    const response = await fetch(`${apiBaseUrl}/api/conversations/${phone_number}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`FastAPI responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    const conversations = data.conversations || [];
    
    // Map backend SQLite conversations to frontend ChatSession objects
    const sessions: ChatSession[] = conversations.map((convo: any) => ({
      _id: convo.id.toString(),
      userId,
      title: convo.title || 'New Chat',
      language: 'en',
      messages: [],
      createdAt: new Date(convo.updated_at),
      updatedAt: new Date(convo.updated_at),
      isActive: true,
    }));

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Error fetching chat sessions from server:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat sessions' },
      { status: 500 }
    );
  }
}

// POST /api/chat/sessions - Create a new chat session on FastAPI backend
export async function POST(request: NextRequest) {
  try {
    const body: CreateChatSessionRequest = await request.json();
    const { userId, language } = body;

    if (!userId || !language) {
      return NextResponse.json(
        { error: 'User ID and language are required' },
        { status: 400 }
      );
    }

    const phone_number = userId.startsWith('phone_') ? userId.replace('phone_', '') : userId;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    
    // Create new conversation in SQLite on the backend
    const response = await fetch(`${apiBaseUrl}/api/conversation/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number,
        title: 'New Chat',
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create conversation on FastAPI backend: ${response.status}`);
    }
    
    const data = await response.json();
    const convoId = data.conversation_id;

    const session: ChatSession = {
      _id: convoId.toString(),
      userId,
      title: 'New Chat',
      language,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      metadata: {
        totalMessages: 0,
        lastActivity: new Date(),
      },
    };

    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    console.error('Error creating chat session on server:', error);
    return NextResponse.json(
      { error: 'Failed to create chat session' },
      { status: 500 }
    );
  }
}