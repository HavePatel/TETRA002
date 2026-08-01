import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = FileSearch,
  title = 'No results found',
  description = 'Try adjusting your search or filter criteria.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col items-center justify-center gap-5 py-20 text-center ${className}`}
    >
      <motion.div 
        className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 dark:bg-indigo-500/12 dark:border-indigo-500/20 flex items-center justify-center"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
      </motion.div>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800 dark:text-gray-300">{title}</p>
        <p className="text-xs text-slate-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>{actionLabel}</Button>
      )}
    </motion.div>
  );
}
