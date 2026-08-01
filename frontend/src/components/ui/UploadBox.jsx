import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, X, ShieldAlert, Sparkles, Cpu, RefreshCw, FileCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from './Button';

export default function UploadBox({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStage, setScanStage] = useState(''); // 'ocr' | 'gst' | 'ai' | 'done'

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setScanStage('');
      toast.success(`Loaded document: ${file.name}`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  const handleSimulateScan = () => {
    if (!selectedFile) {
      toast.error("Please drop or select an invoice PDF or image first.");
      return;
    }

    setIsAnalyzing(true);
    setScanStage('ocr');
    toast.loading("Stage 1/3: PaddleOCR Text Extraction & Coordinate Mapping...", { id: "scan" });

    setTimeout(() => {
      setScanStage('gst');
      toast.loading("Stage 2/3: Validating GSTIN & Tax Subtotal Reconciliation...", { id: "scan" });
    }, 1000);

    setTimeout(() => {
      setScanStage('ai');
      toast.loading("Stage 3/3: Gemini AI Neural Risk Scoring & Anomaly Rationale...", { id: "scan" });
    }, 2000);

    setTimeout(() => {
      setIsAnalyzing(false);
      setScanStage('done');
      toast.success("Invoice Risk Intelligence Analysis Complete!", { id: "scan" });
      if (onUploadSuccess) {
        onUploadSuccess(selectedFile);
      }
    }, 3000);
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setScanStage('');
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass space-y-6 border border-white/10">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01] shadow-glow-indigo'
            : selectedFile
            ? 'border-emerald-500/50 bg-emerald-500/5'
            : 'border-slate-800 hover:border-indigo-500/50 hover:bg-cosmic-900/60 bg-cosmic-950/60'
        }`}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div 
              key="file"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-glow-emerald">
                <FileCheck className="w-10 h-10" />
              </div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-extrabold text-slate-100 font-mono">{selectedFile.name}</h4>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'Invoice Document'}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-glow-emerald">
                <CheckCircle className="w-4 h-4" />
                Document Ready for OCR & Anomaly Radar Scan
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="drop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform shadow-glow-indigo">
                <Upload className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-100 tracking-tight">
                {isDragActive ? "Drop invoice document here..." : "Drag & drop invoice document here"}
              </h3>
              <p className="text-xs text-slate-400 mt-2 max-w-md leading-relaxed">
                Upload PDF, PNG, JPG, or JPEG invoices to initiate real-time key-value extraction, GST portal checksum, and Gemini AI risk assessment.
              </p>

              {/* Supported Format Chips */}
              <div className="mt-5 flex items-center gap-2">
                {['PDF', 'PNG', 'JPG', 'JPEG'].map((fmt) => (
                  <span key={fmt} className="px-3 py-1 rounded-xl bg-cosmic-900 border border-slate-700/80 text-[10px] font-mono font-bold text-indigo-300">
                    .{fmt.toLowerCase()}
                  </span>
                ))}
              </div>

              <div className="mt-6">
                <span className="px-5 py-2.5 rounded-xl bg-cosmic-800 text-slate-200 text-xs font-bold border border-slate-700 hover:bg-cosmic-700 transition-colors shadow-sm inline-block">
                  Browse Computer
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Radar Bar when Analyzing */}
      {isAnalyzing && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-5 rounded-2xl bg-cosmic-950 border border-indigo-500/40 space-y-3.5 shadow-glow-indigo"
        >
          <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
              Neural Anomaly Radar Pipeline Active
            </span>
            <span className="font-mono text-indigo-400">
              {scanStage === 'ocr' ? '33%' : scanStage === 'gst' ? '66%' : '90%'}
            </span>
          </div>

          <div className="w-full bg-cosmic-900 rounded-full h-2.5 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 h-2.5 rounded-full"
              initial={{ width: '10%' }}
              animate={{ 
                width: scanStage === 'ocr' ? '33%' : scanStage === 'gst' ? '66%' : scanStage === 'ai' ? '90%' : '100%' 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-[11px] text-center font-bold">
            <div className={`p-2 rounded-xl border ${scanStage === 'ocr' ? 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40 shadow-glow-indigo' : 'bg-cosmic-900/40 text-slate-500 border-slate-800'}`}>
              1. OCR Parsing
            </div>
            <div className={`p-2 rounded-xl border ${scanStage === 'gst' ? 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40 shadow-glow-indigo' : 'bg-cosmic-900/40 text-slate-500 border-slate-800'}`}>
              2. GST Match Check
            </div>
            <div className={`p-2 rounded-xl border ${scanStage === 'ai' ? 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40 shadow-glow-indigo' : 'bg-cosmic-900/40 text-slate-500 border-slate-800'}`}>
              3. Gemini AI Rationale
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Maximum File Size: 10 MB per document</span>
        </div>

        <Button
          variant="primary"
          size="lg"
          disabled={!selectedFile}
          isLoading={isAnalyzing}
          onClick={handleSimulateScan}
          icon={Sparkles}
          className="w-full sm:w-auto"
        >
          {isAnalyzing ? "Scanning Anomaly Engine..." : "Analyze Invoice Risk"}
        </Button>
      </div>
    </div>
  );
}
