"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  bestFor?: string;
  roi?: string;
}

export default function PricingTier({
  name,
  price,
  description,
  features,
  isPopular = false,
  bestFor = "",
  roi = "",
}: PricingTierProps) {
  return (
    <motion.div
      className={`relative p-6 rounded-xl border bg-gradient-to-b from-white/[0.08] to-transparent backdrop-blur-sm ${
        isPopular
          ? "border-[#8C52FF] shadow-lg shadow-[#8C52FF]/20"
          : "border-white/10"
      }`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#8C52FF] text-white text-sm font-medium rounded-full shadow-lg shadow-[#8C52FF]/30">
          Most Popular
        </span>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">{name}</h3>
          {bestFor && (
            <p className="text-sm font-medium text-[#B794FF]">
              Best for: {bestFor}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8C52FF] to-[#B794FF]">
            {price}
          </p>
          <p className="text-base text-white/70">{description}</p>
          {roi && (
            <p className="text-sm text-[#B794FF] mt-2 font-medium">
              ROI: {roi}
            </p>
          )}
        </div>

        <ul className="space-y-3 pt-4">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-5 h-5">
                <div className="absolute inset-0 bg-[#8C52FF] opacity-25 rounded-full blur-[2px]" />
                <Check
                  className="h-4 w-4 text-[#B794FF] relative z-10"
                  strokeWidth={3}
                />
              </div>
              <span className="text-sm text-white/90">{feature}</span>
            </li>
          ))}
        </ul>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group pt-2"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8C52FF] to-[#B794FF] rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
          <Button className="relative w-full bg-[#1a1a1a] hover:bg-[#252525] text-white px-4 py-3 h-auto text-base font-medium shadow-xl shadow-[#8C52FF]/20">
            Get Started
            <motion.span
              className="ml-2"
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
}
