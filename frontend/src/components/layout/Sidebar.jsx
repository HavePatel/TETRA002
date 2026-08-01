import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  FileSearch, 
  BarChart3, 
  ShieldCheck, 
  ChevronRight,
  Sparkles,
  Activity,
  Cpu
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Upload Invoice', path: '/upload', icon: Upload },
    { label: 'Invoice Details', path: '/invoice', icon: FileSearch },
    { label: 'Analytics & Risk', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <aside
      className={`fixed lg:static top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-cosmic-950/95 border-r border-white/10 z-30 transition-all duration-300 flex flex-col justify-between p-4 backdrop-blur-2xl shrink-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">
            Core Audit Operations
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end
                onClick={() => setIsOpen && setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer select-none relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/30 via-indigo-600/15 to-transparent text-indigo-200 border-l-4 border-indigo-500 shadow-glow-indigo'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-cosmic-800/60 border-l-4 border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />
              </NavLink>
            ))}
          </nav>
        </div>

        {/* AI Neural Engine Core Widget */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-cosmic-900 via-cosmic-950 to-indigo-950/50 border border-white/10 space-y-3 shadow-glass relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-extrabold text-slate-100">Gemini Neural Core</span>
            </div>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed relative z-10">
            PaddleOCR + Gemini 1.5 anomaly scanner operating in live audit mode.
          </p>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono relative z-10">
            <span className="text-slate-400">Processing Accuracy</span>
            <span className="font-extrabold text-emerald-400">99.4%</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <span className="font-mono text-slate-400 font-bold">InvoiceGuard AI v1.0</span>
        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
          <ShieldCheck className="w-3.5 h-3.5" /> Hackathon Active
        </span>
      </div>
    </aside>
  );
}
