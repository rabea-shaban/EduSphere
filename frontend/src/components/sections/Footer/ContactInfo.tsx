"use client";

import * as React from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import type { ContactDetailItem } from "./types";

interface ContactInfoProps {
  details: ContactDetailItem[];
}

function ContactIcon({ iconName }: { iconName: ContactDetailItem["iconName"] }) {
  switch (iconName) {
    case "mail":
      return <Mail className="h-4 w-4 text-[#0B2D5B] dark:text-blue-400 shrink-0" />;
    case "phone":
      return <Phone className="h-4 w-4 text-[#0B2D5B] dark:text-blue-400 shrink-0" />;
    case "map":
      return <MapPin className="h-4 w-4 text-[#0B2D5B] dark:text-blue-400 shrink-0" />;
    case "clock":
      return <Clock className="h-4 w-4 text-[#0B2D5B] dark:text-blue-400 shrink-0" />;
    default:
      return <Mail className="h-4 w-4 text-[#0B2D5B] dark:text-blue-400 shrink-0" />;
  }
}

export function ContactInfo({ details }: ContactInfoProps) {
  return (
    <div className="space-y-4 text-right">
      {/* Column Title with Blue Underline */}
      <div className="relative inline-block">
        <h3
          className="text-base sm:text-lg font-bold text-[#0B2D5B] dark:text-white"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          تواصل معنا
        </h3>
        <span className="block h-0.5 w-8 bg-[#1E73D8] dark:bg-blue-400 mt-1.5 rounded-full" />
      </div>

      {/* Contact Details List */}
      <ul className="space-y-3.5">
        {details.map((item) => (
          <li key={item.id} className="flex items-center justify-end gap-3 text-xs sm:text-sm font-medium text-[#64748B] dark:text-slate-400">
            {item.href ? (
              <a
                href={item.href}
                className="hover:text-[#1E73D8] dark:hover:text-blue-400 transition-colors duration-200"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                {item.text}
              </a>
            ) : (
              <span style={{ fontFamily: "'Cairo', sans-serif" }}>{item.text}</span>
            )}
            <ContactIcon iconName={item.iconName} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContactInfo;
