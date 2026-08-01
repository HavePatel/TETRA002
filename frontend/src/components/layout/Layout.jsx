import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.18, ease: 'easeIn' } },
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#070a12] text-slate-900 dark:text-gray-100 overflow-hidden font-sans relative selection:bg-indigo-500/30 selection:text-indigo-900 dark:selection:text-white transition-colors duration-200">
      {/* Background ambient glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/[0.04] dark:bg-indigo-600/[0.04] rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/[0.03] dark:bg-violet-600/[0.03] rounded-full blur-[120px] pointer-events-none z-0" />

      {/* ── Sidebar ── */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <motion.div
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* ── Main Column ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
        <Navbar onToggleSidebar={() => setSidebarOpen(p => !p)} />

        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-gradient-to-b dark:from-[#070a12] dark:via-[#090d18] dark:to-[#0c101d] transition-colors duration-200">
          <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
