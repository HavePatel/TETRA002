import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Upload,
  FileSearch,
  BarChart3,
  Settings,
  ShieldCheck,
  X,
  Cpu,
} from 'lucide-react';

const NAV = [
  { label: 'Dashboard',       path: '/dashboard', icon: LayoutDashboard },
  { label: 'Upload Invoice',  path: '/upload',    icon: Upload          },
  { label: 'Invoice Details', path: '/invoice',   icon: FileSearch      },
  { label: 'Analytics',       path: '/analytics', icon: BarChart3       },
  { label: 'Settings',        path: '/settings',  icon: Settings        },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 flex flex-col border-r border-slate-200/80 dark:border-white/[0.08]
        transition-transform duration-200 ease-in-out bg-white dark:bg-[#0E1320]
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* ── Brand Header ── */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/80 dark:border-white/[0.08]">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 group flex-1 text-left outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-sm shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                InvoiceGuard
              </p>
              <span className="text-[9px] font-extrabold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 px-1.5 py-0.5 rounded">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-gray-400 font-medium tracking-wider uppercase mt-1">Enterprise Audit Platform</p>
          </div>
        </button>

        {/* Mobile close */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#252F4C] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── Nav Items ── */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="px-3 mb-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-gray-400">
          Core Navigation
        </p>

        {NAV.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `
              group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium
              transition-colors duration-200 select-none outline-none
              ${isActive
                ? 'bg-[#EEF2FF] text-slate-900 font-semibold dark:bg-[#1D2540] dark:text-white'
                : 'text-slate-600 hover:bg-[#F8FAFC] hover:text-slate-900 dark:text-gray-400 dark:hover:bg-[#252F4C] dark:hover:text-white'
              }
            `}
          >
            {({ isActive }) => (
              <>
                {/* 4px Accent bar on the left */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-600 dark:bg-indigo-400 rounded-r" />
                )}
                <Icon className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-400 dark:text-gray-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                }`} />
                <span className="flex-1 tracking-tight">{label}</span>
              </>
            )}
          </NavLink>
        ))}

      </nav>

      {/* ── AI Engine Status Card ── */}
      <div className="mx-3.5 mb-5 p-4 rounded-2xl bg-slate-50 dark:bg-[#151B2D] border border-slate-200/80 dark:border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-gray-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            AI Core Status
          </div>
          <Cpu className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <p className="text-[11px] text-slate-600 dark:text-gray-400 leading-relaxed font-normal">
          PaddleOCR + Gemini 1.5 scanning active.
        </p>
        <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-slate-200/80 dark:border-white/[0.08]">
          <span className="text-slate-500 dark:text-gray-400">OCR Accuracy</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">99.4%</span>
        </div>
      </div>
    </aside>
  );
}
