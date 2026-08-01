import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from './Badge';
import Button from './Button';
import Skeleton from './Skeleton';
import { Eye, Search, Filter, X, ArrowUpDown, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function InvoiceTable({ invoices = [], showHeaderActions = true, limit, isLoading = false }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('All');

  // Filter invoices
  const filteredInvoices = invoices.filter(item => {
    const matchesSearch = 
      item.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.gstin.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = 
      filterRisk === 'All' || 
      (filterRisk === 'High' && (item.risk_level?.includes('High') || item.risk_score >= 70)) ||
      (filterRisk === 'Medium' && (item.risk_level?.includes('Medium') || (item.risk_score >= 30 && item.risk_score < 70))) ||
      (filterRisk === 'Low' && (item.risk_level?.includes('Low') || item.risk_score < 30));

    return matchesSearch && matchesRisk;
  });

  const displayedInvoices = limit ? filteredInvoices.slice(0, limit) : filteredInvoices;

  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="glass-panel rounded-3xl overflow-hidden shadow-glass border border-white/10">
      {showHeaderActions && (
        <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cosmic-950/60">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoice #, vendor, GSTIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cosmic-900/90 border border-white/10 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Risk Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'High', 'Medium', 'Low'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setFilterRisk(level)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  filterRisk === level
                    ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/50 shadow-glow-indigo'
                    : 'bg-cosmic-900/60 text-slate-400 hover:text-slate-100 border border-white/5 hover:bg-cosmic-800/60'
                }`}
              >
                {level === 'All' ? 'All Invoices' : `${level} Risk`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-cosmic-950/80 text-slate-400 font-extrabold uppercase tracking-widest text-[10px]">
              <th className="py-4 px-5">Invoice #</th>
              <th className="py-4 px-5">Vendor & GSTIN</th>
              <th className="py-4 px-5">Date</th>
              <th className="py-4 px-5">Subtotal / GST</th>
              <th className="py-4 px-5">Total Amount</th>
              <th className="py-4 px-5">Risk Level</th>
              <th className="py-4 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx}>
                  <td className="py-4 px-5"><Skeleton className="h-4 w-20" /></td>
                  <td className="py-4 px-5"><Skeleton className="h-4 w-32" /></td>
                  <td className="py-4 px-5"><Skeleton className="h-4 w-24" /></td>
                  <td className="py-4 px-5"><Skeleton className="h-4 w-24" /></td>
                  <td className="py-4 px-5"><Skeleton className="h-4 w-20" /></td>
                  <td className="py-4 px-5"><Skeleton className="h-4 w-20" /></td>
                  <td className="py-4 px-5 text-right"><Skeleton className="h-8 w-16 ml-auto" /></td>
                </tr>
              ))
            ) : displayedInvoices.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400 space-y-2">
                  <ShieldAlert className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-sm font-bold text-slate-300">No matching invoices found</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try adjusting your search query or clearing risk filters to inspect other transactions.
                  </p>
                </td>
              </tr>
            ) : (
              displayedInvoices.map((inv, index) => (
                <motion.tr 
                  key={inv.invoice_id} 
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                  className="hover:bg-cosmic-800/40 transition-colors duration-150 group"
                >
                  <td className="py-4 px-5 font-mono font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                    {inv.invoice_number}
                  </td>
                  <td className="py-4 px-5">
                    <div className="font-bold text-slate-100">{inv.vendor}</div>
                    <div className="text-[10px] font-mono text-slate-400">{inv.gstin}</div>
                  </td>
                  <td className="py-4 px-5 text-slate-400 font-mono">
                    {inv.invoice_date}
                  </td>
                  <td className="py-4 px-5 text-slate-400 font-mono">
                    <div>{formatCurrency(inv.subtotal, inv.currency)}</div>
                    <div className="text-[10px] text-slate-500">+ GST {formatCurrency(inv.gst, inv.currency)}</div>
                  </td>
                  <td className="py-4 px-5 font-mono font-extrabold text-slate-100 text-sm">
                    {formatCurrency(inv.total, inv.currency)}
                  </td>
                  <td className="py-4 px-5">
                    <Badge level={inv.risk_level} status={inv.status} />
                  </td>
                  <td className="py-4 px-5 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                      onClick={() => navigate(`/invoice?id=${inv.invoice_id}`)}
                      className="opacity-80 group-hover:opacity-100"
                    >
                      Inspect
                    </Button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
