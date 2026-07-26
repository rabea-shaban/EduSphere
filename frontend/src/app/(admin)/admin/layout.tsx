import * as React from "react";
import { AdminLayout } from "@/features/admin";

export default function AppAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminLayout>{children}</AdminLayout>;
}
