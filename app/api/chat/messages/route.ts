import { NextRequest, NextResponse } from 'next/server';
import { Message, SendMessageRequest } from '@/lib/types/chat';
import { nanoid } from 'nanoid';
import { getUser } from '@/lib/db/queries';

// Generate a smart conversation title from the first user message
function generateTitle(message: string): string {
  // Remove extra whitespace and truncate
  const cleaned = message.trim().replace(/\s+/g, ' ');
  // Capitalize first letter and truncate to 50 chars
  const truncated = cleaned.length > 50 ? cleaned.slice(0, 47) + '...' : cleaned;
  return truncated.charAt(0).toUpperCase() + truncated.slice(1);
}

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

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

    // Check if this is the first message in the conversation
    // (used to auto-set conversation title)
    let isFirstMessage = false;
    let updatedTitle: string | null = null;
    try {
      const historyRes = await fetch(`${apiBaseUrl}/api/conversation/${convoId}`, { cache: 'no-store' });
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        const existingMessages = historyData.messages || [];
        isFirstMessage = existingMessages.length === 0;
      }
    } catch (_) {
      // ignore — non-critical
    }

    // Generate AI response by calling the FastAPI server
    let aiResponse = '';
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

    // Auto-update conversation title from first message
    if (isFirstMessage && message.trim()) {
      const newTitle = generateTitle(message.trim());
      try {
        const titleRes = await fetch(`${apiBaseUrl}/api/conversation/${convoId}/title`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle }),
        });
        if (titleRes.ok) {
          updatedTitle = newTitle;
        }
      } catch (_) {
        // ignore — non-critical
      }
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
      success: true,
      // Return updated title so frontend can refresh sidebar without a full reload
      updatedTitle,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}