"use client";

import * as React from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import { TeacherSidebar } from "./teacher-sidebar";
import { TeacherTopbar } from "./teacher-topbar";
import { motion, AnimatePresence } from "framer-motion";

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export function TeacherLayout({ children }: TeacherLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  // Detect if we're on the chat route — chat gets full-screen treatment
  const segment = useSelectedLayoutSegment();
  const isChatPage = segment === "chat";

  // Close mobile drawer on resize to lg+
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`w-full flex bg-[#F8FAFC] dark:bg-[#071C3B] text-[#1E293B] dark:text-[#F8FAFC] transition-colors duration-300 font-cairo dir-rtl overflow-x-hidden print:bg-white print:text-black print:overflow-visible print:h-auto print:min-h-0 print:block ${
        isChatPage ? "h-screen overflow-hidden" : "min-h-screen"
      }`}
    >
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block shrink-0 print:hidden">
        <TeacherSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        />
      </div>

      {/* MOBILE DRAWER SIDEBAR */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden print:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] lg:hidden shadow-2xl print:hidden"
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
      <div
        className={`flex-1 flex flex-col min-w-0 print:overflow-visible print:h-auto print:min-h-0 print:block ${
          isChatPage ? "h-screen overflow-hidden" : "min-h-screen overflow-y-auto overflow-x-hidden"
        }`}
      >
        <TeacherTopbar onMenuClick={() => setIsMobileOpen(true)} />

        {isChatPage ? (
          // Chat page: full-screen, no padding, no max-width, no footer
          <main className="flex-1 overflow-hidden min-h-0">
            {children}
          </main>
        ) : (
          // All other pages: normal padded layout with footer
          <>
            <main className="flex-1 p-3 sm:p-5 lg:p-8 w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 print:p-0 print:m-0 print:max-w-none print:block">
              {children}
            </main>

            {/* Teacher Footer */}
            <footer className="w-full border-t border-slate-200/80 dark:border-white/10 p-4 sm:p-6 text-center text-xs font-semibold text-slate-400 dark:text-slate-500 print:hidden">
              &copy; {new Date().getFullYear()} EduSphere Teacher Workspace. جميع الحقوق محفوظة للمعلمين والمنصة.
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

export default TeacherLayout;
