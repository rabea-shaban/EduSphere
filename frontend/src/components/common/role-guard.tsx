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
 *
 * Usage:
 *   <RoleGuard allowedRoles={["admin", "super_admin"]}>
 *     <AdminLayout>{children}</AdminLayout>
 *   </RoleGuard>
 *
 * Behaviour:
 *   • Still loading  → skeleton spinner (prevents flash)
 *   • Not authenticated → redirects to /login  (auth-provider already handles this,
 *                          but kept here as a safety net)
 *   • Wrong role     → shows 403 "Access Denied" page with a link to their correct dashboard
 *   • Correct role   → renders children normally
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
      return normalizedUserRole === allowed;
    });

  // Derive the user's correct dashboard link
  const correctDashboard = React.useMemo(() => {
    if (normalizedUserRole === "teacher") return "/teacher/dashboard";
    if (normalizedUserRole === "admin" || normalizedUserRole === "super_admin") return "/admin/dashboard";
    return "/dashboard";
  }, [normalizedUserRole]);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0B2D5B] border-t-[#F58220]" />
          <p className="text-sm font-medium text-muted-foreground">جاري التحقق من الصلاحيات…</p>
        </div>
      </div>
    );
  }

  // ── Not logged in → redirect to login ───────────────────────────────────────
  if (!isAuthenticated) {
    router.replace("/login");
    return null;
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
            ليس لديك صلاحية للوصول إلى هذه الصفحة.
            <br />
            هذا القسم مخصص لـ&nbsp;
            <span className="font-bold text-[#F58220]">
              {normalizedAllowed
                .map((r) =>
                  r === "admin" || r === "super_admin"
                    ? "الأدمن"
                    : r === "teacher"
                    ? "المعلمين"
                    : "الطلاب"
                )
                .join(" / ")}
            </span>
            &nbsp;فقط.
          </p>
        </div>

        {/* Action */}
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button
            asChild
            className="bg-[#0B2D5B] hover:bg-[#0B2D5B]/90 dark:bg-[#F58220] dark:hover:bg-[#F58220]/90 text-white rounded-xl px-6 font-bold"
          >
            <Link href={correctDashboard}>العودة إلى لوحتي</Link>
          </Button>
          <Button variant="outline" asChild className="rounded-xl px-6 font-bold">
            <Link href="/">الصفحة الرئيسية</Link>
          </Button>
        </div>
      </div>
    );
  }

  // ── Authorised ───────────────────────────────────────────────────────────────
  return <>{children}</>;
}
