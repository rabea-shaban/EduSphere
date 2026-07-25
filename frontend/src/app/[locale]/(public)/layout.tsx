import * as React from "react";
import {
  AnnouncementBar,
  Footer,
  Navbar,
  PageTransition,
  ScrollToTopButton,
} from "@/components/layout";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 flex flex-col">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
