"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";

interface CalendlyEmbedProps {
  url: string;
  prefill?: {
    name?: string;
    email?: string;
    customAnswers?: {
      a1?: string; // Company name
      a2?: string; // AI Interest
    };
  };
}

export default function CalendlyEmbed({ url, prefill }: CalendlyEmbedProps) {
  useEffect(() => {
    // Load Calendly widget script
    const head = document.querySelector("head");
    const script = document.createElement("script");
    script.setAttribute(
      "src",
      "https://assets.calendly.com/assets/external/widget.js"
    );
    head.appendChild(script);

    // Cleanup on unmount
    return () => {
      script.remove();
    };
  }, []);

  // Construct the URL with prefill parameters if they exist
  const constructUrl = () => {
    if (!prefill) return url;

    const params = new URLSearchParams();

    // Replace all + with spaces in the decoded values
    if (prefill.name) {
      const decodedName = prefill.name.replace(/\+/g, " ");
      params.append("name", decodedName);
    }
    if (prefill.email) params.append("email", prefill.email);
    if (prefill.customAnswers?.a1) {
      const decodedCompany = prefill.customAnswers.a1.replace(/\+/g, " ");
      params.append("a1", decodedCompany);
    }
    if (prefill.customAnswers?.a2) {
      params.append("a2", prefill.customAnswers.a2);
    }

    // Construct final URL with properly encoded parameters
    const baseUrl = url.split("?")[0];
    const existingParams = url.includes("?") ? url.split("?")[1] : "";
    const newParams = params.toString();

    const finalParams = existingParams
      ? `${existingParams}&${newParams}`
      : newParams;

    return `${baseUrl}${finalParams ? "?" + finalParams : ""}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="w-full bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
    >
      <div
        className="calendly-inline-widget"
        data-url={constructUrl()}
        style={{
          minHeight: "750px",
          height: "calc(100vh - 200px)",
          maxHeight: "900px",
          width: "100%",
        }}
      />
    </motion.div>
  );
}
