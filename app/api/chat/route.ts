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

export const runtime = 'edge'
export const preferredRegion = 'iad1'

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

async function processMessage(chatRequest: ChatRequest) {
  try {
    // Update status to processing
    chatRequest.status = 'processing';
    await redis.set(`chat:${chatRequest.id}`, JSON.stringify(chatRequest));
    
    // Initialize tools
    const retriever = new TavilySearchAPIRetriever({
      apiKey: process.env.TAVILY_API_KEY!,
      k: 5,
    });
    
    const chatModel = new ChatOpenAI({
      modelName: "gpt-4",
      temperature: 0.7,
      streaming: true,
    });
    
    const { messages, companyInfo } = chatRequest;
    const { companyName, websiteUrl } = companyInfo;
    
    // Perform Tavily search
    const searchQuery = `${companyName} company information products services pricing ${websiteUrl}`;
    const searchResults = await retriever.invoke(searchQuery);
    
    // Format search results
    const searchContext = searchResults
      .map((result: any) => result.pageContent)
      .join("\n\n");
    
    // Create system message with the same content as before
    const systemMessage = new SystemMessage(
      `You are an AI Customer Support Specialist for ${companyName}. 
      Use this context about the company: ${searchContext}

      Key Instructions:
      1. Be concise and results-focused - lead with specific metrics and ROI.
      2. Focus on our three core services:
         - AI Support Automation (70% reduction in support workload)
         - Workflow Automation (60% reduction in manual tasks)
         - AI Analytics & Insights (85% prediction accuracy)
      3. When discussing features, always connect them to business outcomes:
         - Support Automation: "24/7 customer support, 80% automated resolution"
         - Workflow Automation: "Reduce manual CRM/billing tasks by 60%"
         - Analytics: "Predict customer behavior with 85% accuracy"
      4. Use technical details to build credibility:
         - Mention our expertise with ChatGPT API, ML models, and automation pipelines
         - Describe specific integrations (Zendesk, HubSpot, Stripe)
      5. Always end with a clear next step or action item.
      6. CRITICAL - Consultation Handling:
         - When users express interest in a demo or consultation, ALWAYS direct them to our built-in consultation booking system
         - NEVER refer users to external websites or company URLs
         - Use the following format for consultation responses:
           "I'd be happy to help you schedule a consultation. You can book a time right now by clicking the 'Book Free Consultation' button above, or I can guide you through our quick booking process. Would you like me to help you schedule a consultation?"
         - If they say yes, respond with:
           "Great! Just click the 'Book Free Consultation' button at the top of our chat, and you'll be able to choose a time that works best for you. Our team will walk you through a personalized demo of how our AI solutions can benefit your business."

      Remember: Focus on concrete results and technical expertise while maintaining a helpful, consultative tone.`
    );
    
    // Convert messages to LangChain format
    const formattedMessages = messages.map((msg: ChatMessage) => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      }
      return new AIMessage(msg.content);
    });
    
    // Get response from the model
    const response = await chatModel.call([
      systemMessage,
      ...formattedMessages,
    ]);
    
    // Extract and validate response
    const responseContent = typeof response.content === 'string' 
      ? response.content 
      : JSON.stringify(response.content);
    
    // Update chat request with result
    chatRequest.status = 'completed';
    chatRequest.result = responseContent;
    await redis.set(`chat:${chatRequest.id}`, JSON.stringify(chatRequest));
    
    return chatRequest;
  } catch (error) {
    chatRequest.status = 'failed';
    chatRequest.error = error instanceof Error ? error.message : 'Unknown error occurred';
    await redis.set(`chat:${chatRequest.id}`, JSON.stringify(chatRequest));
    throw error;
  }
}

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
    
    // Store the initial request in Redis
    await redis.set(`chat:${requestId}`, JSON.stringify(chatRequest));
    
    // Process the message directly in the edge function
    const processedRequest = await processMessage(chatRequest);
    
    return NextResponse.json(processedRequest);
    
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
}

// Status check endpoint remains the same
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
