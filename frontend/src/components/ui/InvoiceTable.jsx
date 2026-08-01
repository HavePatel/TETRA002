import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion }       from 'framer-motion';
import Badge    from './Badge';
import Button   from './Button';
import Skeleton from './Skeleton';
import EmptyState from './EmptyState';
import {
  Eye, Search, X, ArrowUpDown,
  ChevronLeft, ChevronRight,
} from 'lucide-react';

const PER_PAGE = 5;

const fmt = (n, cur = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(n);

const initials = (name = '') => {
  const w = name.trim().split(/\s+/);
  return w.length >= 2 ? (w[0][0] + w[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
};

export default function InvoiceTable({
  invoices = [],
  showHeaderActions = true,
  limit,
  isLoading = false,
}) {
  const navigate = useNavigate();
  const [query,      setQuery]      = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [sort,       setSort]       = useState({ key: 'invoice_date', dir: 'desc' });
  const [page,       setPage]       = useState(1);

  /* ── filter + sort ── */
  const filtered = useMemo(() => {
    return invoices
      .filter(inv => {
        const s = query.toLowerCase();
        const matchQ = !s ||
          inv.invoice_number.toLowerCase().includes(s) ||
          inv.vendor.toLowerCase().includes(s)         ||
          inv.gstin.toLowerCase().includes(s);

        const matchR =
          riskFilter === 'All'    ||
          (riskFilter === 'High'   && inv.risk_score >= 70) ||
          (riskFilter === 'Medium' && inv.risk_score >= 30 && inv.risk_score < 70) ||
          (riskFilter === 'Low'    && inv.risk_score < 30);

        return matchQ && matchR;
      })
      .sort((a, b) => {
        let va, vb;
        if (sort.key === 'total')   { va = a.total;       vb = b.total; }
        else if (sort.key === 'risk_score') { va = a.risk_score; vb = b.risk_score; }
        else { va = a[sort.key] ?? ''; vb = b[sort.key] ?? ''; }
        if (va < vb) return sort.dir === 'asc' ? -1 :  1;
        if (va > vb) return sort.dir === 'asc' ?  1 : -1;
        return 0;
      });
  }, [invoices, query, riskFilter, sort]);

  const pages   = Math.ceil(filtered.length / PER_PAGE);
  const visible = limit
    ? filtered.slice(0, limit)
    : filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSort = (key) =>
    setSort(p => p.key === key ? { key, dir: p.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' });

  const SortBtn = ({ col }) => (
    <button onClick={() => toggleSort(col)} className="ml-1 opacity-50 hover:opacity-100 transition-opacity">
      <ArrowUpDown className="w-3 h-3 inline text-indigo-600 dark:text-indigo-400" />
    </button>
  );

  /* ── Skeleton rows ── */
  if (isLoading) {
    return (
      <div className="glass-card overflow-hidden border border-slate-200 dark:border-white/[0.06]">
        <div className="divide-y divide-slate-200 dark:divide-white/[0.04]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <Skeleton className="w-9 h-9 rounded-xl" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-2.5 w-48" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden flex flex-col border border-slate-200/80 dark:border-white/[0.06] bg-white/70 dark:bg-[#0c101d]/60 backdrop-blur-xl">
      {/* ── Toolbar ── */}
      {showHeaderActions && (
        <motion.div 
          className="flex flex-col sm:flex-row gap-3.5 items-start sm:items-center justify-between p-5 border-b border-slate-200/80 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02]"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Search */}
          <div className="relative w-full sm:max-w-xs group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search invoice #, vendor, GSTIN…"
              className="w-full bg-white dark:bg-white/[0.03] backdrop-blur-md border border-slate-200 dark:border-white/[0.08] rounded-xl pl-10 pr-8 py-2 text-xs text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 outline-none focus-visible:border-indigo-500/50 focus-visible:bg-white transition-all"
            />
            {query && (
              <motion.button 
                onClick={() => setQuery('')} 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          {/* Risk chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['All', 'High', 'Medium', 'Low'].map(r => (
              <motion.button
                key={r}
                onClick={() => { setRiskFilter(r); setPage(1); }}
                className={`px-3.5 py-1.5 rounded-xl text-[11px] font-semibold border tracking-tight transition-all ${
                  riskFilter === r
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm dark:bg-indigo-600/25 dark:border-indigo-500/40'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900 dark:bg-white/[0.03] dark:text-gray-400 dark:border-white/[0.06] dark:hover:border-white/[0.12] dark:hover:text-gray-200'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {r === 'All' ? 'All Invoices' : `${r} Risk`}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[700px]">
          <thead>
            <tr className="bg-slate-100/60 dark:bg-white/[0.02] text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-gray-400 border-b border-slate-200/80 dark:border-white/[0.06]">
              <th className="px-6 py-4">
                Vendor
                <SortBtn col="vendor" />
              </th>
              <th className="px-6 py-4">Invoice #</th>
              <th className="px-6 py-4">
                Date
                <SortBtn col="invoice_date" />
              </th>
              <th className="px-6 py-4">
                Amount
                <SortBtn col="total" />
              </th>
              <th className="px-6 py-4">
                Risk Rating
                <SortBtn col="risk_score" />
              </th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200/60 dark:divide-white/[0.04]">
            {visible.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <EmptyState
                    title="No invoices match your filter"
                    description="Adjust the search query or risk filter."
                    actionLabel="Clear filters"
                    onAction={() => { setQuery(''); setRiskFilter('All'); }}
                  />
                </td>
              </tr>
            ) : visible.map((inv, i) => (
              <motion.tr
                key={inv.invoice_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => navigate(`/invoice?id=${inv.invoice_id}`)}
                className="table-row-hover cursor-pointer group border-b border-slate-200/50 dark:border-white/[0.03] last:border-0 hover:bg-slate-100/60 dark:hover:bg-indigo-500/[0.04]"
              >
                {/* Vendor */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3.5">
                    <motion.div 
                      className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-gradient-to-br dark:from-indigo-500/20 dark:via-indigo-600/15 dark:to-violet-600/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-[11px] font-extrabold text-indigo-700 dark:text-indigo-300 shrink-0 shadow-sm"
                      whileHover={{ scale: 1.08 }}
                    >
                      {initials(inv.vendor)}
                    </motion.div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">{inv.vendor}</p>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400 font-mono mt-0.5">{inv.gstin}</p>
                    </div>
                  </div>
                </td>

                {/* Invoice # */}
                <td className="px-6 py-4 font-mono text-slate-700 dark:text-gray-300 font-semibold text-xs">
                  {inv.invoice_number}
                </td>

                {/* Date */}
                <td className="px-6 py-4 text-slate-500 dark:text-gray-400 font-mono text-xs">
                  {inv.invoice_date}
                </td>

                {/* Amount */}
                <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-gray-100">
                  {fmt(inv.total, inv.currency)}
                </td>

                {/* Risk */}
                <td className="px-6 py-4">
                  <Badge level={inv.risk_level} />
                </td>

                {/* Action */}
                <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Eye}
                    onClick={() => navigate(`/invoice?id=${inv.invoice_id}`)}
                    className="opacity-70 group-hover:opacity-100 hover:text-indigo-600 dark:hover:text-indigo-300"
                  >
                    View
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {!limit && pages > 1 && (
        <motion.div 
          className="flex items-center justify-between px-6 py-4 border-t border-slate-200/80 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02] text-xs text-slate-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="font-mono">
            {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} invoices
          </span>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-transparent disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
              whileHover={{ scale: page === 1 ? 1 : 1.05 }}
              whileTap={{ scale: page === 1 ? 1 : 0.95 }}
            >
              <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-gray-300" />
            </motion.button>
            <span className="px-3 font-mono font-semibold text-slate-700 dark:text-gray-300">{page} / {pages}</span>
            <motion.button
              onClick={() => setPage(p => Math.min(p + 1, pages))}
              disabled={page === pages}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-transparent disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
              whileHover={{ scale: page === pages ? 1 : 1.05 }}
              whileTap={{ scale: page === pages ? 1 : 0.95 }}
            >
              <ChevronRight className="w-4 h-4 text-slate-600 dark:text-gray-300" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
