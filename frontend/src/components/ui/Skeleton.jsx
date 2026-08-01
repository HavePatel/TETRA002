import React from 'react';

export default function Skeleton({ className = '', variant = 'text' }) {
  const baseClasses = "animate-pulse bg-slate-800/60 rounded-lg";

  const variants = {
    text: "h-4 w-full",
    title: "h-6 w-1/3",
    avatar: "w-10 h-10 rounded-full",
    card: "h-32 w-full rounded-xl",
    button: "h-9 w-24 rounded-lg"
  };

  return (
    <div className={`${baseClasses} ${variants[variant] || ''} ${className}`} />
  );
}
