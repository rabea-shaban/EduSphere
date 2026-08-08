"use client";

import * as React from "react";
import { TeacherSidebar } from "@/features/teacher/components/teacher-sidebar";
import { TeacherTopbar } from "@/features/teacher/components/teacher-topbar";
import { motion, AnimatePresence } from "framer-motion";

export default function TeacherChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

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
    <div className="fixed inset-0 z-50 flex bg-[#F8FAFC] dark:bg-[#071C3B] text-[#1E293B] dark:text-[#F8FAFC] transition-colors duration-300 font-cairo dir-rtl overflow-hidden">
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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 z-[70] w-72 max-w-[85vw] lg:hidden shadow-2xl"
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
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TeacherTopbar onMenuClick={() => setIsMobileOpen(true)} />
        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
}
