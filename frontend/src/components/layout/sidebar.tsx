"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "../common";
import { Button } from "../ui/button";
import { NavLink } from "./nav-link";

interface SidebarProps {
  collapsed?: boolean;
  onCollapseToggle?: () => void;
  className?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export function Sidebar({ collapsed = false, onCollapseToggle, className }: SidebarProps) {
  const pathname = usePathname();

  const navigationGroups: NavGroup[] = [
    {
      groupName: "Overview",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
        { label: "My Courses", href: "/courses", icon: <BookOpen className="h-4.5 w-4.5" /> },
      ],
    },
    {
      groupName: "Management",
      items: [
        { label: "Students", href: "/dashboard/students", icon: <Users className="h-4.5 w-4.5" /> },
        { label: "Payments", href: "/dashboard/billing", icon: <CreditCard className="h-4.5 w-4.5" /> },
      ],
    },
    {
      groupName: "Settings",
      items: [
        { label: "Preferences", href: "/dashboard/settings", icon: <Settings className="h-4.5 w-4.5" /> },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "h-screen bg-card border-r border-border/80 flex flex-col transition-all duration-300 z-30 sticky top-0 shrink-0",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Sidebar Header Brand Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/60 shrink-0">
        {!collapsed ? (
          <Logo size="sm" />
        ) : (
          <div className="flex items-center justify-center w-full text-primary shrink-0">
            <GraduationCap className="h-6 w-6" />
          </div>
        )}
        {onCollapseToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCollapseToggle}
            className="hidden md:flex rounded-lg h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            ) : (
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            )}
          </Button>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
        {navigationGroups.map((group, idx) => (
          <div key={idx} className="space-y-2">
            {!collapsed && (
              <span className="block text-[10px] font-bold tracking-wider text-muted-foreground/60 uppercase px-3 select-none">
                {group.groupName}
              </span>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <NavLink
                      href={item.href}
                      exact={item.href === "/dashboard"}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-sm font-bold rounded-xl text-muted-foreground transition-all hover:bg-muted hover:text-foreground select-none",
                        isActive &&
                          "bg-primary text-primary-foreground hover:bg-primary/95 hover:text-primary-foreground font-extrabold shadow-sm"
                      )}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="truncate"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
export default Sidebar;
