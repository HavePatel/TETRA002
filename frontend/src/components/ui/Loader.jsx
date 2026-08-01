import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({ text = 'Loading…', size = 'md', fullScreen = false }) {
  const sz = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }[size] ?? 'w-8 h-8';

  const inner = (
    <div className="flex flex-col items-center gap-4 p-10 text-center">
      <Loader2 className={`${sz} animate-spin text-indigo-600 dark:text-indigo-400 drop-shadow-md`} />
      {text && <p className="text-xs text-slate-500 dark:text-gray-400 font-medium tracking-wide">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900/40 dark:bg-[#070a12]/80 backdrop-blur-md z-50 flex items-center justify-center">
        <div className="glass-card border border-slate-200 dark:border-white/[0.05] rounded-2xl">
          {inner}
        </div>
      </div>
    );
  }
  return inner;
}
