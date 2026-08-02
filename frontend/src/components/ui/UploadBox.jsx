import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AnimatePresence, motion } from 'framer-motion';
import {
  UploadCloud, X, CheckCircle2, RefreshCw, Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from './Button';

const STAGES = [
  { key: 'ocr', label: 'PaddleOCR Extraction', pct: 33  },
  { key: 'gst', label: 'GSTIN Validation',      pct: 66  },
  { key: 'ai',  label: 'Gemini AI Scoring',     pct: 100 },
];

export default function UploadBox({ onUploadSuccess }) {
  const [file,     setFile]     = useState(null);
  const [scanning, setScanning] = useState(false);
  const [stage,    setStage]    = useState(null); // null | 'ocr' | 'gst' | 'ai' | 'done'

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length) { toast.error('Invalid file. Accepted: PDF, PNG, JPG.'); return; }
    if (accepted.length) { setFile(accepted[0]); setStage(null); toast.success(`File loaded: ${accepted[0].name}`); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleAnalyze = async () => {
    if (!file) { toast.error('Please select an invoice document first.'); return; }
    setScanning(true);
    setStage('ocr');
    toast.loading('Stage 1 / 3 — PaddleOCR extraction…', { id: 'scan' });

    // Start backend request
    const formData = new FormData();
    formData.append('file', file);

    const uploadPromise = fetch('http://localhost:8000/upload', {
      method: 'POST',
      body: formData,
    }).then(async (res) => {
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to upload invoice');
      }
      return res.json();
    });

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      await delay(1100);
      setStage('gst');
      toast.loading('Stage 2 / 3 — GSTIN validation…', { id: 'scan' });

      await delay(1100);
      setStage('ai');
      toast.loading('Stage 3 / 3 — Gemini AI scoring…', { id: 'scan' });

      // Wait for both the minimum animation duration (additional 1.2s to reach 3.4s)
      // and the backend upload request response.
      const [_, result] = await Promise.all([
        delay(1200),
        uploadPromise,
      ]);

      setScanning(false);
      setStage('done');
      toast.success('Analysis complete!', { id: 'scan' });
      onUploadSuccess?.(result.invoice?.invoice_id);
    } catch (error) {
      setScanning(false);
      setStage(null);
      toast.error(error.message || 'Error processing invoice', { id: 'scan' });
    }
  };

  const pct = STAGES.find(s => s.key === stage)?.pct ?? (stage === 'done' ? 100 : 0);

  return (
    <div className="space-y-6">
      {/* ── Drop Zone ── */}
      <motion.div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer
          transition-all duration-300 relative overflow-hidden backdrop-blur-xl
          ${isDragActive
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 scale-[1.01] shadow-md'
            : file
              ? 'border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-500/5'
              : 'border-slate-300 dark:border-white/[0.1] bg-white/80 dark:bg-white/[0.02] hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/[0.04]'
          }
        `}
        whileHover={{ scale: isDragActive || file ? 1 : 1.008 }}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div 
                className="w-20 h-20 rounded-2xl bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center shadow-sm"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </motion.div>
              <div className="flex items-center gap-2.5">
                <p className="font-bold text-slate-900 dark:text-gray-100 font-mono text-sm tracking-tight">{file.name}</p>
                <motion.button
                  type="button"
                  onClick={e => { e.stopPropagation(); setFile(null); setStage(null); }}
                  className="p-1.5 rounded-xl text-slate-400 dark:text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/15 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-mono">
                {(file.size / 1024).toFixed(1)} KB · {file.type || 'document'}
              </p>
              <motion.span 
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/25 shadow-sm"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Ready for analysis
              </motion.span>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-5"
            >
              <motion.div 
                className={`w-20 h-20 rounded-2xl border flex items-center justify-center transition-all ${isDragActive ? 'bg-indigo-100 border-indigo-500 dark:bg-indigo-500/20 dark:border-indigo-400 shadow-md' : 'bg-slate-100/80 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.1]'}`}
                animate={{ y: isDragActive ? -4 : 0, scale: isDragActive ? 1.08 : 1 }}
              >
                <UploadCloud className={`w-10 h-10 ${isDragActive ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-400 dark:text-gray-400'}`} />
              </motion.div>
              <div className="space-y-1.5">
                <p className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {isDragActive ? 'Drop invoice document here...' : 'Drag & Drop Invoice Document'}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 font-normal">or click to browse your local filesystem</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-center pt-1">
                {['PDF', 'PNG', 'JPG', 'JPEG'].map(f => (
                  <motion.span 
                    key={f} 
                    className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    .{f.toLowerCase()}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Progress ── */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="glass-card p-6 space-y-4 border border-indigo-200 dark:border-indigo-500/25 bg-indigo-50/80 dark:bg-indigo-600/10 rounded-2xl"
          >
            <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-200">
              <span className="flex items-center gap-2 tracking-tight">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                AI Audit Pipeline Running…
              </span>
              <span className="font-mono text-sm text-indigo-700 dark:text-indigo-300">{pct}%</span>
            </div>

            <div className="w-full bg-slate-200 dark:bg-white/[0.05] rounded-full h-2 overflow-hidden border border-indigo-200 dark:border-indigo-500/20">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {STAGES.map(s => (
                <motion.div
                  key={s.key}
                  className={`py-2.5 px-3 rounded-xl text-center text-[11px] font-semibold border transition-all ${
                    stage === s.key
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm dark:bg-indigo-600/30 dark:border-indigo-500/50'
                      : (STAGES.findIndex(x => x.key === stage) > STAGES.findIndex(x => x.key === s.key) || stage === 'done')
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30'
                        : 'bg-white text-slate-400 border-slate-200 dark:bg-white/[0.02] dark:text-gray-500 dark:border-white/[0.05]'
                  }`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: STAGES.findIndex(x => x.key === s.key) * 0.05 }}
                >
                  {s.label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <p className="text-[12px] text-slate-500 dark:text-gray-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          Max file size 10 MB · Multi-page PDF, PNG, JPG supported
        </p>
        <Button
          variant="primary"
          size="md"
          icon={Sparkles}
          disabled={!file}
          isLoading={scanning}
          onClick={handleAnalyze}
          className="min-w-[160px]"
        >
          {scanning ? 'Analyzing…' : 'Analyze Invoice'}
        </Button>
      </div>
    </div>
  );
}
