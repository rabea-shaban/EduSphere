"use client";

import * as React from "react";
import { PageTransition, Sidebar, Topbar } from "@/components/layout";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onCollapseToggle={() => setCollapsed(!collapsed)}
        className="hidden md:flex"
      />

      {/* Mobile Drawer Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-64 p-0 border-r border-border">
          <Sidebar collapsed={false} className="w-full border-r-0" />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-grow overflow-y-auto p-4 md:p-6 lg:p-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
