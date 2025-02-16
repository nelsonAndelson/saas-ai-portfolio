import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChatInterface } from "@/app/components/chat/ChatInterface";
import { useChatStore } from "@/store/chat";
import { act } from "react";

// Mock nanoid
jest.mock("nanoid", () => ({
  nanoid: () => "test-id",
}));

// Mock the fetch function
global.fetch = jest.fn();

// Mock ReadableStream
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

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe("ChatInterface", () => {
  beforeEach(() => {
    act(() => {
      useChatStore.setState({
        messages: [],
        companyInfo: null,
        isLoading: false,
        error: null,
      });
    });

    (global.fetch as jest.Mock).mockReset();
    (window.HTMLElement.prototype.scrollIntoView as jest.Mock).mockReset();
  });

  it("should render company info form initially", () => {
    render(<ChatInterface />);

    expect(
      screen.getByRole("textbox", { name: /company name/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /website url/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /start demo/i })
    ).toBeInTheDocument();
  });

  it("should handle company info submission", async () => {
    render(<ChatInterface />);

    const companyNameInput = screen.getByRole("textbox", {
      name: /company name/i,
    });
    const websiteUrlInput = screen.getByRole("textbox", {
      name: /website url/i,
    });
    const submitButton = screen.getByRole("button", { name: /start demo/i });

    fireEvent.change(companyNameInput, { target: { value: "Test Company" } });
    fireEvent.change(websiteUrlInput, {
      target: { value: "https://test.com" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Thanks for providing your company information!/)
      ).toBeInTheDocument();
    });
  });

  it("should handle message sending", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: new MockReadableStream({
        start(controller) {},
      }),
      headers: new Headers({
        "Content-Type": "text/event-stream",
      }),
    });

    act(() => {
      useChatStore.setState({
        companyInfo: {
          companyName: "Test Company",
          websiteUrl: "https://test.com",
        },
      });
    });

    render(<ChatInterface />);

    const input = screen.getByRole("textbox", { name: /message/i });
    const sendButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/chat",
        expect.any(Object)
      );
    });

    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it("should display error message when API call fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

    act(() => {
      useChatStore.setState({
        companyInfo: {
          companyName: "Test Company",
          websiteUrl: "https://test.com",
        },
      });
    });

    render(<ChatInterface />);

    const input = screen.getByRole("textbox", { name: /message/i });
    const sendButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText("API Error")).toBeInTheDocument();
    });
  });

  it("should show typing animation while loading", async () => {
    act(() => {
      useChatStore.setState({
        companyInfo: {
          companyName: "Test Company",
          websiteUrl: "https://test.com",
        },
        isLoading: true,
      });
    });

    render(<ChatInterface />);
    expect(screen.getByTestId("typing-animation")).toBeInTheDocument();
  });
});
