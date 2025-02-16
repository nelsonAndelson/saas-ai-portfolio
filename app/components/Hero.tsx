"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import CountUp from "react-countup";
import { ChatInterface } from "./chat/ChatInterface";

interface ChatMessageProps {
  isUser: boolean;
  message: string;
  isTyping?: boolean;
}

interface AnimatedValueProps {
  value: string;
  suffix?: string;
}

const GradientBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E2A47] via-[#2A2F4E] to-[#6C63FF] opacity-50" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -inset-[10px] opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(140, 82, 255, 0.15), transparent 50%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -inset-[10px] opacity-30"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(108, 99, 255, 0.15), transparent 50%)",
        }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Futuristic pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.343 0L13.857 8.485 15.272 9.9l7.9-7.9h-.83zm5.657 0L19.514 8.485 20.93 9.9l8.485-8.485h-1.414zM32.372 0L22.343 10.03 23.757 11.444l9.9-9.9h-1.285zm5.656 0L28. 10.03l1.414 1.414L40.03 0h-2z' fill='%238C52FF' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

const TypingAnimation = () => {
  return (
    <motion.div
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

const ChatMessage = ({
  isUser,
  message,
  isTyping = false,
}: ChatMessageProps) => {
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
          isUser ? "bg-[#8C52FF]/20" : "bg-white/10"
        }`}
      >
        <span className="text-sm">{isUser ? "👤" : "🤖"}</span>
      </div>
      <div className={`flex-1 ${isUser ? "text-right" : ""}`}>
        <div
          className={`inline-block max-w-[80%] px-4 py-2 rounded-2xl ${
            isUser
              ? "bg-[#8C52FF] text-white ml-auto rounded-tr-none"
              : "bg-white/10 backdrop-blur-sm text-white/90 rounded-tl-none"
          }`}
        >
          {isTyping ? (
            <TypingAnimation />
          ) : (
            <p className="text-sm">{message}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const FloatingParticle = ({ delay = 0, className = "" }) => {
  return (
    <motion.div
      className={`absolute w-2 h-2 rounded-full ${className}`}
      animate={{
        y: ["0%", "-150%"],
        opacity: [0, 1, 0],
        scale: [1, 1.2, 0.8],
      }}
      transition={{
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
        delay: delay,
      }}
    />
  );
};

const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -left-4 top-1/4">
        {[0, 1, 2].map((i) => (
          <FloatingParticle
            key={i}
            delay={i * 1.5}
            className="bg-[#8C52FF]/20 dark:bg-[#8C52FF]/40"
          />
        ))}
      </div>
      <div className="absolute -right-4 top-1/3">
        {[0, 1, 2].map((i) => (
          <FloatingParticle
            key={i}
            delay={i * 1.2 + 1}
            className="bg-blue-500/20 dark:bg-blue-500/40"
          />
        ))}
      </div>
    </div>
  );
};

const HeroRating = () => {
  return (
    <motion.div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className="w-4 h-4 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-medium text-white/90">
        5.0 rating on G2 Crowd
      </span>
    </motion.div>
  );
};

const AnimatedValue = ({ value, suffix = "" }: AnimatedValueProps) => {
  const [isInView, setIsInView] = useState(false);
  const countRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, []);

  return (
    <motion.span
      ref={countRef}
      className="text-[#8C52FF] font-semibold"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {isInView ? (
          <CountUp end={parseInt(value)} duration={2} suffix={suffix} />
        ) : (
          "0" + suffix
        )}
      </motion.span>
    </motion.span>
  );
};

export default function Hero() {
  return (
    <section className="relative py-20 px-4 md:px-6 lg:px-8 bg-background dark:bg-background backdrop-blur-3xl min-h-screen flex items-center">
      <GradientBackground />
      <div className="container max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="space-y-6 text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <HeroRating />

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <motion.span
                className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70 dark:from-white dark:via-white dark:to-white/70"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Transform Your
              </motion.span>
              <br />
              <motion.span
                className="bg-clip-text text-transparent bg-gradient-to-r from-[#8C52FF] to-[#6C63FF] leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Customer Support
              </motion.span>
            </h1>

            <motion.p
              className="text-xl md:text-2xl text-foreground/80 dark:text-white/80 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <AnimatedValue value="70" suffix="% fewer tickets" /> with instant
              AI responses. Cut costs, improve response times, and scale your
              support operations today.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8C52FF] to-[#6C63FF] rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
                <Button
                  size="lg"
                  onClick={() => {
                    const chatInterface = document.querySelector('#chat-interface');
                    if (chatInterface) {
                      chatInterface.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="relative bg-background hover:bg-background/90 text-white px-6 py-3 h-auto text-base font-medium shadow-xl shadow-[#8C52FF]/20"
                >
                  Try AI Chatbot Now
                  <motion.span
                    className="ml-2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8C52FF] to-[#6C63FF] rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-200"></div>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    const consultationForm = document.querySelector('#consultation-form-section');
                    if (consultationForm) {
                      consultationForm.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="relative border-white/20 hover:border-white/40 hover:bg-white/5 text-white/90 px-6 py-3 h-auto text-base font-medium backdrop-blur-sm"
                >
                  Book Free Consultation
                  <motion.span
                    className="ml-2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-[3fr,1fr] gap-8 mb-16">
            <div className="space-y-8 order-2 md:order-1">
              <ChatInterface />
            </div>
            <div className="space-y-8 order-1 md:order-2">
              <motion.div 
                className="grid grid-cols-1 gap-4 sticky top-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {[
                  {
                    label: "Ticket Reduction",
                    value: "70%",
                    description: "Fewer support tickets",
                    icon: "📉"
                  },
                  {
                    label: "Cost Savings",
                    value: "60%",
                    description: "Reduced support costs",
                    icon: "💰"
                  },
                  {
                    label: "Response Time",
                    value: "24/7",
                    description: "Instant responses",
                    icon: "⚡"
                  },
                  {
                    label: "Satisfaction",
                    value: "95%",
                    description: "Customer happiness",
                    icon: "😊"
                  },
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm relative group overflow-hidden"
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <div className="absolute -right-2 -top-2 text-3xl opacity-10 group-hover:opacity-20 transition-opacity">
                      {stat.icon}
                    </div>
                    <div className="relative">
                      <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8C52FF] to-[#6C63FF]">
                        {stat.value}
                      </div>
                      <div className="text-sm font-medium text-white/60">
                        {stat.label}
                      </div>
                      <div className="text-xs text-white/40 mt-1">
                        {stat.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
