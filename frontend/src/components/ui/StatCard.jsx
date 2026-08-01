import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendType = 'up',
  description,
  accentColor = 'indigo',
  className = ''
}) {
  const accentStyles = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 group-hover:border-indigo-500/60 shadow-glow-indigo',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 group-hover:border-emerald-500/60 shadow-glow-emerald',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30 group-hover:border-amber-500/60',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30 group-hover:border-rose-500/60 shadow-glow-rose',
    slate: 'bg-slate-800 text-slate-300 border-slate-700'
  };

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`p-6 rounded-2xl glass-panel glass-card-hover group relative overflow-hidden ${className}`}
    >
      {/* Background radial spotlight effect */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-300 pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-3 rounded-xl border ${accentStyles[accentColor] || accentStyles.indigo} group-hover:scale-110 transition-transform duration-200`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between relative z-10">
        <h3 className="text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
          {value}
        </h3>
        {trend && (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
            trendType === 'up' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
              : trendType === 'down' 
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' 
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            {trendType === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : trendType === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
            {trend}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-2 text-xs text-slate-400 relative z-10">
          {description}
        </p>
      )}
    </motion.div>
  );
}
