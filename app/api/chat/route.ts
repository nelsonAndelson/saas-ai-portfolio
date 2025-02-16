import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  id: string;
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
    console.log("Chat API: Request received");
    const { messages, companyInfo } = await req.json();
    const { companyName, websiteUrl } = companyInfo;
    
    console.log("Chat API: Company info:", { companyName, websiteUrl });
    console.log("Chat API: Messages received:", messages);

    // Initialize tools
    console.log("Chat API: Initializing Tavily retriever");
    const retriever = initTavilyRetriever();
    console.log("Chat API: Initializing ChatOpenAI");
    const chatModel = initChatModel();

    // Perform Tavily search for company information
    const searchQuery = `${companyName} company information products services pricing ${websiteUrl}`;
    console.log("Chat API: Performing Tavily search with query:", searchQuery);
    const searchResults = await retriever.invoke(searchQuery) as TavilySearchResult[];
    console.log("Chat API: Search results received:", searchResults);

    // Format search results for context
    const searchContext = searchResults
      .map((result: TavilySearchResult) => result.pageContent)
      .join("\n\n");
    console.log("Chat API: Formatted search context length:", searchContext.length);

    // Create system message with company context
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
    console.log("Chat API: System message created");

    // Convert incoming messages to LangChain format
    console.log("Chat API: Converting messages to LangChain format");
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

    // Extract the content as string
    const responseContent = typeof response.content === 'string' 
      ? response.content 
      : JSON.stringify(response.content);

    // Validate and potentially modify the response
    const validatedResponse = validateConsultationResponse(responseContent);

    return NextResponse.json({ content: validatedResponse });
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
}
