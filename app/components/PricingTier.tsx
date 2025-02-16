"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
      className={`relative p-6 rounded-xl bg-white/5 border backdrop-blur-sm ${
        isPopular
          ? "border-[#8C52FF] shadow-lg shadow-[#8C52FF]/20"
          : "border-white/10"
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#8C52FF] rounded-full text-sm font-medium text-white">
          Most Popular
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{name}</h3>
          <p className="text-sm text-[#8C52FF]">Best for: {bestFor}</p>
        </div>

        <div>
          <div className="text-3xl font-bold text-white">{price}</div>
          <p className="text-sm text-white/60">{description}</p>
        </div>

        <div className="py-3 px-4 rounded-lg bg-[#8C52FF]/10 border border-[#8C52FF]/20">
          <p className="text-sm text-[#8C52FF]">ROI: {roi}</p>
        </div>

        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start">
              <svg
                className="w-5 h-5 text-[#8C52FF] shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="ml-3 text-white/80">{feature}</span>
            </li>
          ))}
        </ul>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative group"
        >
          <div className={`absolute -inset-0.5 rounded-lg blur opacity-30 transition duration-200 ${
            isPopular ? "bg-gradient-to-r from-[#8C52FF] to-[#6C63FF] group-hover:opacity-50" : "bg-white group-hover:opacity-40"
          }`} />
          <Button
            onClick={() => {
              const consultationForm = document.querySelector('#consultation-form-section');
              if (consultationForm) {
                consultationForm.scrollIntoView({ behavior: 'smooth' });
                // Focus the first input for better UX
                const firstInput = consultationForm.querySelector('input');
                if (firstInput) {
                  firstInput.focus();
                }
              }
            }}
            className={`relative w-full ${
              isPopular
                ? "bg-[#8C52FF] hover:bg-[#8C52FF]/90 text-white"
                : "bg-background hover:bg-white/10 text-white"
            }`}
          >
            Book Consultation
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
