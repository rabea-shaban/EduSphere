import type { Metadata, Viewport } from "next";
import * as React from "react";
import { Cairo } from "next/font/google";
import { SITE_METADATA } from "@/constants";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { SocketProvider } from "@/providers/socket-provider";
import { CallProvider } from "@/providers/call-provider";
import { ErrorBoundary } from "@/components/common";
import "./globals.css";

// ─── Arabic Font (Cairo) ──────────────────────────────────────────────────────
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

// ─── Arabic SEO Metadata ──────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "EduSphere | منصة التعليم الذكي المتكاملة",
    template: "%s | EduSphere",
  },
  description:
    "منصة تعليمية متكاملة من الصف الرابع الابتدائي إلى الصف الثالث الثانوي. تعلم مع أفضل المعلمين بمحتوى تفاعلي وذكاء اصطناعي.",
  keywords: [
    "تعليم",
    "كورسات",
    "مذاكرة",
    "ثانوية عامة",
    "منصة تعليمية",
    "كورسات اونلاين",
    "EduSphere",
    "تعلم اونلاين",
    "مصر",
  ],
  authors: [{ name: "EduSphere" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "EduSphere | منصة التعليم الذكي المتكاملة",
    description:
      "منصة تعليمية متكاملة من الصف الرابع الابتدائي إلى الصف الثالث الثانوي.",
    url: SITE_METADATA.url,
    siteName: "EduSphere",
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduSphere | منصة التعليم الذكي المتكاملة",
    description:
      "منصة تعليمية متكاملة من الصف الرابع الابتدائي إلى الصف الثالث الثانوي.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} h-full scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full bg-background font-cairo text-foreground transition-colors duration-200"
        style={{ fontFamily: "var(--font-cairo), sans-serif" }}
        suppressHydrationWarning
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <SocketProvider>
                <CallProvider>
                  <ErrorBoundary>
                    {children}
                  </ErrorBoundary>
                  <ToastProvider />
                </CallProvider>
              </SocketProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
