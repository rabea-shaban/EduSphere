import * as React from "react";
import type { Metadata } from "next";
import { OnboardingWizard } from "@/features/auth";

export const metadata: Metadata = {
  title: "إعداد الملف الشخصي | EduSphere",
  description: "خصص حسابك واكتشف محتواك التعليمي المخصص على EduSphere.",
};

export default function ProfileSetupPage() {
  return <OnboardingWizard />;
}
