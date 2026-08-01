import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

const base =
  'relative inline-flex items-center justify-center font-semibold rounded-xl select-none box-border ' +
  'transition-all duration-150 ease-out outline-none focus:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ' +
  'dark:focus-visible:ring-offset-[#070a12] focus-visible:ring-offset-white ' +
  'disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none text-xs sm:text-sm tracking-tight shrink-0';

const variants = {
  primary:   'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-sm hover:shadow-indigo-500/25 border border-indigo-400/30',
  secondary: 'bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] dark:text-slate-200 dark:border-white/[0.08] shadow-sm',
  outline:   'bg-transparent border border-indigo-600/30 hover:border-indigo-600/60 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500/30 dark:hover:border-indigo-400/60 dark:text-indigo-300 dark:hover:text-white dark:hover:bg-indigo-600/10',
  ghost:     'bg-transparent hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 border border-transparent dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-white/[0.06]',
  danger:    'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-sm hover:shadow-rose-500/25 border border-rose-400/30',
};

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5 min-w-[70px]',
  md: 'h-9.5 px-4 text-xs sm:text-sm gap-2 min-w-[90px]',
  lg: 'h-11 px-5 text-sm gap-2.5 min-w-[110px]',
};

export default function Button({
  children,
  variant = 'primary',
  size    = 'md',
  icon: Icon,
  isLoading = false,
  disabled,
  className = '',
  onClick,
  type = 'button',
  ...rest
}) {
  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      whileHover={isDisabled ? undefined : { translateY: -1 }}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={twMerge(clsx(base, variants[variant] ?? variants.primary, sizes[size] ?? sizes.md), className)}
      {...rest}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children && <span className="truncate">{children}</span>}
    </motion.button>
  );
}
