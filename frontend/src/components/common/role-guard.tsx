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
 * RoleGuard — client-side role-based access control wrapper.
 */
export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { isAuthenticated, isLoading, role } = useAuthContext();
  const router = useRouter();

  // Normalise roles for comparison
  const normalizedUserRole = (role || "").toLowerCase();
  const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

  // Check access
  const isAllowed =
    isAuthenticated &&
    normalizedAllowed.some((allowed) => {
      // "admin" allowed → also allow "super_admin"
      if (allowed === "admin") {
        return normalizedUserRole === "admin" || normalizedUserRole === "super_admin";
      }
      // "teacher" allowed → also allow admins for inspection
      if (allowed === "teacher") {
        return normalizedUserRole === "teacher" || normalizedUserRole === "admin" || normalizedUserRole === "super_admin";
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
    if (!isLoading && !isAuthenticated) {
      const isAdminGuard = normalizedAllowed.some((r) => r === "admin" || r === "super_admin");
      router.replace(isAdminGuard ? "/admin/login" : "/login");
    }
  }, [isLoading, isAuthenticated, normalizedAllowed, router]);

  // ── Loading or Unauthenticated Spinner ───────────────────────────────────────
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0B2D5B] border-t-[#F58220]" />
          <p className="text-sm font-medium text-muted-foreground">جاري التحقق من الصلاحيات…</p>
        </div>
      </div>
    );
  }

  // ── Wrong role → 403 page ───────────────────────────────────────────────────
  if (!isAllowed) {
    return (
      <div
        className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-background px-4 text-center"
        dir="rtl"
      >
        {/* Icon */}
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
          <ShieldAlert className="h-12 w-12 text-red-500 dark:text-red-400" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#0B2D5B] dark:text-white">
            403 — وصول مرفوض
          </h1>
          <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
            ليس لديك صلاحية للوصول إلى لوحة المعلم بعد.
            <br />
            يتطلب الدخول إلى هذا القسم اعتماد حسابك كـ&nbsp;
            <span className="font-bold text-[#F58220]">معلم معتمد</span>
            &nbsp;من إدارة المنصة.
          </p>
        </div>

        {/* Action */}
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button
            asChild
            className="bg-[#F58220] hover:bg-[#F58220]/90 text-white rounded-xl px-6 font-bold"
          >
            <Link href="/teacher/apply">تقديم طلب انضمام كمعلم 👨‍🏫</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-xl px-6 font-bold"
          >
            <Link href={correctDashboard}>العودة إلى لوحتي ({correctDashboard})</Link>
          </Button>
        </div>
      </div>
    );
  }

  // ── Authorised ───────────────────────────────────────────────────────────────
  return <>{children}</>;
}
