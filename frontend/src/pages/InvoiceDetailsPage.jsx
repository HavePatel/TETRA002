import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { dummyInvoices } from '../data/dummyData';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowLeft, 
  Download, 
  Building2, 
  Calendar, 
  Hash, 
  Receipt,
  Check,
  Code2,
  ListFilter
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function InvoiceDetailsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const invoiceIdParam = searchParams.get('id') || 'INV_001';

  const [selectedInvoice, setSelectedInvoice] = useState(
    dummyInvoices.find(inv => inv.invoice_id === invoiceIdParam) || dummyInvoices[0]
  );
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'json'

  useEffect(() => {
    const found = dummyInvoices.find(inv => inv.invoice_id === invoiceIdParam);
    if (found) setSelectedInvoice(found);
  }, [invoiceIdParam]);

  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleDownloadReport = () => {
    toast.success(`Audit report for ${selectedInvoice.invoice_number} generated (PDF)`);
  };

  const handleApproveInvoice = () => {
    toast.success(`Invoice ${selectedInvoice.invoice_number} marked as Verified & Approved.`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={ArrowLeft} onClick={() => navigate('/dashboard')}>
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-100 font-mono tracking-tight">
                {selectedInvoice.invoice_number}
              </h1>
              <Badge level={selectedInvoice.risk_level} status={selectedInvoice.status} />
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Invoice ID: <span className="text-slate-300 font-bold">{selectedInvoice.invoice_id}</span>
            </p>
          </div>
        </div>

        {/* Invoice Selector Dropdown & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedInvoice.invoice_id}
            onChange={(e) => {
              const found = dummyInvoices.find(inv => inv.invoice_id === e.target.value);
              if (found) {
                setSelectedInvoice(found);
                navigate(`/invoice?id=${found.invoice_id}`);
              }
            }}
            className="bg-cosmic-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
          >
            {dummyInvoices.map(inv => (
              <option key={inv.invoice_id} value={inv.invoice_id}>
                {inv.invoice_number} — {inv.vendor} ({inv.risk_level})
              </option>
            ))}
          </select>

          <Button variant="outline" size="sm" icon={Download} onClick={handleDownloadReport}>
            Export Report
          </Button>
          <Button variant="primary" size="sm" icon={Check} onClick={handleApproveInvoice}>
            Approve Audit
          </Button>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Metadata & Line Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata Card strictly matching JSON Schema */}
          <div className="glass-panel rounded-3xl p-6 shadow-glass space-y-4 border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-sm font-extrabold text-slate-200 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-indigo-400" /> Extracted Invoice Data Contract
              </h3>
              
              {/* Tab Switcher */}
              <div className="flex items-center gap-1 bg-cosmic-950 p-1 rounded-xl border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('summary')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                    activeTab === 'summary' ? 'bg-indigo-600 text-white shadow-glow-indigo' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" /> Form View
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('json')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                    activeTab === 'json' ? 'bg-indigo-600 text-white shadow-glow-indigo' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" /> JSON Schema
                </button>
              </div>
            </div>

            {activeTab === 'summary' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-cosmic-950/80 border border-white/10">
                  <span className="text-[10px] font-extrabold text-slate-400 flex items-center gap-1 mb-1 uppercase tracking-wider">
                    <Building2 className="w-3 h-3 text-slate-500" /> vendor
                  </span>
                  <span className="font-extrabold text-slate-100 text-sm block">{selectedInvoice.vendor}</span>
                </div>

                <div className="p-4 rounded-2xl bg-cosmic-950/80 border border-white/10">
                  <span className="text-[10px] font-extrabold text-slate-400 flex items-center gap-1 mb-1 uppercase tracking-wider">
                    <Hash className="w-3 h-3 text-slate-500" /> gstin
                  </span>
                  <span className="font-mono font-bold text-slate-200 text-sm block">{selectedInvoice.gstin}</span>
                </div>

                <div className="p-4 rounded-2xl bg-cosmic-950/80 border border-white/10">
                  <span className="text-[10px] font-extrabold text-slate-400 flex items-center gap-1 mb-1 uppercase tracking-wider">
                    <Calendar className="w-3 h-3 text-slate-500" /> invoice_date
                  </span>
                  <span className="font-mono font-bold text-slate-200 text-sm block">{selectedInvoice.invoice_date}</span>
                </div>

                <div className="p-4 rounded-2xl bg-cosmic-950/80 border border-white/10">
                  <span className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider">subtotal</span>
                  <span className="font-mono font-bold text-slate-200 text-sm block">
                    {formatCurrency(selectedInvoice.subtotal, selectedInvoice.currency)}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-cosmic-950/80 border border-white/10">
                  <span className="text-[10px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider">gst</span>
                  <span className="font-mono font-bold text-slate-200 text-sm block">
                    {formatCurrency(selectedInvoice.gst, selectedInvoice.currency)}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-cosmic-950/80 border border-indigo-500/30 bg-indigo-500/5 shadow-glow-indigo">
                  <span className="text-[10px] font-extrabold text-indigo-300 block mb-1 uppercase tracking-wider">total</span>
                  <span className="font-mono font-extrabold text-indigo-400 text-base block">
                    {formatCurrency(selectedInvoice.total, selectedInvoice.currency)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-cosmic-950 border border-white/10 font-mono text-xs text-indigo-300 overflow-x-auto shadow-inner">
                <pre>{JSON.stringify({
                  invoice_id: selectedInvoice.invoice_id,
                  invoice_number: selectedInvoice.invoice_number,
                  vendor: selectedInvoice.vendor,
                  gstin: selectedInvoice.gstin,
                  invoice_date: selectedInvoice.invoice_date,
                  subtotal: selectedInvoice.subtotal,
                  gst: selectedInvoice.gst,
                  total: selectedInvoice.total,
                  currency: selectedInvoice.currency
                }, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* Line Items Table */}
          <div className="glass-panel rounded-3xl p-6 shadow-glass space-y-4 border border-white/10">
            <h3 className="text-sm font-extrabold text-slate-200 border-b border-white/10 pb-4">
              Invoice Itemized Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider font-extrabold">
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {(selectedInvoice.line_items || []).map((item) => (
                    <tr key={item.id} className="hover:bg-cosmic-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-100">{item.description}</td>
                      <td className="py-3.5 px-4 text-center font-mono">{item.quantity}</td>
                      <td className="py-3.5 px-4 text-right font-mono">{formatCurrency(item.unit_price, selectedInvoice.currency)}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-extrabold text-slate-100">{formatCurrency(item.total, selectedInvoice.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Risk Meter + AI Explanation */}
        <div className="space-y-6">
          {/* Circular Risk Score Gauge */}
          <div className="glass-panel rounded-3xl p-6 shadow-glass text-center space-y-4 border border-white/10">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Risk Score Assessment
            </h3>

            <div className="relative inline-flex items-center justify-center">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`w-36 h-36 rounded-full border-8 flex flex-col items-center justify-center shadow-lg ${
                  selectedInvoice.risk_score >= 70
                    ? 'border-rose-500 bg-rose-500/10 shadow-glow-rose'
                    : selectedInvoice.risk_score >= 30
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-emerald-500 bg-emerald-500/10 shadow-glow-emerald'
                }`}
              >
                <span className="text-4xl font-extrabold font-mono text-slate-100">
                  {selectedInvoice.risk_score}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">out of 100</span>
              </motion.div>
            </div>

            <div>
              <Badge level={selectedInvoice.risk_level} className="text-sm px-3.5 py-1.5" />
            </div>
          </div>

          {/* AI Explanation Rationale Card */}
          <div className="glass-panel rounded-3xl p-6 shadow-glass space-y-3 border border-white/10">
            <h3 className="text-sm font-extrabold text-slate-200 flex items-center gap-2 border-b border-white/10 pb-4">
              <Sparkles className="w-4 h-4 text-indigo-400" /> AI Audit Insights (Gemini 1.5)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-cosmic-950 p-4 rounded-2xl border border-white/10 font-sans">
              "{selectedInvoice.ai_explanation}"
            </p>
          </div>

          {/* Detected Anomalies */}
          <div className="glass-panel rounded-3xl p-6 shadow-glass space-y-3 border border-white/10">
            <h3 className="text-sm font-extrabold text-slate-200 flex items-center gap-2 border-b border-white/10 pb-4">
              <ShieldAlert className="w-4 h-4 text-rose-400" /> Detected Compliance Anomalies
            </h3>

            {(!selectedInvoice.anomalies || selectedInvoice.anomalies.length === 0) ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/30 shadow-glow-emerald font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Zero compliance anomalies detected. Invoice is safe for settlement.</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {selectedInvoice.anomalies.map((anomaly, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 shadow-glow-rose">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="font-semibold">{anomaly}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
