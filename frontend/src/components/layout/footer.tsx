"use client";

import * as React from "react";
import { Footer as FooterSection } from "@/components/sections/Footer";

export function Footer({ className }: { className?: string }) {
  return <FooterSection className={className} />;
}

export default Footer;
