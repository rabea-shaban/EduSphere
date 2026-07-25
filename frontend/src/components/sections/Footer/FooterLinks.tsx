"use client";

import * as React from "react";
import Link from "next/link";
import type { FooterColumnData, FooterLinkItem } from "./types";

export function FooterLink({ link }: { link: FooterLinkItem }) {
  return (
    <li>
      <Link
        href={link.href}
        className="text-xs sm:text-sm font-medium text-[#64748B] dark:text-slate-400 hover:text-[#1E73D8] dark:hover:text-blue-400 transition-colors duration-200"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        {link.label}
      </Link>
    </li>
  );
}

export function FooterColumn({ column }: { column: FooterColumnData }) {
  return (
    <div className="space-y-4 text-right">
      {/* Column Title with Blue Underline */}
      <div className="relative inline-block">
        <h3
          className="text-base sm:text-lg font-bold text-[#0B2D5B] dark:text-white"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {column.title}
        </h3>
        <span className="block h-0.5 w-8 bg-[#1E73D8] dark:bg-blue-400 mt-1.5 rounded-full" />
      </div>

      {/* Links List */}
      <ul className="space-y-3">
        {column.links.map((link, i) => (
          <FooterLink key={i} link={link} />
        ))}
      </ul>
    </div>
  );
}

interface FooterLinksGroupProps {
  columns: FooterColumnData[];
}

export function FooterLinksGroup({ columns }: FooterLinksGroupProps) {
  return (
    <>
      {columns.map((col, idx) => (
        <FooterColumn key={idx} column={col} />
      ))}
    </>
  );
}

export default FooterLinksGroup;
