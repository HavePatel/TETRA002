import React from 'react';
import { motion } from 'framer-motion';
import { dummyVendorSummary, dummyRiskDistribution } from '../data/dummyData';
import Badge from '../components/ui/Badge';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  Building2, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';

export default function AnalyticsPage() {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="border-b border-white/10 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Systemic Risk & Vendor Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">
          In-depth audit analytics, vendor risk exposure rankings, and historical anomaly patterns.
        </p>
      </div>

      {/* Top Bar Chart: Vendor Risk Comparison */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass space-y-4 border border-white/10">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-200 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" /> Vendor Average Risk Score Exposure
            </h3>
            <p className="text-[11px] text-slate-400">Mean anomaly score calculated across total historical transactions</p>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dummyVendorSummary} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
              <XAxis dataKey="vendor" stroke="#64748b" fontSize={11} interval={0} angle={-15} textAnchor="end" />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#030712', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="avg_risk" radius={[8, 8, 0, 0]} name="Avg Risk Score">
                {dummyVendorSummary.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.avg_risk >= 70 ? '#f43f5e' : entry.avg_risk >= 30 ? '#f59e0b' : '#10b981'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vendor Risk Directory Table */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass border border-white/10 space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-sm font-extrabold text-slate-200 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" /> Master Vendor Audit Directory
          </h3>
          <span className="text-xs font-mono text-indigo-300 font-bold">Total Tracked Vendors: {dummyVendorSummary.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-cosmic-950/80 text-slate-400 font-extrabold uppercase tracking-widest text-[10px]">
                <th className="py-4 px-5">Vendor Name</th>
                <th className="py-4 px-5">Invoices Processed</th>
                <th className="py-4 px-5">Cumulative Amount Paid</th>
                <th className="py-4 px-5">Average Risk Score</th>
                <th className="py-4 px-5">Risk Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {dummyVendorSummary.map((v, idx) => (
                <tr key={idx} className="hover:bg-cosmic-800/40 transition-colors">
                  <td className="py-4 px-5 font-bold text-slate-100">{v.vendor}</td>
                  <td className="py-4 px-5 font-mono">{v.total_invoices}</td>
                  <td className="py-4 px-5 font-mono font-extrabold text-slate-100 text-sm">{formatCurrency(v.total_amount)}</td>
                  <td className="py-4 px-5 font-mono">
                    <span className={`font-extrabold ${v.avg_risk >= 70 ? 'text-rose-400' : v.avg_risk >= 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {v.avg_risk} / 100
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <Badge level={v.risk_status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
