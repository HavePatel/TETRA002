import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ShieldCheck,
  Search,
  Bell,
  Menu,
  PlusCircle,
  RefreshCw,
  Users,
  Clock,
  Activity,
  Sun,
  Moon,
} from 'lucide-react';
import Button from '../ui/Button';
import toast from 'react-hot-toast';
import { dummyInvoices } from '../../data/dummyData';

const ALERTS = [
  { id: 1, title: 'High Risk — INV1001',     body: 'GSTIN mismatch, ABC Traders.',       href: '/invoice?id=INV_001', severity: 'danger'  },
  { id: 2, title: 'Bank Anomaly — INV1004',  body: 'Remittance details mismatch.',        href: '/invoice?id=INV_004', severity: 'danger'  },
  { id: 3, title: 'GST Warning — INV1003',   body: 'Tax rate discrepancy detected.',      href: '/invoice?id=INV_003', severity: 'warning' },
];

export default function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const [bellOpen, setBellOpen] = useState(false);
  const [time,     setTime]     = useState('');
  const [syncing,  setSyncing]  = useState(false);
  const [isDark,   setIsDark]   = useState(true);

  // Search Bar State & Ref
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen]   = useState(false);
  const searchInputRef = React.useRef(null);

  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return dummyInvoices.filter(
      (inv) =>
        inv.invoice_number.toLowerCase().includes(q) ||
        inv.vendor.toLowerCase().includes(q) ||
        inv.gstin.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    tick();
    const id = setInterval(tick, 30_000);

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(id);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      toast.success('Dark mode activated', { id: 'theme' });
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      toast.success('Light mode activated', { id: 'theme' });
    }
  };

  const handleSync = () => {
    setSyncing(true);
    toast.loading('Syncing audit state…', { id: 'sync' });
    setTimeout(() => { setSyncing(false); toast.success('Sync complete.', { id: 'sync' }); }, 900);
  };

  return (
    <header className="glass-panel border-b border-slate-200/80 dark:border-white/[0.06] bg-white/90 dark:bg-[#070a12]/80 backdrop-blur-xl h-16 flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-30 transition-colors duration-200">
      {/* Mobile hamburger */}
      <motion.button
        onClick={onToggleSidebar}
        className="lg:hidden p-2 rounded-xl text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Menu className="w-5 h-5" />
      </motion.button>

      {/* Brand — visible on mobile only */}
      <div className="flex items-center gap-2.5 lg:hidden">
        <motion.div 
          className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm"
          whileHover={{ scale: 1.05 }}
        >
          <ShieldCheck className="w-4.5 h-4.5 text-white" />
        </motion.div>
        <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">InvoiceGuard</span>
      </div>

      {/* ── Search bar ── */}
      <motion.div 
        className="hidden md:flex flex-1 max-w-md relative"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative w-full group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search invoice #, vendor, GSTIN... (⌘K)"
            className="w-full bg-slate-100/80 dark:bg-white/[0.03] backdrop-blur-md border border-slate-200 dark:border-white/[0.08] rounded-xl pl-10 pr-12 py-2 text-xs text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 outline-none focus-visible:border-indigo-500 focus-visible:bg-white dark:focus-visible:bg-[#151B2D] transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono text-slate-400 dark:text-gray-500 bg-slate-200/60 dark:bg-white/[0.05] px-1.5 py-0.5 rounded border border-slate-300/50 dark:border-white/[0.08]">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>

        {/* Live Search Results Dropdown Overlay */}
        <AnimatePresence>
          {searchOpen && searchQuery.trim() && (
            <>
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setSearchOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full mt-2 w-full z-50 bg-white dark:bg-[#151B2D] border border-slate-200 dark:border-white/[0.1] shadow-2xl rounded-2xl p-2.5 space-y-1 max-h-80 overflow-y-auto"
              >
                {searchResults.length > 0 ? (
                  searchResults.map((inv) => (
                    <button
                      key={inv.invoice_id}
                      onClick={() => {
                        navigate(`/invoice?id=${inv.invoice_id}`);
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors flex items-center justify-between gap-3 group"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                            {inv.invoice_number}
                          </span>
                          <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {inv.vendor}
                          </span>
                        </div>
                        <p className="text-[10px] font-mono text-slate-400 dark:text-gray-400 truncate mt-0.5">
                          GSTIN: {inv.gstin}
                        </p>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        inv.risk_score >= 70
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
                          : inv.risk_score >= 40
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                      }`}>
                        {inv.risk_level} ({inv.risk_score})
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400 dark:text-gray-500">
                    No matching invoices found for "{searchQuery}"
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Spacer */}
      <div className="flex-1 hidden md:block" />

      {/* ── Right cluster ── */}
      <div className="flex items-center gap-2.5 sm:gap-3">

        {/* ── Theme Switcher Button ── */}
        <motion.button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-xl text-slate-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] transition-all relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div
                key="moon"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-4.5 h-4.5 text-indigo-400" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-4.5 h-4.5 text-amber-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* System status */}
        <motion.div 
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300 text-[11px] font-semibold tracking-tight"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          System Online
        </motion.div>

        {/* Time */}
        <motion.div 
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] text-[11px] font-mono text-slate-600 dark:text-gray-400"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          {time}
        </motion.div>

        {/* Refresh */}
        <motion.button
          onClick={handleSync}
          className="p-2 rounded-xl text-slate-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-transparent hover:border-slate-200 dark:hover:border-white/[0.08] transition-colors hidden sm:block"
          title="Refresh sync"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin text-indigo-600 dark:text-indigo-400' : ''}`} />
        </motion.button>

        {/* Scan CTA */}
        <Button
          variant="primary"
          size="sm"
          icon={PlusCircle}
          onClick={() => navigate('/upload')}
          className="hidden sm:inline-flex"
        >
          Scan Invoice
        </Button>

        {/* Notifications */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
        >
          <motion.button
            onClick={() => setBellOpen(p => !p)}
            className="relative p-2 rounded-xl text-slate-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-transparent hover:border-slate-200 dark:hover:border-white/[0.08] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse" />
          </motion.button>

          <AnimatePresence>
            {bellOpen && (
              <>
                {/* Full-screen page dimming overlay (z-40) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="fixed inset-0 bg-[#0f172a]/12 dark:bg-black/35 z-40"
                  onClick={() => setBellOpen(false)}
                />

                {/* Opaque Notification Panel (z-50) */}
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full mt-2 w-80 sm:w-96 p-4 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl"
                >
                  <div className="flex items-center justify-between mb-3.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Audit Alerts</p>
                    </div>
                    <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-800/80">
                      {ALERTS.length} Active
                    </span>
                  </div>

                  <div className="space-y-2">
                    {ALERTS.map((a, i) => (
                      <motion.button
                        key={a.id}
                        onClick={() => { navigate(a.href); setBellOpen(false); }}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${
                          a.severity === 'danger'
                            ? 'bg-rose-50/80 border-rose-200 text-slate-900 hover:bg-rose-100 dark:bg-slate-800/80 dark:border-rose-900/60 dark:hover:bg-slate-800'
                            : 'bg-amber-50/80 border-amber-200 text-slate-900 hover:bg-amber-100 dark:bg-slate-800/80 dark:border-amber-900/60 dark:hover:bg-slate-800'
                        }`}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <p className={`font-bold text-xs ${a.severity === 'danger' ? 'text-rose-700 dark:text-rose-400' : 'text-amber-700 dark:text-amber-400'}`}>{a.title}</p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 font-normal leading-relaxed">{a.body}</p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Team avatar */}
        <motion.div 
          className="flex items-center gap-2.5 pl-1.5 cursor-pointer group"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.03 }}
        >
          <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 dark:bg-gradient-to-br dark:from-indigo-500/20 dark:via-indigo-600/30 dark:to-violet-600/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-xs font-extrabold text-indigo-700 dark:text-indigo-300 group-hover:border-indigo-400/60 transition-colors shadow-sm">
            <Users className="w-4 h-4" />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-800 dark:text-gray-200 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">Team TETRA002</p>
            <p className="text-[10px] text-slate-500 dark:text-gray-400 font-medium">Lead Auditor</p>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
