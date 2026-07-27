"use client";

import * as React from "react";
import { useAuthContext } from "@/providers/auth-provider";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type AdminPermission =
  | "dashboard"
  | "teacher_applications"
  | "students"
  | "teachers"
  | "payments"
  | "reports"
  | "settings"
  | "audit_logs"
  | "academic"
  | "courses"
  | "quizzes"
  | "coupons"
  | string;

interface PermissionGuardProps {
  /** The required permission key(s) to view this content */
  requiredPermission: AdminPermission | AdminPermission[];
  /** Optional custom fallback element when permission is denied */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Hook to inspect if current logged-in user possesses specific admin permissions.
 */
export function usePermission() {
  const { user, role } = useAuthContext();

  const normalizedRole = (role || user?.role || "").toLowerCase();
  const isSuperAdmin = normalizedRole === "super_admin" || normalizedRole === "superadmin";
  const isAdmin = isSuperAdmin || normalizedRole === "admin";

  const userPermissions = React.useMemo(() => {
    if (user?.permissions && Array.isArray(user.permissions)) {
      return user.permissions.map((p) => p.toLowerCase());
    }
    // Default full permissions for Super Admin & Admin roles
    if (isAdmin) {
      return [
        "dashboard",
        "teacher_applications",
        "students",
        "teachers",
        "payments",
        "reports",
        "settings",
        "audit_logs",
        "academic",
        "courses",
        "quizzes",
        "coupons",
      ];
    }
    return [];
  }, [user, isAdmin]);

  const hasPermission = React.useCallback(
    (permission: AdminPermission | AdminPermission[]): boolean => {
      if (isSuperAdmin) return true; // Super Admin has unrestricted access to all modules
      if (!isAdmin) return false;

      const requiredList = Array.isArray(permission) ? permission : [permission];
      return requiredList.some((req) => userPermissions.includes(req.toLowerCase()));
    },
    [isSuperAdmin, isAdmin, userPermissions]
  );

  return {
    isAdmin,
    isSuperAdmin,
    permissions: userPermissions,
    hasPermission,
  };
}

/**
 * PermissionGuard — Granular permission check component for Admin modules.
 */
export function PermissionGuard({ requiredPermission, fallback, children }: PermissionGuardProps) {
  const { hasPermission, isAdmin } = usePermission();

  const isAllowed = hasPermission(requiredPermission);

  if (!isAdmin || !isAllowed) {
    if (fallback) return <>{fallback}</>;

    return (
      <div
        className="flex min-h-[400px] w-full flex-col items-center justify-center gap-4 bg-background p-6 text-center border border-dashed border-red-200 dark:border-red-900/30 rounded-3xl"
        dir="rtl"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40 text-red-500">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">
            غير مصرح بالوصول إلى هذا القسم 🔒
          </h3>
          <p className="max-w-md text-xs text-muted-foreground leading-relaxed">
            حسابك الإداري لا يملك الصلاحيات الكافية لرؤية أو تعديل بيانات هذا القسم. يرجى مراجعة المسؤول الفائق (Super Admin).
          </p>
        </div>

        <Button asChild variant="outline" className="rounded-xl text-xs font-bold">
          <Link href="/admin/dashboard">العودة للوحة الرئيسية</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
