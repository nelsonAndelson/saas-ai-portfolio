import { Redis } from '@upstash/redis'
import { ChatOpenAI } from "@langchain/openai";
import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

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

async function processMessage(requestId: string) {
  try {
    // Get the chat request from Redis
    const chatRequestStr = await redis.get(`chat:${requestId}`);
    if (!chatRequestStr) {
      throw new Error('Chat request not found');
    }
    
    const chatRequest = JSON.parse(chatRequestStr);
    const { messages, companyInfo } = chatRequest;
    const { companyName, websiteUrl } = companyInfo;
    
    // Update status to processing
    chatRequest.status = 'processing';
    await redis.set(`chat:${requestId}`, JSON.stringify(chatRequest));
    
    // Perform Tavily search
    const searchQuery = `${companyName} company information products services pricing ${websiteUrl}`;
    const searchResults = await retriever.invoke(searchQuery);
    
    // Format search results
    const searchContext = searchResults
      .map((result: any) => result.pageContent)
      .join("\n\n");
    
    // Create system message
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
    const formattedMessages = messages.map((msg: any) => {
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
    await redis.set(`chat:${requestId}`, JSON.stringify(chatRequest));
    
  } catch (error) {
    // Update chat request with error
    const chatRequestStr = await redis.get(`chat:${requestId}`);
    if (chatRequestStr) {
      const chatRequest = JSON.parse(chatRequestStr);
      chatRequest.status = 'failed';
      chatRequest.error = error instanceof Error ? error.message : 'Unknown error occurred';
      await redis.set(`chat:${requestId}`, JSON.stringify(chatRequest));
    }
    
    console.error('Error processing message:', error);
  }
}

// Main worker loop
async function workerLoop() {
  while (true) {
    try {
      // Get next request from queue
      const requestId = await redis.rpop('chat:queue');
      
      if (requestId) {
        await processMessage(requestId);
      } else {
        // No messages to process, wait before checking again
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error('Worker error:', error);
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

// Start the worker
workerLoop(); 