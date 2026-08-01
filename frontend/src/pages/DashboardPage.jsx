import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StatCard from '../components/ui/StatCard';
import InvoiceTable from '../components/ui/InvoiceTable';
import Button from '../components/ui/Button';
import { 
  dummyDashboardStats, 
  dummyInvoices, 
  dummyRiskDistribution, 
  dummyRiskTrend 
} from '../data/dummyData';
import { 
  FileText, 
  ShieldAlert, 
  Clock, 
  IndianRupee, 
  Upload, 
  ArrowRight,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  TrendingUp,
  CheckCircle2,
  Activity,
  Layers,
  ShieldCheck,
  Zap,
  Cpu,
  Lock,
  Search
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(true);

  const handleRefreshSync = () => {
    toast.success("Dashboard synced with latest OCR & Gemini AI audit logs.");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      {/* Massive Immersive Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-cosmic-950 via-indigo-950/50 to-cosmic-950 border border-white/10 p-8 sm:p-10 shadow-glass overflow-hidden bg-cyber-pattern">
        {/* Background Ambient Radial Glow Spotlights */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 backdrop-blur-md shadow-glow-indigo">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>Welcome Back 👋 — Lead Auditor Workspace</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight leading-none">
                InvoiceGuard <span className="text-ai-gradient">AI</span>
              </h1>
              <p className="text-sm sm:text-base font-bold text-indigo-300 mt-2 tracking-wide">
                Autonomous Risk & Fraud Intelligence Platform
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
              Real-time automated invoice risk scoring, PaddleOCR text extraction, GSTIN portal checksum validation, and Gemini 1.5 anomaly rationale.
            </p>

            {/* Today's Summary & System Health Strip */}
            <div className="pt-3 border-t border-white/10">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-3">
                Today's Summary & System Health
              </span>
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
                <div className="flex items-center gap-2 bg-cosmic-950/80 px-3.5 py-2 rounded-xl border border-white/10 shadow-sm">
                  <span className="text-slate-400">Processed:</span>
                  <span className="font-extrabold text-slate-100">{dummyDashboardStats.totalInvoices} Invoices</span>
                </div>
                <div className="flex items-center gap-2 bg-rose-500/10 px-3.5 py-2 rounded-xl border border-rose-500/30 text-rose-300 font-bold shadow-glow-rose">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>High Risk: 14</span>
                </div>
                <div className="flex items-center gap-2 bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/30 text-amber-300 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Medium Risk: 28</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/30 text-emerald-300 font-bold shadow-glow-emerald">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Low Risk: 100</span>
                </div>
                <div className="flex items-center gap-2 bg-cosmic-950/80 px-3.5 py-2 rounded-xl border border-white/10 text-slate-300 font-bold">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pending: 9</span>
                </div>
                <div className="flex items-center gap-2 bg-indigo-500/10 px-3.5 py-2 rounded-xl border border-indigo-500/30 text-indigo-300 font-bold">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Accuracy: 99.4%</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/30 text-emerald-300 font-bold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Health: 100% Operational</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <Button variant="primary" size="lg" icon={Upload} onClick={() => navigate('/upload')}>
              Scan New Invoice
            </Button>
            <Button variant="outline" size="md" icon={RefreshCw} onClick={handleRefreshSync}>
              Refresh Sync
            </Button>
          </div>
        </div>
      </div>

      {/* Critical Alert Banner */}
      {showAlert && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/90 via-cosmic-900 to-cosmic-950 border border-rose-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-glow-rose backdrop-blur-xl"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 shrink-0 border border-rose-500/30">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-rose-200 uppercase tracking-wider">
                Critical Audit Alert — 2 High Risk Invoices Flagged
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Invoice <span className="font-mono font-bold text-rose-300">INV1001</span> (ABC Traders) & <span className="font-mono font-bold text-rose-300">INV1004</span> (Zenith Cloud) flagged for bank mismatch & duplicate numbers.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
            <Button 
              variant="danger" 
              size="sm" 
              onClick={() => navigate('/invoice?id=INV_004')}
            >
              Inspect Risk
            </Button>
            <button 
              onClick={() => setShowAlert(false)}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 cursor-pointer font-bold"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}

      {/* KPI Statistic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Invoices Scanned"
          value={dummyDashboardStats.totalInvoices}
          icon={FileText}
          trend="+18.4% vs last month"
          trendType="up"
          description="Processed by PaddleOCR engine"
          accentColor="indigo"
        />
        <StatCard
          title="Scanned Volume"
          value={dummyDashboardStats.totalScannedAmount}
          icon={IndianRupee}
          trend="+12.1% total value"
          trendType="up"
          description="Cumulative transactional throughput"
          accentColor="emerald"
        />
        <StatCard
          title="High Risk Invoices"
          value={dummyDashboardStats.highRiskCount}
          icon={ShieldAlert}
          trend="14 Flagged (10%)"
          trendType="down"
          description="Requires immediate auditor action"
          accentColor="rose"
        />
        <StatCard
          title="Pending Audit Review"
          value={dummyDashboardStats.pendingReviewCount}
          icon={Clock}
          trend="9 awaiting decision"
          trendType="neutral"
          description="Queued in auditor workspace"
          accentColor="amber"
        />
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Trend Area Chart */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 shadow-glass space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-200">Invoice Anomaly & Risk Score Volume</h3>
              <p className="text-[11px] text-slate-400">Track of processed invoice risk distribution over 30 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-glow-emerald" /> Low Risk
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-glow-rose" /> High Risk
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyRiskTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#030712', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                />
                <Area type="monotone" dataKey="low" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorLow)" name="Low Risk" />
                <Area type="monotone" dataKey="high" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorHigh)" name="High Risk" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut Chart */}
        <div className="glass-panel rounded-3xl p-6 shadow-glass flex flex-col justify-between space-y-4">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-sm font-extrabold text-slate-200">Risk Profile Breakdown</h3>
            <p className="text-[11px] text-slate-400">Categorization across 142 total invoices</p>
          </div>

          <div className="h-52 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dummyRiskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={82}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {dummyRiskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#030712" strokeWidth={3} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#030712', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-white/10 text-center">
            {dummyRiskDistribution.map((item) => (
              <div key={item.name} className="p-2.5 rounded-2xl bg-cosmic-950/80 border border-white/10">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.name}</div>
                <div className="text-base font-extrabold font-mono mt-0.5" style={{ color: item.color }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-100 tracking-tight">Recent Scanned Invoices</h2>
            <p className="text-xs text-slate-400">Live feed strictly following the JSON Data Contract</p>
          </div>
          <Button variant="ghost" size="sm" icon={ArrowRight} onClick={() => navigate('/analytics')}>
            View Full Risk Analytics
          </Button>
        </div>

        <InvoiceTable invoices={dummyInvoices} showHeaderActions={true} limit={5} />
      </div>
    </motion.div>
  );
}
