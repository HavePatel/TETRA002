import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

const ACCENT = {
  indigo:  { ring: 'text-indigo-600 dark:text-indigo-400',  bg: 'bg-indigo-50 border-indigo-200 dark:bg-indigo-500/12 dark:border-indigo-500/20' },
  emerald: { ring: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/12 dark:border-emerald-500/20' },
  amber:   { ring: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 border-amber-200 dark:bg-amber-500/12 dark:border-amber-500/20' },
  rose:    { ring: 'text-rose-600 dark:text-rose-400',    bg: 'bg-rose-50 border-rose-200 dark:bg-rose-500/12 dark:border-rose-500/20' },
  violet:  { ring: 'text-violet-600 dark:text-violet-400',  bg: 'bg-violet-50 border-violet-200 dark:bg-violet-500/12 dark:border-violet-500/20' },
  cyan:    { ring: 'text-cyan-600 dark:text-cyan-400',    bg: 'bg-cyan-50 border-cyan-200 dark:bg-cyan-500/12 dark:border-cyan-500/20' },
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendType = 'neutral',
  description,
  accentColor = 'indigo',
  isCurrency = false,
  suffix      = '',
  className   = '',
}) {
  const a = ACCENT[accentColor] ?? ACCENT.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`glass-card p-6 flex flex-col justify-between gap-4 relative overflow-hidden group ${className}`}
    >
      {/* Background ambient shine */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-indigo-500/5 dark:bg-white/[0.02] rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-500" />

      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-gray-400">{title}</p>
        {Icon && (
          <motion.div
            className={`p-2.5 rounded-xl border backdrop-blur-md ${a.bg}`}
            whileHover={{ scale: 1.08, rotate: 3 }}
          >
            <Icon className={`w-4.5 h-4.5 ${a.ring}`} />
          </motion.div>
        )}
      </div>

      {/* Value */}
      <div className="space-y-1">
        <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
          {typeof value === 'number'
            ? <AnimatedCounter value={value} prefix={isCurrency ? '₹' : ''} suffix={suffix} />
            : value
          }
        </p>
        {description && <p className="text-[12px] text-slate-500 dark:text-gray-400 font-normal leading-relaxed">{description}</p>}
      </div>

      {/* Trend */}
      {trend && (
        <motion.div
          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-full px-2.5 py-1 self-start backdrop-blur-md ${
            trendType === 'up'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20'
              : trendType === 'down'
                ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20'
                : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-white/[0.05] dark:text-gray-400 dark:border-white/[0.08]'
          }`}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          {trendType === 'up'   && <TrendingUp   className="w-3.5 h-3.5" />}
          {trendType === 'down' && <TrendingDown  className="w-3.5 h-3.5" />}
          {trendType === 'neutral' && <Minus      className="w-3.5 h-3.5" />}
          <span>{trend}</span>
        </motion.div>
      )}
    </motion.div>
  );
}
