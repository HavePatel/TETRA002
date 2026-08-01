import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Menu, X, Bell, PlusCircle, Search, Sparkles, CheckCircle2, ChevronDown, Cpu, Command } from 'lucide-react';
import Button from '../ui/Button';

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-cosmic-950/80 border-b border-white/10 sticky top-0 z-40 backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between shadow-glass">
      {/* Left: Brand Logo Pod & Mobile Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-cosmic-800 focus:outline-none transition-colors"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-glow-indigo group-hover:scale-105 transition-transform duration-300">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wider text-ai-gradient">
                InvoiceGuard AI
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-400 -mt-0.5 hidden sm:block tracking-wide">
              Autonomous Risk & Fraud Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Middle Search & Status Bar */}
      <div className="hidden lg:flex items-center gap-3">
        <div 
          onClick={() => navigate('/dashboard')} 
          className="px-4 py-1.5 rounded-xl bg-cosmic-900/80 border border-white/10 text-xs text-slate-400 flex items-center gap-3 cursor-pointer hover:border-indigo-500/40 transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Quick search invoices, vendors, GSTIN...</span>
          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-cosmic-950 px-1.5 py-0.5 rounded border border-slate-800">
            <Command className="w-3 h-3" /> K
          </div>
        </div>
      </div>

      {/* Right: Quick Actions & User Avatar */}
      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          size="sm"
          icon={PlusCircle}
          onClick={() => navigate('/upload')}
          className="hidden sm:inline-flex"
        >
          Scan Invoice
        </Button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-cosmic-800/80 rounded-xl relative transition-colors border border-transparent hover:border-white/10"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl shadow-glass p-4 z-50 space-y-3 border border-white/10"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Audit Intelligence Alerts</h4>
                  <span className="text-[10px] font-mono text-indigo-400 font-bold">2 Critical</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div 
                    onClick={() => { navigate('/invoice?id=INV_001'); setShowNotifications(false); }}
                    className="p-3 rounded-xl bg-cosmic-950/80 hover:bg-cosmic-800/60 cursor-pointer border border-rose-500/30 transition-colors"
                  >
                    <div className="font-bold text-rose-300">High Risk Flag — INV1001</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">GSTIN mismatch with Master Vendor Database.</div>
                  </div>
                  <div 
                    onClick={() => { navigate('/invoice?id=INV_004'); setShowNotifications(false); }}
                    className="p-3 rounded-xl bg-cosmic-950/80 hover:bg-cosmic-800/60 cursor-pointer border border-rose-500/30 transition-colors"
                  >
                    <div className="font-bold text-rose-300">Bank Account Anomaly — INV1004</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Header bank details differ from verified record.</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-6 w-[1px] bg-slate-800"></div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-1 cursor-pointer group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-500 p-[1.5px] group-hover:scale-105 transition-transform shadow-glow-indigo">
            <div className="w-full h-full rounded-2xl bg-cosmic-950 flex items-center justify-center text-xs font-extrabold text-slate-200">
              AUD
            </div>
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">Lead Auditor</div>
            <div className="text-[10px] text-slate-400 font-mono">InvoiceGuard AI</div>
          </div>
        </div>
      </div>
    </header>
  );
}
