import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { ChatSession, CreateChatSessionRequest } from '@/lib/types/chat';
import { ObjectId } from 'mongodb';
import { nanoid } from 'nanoid';

// GET /api/chat/sessions - Get all chat sessions for a user
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

    const { db } = await connectToDatabase();
    const sessions = await db
      .collection<ChatSession>('chat_sessions')
      .find(
        { userId, isActive: true },
        { sort: { updatedAt: -1 } }
      )
      .toArray();

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat sessions' },
      { status: 500 }
    );
  }
}

// POST /api/chat/sessions - Create a new chat session
export async function POST(request: NextRequest) {
  try {
    const body: CreateChatSessionRequest = await request.json();
    const { userId, language, initialMessage } = body;

    if (!userId || !language) {
      return NextResponse.json(
        { error: 'User ID and language are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const newSession: Omit<ChatSession, '_id'> = {
      userId,
      title: 'New Chat',
      language,
      messages: initialMessage ? [{
        _id: nanoid(),
        role: 'user',
        content: initialMessage,
        timestamp: new Date(),
      }] : [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      metadata: {
        totalMessages: initialMessage ? 1 : 0,
        lastActivity: new Date(),
      },
    };

    const result = await db
      .collection<ChatSession>('chat_sessions')
      .insertOne(newSession);

    const session = {
      ...newSession,
      _id: result.insertedId,
    };

    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    console.error('Error creating chat session:', error);
    return NextResponse.json(
      { error: 'Failed to create chat session' },
      { status: 500 }
    );
  }
}