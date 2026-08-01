import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ShieldAlert, ShieldCheck, AlertTriangle,
  Building2, CalendarDays, Cpu, Hash,
  CircleDollarSign, FileText, ReceiptText, Sparkles,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge  from '../components/ui/Badge';
import { dummyInvoices } from '../data/dummyData';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const RiskMeter = ({ score }) => {
  const color =
    score >= 70 ? '#f43f5e'
    : score >= 40 ? '#f59e0b'
    : '#10b981';

  return (
    <div className="space-y-2.5">
      <div className="flex items-end justify-between text-xs font-mono">
        <span className="text-slate-500 dark:text-gray-400 font-medium">Risk Assessment Score</span>
        <span className="text-3xl font-extrabold tracking-tight" style={{ color }}>{score}</span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 dark:bg-white/[0.05] rounded-full overflow-hidden border border-slate-200 dark:border-white/[0.08] p-0.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="h-full rounded-full shadow-sm"
          style={{ background: color, boxShadow: `0 0 10px ${color}80` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-500 dark:text-gray-500 font-mono font-medium">
        <span>0 — Verified Clean</span>
        <span>50 — Moderate</span>
        <span>100 — Critical Flag</span>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, mono = false, icon: Icon }) => (
  <div className="flex items-center gap-3 py-3 border-b border-slate-200/60 dark:border-white/[0.04] last:border-0">
    {Icon && <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-gray-400 w-32 shrink-0">{label}</span>
    <span className={`text-xs sm:text-sm font-semibold text-slate-900 dark:text-gray-200 break-all ${mono ? 'font-mono' : ''}`}>{value}</span>
  </div>
);

export default function InvoiceDetailsPage() {
  const navigate       = useNavigate();
  const [params]       = useSearchParams();
  const id             = params.get('id') ?? 'INV_001';
  const inv            = dummyInvoices.find(i => i.invoice_id === id) ?? dummyInvoices[0];

  const isHigh   = inv.risk_score >= 70;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 flex-wrap sm:flex-nowrap"
      >
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate(-1)}>
          Back
        </Button>
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-500/20">
            Audit Report
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight mt-1">{inv.invoice_number}</h1>
        </div>
        <Badge level={inv.risk_level} className="text-xs px-4 py-1.5" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: Invoice Info ── */}
        <motion.div 
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >

          {/* Core fields */}
          <div className="glass-card p-7 space-y-1 border border-slate-200/80 dark:border-white/[0.06] bg-white/80 dark:bg-[#0c101d]/70 backdrop-blur-xl rounded-3xl">
            <p className="text-xs font-bold text-slate-900 dark:text-gray-200 mb-4 flex items-center gap-2 pb-4 border-b border-slate-200/80 dark:border-white/[0.05]">
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Invoice Information Summary
            </p>
            <DetailRow icon={Building2}       label="Vendor"         value={inv.vendor}           />
            <DetailRow icon={Hash}            label="Invoice #"      value={inv.invoice_number}   mono />
            <DetailRow icon={Hash}            label="GSTIN"          value={inv.gstin}            mono />
            <DetailRow icon={CalendarDays}    label="Date"           value={inv.invoice_date}     mono />
            <DetailRow icon={CircleDollarSign} label="Subtotal"      value={fmt(inv.subtotal)}    mono />
            <DetailRow icon={ReceiptText}     label="GST"            value={fmt(inv.gst)}         mono />
            <DetailRow icon={CircleDollarSign} label="Total Amount"  value={fmt(inv.total)}       mono />
          </div>

          {/* Line Items */}
          <motion.div 
            className="glass-card overflow-hidden border border-slate-200/80 dark:border-white/[0.06] bg-white/80 dark:bg-[#0c101d]/70 backdrop-blur-xl rounded-3xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="px-7 py-5 border-b border-slate-200/80 dark:border-white/[0.05] bg-slate-50/50 dark:bg-white/[0.02]">
              <p className="text-xs font-bold text-slate-900 dark:text-gray-200 flex items-center gap-2">
                <ReceiptText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Line Item Breakdown
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-full">
                <thead>
                  <tr className="bg-slate-100/60 dark:bg-white/[0.02] text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-gray-400 border-b border-slate-200/80 dark:border-white/[0.05]">
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-right">Qty</th>
                    <th className="px-6 py-4 text-right">Unit Price</th>
                    <th className="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-white/[0.04]">
                  {inv.line_items.map(item => (
                    <tr key={item.id} className="table-row-hover hover:bg-slate-100/60 dark:hover:bg-white/[0.02]">
                      <td className="px-6 py-4 text-slate-400 dark:text-gray-500 font-mono font-semibold">{item.id}</td>
                      <td className="px-6 py-4 text-slate-800 dark:text-gray-200 font-medium">{item.description}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-gray-400 font-mono text-right font-medium">{item.quantity}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-gray-400 font-mono text-right font-medium">{fmt(item.unit_price)}</td>
                      <td className="px-6 py-4 text-slate-900 dark:text-gray-100 font-mono font-bold text-right">{fmt(item.total)}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100/80 dark:bg-white/[0.03] font-bold border-t border-slate-200 dark:border-white/[0.06]">
                    <td colSpan={4} className="px-6 py-4 text-right text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider">Calculated Total</td>
                    <td className="px-6 py-4 text-right font-mono text-indigo-700 dark:text-indigo-300 text-sm">{fmt(inv.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right: Risk Panel ── */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >

          {/* Risk Score */}
          <div className="glass-card p-6 space-y-5 border border-slate-200/80 dark:border-white/[0.06] bg-white/80 dark:bg-[#0c101d]/70 backdrop-blur-xl rounded-3xl">
            <p className="text-xs font-bold text-slate-900 dark:text-gray-200 flex items-center gap-2 pb-3 border-b border-slate-200/80 dark:border-white/[0.05]">
              <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              AI Risk Assessment
            </p>
            <RiskMeter score={inv.risk_score} />
            <div className="pt-2">
              <Badge level={inv.risk_level} className="w-full justify-center text-xs px-4 py-2.5 rounded-xl" />
            </div>
          </div>

          {/* Anomalies */}
          {inv.anomalies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className={`glass-card p-6 space-y-4 rounded-3xl border ${isHigh ? 'border-rose-200 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-600/10 shadow-sm' : 'border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-600/10'}`}
            >
              <p className={`text-xs font-bold flex items-center gap-2 ${isHigh ? 'text-rose-700 dark:text-rose-300' : 'text-amber-800 dark:text-amber-300'}`}>
                <ShieldAlert className="w-4.5 h-4.5" />
                Anomalies Flagged ({inv.anomalies.length})
              </p>
              <ul className="space-y-2.5">
                {inv.anomalies.map((a, i) => (
                  <motion.li
                    key={i}
                    className={`flex items-start gap-2.5 text-xs p-3 rounded-2xl border font-medium ${
                      isHigh
                        ? 'bg-white text-rose-900 border-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:border-rose-500/20'
                        : 'bg-white text-amber-900 border-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:border-amber-500/20'
                    }`}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{a}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* AI Explanation */}
          <motion.div 
            className="glass-card p-6 space-y-3 border border-slate-200/80 dark:border-white/[0.06] bg-white/80 dark:bg-[#0c101d]/70 backdrop-blur-xl rounded-3xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs font-bold text-slate-900 dark:text-gray-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Gemini AI Forensic Explanation
            </p>
            <p className="text-xs text-slate-600 dark:text-gray-300 font-normal leading-relaxed">{inv.ai_explanation}</p>
          </motion.div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button variant="primary" size="md" icon={ShieldCheck} className="w-full">
              Approve &amp; Settle Invoice
            </Button>
            <Button variant="secondary" size="md" icon={ArrowLeft} className="w-full" onClick={() => navigate('/upload')}>
              Re-Upload Document
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
