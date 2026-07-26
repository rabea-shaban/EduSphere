import * as React from "react";
import { RoleGuard } from "@/components/common";

export default function DashboardRouteGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={["student"]}>
      {children}
    </RoleGuard>
  );
}
