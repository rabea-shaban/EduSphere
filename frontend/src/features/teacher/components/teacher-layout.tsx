"use client";

import * as React from "react";
import { TeacherSidebar } from "./teacher-sidebar";
import { TeacherTopbar } from "./teacher-topbar";
import { motion, AnimatePresence } from "framer-motion";

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export function TeacherLayout({ children }: TeacherLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] dark:bg-[#071C3B] text-[#1E293B] dark:text-[#F8FAFC] transition-colors duration-300 font-cairo dir-rtl overflow-x-hidden">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block shrink-0">
        <TeacherSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        />
      </div>

      {/* MOBILE DRAWER SIDEBAR */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 z-50 w-72 lg:hidden shadow-2xl"
            >
              <div className="relative h-full">
                <TeacherSidebar
                  isCollapsed={false}
                  onMobileClose={() => setIsMobileOpen(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        <TeacherTopbar onMenuClick={() => setIsMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>

        {/* Teacher Footer */}
        <footer className="w-full border-t border-slate-200/80 dark:border-white/10 p-6 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
          &copy; {new Date().getFullYear()} EduSphere Teacher Workspace. جميع الحقوق محفوظة للمعلمين والمنصة.
        </footer>
      </div>
    </div>
  );
}

export default TeacherLayout;
