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
      className={`relative p-6 bg-white/5 backdrop-blur-sm rounded-xl border ${
        isPopular ? "border-[#8C52FF]" : "border-white/10"
      }`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#8C52FF] text-white text-sm rounded-full">
          Most Popular
        </span>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">{name}</h3>
          {bestFor && (
            <p className="text-sm text-[#8C52FF]">Best for: {bestFor}</p>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8C52FF] to-[#6C63FF]">
            {price}
          </p>
          <p className="text-sm text-white/60">{description}</p>
          {roi && (
            <p className="text-sm text-[#8C52FF]/90 mt-2 font-medium">
              ROI: {roi}
            </p>
          )}
        </div>

        <ul className="space-y-3 pt-4">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-5 h-5">
                <div className="absolute inset-0 bg-[#8C52FF] opacity-20 rounded-full blur-[2px]" />
                <Check
                  className="h-4 w-4 text-[#8C52FF] relative z-10"
                  strokeWidth={3}
                />
              </div>
              <span className="text-sm text-white/80">{feature}</span>
            </li>
          ))}
        </ul>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8C52FF] to-[#6C63FF] rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
          <Button className="relative w-full bg-background hover:bg-background/90 text-white px-4 py-2 h-auto text-base font-medium shadow-lg shadow-[#8C52FF]/20">
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
