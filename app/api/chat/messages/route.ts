import { NextRequest, NextResponse } from 'next/server';
import { Message, SendMessageRequest } from '@/lib/types/chat';
import { nanoid } from 'nanoid';
import { getUser } from '@/lib/db/queries';

// POST /api/chat/messages - Send a message and get AI response
export async function POST(request: NextRequest) {
  try {
    const body: SendMessageRequest = await request.json();
    const { sessionId, message, userId } = body;

    if (!sessionId || !message || !userId) {
      return NextResponse.json(
        { error: 'Session ID, message, and user ID are required' },
        { status: 400 }
      );
    }

    const convoId = parseInt(sessionId);
    if (isNaN(convoId)) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    // Get authenticated user phone number
    const activeUser = await getUser();
    const phone_number = activeUser && 'phone_number' in activeUser && activeUser.phone_number
      ? activeUser.phone_number
      : '+910000000000'; // Default guest number

    // Generate AI response by calling the FastAPI server
    let aiResponse = '';
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    
    try {
      const apiResponse = await fetch(`${apiBaseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          phone_number,
          message: message.trim(),
          conversation_id: convoId,
          history: [], // Let the server resolve history from SQLite using conversation_id
        }),
      });

      if (apiResponse.ok) {
        const data = await apiResponse.json();
        aiResponse = data.response;
      } else {
        const errorText = await apiResponse.text();
        console.error('FastAPI error response:', errorText);
        aiResponse = 'I am sorry, I encountered an error communicating with the healthcare server. Please try again.';
      }
    } catch (fetchError) {
      console.error('Failed to fetch from FastAPI server:', fetchError);
      aiResponse = 'The healthcare server appears to be offline. Please verify the backend is running.';
    }

    // Create user message
    const userMessage: Message = {
      _id: nanoid(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
    };

    // Create AI message
    const aiMessage: Message = {
      _id: nanoid(),
      role: 'ai',
      content: aiResponse,
      timestamp: new Date(),
      metadata: {
        model: 'arogya-ai-coordinator',
        confidence: 0.98,
      },
    };

    return NextResponse.json({
      userMessage,
      aiMessage,
      success: true
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}