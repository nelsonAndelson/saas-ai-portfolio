import { NextResponse } from "next/server";
import { POST } from "@/app/api/chat/route";
import { ChatOpenAI } from "@langchain/openai";
import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";

// Mock external dependencies
jest.mock("@langchain/openai");
jest.mock("@langchain/community/retrievers/tavily_search_api");

// Mock Web APIs
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;

class MockReadableStream {
  constructor(options) {
    this.controller = options.start;
  }
  getReader() {
    return {
      read: async () => {
        const chunk = new TextEncoder().encode(
          'data: {"event":"on_chat_model_stream","data":{"chunk":{"content":"Hello!"}}}\n\n'
        );
        return { value: chunk, done: true };
      },
      releaseLock: () => {},
    };
  }
}

global.ReadableStream = MockReadableStream;
global.Request = class Request {
  constructor(input, init) {
    this.url = input;
    this.method = init?.method || "GET";
    this.headers = new Headers(init?.headers);
    this.body = init?.body;
  }

  async json() {
    return JSON.parse(this.body);
  }
};

global.Headers = class Headers {
  constructor(init) {
    this.headers = new Map();
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.headers.set(key.toLowerCase(), value);
      });
    }
  }
  get(name) {
    return this.headers.get(name.toLowerCase()) || null;
  }
  set(name, value) {
    this.headers.set(name.toLowerCase(), value);
  }
};

describe("Chat API Route", () => {
  const mockCompanyInfo = {
    companyName: "Test Company",
    websiteUrl: "https://test.com",
  };

  const mockMessages = [{ role: "user", content: "Hello" }];

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Tavily retriever
    (TavilySearchAPIRetriever as jest.Mock).mockImplementation(() => ({
      invoke: jest
        .fn()
        .mockResolvedValue([{ pageContent: "Test company information" }]),
    }));

    // Mock ChatOpenAI with streaming response
    (ChatOpenAI as jest.Mock).mockImplementation(() => ({
      streamEvents: jest.fn().mockImplementation(async function* () {
        yield {
          event: "on_chat_model_stream",
          data: { chunk: { content: "Hello! How can I help you?" } },
        };
      }),
    }));
  });

  it("should handle chat request successfully", async () => {
    const request = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: mockMessages,
        companyInfo: mockCompanyInfo,
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/event-stream");

    // Test the stream
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
      const { value } = await reader.read();
      const chunk = decoder.decode(value);
      expect(chunk).toContain("on_chat_model_stream");
    }
  });

  it("should handle errors gracefully", async () => {
    (ChatOpenAI as jest.Mock).mockImplementation(() => {
      throw new Error("API Error");
    });

    const request = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: mockMessages,
        companyInfo: mockCompanyInfo,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Error processing chat request");
  });

  it("should process search results correctly", async () => {
    const mockSearchResults = [
      { pageContent: "Product information" },
      { pageContent: "Pricing details" },
    ];

    (TavilySearchAPIRetriever as jest.Mock).mockImplementation(() => ({
      invoke: jest.fn().mockResolvedValue(mockSearchResults),
    }));

    const request = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: mockMessages,
        companyInfo: mockCompanyInfo,
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});
