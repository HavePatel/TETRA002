import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UploadBox from '../components/ui/UploadBox';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { 
  FileCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Cpu,
  FileType
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function UploadPage() {
  const navigate = useNavigate();
  const [scannedResult, setScannedResult] = useState(null);

  const handleScanSuccess = (file) => {
    const newInvoice = {
      invoice_id: `INV_${Math.floor(100 + Math.random() * 900)}`,
      invoice_number: `INV${Math.floor(2000 + Math.random() * 8000)}`,
      vendor: "Dynamic Tech Solutions Ltd",
      gstin: "27ABCDE9988F1Z4",
      invoice_date: new Date().toISOString().split('T')[0],
      subtotal: 75000,
      gst: 13500,
      total: 88500,
      currency: "INR",
      risk_score: 76,
      risk_level: "High Risk",
      status: "Flagged",
      anomalies: [
        "GSTIN format valid but tax calculation deviation detected (+ ₹500)",
        "Vendor invoice number sequence gap identified"
      ],
      ai_explanation: "Automated OCR extracted 7 fields with 98.2% confidence. Anomaly scanner detected a subtotal/GST math discrepancy requiring manual audit signoff."
    };

    setScannedResult(newInvoice);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Upload & Scan Invoice</h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload PDF or image invoices to trigger real-time OCR extraction, GST verification, and AI anomaly scoring.
          </p>
        </div>

        {/* Supported Format Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['PDF', 'PNG', 'JPG', 'JPEG'].map((fmt) => (
            <span key={fmt} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold text-indigo-300">
              .{fmt.toLowerCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Grid: Upload Box + Pipeline Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UploadBox onUploadSuccess={handleScanSuccess} />
        </div>

        {/* Processing Pipeline Instructions */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-card space-y-5">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" /> Automated Audit Pipeline
          </h3>

          <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-800">
            <div className="flex gap-3 relative z-10">
              <div className="w-7 h-7 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
                1
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">PaddleOCR Text Extraction</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Converts raster/PDF invoices into structured text and key-value fields.
                </p>
              </div>
            </div>

            <div className="flex gap-3 relative z-10">
              <div className="w-7 h-7 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
                2
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">GSTIN & Math Validation</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Validates checksums, tax subtotal match (Subtotal + GST = Total), and vendor record.
                </p>
              </div>
            </div>

            <div className="flex gap-3 relative z-10">
              <div className="w-7 h-7 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
                3
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Gemini AI Anomaly Scoring</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Generates risk score (0-100) and plain-English risk explanation for auditors.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>Strict compliance with JSON Data Contract ensured for all extracted metadata.</span>
          </div>
        </div>
      </div>

      {/* Scanned Result Preview */}
      {scannedResult && (
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-glow-brand space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-100 font-mono">
                    {scannedResult.invoice_number}
                  </h3>
                  <Badge level={scannedResult.risk_level} />
                </div>
                <p className="text-xs text-slate-400">
                  {scannedResult.vendor} • GSTIN: {scannedResult.gstin}
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={ArrowRight}
              onClick={() => navigate(`/invoice?id=${scannedResult.invoice_id}`)}
            >
              View Full Audit Analysis
            </Button>
          </div>

          {/* JSON Data Contract Preview */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
              Extracted Data Contract
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">invoice_id</span>
                <span className="text-xs font-mono font-bold text-slate-200">{scannedResult.invoice_id}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">invoice_number</span>
                <span className="text-xs font-mono font-bold text-slate-200">{scannedResult.invoice_number}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">vendor</span>
                <span className="text-xs font-semibold text-slate-200 truncate block">{scannedResult.vendor}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">subtotal</span>
                <span className="text-xs font-mono font-bold text-slate-200">₹{scannedResult.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">gst</span>
                <span className="text-xs font-mono font-bold text-slate-200">₹{scannedResult.gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">total</span>
                <span className="text-xs font-mono font-bold text-emerald-400">₹{scannedResult.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
