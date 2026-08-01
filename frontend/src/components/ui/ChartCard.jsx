import React from 'react';
import { motion } from 'framer-motion';

export default function ChartCard({ title, subtitle, action, children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`glass-card p-6 sm:p-7 flex flex-col gap-5 border border-slate-200/80 dark:border-white/[0.06] ${className}`}
    >
      <div className="flex items-start justify-between gap-3 pb-1 border-b border-slate-200/60 dark:border-white/[0.04]">
        <div className="space-y-0.5 pb-2">
          <p className="text-sm font-bold text-slate-900 dark:text-gray-100 tracking-tight">{title}</p>
          {subtitle && <p className="text-[12px] text-slate-500 dark:text-gray-400 font-normal">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div className="flex-1">{children}</div>
    </motion.div>
  );
}
