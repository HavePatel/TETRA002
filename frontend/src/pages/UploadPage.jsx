import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UploadCloud, ShieldCheck, FileText, Cpu,
  CheckCircle2,
} from 'lucide-react';
import UploadBox from '../components/ui/UploadBox';

const INFO_STEPS = [
  {
    icon: UploadCloud,
    label: 'Step 1 — Upload Document',
    body:  'Drop a PDF or image of your invoice. Supports multi-page PDFs up to 10 MB.',
    color: 'indigo',
  },
  {
    icon: Cpu,
    label: 'Step 2 — PaddleOCR Field Extraction',
    body:  'PaddleOCR extracts key fields: vendor, GSTIN, line-items, subtotal, and tax.',
    color: 'violet',
  },
  {
    icon: ShieldCheck,
    label: 'Step 3 — Gemini AI Risk Scoring',
    body:  'Gemini AI cross-validates master DB records and calculates a 0–100 risk rating.',
    color: 'emerald',
  },
];

const COLORS = {
  indigo:  'text-indigo-600 dark:text-indigo-400 bg-indigo-50 border-indigo-200 dark:bg-indigo-500/15 dark:border-indigo-500/30',
  violet:  'text-violet-600 dark:text-violet-400 bg-violet-50 border-violet-200 dark:bg-violet-500/15 dark:border-violet-500/30',
  emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/15 dark:border-emerald-500/30',
};

export default function UploadPage() {
  const navigate  = useNavigate();
  const [done, setDone] = useState(false);

  const handleSuccess = (_file) => {
    setDone(true);
    setTimeout(() => navigate('/invoice?id=INV_001'), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-500/20">
          Document Intake
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight pt-2">Upload &amp; Audit Invoice</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 font-normal">
          Upload an invoice document to trigger the automated PaddleOCR &amp; Gemini AI risk evaluation pipeline.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Upload box ── */}
        <motion.div 
          className="lg:col-span-2 glass-card p-6 sm:p-8 space-y-6 border border-slate-200/80 dark:border-white/[0.06] bg-white/80 dark:bg-[#0c101d]/70 backdrop-blur-xl rounded-3xl"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900 dark:text-gray-200 border-b border-slate-200/80 dark:border-white/[0.05] pb-4">
            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Invoice Intake Dropzone
          </div>

          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-5 py-16 text-center"
            >
              <motion.div 
                className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center shadow-sm"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </motion.div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Analysis Complete</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 font-normal">Redirecting to full audit report...</p>
              </div>
              <div className="w-56 h-1.5 bg-slate-100 dark:bg-white/[0.05] rounded-full overflow-hidden border border-slate-200 dark:border-white/[0.08]">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2 }}
                />
              </div>
            </motion.div>
          ) : (
            <UploadBox onUploadSuccess={handleSuccess} />
          )}
        </motion.div>

        {/* ── Right: Info cards ── */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {INFO_STEPS.map((step, i) => {
            const c = COLORS[step.color] ?? COLORS.indigo;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="glass-card p-5 space-y-3 border border-slate-200/80 dark:border-white/[0.06] bg-white/70 dark:bg-[#0c101d]/60 backdrop-blur-xl rounded-2xl"
              >
                <motion.div 
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border ${c}`}
                  whileHover={{ scale: 1.08 }}
                >
                  <step.icon className="w-5 h-5" />
                </motion.div>
                <p className="text-xs font-bold text-slate-900 dark:text-gray-200 tracking-tight">{step.label}</p>
                <p className="text-[12px] text-slate-500 dark:text-gray-400 font-normal leading-relaxed">{step.body}</p>
              </motion.div>
            );
          })}

          {/* Supported formats */}
          <motion.div 
            className="glass-card p-5 space-y-3 border border-slate-200/80 dark:border-white/[0.06] bg-white/70 dark:bg-[#0c101d]/60 backdrop-blur-xl rounded-2xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-gray-400">Supported Formats</p>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                ['PDF', 'text-indigo-600 dark:text-indigo-400'],
                ['PNG', 'text-violet-600 dark:text-violet-400'],
                ['JPG', 'text-cyan-600 dark:text-cyan-400'],
                ['JPEG','text-cyan-600 dark:text-cyan-400'],
              ].map(([f, c]) => (
                <motion.div 
                  key={f} 
                  className="flex items-center gap-2 text-[11px] font-mono font-semibold text-slate-700 dark:text-gray-300 bg-slate-100 dark:bg-white/[0.03] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.06]"
                  whileHover={{ x: 2 }}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${c}`} />
                  .{f.toLowerCase()}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
