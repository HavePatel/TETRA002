import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2, ShieldAlert, ShieldCheck, AlertTriangle,
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

import ChartCard from '../components/ui/ChartCard';
import Badge     from '../components/ui/Badge';
import InvoiceTable from '../components/ui/InvoiceTable';
import {
  dummyInvoices,
  dummyMonthlyVolume,
  dummyVendorSummary,
  dummyRiskHeatmap,
  dummyDashboardStats as S,
} from '../data/dummyData';

/* ── Tooltip ── */
const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3.5 py-2.5 text-xs border border-slate-200 dark:border-white/[0.1] bg-white/95 dark:bg-[#0c101d]/95 backdrop-blur-xl shadow-xl min-w-[140px] rounded-xl">
      {label && <p className="text-slate-500 dark:text-gray-400 font-medium mb-1.5 border-b border-slate-200 dark:border-white/[0.06] pb-1">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full shadow-sm" style={{ background: p.color }} />
          <span className="text-slate-600 dark:text-gray-400 font-medium">{p.name}:</span>
          <span className="text-slate-900 dark:text-gray-100 font-mono font-bold ml-auto pl-2">
            {typeof p.value === 'number' && p.value > 999
              ? `₹${(p.value / 100000).toFixed(1)}L`
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const stagger = (i) => ({
  initial:    { opacity: 0, y: 14 },
  animate:    { opacity: 1, y: 0  },
  transition: { delay: i * 0.07, duration: 0.28 },
});

const riskColor = (r) => r === 'High Risk' ? '#f43f5e' : r === 'Medium Risk' ? '#f59e0b' : '#10b981';

export default function AnalyticsPage() {
  const totalAmount = dummyVendorSummary.reduce((s, v) => s + v.total_amount, 0);

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-500/20">
          Risk &amp; Portfolio Analytics
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight pt-2">Risk &amp; Audit Analytics</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 font-normal">
          Comprehensive enterprise invoice risk metrics — monthly billing volume, vendor exposure analysis, and anomaly frequency heatmap.
        </p>
      </motion.div>

      {/* ── Summary KPI ── */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.08 }}
      >
        {[
          { label: 'Total Invoices',    value: S.totalInvoices,  icon: BarChart2,    color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 border-indigo-200 dark:bg-indigo-500/12 dark:border-indigo-500/25' },
          { label: 'High Risk Flagged', value: S.highRiskCount,  icon: ShieldAlert,  color: 'text-rose-600 dark:text-rose-400 bg-rose-50 border-rose-200 dark:bg-rose-500/12 dark:border-rose-500/25' },
          { label: 'Medium Risk Review',value: S.mediumRiskCount,icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 border-amber-200 dark:bg-amber-500/12 dark:border-amber-500/25' },
          { label: 'Clean / Verified',  value: S.lowRiskCount,   icon: ShieldCheck,  color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/12 dark:border-emerald-500/25' },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div 
            key={i} 
            {...stagger(i)} 
            className="glass-card p-5 space-y-3 border border-slate-200/80 dark:border-white/[0.06] bg-white/80 dark:bg-[#0c101d]/70 backdrop-blur-xl rounded-2xl hover:border-indigo-500/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-gray-400">{label}</p>
              <motion.div 
                className={`p-2.5 rounded-xl border ${color}`}
                whileHover={{ scale: 1.08 }}
              >
                <Icon className="w-4.5 h-4.5" />
              </motion.div>
            </div>
            <p className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">{value.toLocaleString('en-IN')}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Monthly Volume + Line chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div {...stagger(0)}>
          <ChartCard
            title="Monthly Invoice Volume"
            subtitle="Total scanned invoice count (Jan–Jul 2026)"
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={dummyMonthlyVolume} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
                <Bar dataKey="invoices" name="Invoices" fill="#6366f1" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        <motion.div {...stagger(1)}>
          <ChartCard
            title="Monthly Transaction Value"
            subtitle="Total invoice amount processed (₹ Lakhs)"
          >
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={dummyMonthlyVolume} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false}
                  tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
                <Tooltip content={<DarkTooltip />} />
                <Line type="monotone" dataKey="volume" name="Value" stroke="#10b981"
                  strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>
      </div>

      {/* ── Vendor Risk Table ── */}
      <motion.div {...stagger(2)} className="glass-card overflow-hidden border border-slate-200/80 dark:border-white/[0.06] bg-white/80 dark:bg-[#0c101d]/70 backdrop-blur-xl rounded-3xl">
        <div className="px-7 py-5 border-b border-slate-200/80 dark:border-white/[0.05] bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-gray-100 tracking-tight">Vendor Risk &amp; Exposure Summary</p>
            <p className="text-[12px] text-slate-500 dark:text-gray-400 mt-0.5">Aggregated financial exposure per vendor</p>
          </div>
          <span className="text-[11px] font-mono font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-white/[0.04] px-3 py-1.5 rounded-full border border-indigo-200 dark:border-white/[0.08]">
            {dummyVendorSummary.length} Active Vendors
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[800px]">
            <thead>
              <tr className="bg-slate-100/60 dark:bg-white/[0.02] text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-gray-400 border-b border-slate-200/80 dark:border-white/[0.05]">
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4 text-right">Invoices</th>
                <th className="px-6 py-4 text-right">Total Amount</th>
                <th className="px-6 py-4 text-right">Avg Risk</th>
                <th className="px-6 py-4">Status Rating</th>
                <th className="px-6 py-4">Exposure Distribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-white/[0.04]">
              {dummyVendorSummary.map((v, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="table-row-hover hover:bg-slate-100/60 dark:hover:bg-white/[0.02]"
                >
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-gray-200">{v.vendor}</td>
                  <td className="px-6 py-4 text-right font-mono text-slate-600 dark:text-gray-400 font-semibold">{v.total_invoices}</td>
                  <td className="px-6 py-4 text-right font-mono text-slate-900 dark:text-gray-100 font-bold">
                    ₹{(v.total_amount / 100000).toFixed(2)}L
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-extrabold" style={{ color: riskColor(v.risk_status) }}>
                    {v.avg_risk}
                  </td>
                  <td className="px-6 py-4">
                    <Badge level={v.risk_status} />
                  </td>
                  <td className="px-6 py-4 min-w-[140px]">
                    <div className="w-full h-2 bg-slate-100 dark:bg-white/[0.05] rounded-full overflow-hidden border border-slate-200 dark:border-white/[0.06]">
                      <motion.div
                        className="h-full rounded-full transition-all shadow-sm"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(v.total_amount / totalAmount) * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        style={{
                          background: riskColor(v.risk_status),
                        }}
                      />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Anomaly Heatmap + All Invoices ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Anomaly heatmap — 2 cols */}
        <motion.div {...stagger(3)} className="lg:col-span-2 glass-card p-6 space-y-5 border border-slate-200/80 dark:border-white/[0.06] bg-white/80 dark:bg-[#0c101d]/70 backdrop-blur-xl rounded-3xl">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-gray-100 tracking-tight">Anomaly Distribution Heatmap</p>
            <p className="text-[12px] text-slate-500 dark:text-gray-400 mt-0.5">Frequency of risk category triggers</p>
          </div>
          <div className="space-y-3.5">
            {dummyRiskHeatmap.map((item, i) => (
              <motion.div 
                key={i} 
                className="space-y-2"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-slate-700 dark:text-gray-300 font-medium">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800 dark:text-gray-200">{item.count}</span>
                    <Badge level={`${item.risk} Risk`} />
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-white/[0.05] rounded-full overflow-hidden border border-slate-200 dark:border-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.weight}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08 }}
                    className="h-full rounded-full shadow-sm"
                    style={{ background: riskColor(`${item.risk} Risk`) }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* All invoices table — 3 cols */}
        <motion.div {...stagger(4)} className="lg:col-span-3 space-y-4">
          <p className="text-sm font-bold text-slate-900 dark:text-gray-200 tracking-tight">All Scanned Invoices Database</p>
          <InvoiceTable invoices={dummyInvoices} showHeaderActions />
        </motion.div>
      </div>
    </div>
  );
}
