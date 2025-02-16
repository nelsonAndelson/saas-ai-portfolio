import { useChatStore } from "@/store/chat";
import { act } from "@testing-library/react";

describe("Chat Store", () => {
  beforeEach(() => {
    act(() => {
      useChatStore.setState({
        messages: [],
        companyInfo: null,
        isLoading: false,
        error: null,
      });
    });
  });

  it("should initialize with default state", () => {
    const state = useChatStore.getState();
    expect(state.messages).toEqual([]);
    expect(state.companyInfo).toBeNull();
    expect(state.isLoading).toBeFalsy();
    expect(state.error).toBeNull();
  });

  it("should set company info", () => {
    const companyInfo = {
      companyName: "Test Company",
      websiteUrl: "https://test.com",
    };

    act(() => {
      useChatStore.getState().setCompanyInfo(companyInfo);
    });

    const state = useChatStore.getState();
    expect(state.companyInfo).toEqual(companyInfo);
  });

  it("should add messages", () => {
    const message = {
      id: "test-id",
      role: "user" as const,
      content: "Hello",
    };

    act(() => {
      useChatStore.getState().addMessage(message);
    });

    const state = useChatStore.getState();
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0]).toEqual(message);
  });

  it("should set loading state", () => {
    act(() => {
      useChatStore.getState().setLoading(true);
    });

    const state = useChatStore.getState();
    expect(state.isLoading).toBeTruthy();
  });

  it("should set error state", () => {
    const errorMessage = "Test error";

    act(() => {
      useChatStore.getState().setError(errorMessage);
    });

    const state = useChatStore.getState();
    expect(state.error).toBe(errorMessage);
  });

  it("should clear chat", () => {
    // Set some initial state
    act(() => {
      useChatStore.setState({
        messages: [{ id: "1", role: "user", content: "Hello" }],
        companyInfo: {
          companyName: "Test Company",
          websiteUrl: "https://test.com",
        },
        error: "Some error",
      });
    });

    // Clear the chat
    act(() => {
      useChatStore.getState().clearChat();
    });

    const state = useChatStore.getState();
    expect(state.messages).toEqual([]);
    expect(state.companyInfo).toBeNull();
    expect(state.error).toBeNull();
  });

  it("should maintain message order", () => {
    const messages = [
      { id: "1", role: "user" as const, content: "Hello" },
      { id: "2", role: "assistant" as const, content: "Hi there" },
      { id: "3", role: "user" as const, content: "How are you?" },
    ];

    messages.forEach((message) => {
      act(() => {
        useChatStore.getState().addMessage(message);
      });
    });

    const state = useChatStore.getState();
    expect(state.messages).toHaveLength(3);
    expect(state.messages).toEqual(messages);
  });
});
