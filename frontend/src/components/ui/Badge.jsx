import React from 'react';
import { motion } from 'framer-motion';

export default function Badge({ level, status, className = "" }) {
  const value = level || status || "Low Risk";
  const normalized = String(value).toLowerCase();

  if (normalized.includes('high') || normalized.includes('flagged')) {
    return (
      <motion.span 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-glow-rose backdrop-blur-md ${className}`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
        High Risk 🔴
      </motion.span>
    );
  }

  if (normalized.includes('medium') || normalized.includes('pending')) {
    return (
      <motion.span 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm backdrop-blur-md ${className}`}
      >
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        Medium Risk 🟡
      </motion.span>
    );
  }

  return (
    <motion.span 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-glow-emerald backdrop-blur-md ${className}`}
    >
      <span className="w-2 h-2 rounded-full bg-emerald-500" />
      Low Risk 🟢
    </motion.span>
  );
}
