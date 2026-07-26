import * as React from "react";
import { AdminLayout } from "@/features/admin";
import { RoleGuard } from "@/components/common";

export default function AppAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={["admin", "super_admin"]}>
      <AdminLayout>{children}</AdminLayout>
    </RoleGuard>
  );
}
