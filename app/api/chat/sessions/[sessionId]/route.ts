import { NextRequest, NextResponse } from 'next/server';
import { ChatSession, Message } from '@/lib/types/chat';

// GET /api/chat/sessions/[sessionId] - Get specific chat session and messages from FastAPI
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await context.params;
    const convoId = parseInt(sessionId);
    
    if (isNaN(convoId)) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    
    // Fetch conversation messages from SQLite on the backend
    const response = await fetch(`${apiBaseUrl}/api/conversation/${convoId}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }
    
    const data = await response.json();
    
    // Map backend SQLite messages to frontend Message shape
    const messages: Message[] = (data.messages || []).map((msg: any, idx: number) => ({
      _id: idx.toString(),
      role: msg.role === 'assistant' ? 'ai' : 'user',
      content: msg.content,
      timestamp: new Date(),
    }));

    const session: ChatSession = {
      _id: sessionId,
      userId: 'user',
      title: 'Active Chat',
      language: 'en',
      messages,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      metadata: {
        totalMessages: messages.length,
        lastActivity: new Date(),
      }
    };

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error fetching chat session from server:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat session' },
      { status: 500 }
    );
  }
}

// PATCH /api/chat/sessions/[sessionId] - Mock update chat session
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await context.params;
    const updates = await request.json();

    const session: ChatSession = {
      _id: sessionId,
      userId: 'user',
      title: updates.title || 'Updated Chat',
      language: 'en',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error updating chat session:', error);
    return NextResponse.json(
      { error: 'Failed to update chat session' },
      { status: 500 }
    );
  }
}

// DELETE /api/chat/sessions/[sessionId] - Mock delete chat session
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat session:', error);
    return NextResponse.json(
      { error: 'Failed to delete chat session' },
      { status: 500 }
    );
  }
}