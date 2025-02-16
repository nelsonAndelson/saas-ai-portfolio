"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Icons } from "../components/ui/icons";

interface ProjectCardProps {
  title: string;
  description: string;
  techStack: string[];
  icon: keyof typeof Icons;
}

export default function ProjectCard({
  title,
  description,
  techStack,
  icon,
}: ProjectCardProps) {
  const IconComponent = Icons[icon];

  return (
    <motion.div
      className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-[#8C52FF]/50 transition-all duration-300"
      whileHover={{
        y: -8,
        rotateY: 5,
        scale: 1.02,
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8C52FF]/5 via-[#8C52FF]/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />

      <div className="relative space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#8C52FF]/10 rounded-lg">
            <IconComponent className="h-6 w-6 text-[#8C52FF]" />
          </div>
          <motion.h3
            className="text-2xl font-bold font-heading text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {title}
          </motion.h3>
        </div>

        <motion.p
          className="text-white/80 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8C52FF] to-[#6C63FF] rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
            <Button className="relative w-full bg-background hover:bg-background/90 text-white px-4 py-2 h-auto text-base font-medium">
              Try Live Demo
              <Icons.arrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {techStack.map((tech) => (
            <div
              key={tech}
              className="text-white/60 text-sm bg-white/5 px-3 py-1 rounded-full flex items-center gap-1.5"
            >
              <Icons.tech className="h-3 w-3 text-[#8C52FF]" />
              {tech}
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
