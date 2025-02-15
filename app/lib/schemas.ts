import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(50, "Company name must be less than 50 characters"),
  aiNeeds: z.enum(["chatbot", "automation", "analytics", "custom"], {
    required_error: "Please select your AI needs",
  }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>; 