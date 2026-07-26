import * as React from "react";
import { TeacherLayout } from "@/features/teacher";

export default function AppTeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <TeacherLayout>{children}</TeacherLayout>;
}
