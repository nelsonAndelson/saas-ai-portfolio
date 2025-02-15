"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PricingTier from "./PricingTier";

const pricingTiers = [
  {
    name: "Starter",
    price: "$2,500",
    description: "One-time setup fee",
    bestFor: "Early-stage SaaS founders",
    roi: "Save 40+ hours/month on support",
    features: [
      "AI Chatbot Setup",
      "Knowledge Base Integration",
      "Basic Analytics Dashboard",
      "Email Support",
      "14-Day Implementation",
    ],
  },
  {
    name: "Growth",
    price: "$5,000",
    description: "One-time setup fee",
    bestFor: "Growing SaaS companies",
    roi: "Reduce support costs by 60%",
    features: [
      "Everything in Starter",
      "AI Support Automation",
      "Advanced Analytics",
      "Custom Integrations",
      "Priority Support",
      "30-Day Implementation",
    ],
    isPopular: true,
  },
  {
    name: "Enterprise",
    price: "$2,000",
    description: "Per month",
    bestFor: "Scale-up & enterprise SaaS",
    roi: "95% faster response times",
    features: [
      "Everything in Growth",
      "Full AI Automation Suite",
      "Dedicated AI Engineer",
      "24/7 Premium Support",
      "Custom Development",
      "Ongoing Optimization",
    ],
  },
];

interface FormData {
  name: string;
  email: string;
  company: string;
  aiNeeds: string;
}

const TrustedBySection = () => {
  return (
    <motion.div
      className="mt-12 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="text-center space-y-4">
        <p className="text-lg font-medium text-white/80">
          Trusted by Innovative Teams
        </p>
        <div className="flex justify-center items-center space-x-8">
          {["TechFlow", "DataSphere", "CloudStack", "AIMatrix"].map(
            (company) => (
              <motion.div
                key={company}
                className="text-white/60 hover:text-[#8C52FF] transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
              >
                {company}
              </motion.div>
            )
          )}
        </div>
        <div className="max-w-2xl mx-auto mt-6 px-6">
          <blockquote className="text-lg italic text-white/80">
            "We automated 60% of our support tickets in 30 days. Absolute
            game-changer for our team!"
            <footer className="mt-2 text-sm font-medium text-white/60">
              - John D., CEO @ TechFlow
            </footer>
          </blockquote>
        </div>
      </div>
    </motion.div>
  );
};

export default function Pricing() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    aiNeeds: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your backend
  };

  return (
    <section className="relative py-20 px-4 md:px-6 lg:px-8 bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E2A47] via-[#2A2F4E] to-[#6C63FF] opacity-50" />

      <div className="container max-w-7xl mx-auto relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="space-y-6 text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
                Simple, Transparent Pricing
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Choose the perfect plan for your business. All plans include our
              core AI features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {pricingTiers.map((tier) => (
              <PricingTier key={tier.name} {...tier} />
            ))}
          </div>

          <TrustedBySection />

          <motion.div
            className="max-w-xl mx-auto bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-center text-white">
                  Get a Custom AI Solution
                </h3>
                <p className="text-white/80 text-center">
                  Tell us about your needs and we'll create a tailored solution
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="John Doe"
                    className="bg-white/10 border-white/10 text-white placeholder:text-white/60"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@company.com"
                    className="bg-white/10 border-white/10 text-white placeholder:text-white/60"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Company Name</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder="Your Company"
                    className="bg-white/10 border-white/10 text-white placeholder:text-white/60"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">AI Needs</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, aiNeeds: value })
                    }
                  >
                    <SelectTrigger className="bg-white/10 border-white/10 text-white">
                      <SelectValue placeholder="Select your primary AI need" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E2A47] border-white/10">
                      <SelectItem
                        value="chatbot"
                        className="text-white focus:bg-white/10"
                      >
                        AI Chatbot
                      </SelectItem>
                      <SelectItem
                        value="automation"
                        className="text-white focus:bg-white/10"
                      >
                        Workflow Automation
                      </SelectItem>
                      <SelectItem
                        value="analytics"
                        className="text-white focus:bg-white/10"
                      >
                        AI Analytics
                      </SelectItem>
                      <SelectItem
                        value="custom"
                        className="text-white focus:bg-white/10"
                      >
                        Custom Solution
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8C52FF] to-[#6C63FF] rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
                <Button
                  type="submit"
                  size="lg"
                  className="relative w-full bg-background hover:bg-background/90 text-white px-8 py-6 h-auto text-lg font-medium"
                >
                  Get Started
                  <span className="ml-2">→</span>
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
