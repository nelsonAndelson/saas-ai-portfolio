"use client";
/* eslint-disable react/no-unescaped-entities */

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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CalendlyEmbed from "./CalendlyEmbed";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContactFormData, contactFormSchema } from "../lib/schemas";
import { useToast } from "@/hooks/use-toast";

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
            &ldquo;We automated 60% of our support tickets in 30 days. Absolute
            game-changer for our team!&rdquo;
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
  const [showCalendly, setShowCalendly] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const formData = watch();

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Here you would typically send the data to your backend
      console.log("Form submitted:", data);

      // Show success toast
      toast({
        title: "Success!",
        description:
          "Your information has been submitted. Let&apos;s schedule your consultation!",
        duration: 5000,
      });

      // Reset form fields
      reset();

      // Show Calendly modal
      setShowCalendly(true);

      const chatInterface = document.querySelector("#chat-interface");
      if (chatInterface) {
        chatInterface.scrollIntoView({ behavior: "smooth" });
      }

      const consultationForm = document.querySelector("#consultation-form-section");
      if (consultationForm) {
        consultationForm.scrollIntoView({ behavior: "smooth" });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="pricing-section" className="relative py-20 px-4 md:px-6 lg:px-8 bg-background">
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
            id="consultation-form-section"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-center text-white">
                  Get a Custom AI Solution
                </h3>
                <p className="text-white/80 text-center">
                  Tell us about your needs and we&apos;ll create a tailored solution
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Name</Label>
                  <Input
                    {...register("name")}
                    placeholder="John Doe"
                    className="bg-white/10 border-white/10 text-white placeholder:text-white/60"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Email</Label>
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="john@company.com"
                    className="bg-white/10 border-white/10 text-white placeholder:text-white/60"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Company Name</Label>
                  <Input
                    {...register("company")}
                    placeholder="Your Company"
                    className="bg-white/10 border-white/10 text-white placeholder:text-white/60"
                  />
                  {errors.company && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.company.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-white">AI Needs</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("aiNeeds", value as ContactFormData["aiNeeds"])
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
                  {errors.aiNeeds && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.aiNeeds.message}
                    </p>
                  )}
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
                  disabled={isSubmitting}
                  className="relative w-full bg-background hover:bg-background/90 text-white px-8 py-6 h-auto text-lg font-medium"
                >
                  {isSubmitting
                    ? "Processing..."
                    : "Book a Free AI Consultation"}
                  <span className="ml-2">→</span>
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>

      <Dialog open={showCalendly} onOpenChange={setShowCalendly}>
        <DialogContent className="max-w-4xl max-h-[95vh] bg-background border-white/10 p-6 overflow-hidden">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-white">
              Schedule Your Free AI Consultation
            </DialogTitle>
            <DialogDescription className="text-white/80">
              Choose a time that works best for you. We&apos;ll discuss your AI needs
              and create a tailored solution.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 -mx-6">
            <CalendlyEmbed
              url="https://calendly.com/nelsonbaguma15"
              prefill={{
                name: formData.name?.replace(/\s+/g, " ").trim() || "",
                email: formData.email,
                customAnswers: {
                  a1: formData.company?.replace(/\s+/g, " ").trim() || "",
                  a2: formData.aiNeeds,
                },
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
