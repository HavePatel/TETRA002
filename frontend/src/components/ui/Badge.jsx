import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

/* Maps a risk/status string to styling tokens */
function resolve(value) {
  const v = String(value ?? '').toLowerCase();

  if (v.includes('high') || v.includes('flagged') || v.includes('critical')) {
    return {
      dot:   'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse',
      chip:  'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/25',
      label: 'High Risk',
      icon:  AlertCircle,
    };
  }
  if (v.includes('medium') || v.includes('pending') || v.includes('review')) {
    return {
      dot:   'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]',
      chip:  'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/25',
      label: 'Medium Risk',
      icon:  AlertTriangle,
    };
  }
  // Low / Verified / default
  return {
    dot:   'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]',
    chip:  'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/25',
    label: 'Low Risk',
    icon:  CheckCircle2,
  };
}

export default function Badge({ level, status, label, className = '' }) {
  const raw  = level || status || label || '';
  const info = resolve(raw);
  const Icon = info.icon;

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border tracking-tight backdrop-blur-md transition-colors ${info.chip} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${info.dot}`} />
      <Icon className="w-3.5 h-3.5 opacity-90 shrink-0" />
      <span>{label || info.label}</span>
    </motion.span>
  );
}
