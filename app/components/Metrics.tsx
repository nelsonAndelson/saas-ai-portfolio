"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import CountUp from "react-countup";
import { useState, useRef, useEffect } from "react";

interface AnimatedMetricProps {
  value: string;
  title: string;
  description: string;
}

const AnimatedMetric = ({ value, title, description }: AnimatedMetricProps) => {
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
    <motion.div
      ref={countRef}
      className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-200"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#8C52FF] to-[#6C63FF] rounded-lg blur-lg opacity-0 group-hover:opacity-20 transition-opacity" />
        <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8C52FF] to-[#6C63FF] mb-2">
          {isInView ? (
            <CountUp end={parseInt(value)} duration={2} suffix="%" />
          ) : (
            "0%"
          )}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/60">{description}</p>
    </motion.div>
  );
};

const metrics = [
  {
    percentage: "70",
    title: "Support Automation",
    description:
      "SaaS company reduced support tickets by automating common customer queries with AI chatbot integration.",
  },
  {
    percentage: "20",
    title: "Churn Reduction",
    description:
      "B2B platform decreased customer churn using AI-powered early warning system and automated engagement.",
  },
  {
    percentage: "30",
    title: "Revenue Boost",
    description:
      "Enterprise SaaS achieved revenue growth through AI-driven upsell recommendations and automation.",
  },
];

export default function Metrics() {
  return (
    <section className="relative py-20 px-4 md:px-6 lg:px-8 bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E2A47] via-[#2A2F4E] to-[#6C63FF] opacity-50" />

      <div className="container max-w-7xl mx-auto relative">
        <motion.div
          className="space-y-4 text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
              Real Business Impact
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-white/80"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            See how AI automation transforms B2B SaaS operations
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <AnimatedMetric
              key={metric.title}
              value={metric.percentage}
              title={metric.title}
              description={metric.description}
            />
          ))}
        </div>

        <motion.div
          className="text-center relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group inline-block"
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
              className="relative bg-background hover:bg-background/90 text-white px-4 py-2 h-auto text-base font-medium shadow-lg shadow-[#8C52FF]/20"
            >
              See AI in Action
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
      </div>
    </section>
  );
}
