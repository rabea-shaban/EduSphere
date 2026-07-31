"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/auth-provider";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RoleGuardProps {
  /** Roles that are ALLOWED to view this section */
  allowedRoles: string[];
  /** Where to redirect unauthorised authenticated users */
  redirectTo?: string;
  children: React.ReactNode;
}

/**
 * RoleGuard — strict client-side role-based access control wrapper.
 */
export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { isAuthenticated, isLoading, role } = useAuthContext();
  const router = useRouter();

  // Normalise roles for comparison
  const normalizedUserRole = (role || "").toLowerCase();
  const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

  // Strict role check
  const isAllowed =
    isAuthenticated &&
    normalizedAllowed.some((allowed) => {
      // "admin" allowed → also allow "super_admin"
      if (allowed === "admin") {
        return normalizedUserRole === "admin" || normalizedUserRole === "super_admin";
      }
      return normalizedUserRole === allowed;
    });

  // Derive the user's correct dashboard link
  const correctDashboard = React.useMemo(() => {
    if (normalizedUserRole === "teacher") return "/teacher/dashboard";
    if (normalizedUserRole === "admin" || normalizedUserRole === "super_admin") return "/admin/dashboard";
    return "/dashboard";
  }, [normalizedUserRole]);

  // Handle redirect in useEffect to avoid updating Router during render
  React.useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        const isAdminGuard = normalizedAllowed.some((r) => r === "admin" || r === "super_admin");
        router.replace(isAdminGuard ? "/admin/login" : "/login");
      } else if (!isAllowed) {
        router.replace(correctDashboard);
      }
    }
  }, [isLoading, isAuthenticated, isAllowed, correctDashboard, normalizedAllowed, router]);

  // ── Initial Auth Check Spinner (Only on initial cold start) ────────────────
  if (isLoading && !role) {
    return (
      <div className="min-h-screen flex items-center justify-[#0B2D5B] justify-center bg-slate-50 dark:bg-[#071C3B]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-[#F58220] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  // ── Unauthorised Fallback View ─────────────────────────────────────────────
  if (!isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#071C3B] p-4 text-right" dir="rtl">
        <div className="max-w-md w-full bg-white dark:bg-[#0F274D] rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-2xl space-y-6 text-center">
          <div className="h-16 w-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-[#0B2D5B] dark:text-white">وصول غير مصرح به 🚫</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              عذراً، حسابك لا يملك الصلاحيات الكافية للوصول إلى هذه الصفحة. يرجى الانتقال إلى لوحة التحكم المخصصة لدورك.
            </p>
          </div>
          <Link href={correctDashboard} className="block">
            <Button className="w-full bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-2xl text-xs font-bold py-3">
              الانتقال للوحة التحكم الخاصة بك
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default RoleGuard;
