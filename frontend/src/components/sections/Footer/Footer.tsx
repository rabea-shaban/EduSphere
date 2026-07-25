"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import type { FooterProps } from "./types";
import { FOOTER_COLUMNS, CONTACT_DETAILS, SOCIAL_LINKS, PAYMENT_METHODS } from "./mock-data";
import { Newsletter } from "./Newsletter";
import { SocialLinks } from "./SocialLinks";
import { FooterLinksGroup } from "./FooterLinks";
import { ContactInfo } from "./ContactInfo";
import { PaymentMethods } from "./PaymentMethods";
import { Copyright } from "./Copyright";
import { FloatingSupportButton } from "./FloatingSupportButton";
import { SectionContainer } from "@/components/layout/section-layout";
import { cn } from "@/lib/utils";

export function Footer({ className }: FooterProps) {
  return (
    <footer
      aria-label="ذيل الصفحة"
      className={cn(
        "relative w-full pt-16 pb-10 bg-[#F8FAFC] dark:bg-slate-950 border-t border-slate-200/70 dark:border-slate-800 transition-colors duration-300 overflow-hidden",
        className
      )}
    >
      <SectionContainer>

        {/* 1. Newsletter Card Top Section */}
        <Newsletter />

        {/* 2. Main 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-slate-200/80 dark:border-slate-800/80">

          {/* COLUMN 1 (Visual Right in RTL): Logo, Brief & Social Icons */}
          <div className="space-y-4 text-right sm:col-span-2 lg:col-span-1">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="relative w-9 h-9 shrink-0">
                <Image
                  src="/logo.png"
                  alt="EduSphere Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span
                className="text-2xl font-black tracking-tight text-[#0B2D5B] dark:text-white"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                EduSphere
              </span>
            </Link>

            {/* Description */}
            <p
              className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 font-medium leading-relaxed"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              منصة تعليمية متكاملة تساعد طلاب الصف الرابع الابتدائي حتى الصف الثالث الثانوي على التعلم بذكاء وتحقيق أفضل النتائج.
            </p>

            {/* Social Buttons */}
            <SocialLinks socials={SOCIAL_LINKS} />
          </div>

          {/* COLUMNS 2, 3, 4: Platform, Support, Important Links */}
          <FooterLinksGroup columns={FOOTER_COLUMNS} />

          {/* COLUMN 5 (Visual Left in RTL): Contact Details */}
          <ContactInfo details={CONTACT_DETAILS} />

        </div>

        {/* 3. Bottom Bar: Payment Methods (Right), Copyright (Center) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Payment Methods Cards (Visual Right in RTL) */}
          <PaymentMethods methods={PAYMENT_METHODS} />

          {/* Copyright Text (Center) */}
          <Copyright />

          {/* Empty spacer for flex alignment balancing */}
          <div className="hidden sm:block w-36" />

        </div>

      </SectionContainer>

      {/* 4. Floating Live Chat Support Button */}
      <FloatingSupportButton />
    </footer>
  );
}

export default Footer;
