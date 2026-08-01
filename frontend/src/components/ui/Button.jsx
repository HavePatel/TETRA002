import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon: Icon,
  disabled,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles = 'relative inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cosmic-950 disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer overflow-hidden';

  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-500 text-white shadow-glow-indigo border border-indigo-400/30',
    secondary: 'bg-cosmic-900/90 hover:bg-cosmic-800 text-slate-200 border border-slate-700/80 focus:ring-slate-500 backdrop-blur-md shadow-sm',
    danger: 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-glow-rose border border-rose-400/30',
    outline: 'border border-slate-700/80 hover:border-indigo-500/50 bg-cosmic-900/40 text-slate-300 hover:text-white hover:bg-cosmic-800/60 backdrop-blur-md',
    ghost: 'bg-transparent hover:bg-cosmic-800/60 text-slate-400 hover:text-slate-100'
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-4.5 py-2 text-xs font-bold gap-2',
    lg: 'px-6 py-2.5 text-sm font-bold gap-2.5'
  };

  return (
    <motion.button
      whileHover={disabled || isLoading ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled || isLoading ? {} : { scale: 0.97 }}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 text-current shrink-0" />
      ) : null}
      <span>{children}</span>
    </motion.button>
  );
}
