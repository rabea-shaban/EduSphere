import * as React from "react";
import { TeacherLayout } from "@/features/teacher";
import { RoleGuard } from "@/components/common";

export default function AppTeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={["teacher", "admin", "super_admin"]}>
      <TeacherLayout>{children}</TeacherLayout>
    </RoleGuard>
  );
}
