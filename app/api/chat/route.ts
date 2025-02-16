import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { Redis } from '@upstash/redis'
import { nanoid } from 'nanoid'

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

interface ChatRequest {
  id: string;
  messages: ChatMessage[];
  companyInfo: {
    companyName: string;
    websiteUrl: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: string;
  error?: string;
  createdAt: number;
}

interface TavilySearchResult {
  pageContent: string;
  metadata: {
    [key: string]: unknown;
  };
}

// Initialize Tavily retriever
const initTavilyRetriever = () => {
  return new TavilySearchAPIRetriever({
    apiKey: process.env.TAVILY_API_KEY!,
    k: 5, // Number of results to retrieve
  });
};

// Initialize ChatOpenAI
const initChatModel = () => {
  return new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0.7,
    streaming: true,
  });
};

// Add validation function before the response is sent
const validateConsultationResponse = (response: string | { type: string; text: string }[] | undefined): string => {
  // Convert complex message content to string if needed
  const responseText = typeof response === 'string' 
    ? response 
    : Array.isArray(response)
    ? response.map(r => typeof r === 'string' ? r : r.text).join(' ')
    : '';

  // Check if this is a consultation-related response
  const consultationKeywords = ['demo', 'schedule', 'booking', 'consultation', 'appointment'];
  const isConsultationResponse = consultationKeywords.some(keyword => 
    responseText.toLowerCase().includes(keyword)
  );

  // Check if response contains any external URLs or website references
  const hasExternalUrls = /visit.*website|go to.*\.(?:com|io|net|org)|https?:\/\//.test(responseText.toLowerCase());

  if (isConsultationResponse && hasExternalUrls) {
    // Replace with our standard consultation response
    return `I'd be happy to help you schedule a consultation. You can book a time right now by clicking the 'Book Free Consultation' button above, or I can guide you through our quick booking process. Would you like me to help you schedule a consultation?`;
  }

  return responseText;
};

export async function POST(req: Request) {
  try {
    const { messages, companyInfo } = await req.json();
    
    // Generate a unique ID for this request
    const requestId = nanoid();
    
    // Create the chat request object
    const chatRequest: ChatRequest = {
      id: requestId,
      messages,
      companyInfo,
      status: 'pending',
      createdAt: Date.now(),
    };
    
    // Store the request in Redis
    await redis.set(`chat:${requestId}`, JSON.stringify(chatRequest));
    
    // Add to processing queue
    await redis.lpush('chat:queue', requestId);
    
    // Return immediately with the request ID
    return NextResponse.json({ 
      requestId,
      status: 'pending',
      message: 'Request queued for processing'
    });
    
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
}

// New endpoint to check status and get results
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get('requestId');
    
    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }
    
    const chatRequest = await redis.get(`chat:${requestId}`);
    
    if (!chatRequest) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(JSON.parse(chatRequest as string));
    
  } catch (error: unknown) {
    console.error("Status Check Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
}
