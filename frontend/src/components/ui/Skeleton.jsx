import React from 'react';

export default function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-white/[0.06] rounded-lg ${className}`}
    />
  );
}
