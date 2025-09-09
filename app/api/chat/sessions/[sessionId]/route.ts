import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { ChatSession } from '@/lib/types/chat';
import { ObjectId } from 'mongodb';

// GET /api/chat/sessions/[sessionId] - Get specific chat session
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;

    if (!ObjectId.isValid(sessionId)) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const session = await db
      .collection<ChatSession>('chat_sessions')
      .findOne({ _id: new ObjectId(sessionId), isActive: true });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error fetching chat session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat session' },
      { status: 500 }
    );
  }
}

// PATCH /api/chat/sessions/[sessionId] - Update chat session
export async function PATCH(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;
    const updates = await request.json();

    if (!ObjectId.isValid(sessionId)) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    const result = await db
      .collection<ChatSession>('chat_sessions')
      .updateOne(
        { _id: new ObjectId(sessionId), isActive: true },
        { $set: updateData }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const updatedSession = await db
      .collection<ChatSession>('chat_sessions')
      .findOne({ _id: new ObjectId(sessionId) });

    return NextResponse.json({ session: updatedSession });
  } catch (error) {
    console.error('Error updating chat session:', error);
    return NextResponse.json(
      { error: 'Failed to update chat session' },
      { status: 500 }
    );
  }
}

// DELETE /api/chat/sessions/[sessionId] - Soft delete chat session
export async function DELETE(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;

    if (!ObjectId.isValid(sessionId)) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const result = await db
      .collection<ChatSession>('chat_sessions')
      .updateOne(
        { _id: new ObjectId(sessionId) },
        { 
          $set: { 
            isActive: false,
            updatedAt: new Date()
          }
        }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
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