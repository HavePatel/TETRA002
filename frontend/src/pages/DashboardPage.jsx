import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload, AlertCircle, CheckCircle2, Clock, ArrowRight,
} from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

import Button from '../components/ui/Button';
import InvoiceTable from '../components/ui/InvoiceTable';
import {
  dummyInvoices,
  dummyDashboardStats as S,
  dummyRiskTrend,
  dummyRecentActivity,
} from '../data/dummyData';

const chartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3.5 py-2.5 text-xs border border-slate-200 dark:border-white/[0.1] bg-white/95 dark:bg-[#0c101d]/95 backdrop-blur-xl shadow-xl min-w-[140px] rounded-xl">
      {label && <p className="text-slate-500 dark:text-gray-400 font-medium mb-1.5 border-b border-slate-200 dark:border-white/[0.06] pb-1">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex gap-2 items-center py-0.5">
          <span className="w-2 h-2 rounded-full shadow-sm" style={{ background: p.color }} />
          <span className="text-slate-600 dark:text-gray-400 font-medium">{p.name}:</span>
          <span className="text-slate-900 dark:text-gray-100 font-mono font-bold ml-auto">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-7">
      {/* HERO SECTION */}
      <motion.section
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-gradient-to-br dark:from-[#0e1322] dark:via-[#090d18] dark:to-[#070a12] p-8 sm:p-10 shadow-sm dark:shadow-2xl"
      >
        {/* Background ambient lighting blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/5 dark:bg-violet-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">AI AUDIT CORE ACTIVE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              AI-Powered Invoice Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 max-w-xl font-normal leading-relaxed">
              Automate invoice verification with AI. Detect duplicate invoices, validate GSTIN, verify vendor information, identify financial risks, and generate intelligent audit insights in seconds.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                icon={Upload}
                onClick={() => navigate('/upload')}
              >
                Scan New Invoice
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate('/analytics')}
              >
                View Risk Analytics
              </Button>
            </div>
          </div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3.5 w-full lg:w-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-card bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-4 text-center backdrop-blur-md hover:border-indigo-500/30 transition-colors">
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{S.totalInvoices.toLocaleString('en-IN')}</p>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mt-1">Total Scanned</p>
            </div>
            <div className="glass-card bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-4 text-center backdrop-blur-md hover:border-emerald-500/30 transition-colors">
              <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">{S.accuracy}%</p>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mt-1">AI Accuracy</p>
            </div>
            <div className="glass-card bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-4 text-center backdrop-blur-md hover:border-rose-500/30 transition-colors">
              <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">{S.highRiskCount}</p>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mt-1">Flagged Risks</p>
            </div>
            <div className="glass-card bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-4 text-center backdrop-blur-md hover:border-emerald-500/30 transition-colors">
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-300 font-mono">{S.lowRiskCount}</p>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mt-1">Verified Clear</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - RISK TIMELINE CHART */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-card rounded-3xl border border-slate-200/80 dark:border-white/[0.06] bg-white/80 dark:bg-[#0c101d]/70 p-6 sm:p-7 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/80 dark:border-white/[0.05]">
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-base tracking-tight">Invoice Risk Timeline</p>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">30-day classification trends across risk tiers</p>
            </div>
            <span className="text-[11px] font-mono font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-500/20">
              Live Feed
            </span>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dummyRiskTrend} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="grad-low" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="grad-med" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="grad-high" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={chartTooltip} />
              <Area type="monotone" dataKey="low" stroke="#10b981" fill="url(#grad-low)" strokeWidth={2.5} name="Low Risk" />
              <Area type="monotone" dataKey="medium" stroke="#f59e0b" fill="url(#grad-med)" strokeWidth={2.5} name="Medium Risk" />
              <Area type="monotone" dataKey="high" stroke="#f43f5e" fill="url(#grad-high)" strokeWidth={2.5} name="High Risk" />
            </AreaChart>
          </ResponsiveContainer>

          <div className="mt-6 flex gap-6 justify-center pt-2 border-t border-slate-200/80 dark:border-white/[0.04]">
            {[
              { label: 'Low Risk', color: '#10b981' },
              { label: 'Medium Risk', color: '#f59e0b' },
              { label: 'High Risk', color: '#f43f5e' },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: color }} />
                <span className="text-xs font-medium text-slate-600 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT COLUMN - EXECUTIVE STATUS CARDS */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* STATUS CARD 1 */}
          <div className="glass-card rounded-2xl border border-slate-200/80 dark:border-white/[0.06] bg-white/80 dark:bg-[#0c101d]/70 p-5 backdrop-blur-xl hover:border-amber-500/30 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Pending Audit Review</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono mt-2">{S.pendingReviewCount}</p>
              </div>
              <motion.div
                className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/25"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </motion.div>
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400 font-normal">Awaiting manual auditor confirmation</p>
          </div>

          {/* STATUS CARD 2 */}
          <div className="glass-card rounded-2xl border border-slate-200/80 dark:border-white/[0.06] bg-white/80 dark:bg-[#0c101d]/70 p-5 backdrop-blur-xl hover:border-emerald-500/30 transition-all space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Approved Today</p>
                <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-2">{S.lowRiskCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-white/[0.05] rounded-full overflow-hidden border border-emerald-200 dark:border-emerald-500/10">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '78%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* STATUS CARD 3 */}
          <div className="glass-card rounded-2xl border border-slate-200/80 dark:border-white/[0.06] bg-white/80 dark:bg-[#0c101d]/70 p-5 backdrop-blur-xl hover:border-rose-500/30 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Critical Anomalies</p>
                <p className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 font-mono mt-2">{S.highRiskCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/25">
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400 font-normal">Requires immediate investigation</p>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM SECTION - RECENT ACTIVITY & INVOICES */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* RECENT INVOICES - 3 COLS */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-base tracking-tight">Recent Scanned Invoices</p>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Latest transactions extracted by PaddleOCR</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/invoice')}
              icon={ArrowRight}
            >
              View All
            </Button>
          </div>
          <InvoiceTable invoices={dummyInvoices} showHeaderActions={false} limit={5} />
        </motion.div>

        {/* LIVE ACTIVITY - 1 COL */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-3xl border border-slate-200/80 dark:border-white/[0.06] bg-white/80 dark:bg-[#0c101d]/70 p-6 backdrop-blur-xl flex flex-col"
        >
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200/80 dark:border-white/[0.05]">
            <p className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">Audit Stream</p>
            <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25 rounded-full">
              Live Feed
            </span>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto">
            {dummyRecentActivity.slice(0, 6).map((activity, i) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex gap-3 text-xs p-2.5 rounded-xl hover:bg-slate-100/60 dark:hover:bg-white/[0.02] transition-colors border border-transparent hover:border-slate-200/50 dark:hover:border-white/[0.04]"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    activity.severity === 'high'
                      ? 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)]'
                      : activity.severity === 'warning'
                      ? 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]'
                      : 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-slate-900 dark:text-gray-200 font-semibold leading-tight truncate">
                    {activity.title}
                  </p>
                  <p className="text-slate-500 dark:text-gray-400 text-[11px] mt-1 font-normal line-clamp-2 leading-relaxed">{activity.body}</p>
                  <p className="text-slate-400 dark:text-gray-500 text-[10px] font-mono mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
