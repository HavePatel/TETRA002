import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sun, Moon, Laptop, User, Bell, ShieldCheck,
  Check, Sliders, Info,
} from 'lucide-react';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [themeMode, setThemeMode] = useState('dark');
  const [notifications, setNotifications] = useState({
    highRiskAlerts: true,
    duplicateFlags: true,
    dailySummary: false,
    auditWebhooks: true,
  });
  const [profile, setProfile] = useState({
    name: 'Team TETRA002',
    role: 'Lead Financial Auditor',
    email: 'audit.admin@invoiceguard.ai',
    department: 'Enterprise Compliance & Risk Audit',
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setThemeMode(savedTheme);
  }, []);

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      toast.success('Dark theme enabled');
    } else if (mode === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      toast.success('Light theme enabled');
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.removeItem('theme');
      toast.success('System theme synced');
    }
  };

  const toggleNotif = (key) => {
    setNotifications((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      toast.success('Notification preference updated');
      return next;
    });
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    toast.success('Profile settings saved');
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-500/20">
          Preferences &amp; Governance
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight pt-2">
          System Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 font-normal">
          Manage your dual-theme appearance, auditor profile, notification triggers, and enterprise AI engine configurations.
        </p>
      </motion.div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Theme & Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Theme Selection */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 space-y-5 border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#151B2D] backdrop-blur-xl rounded-3xl"
          >
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200/80 dark:border-white/[0.06]">
              <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Theme &amp; Visual Appearance</p>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">Choose your preferred workspace aesthetic</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'dark', label: 'Dark Mode', desc: 'Stripe & Linear Navy', icon: Moon },
                { id: 'light', label: 'Light Mode', desc: 'Clean Notion Surface', icon: Sun },
                { id: 'system', label: 'System Theme', desc: 'Auto OS Preference', icon: Laptop },
              ].map(({ id, label, desc, icon: Icon }) => {
                const isActive = themeMode === id;
                return (
                  <button
                    key={id}
                    onClick={() => handleThemeChange(id)}
                    className={`p-4 rounded-2xl border text-left transition-all relative ${
                      isActive
                        ? 'bg-indigo-50/80 border-indigo-500 text-slate-900 dark:bg-indigo-600/15 dark:border-indigo-400 dark:text-white shadow-sm'
                        : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-white/[0.03] dark:border-white/[0.06] dark:text-gray-300 dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-gray-400'}`} />
                      {isActive && (
                        <span className="w-5 h-5 rounded-full bg-indigo-600 dark:bg-indigo-400 text-white dark:text-slate-900 flex items-center justify-center text-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold">{label}</p>
                    <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">{desc}</p>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* 2. Profile Information */}
          <motion.form
            onSubmit={handleProfileSave}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 space-y-5 border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#151B2D] backdrop-blur-xl rounded-3xl"
          >
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200/80 dark:border-white/[0.06]">
              <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Auditor Profile</p>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">Account identity and enterprise credentials</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                  Full Name / Team
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                  Auditor Role
                </label>
                <input
                  type="text"
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                  Department
                </label>
                <input
                  type="text"
                  value={profile.department}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" size="sm">
                Save Profile Settings
              </Button>
            </div>
          </motion.form>
        </div>

        {/* Right Column — Notifications & About */}
        <div className="space-y-6">
          {/* 3. Notification Preferences */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 space-y-5 border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#151B2D] backdrop-blur-xl rounded-3xl"
          >
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200/80 dark:border-white/[0.06]">
              <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Audit Notification Triggers</p>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">Real-time risk alerts &amp; digests</p>
              </div>
            </div>

            <div className="space-y-3.5">
              {[
                { key: 'highRiskAlerts', label: 'High Risk Anomalies', desc: 'Alert immediately on GSTIN or bank mismatches' },
                { key: 'duplicateFlags', label: 'Duplicate Invoice Flags', desc: 'Notify when duplicate invoice numbers are detected' },
                { key: 'dailySummary', label: 'Daily Risk Summary Digest', desc: 'Email daily aggregated risk exposure report' },
                { key: 'auditWebhooks', label: 'Real-Time Audit Webhooks', desc: 'Push events to enterprise ERP endpoints' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-start justify-between gap-3 p-3 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.04]">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{label}</p>
                    <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNotif(key)}
                    className={`w-10 h-6 rounded-full p-1 transition-colors relative shrink-0 ${
                      notifications[key] ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        notifications[key] ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 4. About Application */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 space-y-4 border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#151B2D] backdrop-blur-xl rounded-3xl"
          >
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/80 dark:border-white/[0.06]">
              <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">About Application</p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-gray-400">Application Name</span>
                <span className="font-bold text-slate-900 dark:text-white">InvoiceGuard AI</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span className="text-slate-500 dark:text-gray-400">Version</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">v1.0.0 Enterprise</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-gray-400">AI Core Engine</span>
                <span className="text-slate-800 dark:text-gray-200 font-medium">PaddleOCR 2.7 + Gemini 1.5</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span className="text-slate-500 dark:text-gray-400">OCR Precision Rating</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">99.4% Verified</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 dark:border-white/[0.06] flex items-center gap-2 text-[11px] text-slate-500 dark:text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Enterprise SOC2 &amp; ISO 27001 Compliant Audit Engine</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
