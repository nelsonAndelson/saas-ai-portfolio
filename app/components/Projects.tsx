"use client";

import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

const projects = [
  {
    title: "AI Support Chatbot",
    description:
      "Reduce customer support costs by 70% with our intelligent chatbot that handles common queries and escalates complex issues.",
    demoLink: "/demo/chatbot",
    techStack: ["OpenAI", "Next.js", "TypeScript"],
    icon: "aiChatbot" as const,
  },
  {
    title: "SaaS Analytics AI",
    description:
      "Predict customer behavior and reduce churn by 25% using our AI-powered analytics dashboard.",
    demoLink: "/demo/analytics",
    techStack: ["TensorFlow", "Python", "React"],
    icon: "aiAnalytics" as const,
  },
  {
    title: "Workflow Automation",
    description:
      "Automate repetitive tasks and increase team productivity by 40% with AI-driven workflow optimization.",
    demoLink: "/demo/workflow",
    techStack: ["LangChain", "Node.js", "Redis"],
    icon: "aiAutomation" as const,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function Projects() {
  return (
    <section className="py-24 px-4 md:px-6 lg:px-8 bg-background/50">
      <div className="container max-w-7xl mx-auto">
        <motion.div
          className="space-y-4 text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight text-primary dark:text-white">
            AI-Powered Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of B2B SaaS automation with our live demos
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
