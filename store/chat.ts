import { create } from "zustand";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

export interface CompanyInfo {
  companyName: string;
  websiteUrl: string;
}

interface ChatState {
  messages: Message[];
  companyInfo: CompanyInfo | null;
  isLoading: boolean;
  error: string | null;

  setCompanyInfo: (info: CompanyInfo) => void;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  messages: [],
  companyInfo: null,
  isLoading: false,
  error: null,

  setCompanyInfo: (info) => set({ companyInfo: info }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearChat: () =>
    set({
      messages: [],
      companyInfo: null,
      error: null,
    }),
}));
