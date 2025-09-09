import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { ChatSession, Message, SendMessageRequest } from '@/lib/types/chat';
import { ObjectId } from 'mongodb';
import { nanoid } from 'nanoid';

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

    if (!ObjectId.isValid(sessionId)) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Get the session to check if it exists and get context
    const session = await db
      .collection<ChatSession>('chat_sessions')
      .findOne({ _id: new ObjectId(sessionId), userId, isActive: true });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Create user message
    const userMessage: Message = {
      _id: nanoid(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
    };

    // Add user message to session
    await db
      .collection<ChatSession>('chat_sessions')
      .updateOne(
        { _id: new ObjectId(sessionId) },
        {
          $push: { messages: userMessage },
          $set: {
            updatedAt: new Date(),
            'metadata.lastActivity': new Date(),
          },
          $inc: { 'metadata.totalMessages': 1 }
        }
      );

    // Generate AI response (this would normally call RASA or OpenAI)
    const aiResponse = await generateAIResponse(message, session.language, session.messages);

    // Create AI message
    const aiMessage: Message = {
      _id: nanoid(),
      role: 'ai',
      content: aiResponse,
      timestamp: new Date(),
      metadata: {
        model: 'arogya-ai-v1',
        confidence: 0.95,
      },
    };

    // Add AI message to session
    await db
      .collection<ChatSession>('chat_sessions')
      .updateOne(
        { _id: new ObjectId(sessionId) },
        {
          $push: { messages: aiMessage },
          $set: {
            updatedAt: new Date(),
            'metadata.lastActivity': new Date(),
          },
          $inc: { 'metadata.totalMessages': 1 }
        }
      );

    // Generate title if this is the first user message
    if (session.messages.length === 0 && session.title === 'New Chat') {
      const generatedTitle = generateChatTitle(message);
      await db
        .collection<ChatSession>('chat_sessions')
        .updateOne(
          { _id: new ObjectId(sessionId) },
          { $set: { title: generatedTitle } }
        );
    }

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

// Helper function to generate AI response
async function generateAIResponse(
  userMessage: string,
  language: string,
  conversationHistory: Message[]
): Promise<string> {
  // This is a simple rule-based response for demonstration
  // In production, this would call your RASA backend or OpenAI API
  
  const lowerMessage = userMessage.toLowerCase();
  
  // Health-related responses based on language
  const responses = {
    en: {
      fever: "I understand you're experiencing fever. Here are some general recommendations:\n\n1. Rest and stay hydrated\n2. Monitor your temperature regularly\n3. Take paracetamol if needed (follow dosage instructions)\n4. If fever persists for more than 3 days or exceeds 103°F, please consult a doctor immediately.\n\n⚠️ This is general advice. For persistent symptoms, please seek medical attention.",
      headache: "For headache relief, consider these steps:\n\n1. Rest in a quiet, dark room\n2. Apply a cold or warm compress\n3. Stay hydrated\n4. Avoid screens for a while\n5. Gentle neck and shoulder stretches may help\n\nIf headaches are severe, frequent, or accompanied by other symptoms, please consult a healthcare provider.",
      cough: "For cough management:\n\n1. Stay hydrated with warm liquids\n2. Honey and warm water can be soothing\n3. Avoid irritants like smoke\n4. Use a humidifier if air is dry\n5. Rest your voice\n\nSeek medical attention if cough persists for more than 2 weeks, produces blood, or is accompanied by high fever.",
      default: "Thank you for your question. I'm here to provide general health guidance. Based on your symptoms, I'd recommend consulting with a healthcare professional for proper diagnosis and treatment.\n\nFor immediate medical assistance, you can also reach out through WhatsApp. Is there anything specific about your symptoms you'd like to discuss?"
    },
    hi: {
      fever: "मैं समझता हूं कि आपको बुखार है। यहां कुछ सामान्य सुझाव हैं:\n\n1. आराम करें और हाइड्रेटेड रहें\n2. नियमित रूप से अपना तापमान चेक करें\n3. जरूरत पड़ने पर पैरासिटामोल लें\n4. अगर बुखार 3 दिन से ज्यादा रहे या 103°F से ज्यादा हो, तो तुरंत डॉक्टर से मिलें।\n\n⚠️ यह सामान्य सलाह है। लगातार लक्षणों के लिए चिकित्सा सहायता लें।",
      headache: "सिर दर्द के लिए:\n\n1. शांत, अंधेरे कमरे में आराम करें\n2. ठंडी या गर्म सिकाई करें\n3. पानी पिएं\n4. स्क्रीन से बचें\n5. गर्दन और कंधे की हल्की मालिश करें\n\nअगर सिर दर्द गंभीर या बार-बार हो, तो डॉक्टर से मिलें।",
      cough: "खांसी के लिए:\n\n1. गर्म तरल पदार्थ पिएं\n2. शहद और गर्म पानी लें\n3. धुएं से बचें\n4. हवा में नमी बनाए रखें\n5. आवाज को आराम दें\n\nअगर खांसी 2 हफ्ते से ज्यादा रहे, तो डॉक्टर से मिलें।",
      default: "आपके प्रश्न के लिए धन्यवाद। मैं सामान्य स्वास्थ्य सलाह प्रदान करता हूं। उचित निदान और उपचार के लिए किसी स्वास्थ्य पेशेवर से सलाह लें।"
    },
    od: {
      fever: "ମୁଁ ବୁଝୁଛି ଆପଣଙ୍କର ଜ୍ୱର ହୋଇଛି। ଏଠାରେ କିଛି ସାଧାରଣ ସୁପାରିଶ:\n\n1. ବିଶ୍ରାମ ନିଅନ୍ତୁ ଏବଂ ପାଣି ପିଅନ୍ତୁ\n2. ନିୟମିତ ତାପମାତ୍ରା ଯାଞ୍ଚ କରନ୍ତୁ\n3. ଆବଶ୍ୟକ ହେଲେ ପାରାସିଟାମଲ ନିଅନ୍ତୁ\n4. ଯଦି ଜ୍ୱର 3 ଦିନରୁ ଅଧିକ ରହେ, ତୁରନ୍ତ ଡାକ୍ତରଙ୍କୁ ଦେଖାନ୍ତୁ।\n\n⚠️ ଏହା ସାଧାରଣ ପରାମର୍ଶ। ଲଗାତାର ଲକ୍ଷଣ ପାଇଁ ଚିକିତ୍ସା ସହାୟତା ନିଅନ୍ତୁ।",
      headache: "ମୁଣ୍ଡ ବ୍ୟଥା ପାଇଁ:\n\n1. ଶାନ୍ତ, ଅନ୍ଧାର କୋଠରୀରେ ବିଶ୍ରାମ ନିଅନ୍ତୁ\n2. ଥଣ୍ଡା କିମ୍ବା ଗରମ ସେକ ଦିଅନ୍ତୁ\n3. ପାଣି ପିଅନ୍ତୁ\n4. ସ୍କ୍ରିନରୁ ଦୂରେ ରୁହନ୍ତୁ\n5. ବେକ ଏବଂ କାନ୍ଧର ହାଲକା ମାଲିସ କରନ୍ତୁ\n\nଯଦି ମୁଣ୍ଡ ବ୍ୟଥା ଗମ୍ଭୀର ହୁଏ, ଡାକ୍ତରଙ୍କୁ ଦେଖାନ୍ତୁ।",
      cough: "କାଶ ପାଇଁ:\n\n1. ଗରମ ତରଳ ପଦାର୍ଥ ପିଅନ୍ତୁ\n2. ମହୁ ଏବଂ ଗରମ ପାଣି ନିଅନ୍ତୁ\n3. ଧୂଆଁରୁ ଦୂରେ ରୁହନ୍ତୁ\n4. ବାୟୁରେ ଆର୍ଦ୍ରତା ବଜାୟ ରଖନ୍ତୁ\n5. ଆୱାଜକୁ ବିଶ୍ରାମ ଦିଅନ୍ତୁ\n\nଯଦି କାଶ 2 ସପ୍ତାହରୁ ଅଧିକ ରହେ, ଡାକ୍ତରଙ୍କୁ ଦେଖାନ୍ତୁ।",
      default: "ଆପଣଙ୍କ ପ୍ରଶ୍ନ ପାଇଁ ଧନ୍ୟବାଦ। ମୁଁ ସାଧାରଣ ସ୍ୱାସ୍ଥ୍ୟ ପରାମର୍ଶ ପ୍ରଦାନ କରେ। ସଠିକ୍ ନିରାକରଣ ଏବଂ ଚିକିତ୍ସା ପାଇଁ କୌଣସି ସ୍ୱାସ୍ଥ୍ୟ ପେଶାଦାରଙ୍କ ସହିତ ପରାମର୍ଶ କରନ୍ତୁ।"
    }
  };

  const langResponses = responses[language as keyof typeof responses] || responses.en;

  if (lowerMessage.includes('fever') || lowerMessage.includes('बुखार') || lowerMessage.includes('ଜ୍ୱର')) {
    return langResponses.fever;
  }
  
  if (lowerMessage.includes('headache') || lowerMessage.includes('सिर दर्द') || lowerMessage.includes('ମୁଣ୍ଡ ବ୍ୟଥା')) {
    return langResponses.headache;
  }
  
  if (lowerMessage.includes('cough') || lowerMessage.includes('खांसी') || lowerMessage.includes('କାଶ')) {
    return langResponses.cough;
  }
  
  return langResponses.default;
}

// Helper function to generate chat title
function generateChatTitle(firstMessage: string): string {
  const message = firstMessage.toLowerCase().trim();
  
  if (message.includes('fever') || message.includes('बुखार') || message.includes('ଜ୍ୱର')) {
    return 'Fever Query';
  }
  if (message.includes('headache') || message.includes('सिर दर्द') || message.includes('ମୁଣ୍ଡ ବ୍ୟଥା')) {
    return 'Headache Consultation';
  }
  if (message.includes('cough') || message.includes('खांसी') || message.includes('କାଶ')) {
    return 'Cough Treatment';
  }
  if (message.includes('pain') || message.includes('दर्द') || message.includes('ବ୍ୟଥା')) {
    return 'Pain Management';
  }
  
  // Generate title from first few words
  const words = firstMessage.split(' ').slice(0, 3);
  return words.join(' ').substring(0, 30) + (firstMessage.length > 30 ? '...' : '');
}