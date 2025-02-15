"use client";

import { motion } from "framer-motion";

interface MetricCardProps {
  percentage: string;
  title: string;
  description: string;
}

export default function MetricCard({
  percentage,
  title,
  description,
}: MetricCardProps) {
  return (
    <motion.div
      className="relative p-6 bg-card rounded-lg border border-border"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-2">
        <span className="text-5xl font-bold text-primary">{percentage}%</span>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}
