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
      _id: msg.id?.toString() || idx.toString(),
      role: msg.role === 'assistant' ? 'ai' : 'user',
      content: msg.content,
      timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
      isHistorical: true, // Bypass typewriter animations on load
    }));

    const session: ChatSession = {
      _id: sessionId,
      userId: data.phone_number || 'user',
      title: data.title || 'Chat',
      language: 'en',
      messages,
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
      updatedAt: data.updated_at ? new Date(data.updated_at) : new Date(),
      isActive: true,
      metadata: {
        totalMessages: messages.length,
        lastActivity: messages.length > 0 
          ? messages[messages.length - 1].timestamp 
          : new Date(),
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

// PATCH /api/chat/sessions/[sessionId] - Update chat session title
export async function PATCH(
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

    const updates = await request.json();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

    const response = await fetch(`${apiBaseUrl}/api/conversation/${convoId}/title`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: updates.title }),
    });

    if (!response.ok) {
      throw new Error(`FastAPI responded with status: ${response.status}`);
    }

    return NextResponse.json({ success: true, title: updates.title });
  } catch (error) {
    console.error('Error updating chat session title:', error);
    return NextResponse.json(
      { error: 'Failed to update chat session title' },
      { status: 500 }
    );
  }
}

// DELETE /api/chat/sessions/[sessionId] - Delete chat session
export async function DELETE(
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

    const response = await fetch(`${apiBaseUrl}/api/conversation/${convoId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`FastAPI responded with status: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat session:', error);
    return NextResponse.json(
      { error: 'Failed to delete chat session' },
      { status: 500 }
    );
  }
}