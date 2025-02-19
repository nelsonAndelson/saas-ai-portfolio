import { useState} from "react";
import { motion } from "framer-motion";
import { nanoid } from "nanoid";
import { useChatStore, Message, CompanyInfo } from "@/store/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const TypingAnimation = () => {
  return (
    <motion.div
      data-testid="typing-animation"
      className="flex space-x-1 h-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          className="w-1.5 h-1.5 bg-primary rounded-full"
          animate={{ y: ["0%", "-50%", "0%"] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: dot * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
};

const formatMessageContent = (content: string) => {
  const paragraphs = content.split('\n').filter(Boolean);
  
  return paragraphs.map((paragraph, index) => {
    // Handle consultation question styling
    if (paragraph.toLowerCase().includes("would you like") && 
        (paragraph.toLowerCase().includes("consultation") || paragraph.toLowerCase().includes("schedule"))) {
      return (
        <motion.div
          key={index}
          className="mb-4 p-3 bg-[#8C52FF]/10 rounded-lg border border-[#8C52FF]/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-white font-medium">
            {paragraph}
          </p>
        </motion.div>
      );
    }

    // Handle company name emphasis
    if (paragraph.includes("[COMPANY]")) {
      const [before, company, after] = paragraph.split(/\[COMPANY\](.*?)\[\/COMPANY\]/);
      return (
        <p key={index} className="mb-3">
          {before}
          <motion.span
            className="text-lg font-bold bg-gradient-to-r from-[#8C52FF] to-[#6C63FF] bg-clip-text text-transparent"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {company.toUpperCase()}
          </motion.span>
          {after}
        </p>
      );
    }

    // Handle cards section
    if (paragraph.includes("🤖") || paragraph.includes("⚡") || paragraph.includes("🚀") || paragraph.includes("📊")) {
      const [icon, title, description] = paragraph.split("|").map(s => s.trim());
      return (
        <motion.div
          key={index}
          className="flex items-start space-x-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200 mb-3"
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <span className="text-2xl">{icon}</span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-[#8C52FF]">{title}</div>
            <div className="text-sm text-white/70 mt-1">{description}</div>
          </div>
        </motion.div>
      );
    }

    if (paragraph.includes("For demonstration purposes:")) {
      return (
        <div key={index} className="mb-4">
          <div className="text-white font-medium mb-2">Demo Information</div>
          <div className="pl-3 border-l-2 border-[#8C52FF]/30 bg-[#8C52FF]/5 p-2 rounded-r-lg">
            {paragraph.replace("For demonstration purposes:", "").trim()}
          </div>
        </div>
      );
    }
    
    if (paragraph.includes("• ")) {
      const items = paragraph.split("• ").filter(Boolean);
      return (
        <div key={index} className="mb-4">
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="text-white mr-2 font-bold">•</span>
                <span>{item.trim()}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (paragraph.includes("Plan:") || paragraph.includes("$")) {
      return (
        <div key={index} className="mb-4 grid grid-cols-1 gap-2">
          {paragraph.split(",").map((price, i) => {
            const [plan, cost] = price.split(":").map(part => part.trim());
            return (
              <div
                key={i}
                className="bg-[#8C52FF]/10 p-3 rounded-lg flex items-center justify-between border border-[#8C52FF]/20"
              >
                <span className="font-medium text-white whitespace-nowrap">{plan}</span>
                <span className="text-white font-bold ml-3">
                  {cost || price.trim()}
                </span>
              </div>
            );
          })}
        </div>
      );
    }

    if (/^\d+\./.test(paragraph)) {
      return (
        <div key={index} className="mb-3 flex">
          <span className="text-white font-bold mr-2">
            {paragraph.split(".")[0]}.
          </span>
          <span>{paragraph.split(".").slice(1).join(".").trim()}</span>
        </div>
      );
    }

    return (
      <p key={index} className="mb-3">
        {paragraph}
      </p>
    );
  });
};

const ChatMessage = ({
  message,
  isTyping = false,
}: {
  message: Message;
  isTyping?: boolean;
}) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      className={`flex items-start space-x-3 ${
        isUser ? "flex-row-reverse space-x-reverse" : ""
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-[#8C52FF]" : "bg-white/20"
        }`}
      >
        <span className="text-sm">{isUser ? "👤" : "🤖"}</span>
      </div>
      <div className={`flex-1 ${isUser ? "text-right" : ""}`}>
        <div
          className={`inline-block max-w-[90%] ${
            isUser
              ? "bg-[#8C52FF] text-white ml-auto rounded-tr-none shadow-lg px-3 py-2"
              : "bg-white/10 backdrop-blur-sm text-white rounded-tl-none shadow-lg border border-white/10 px-4 py-3"
          } rounded-2xl`}
        >
          {isTyping ? (
            <TypingAnimation />
          ) : (
            <div className="text-sm space-y-2">
              {formatMessageContent(message.content)}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const CompanyInfoForm = ({
  onSubmit,
}: {
  onSubmit: (info: CompanyInfo) => void;
}) => {
  const [formData, setFormData] = useState<CompanyInfo>({
    companyName: "",
    websiteUrl: "",
  });
  const [urlError, setUrlError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidUrl(formData.websiteUrl)) {
      setUrlError("Please enter a valid website URL");
      return;
    }
    const formattedData = {
      ...formData,
      websiteUrl: formatWebsiteUrl(formData.websiteUrl),
    };
    onSubmit(formattedData);
  };

  const isValidUrl = (url: string): boolean => {
    if (!url) return false;
    // Basic URL validation pattern
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/i;
    return urlPattern.test(url);
  };

  const formatWebsiteUrl = (url: string): string => {
    if (!url) return url;
    url = url.trim();
    if (!url.match(/^https?:\/\//i)) {
      return `https://${url}`;
    }
    return url;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, websiteUrl: value }));
    
    // Clear error when user starts typing
    if (urlError) setUrlError("");
    
    // Validate URL as user types
    if (value && !isValidUrl(value)) {
      setUrlError("Please enter a valid website URL");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Company Name"
        value={formData.companyName}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, companyName: e.target.value }))
        }
        required
      />
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Website URL (e.g., example.com)"
          value={formData.websiteUrl}
          onChange={handleUrlChange}
          className={`${urlError ? 'border-red-500 focus:border-red-500' : ''}`}
          required
        />
        {urlError && (
          <p className="text-sm text-red-500">
            {urlError}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full">
        Start Demo
      </Button>
    </form>
  );
};

interface SuggestedQuestion {
  id: string;
  question: string;
}

// Add new interface for tracking interaction stages
interface InteractionStage {
  messageCount: number;
  hasShownInsights: boolean;
  hasShownConsultation: boolean;
  hasShownValue: boolean;
}

const ConsultationFAB = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.div
      className="absolute bottom-[72px] left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-white/10 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h4 className="text-white font-medium mb-1">Ready to Transform Your Support?</h4>
          <p className="text-white/70 text-sm">Schedule a personalized demo with our AI implementation experts.</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative group flex-shrink-0"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8C52FF] to-[#6C63FF] rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200" />
          <Button
            onClick={onClick}
            className="relative bg-background/50 hover:bg-background/60 text-white px-6 py-3 h-auto text-base font-medium whitespace-nowrap"
            size="lg"
          >
            Book Free 1-1 Consultation Call
            <motion.span
              className="ml-2 opacity-50 group-hover:opacity-100"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              →
            </motion.span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const ChatInterface = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>([]);
  const [interactionStage, setInteractionStage] = useState<InteractionStage>({
    messageCount: 0,
    hasShownInsights: false,
    hasShownConsultation: false,
    hasShownValue: false,
  });
  const [showConsultationFAB, setShowConsultationFAB] = useState(false);
  const {
    messages,
    companyInfo,
    isLoading,
    error,
    setCompanyInfo,
    addMessage,
    setLoading,
    setError,
  } = useChatStore();

  const handleCompanyInfo = async (info: CompanyInfo) => {
    setCompanyInfo(info);

    // Enhanced initial greeting with company emphasis and clean card format
    addMessage({
      id: nanoid(),
      role: "assistant",
      content: `Thanks for providing your company information! I'll be your AI support specialist for [COMPANY]${info.companyName}[/COMPANY]. I can help you understand our AI solutions and how they can benefit your business.

      🤖|AI Capabilities|Explore our cutting-edge AI features and integrations that can transform your customer support

      ⚡|Workflow Automation|Discover how we can automate your support processes for 24/7 customer service

      🚀|Implementation|Learn about our seamless integration process and typical implementation timeline

      📊|ROI & Metrics|See the potential cost savings and efficiency gains for your business`,
    });

    // More targeted suggested questions
    const questions = [
      {
        id: nanoid(),
        question: `What specific AI features could benefit ${info.companyName}?`,
      },
      {
        id: nanoid(),
        question: `How quickly can we implement AI support at ${info.companyName}?`,
      },
    ];
    setSuggestedQuestions(questions);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
    handleSendMessage(question);
  };

  const handleSendMessage = async (messageText?: string) => {
    const messageToSend = messageText || inputMessage;
    if (!messageToSend.trim() || !companyInfo) return;

    // Show consultation FAB if needed
    const consultationKeywords = ['consultation', 'demo', 'book', 'schedule', 'meeting', 'yes'];
    const isConsultationRelated = consultationKeywords.some(keyword => 
      messageToSend.toLowerCase().includes(keyword)
    );

    if (
      (messageToSend.toLowerCase().trim() === "yes" && interactionStage.hasShownConsultation) ||
      isConsultationRelated ||
      interactionStage.messageCount >= 2
    ) {
      setShowConsultationFAB(true);
    }

    // Increment message count
    setInteractionStage(prev => ({
      ...prev,
      messageCount: prev.messageCount + 1,
    }));

    // Add user message immediately
    const userMessage: Message = {
      id: nanoid(),
      role: "user",
      content: messageToSend,
    };
    addMessage(userMessage);
    setInputMessage("");
    setLoading(true);

    try {
      // Send message to API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          companyInfo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      const { requestId } = await response.json();
      
      // Poll for result
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`/api/chat?requestId=${requestId}`);
          if (!statusResponse.ok) {
            throw new Error('Failed to get message status');
          }
          
          const chatRequest = await statusResponse.json();
          
          if (chatRequest.status === 'completed') {
            clearInterval(pollInterval);
            setLoading(false);
      
      // Add AI response message
      addMessage({
        id: nanoid(),
        role: "assistant",
              content: chatRequest.result,
      });

            // Clear suggested questions after first question
      setSuggestedQuestions([]);

            // Handle insights and consultation prompts
      if (interactionStage.messageCount === 2 && !interactionStage.hasShownInsights) {
        setTimeout(() => {
          addMessage({
            id: nanoid(),
            role: "assistant",
            content: `Based on our conversation and my analysis of ${companyInfo.companyName}, I've identified some specific opportunities for AI implementation in your industry. Would you like me to share a detailed breakdown of potential automation areas and expected ROI?`,
          });
          setInteractionStage(prev => ({ 
            ...prev, 
            hasShownInsights: true,
                  hasShownValue: true
          }));
        }, 1000);
      }

      if (interactionStage.hasShownValue && !interactionStage.hasShownConsultation) {
        setTimeout(() => {
          setInteractionStage(prev => ({ ...prev, hasShownConsultation: true }));
        }, 1500);
      }
          } else if (chatRequest.status === 'failed') {
            clearInterval(pollInterval);
            setLoading(false);
            throw new Error(chatRequest.error || 'Failed to process message');
          }
          
        } catch (pollError) {
          clearInterval(pollInterval);
          setLoading(false);
          setError(pollError instanceof Error ? pollError.message : "Failed to get message status");
        }
      }, 1000); // Poll every second
      
      // Clear polling after 30 seconds to prevent infinite polling
      setTimeout(() => {
        clearInterval(pollInterval);
        if (isLoading) {
          setLoading(false);
          setError("Request timed out. Please try again.");
        }
      }, 30000);

    } catch (err: unknown) {
      console.error("Chat error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setLoading(false);
    }
  };

  // Update scroll to consultation section function
  const scrollToConsultation = () => {
    const consultationForm = document.querySelector('#consultation-form-section');
    if (consultationForm) {
      consultationForm.scrollIntoView({ behavior: 'smooth' });
      // Add focus to the first form input for better UX
      const firstInput = consultationForm.querySelector('input');
      if (firstInput) {
        firstInput.focus();
      }
    }
  };

  if (!companyInfo) {
    return (
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">
          Welcome to the AI Support Demo
        </h2>
        <CompanyInfoForm onSubmit={handleCompanyInfo} />
      </div>
    );
  }

  return (
    <div className="w-full h-[600px]">
      <div id="chat-interface" className="flex flex-col bg-gradient-to-b from-gray-900/50 to-gray-800/50 rounded-xl border border-white/10 overflow-hidden h-full relative">
        {/* Chat Header */}
        <div className="border-b border-white/10 p-4 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-white/90">AI Support Assistant</span>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8C52FF] to-[#6C63FF] rounded-lg blur opacity-40 group-hover:opacity-70 transition duration-200" />
            <Button
              onClick={scrollToConsultation}
              className="relative bg-background/50 hover:bg-background/60 text-white px-4 py-2 h-auto text-sm font-medium"
              variant="ghost"
            >
              Book Free Consultation
              <motion.span
                className="ml-2 opacity-50 group-hover:opacity-100"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.span>
            </Button>
          </motion.div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {suggestedQuestions.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-white/80 font-medium">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((q) => (
                    <Button
                      key={q.id}
                      variant="outline"
                      className="bg-white/5 hover:bg-white/10 text-sm border-white/10 hover:border-white/20"
                      onClick={() => handleSuggestedQuestion(q.question)}
                    >
                      {q.question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {isLoading && (
              <ChatMessage
                message={{ id: "loading", role: "assistant", content: "" }}
                isTyping={true}
              />
            )}
          </div>
        </ScrollArea>

        {showConsultationFAB && (
          <ConsultationFAB onClick={scrollToConsultation} />
        )}

        {error && (
          <div className="p-2 text-red-400 text-sm text-center bg-red-500/10 border-t border-b border-red-500/20">
            {error}
          </div>
        )}

        {/* Chat Input */}
        <div className="border-t border-white/10 p-4 bg-white/5">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-white/10 border-white/10 focus:border-[#8C52FF]/50 focus:ring-1 focus:ring-[#8C52FF]/50"
            />
            <Button 
              onClick={() => handleSendMessage()} 
              disabled={isLoading}
              className="bg-[#8C52FF] hover:bg-[#8C52FF]/90"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
