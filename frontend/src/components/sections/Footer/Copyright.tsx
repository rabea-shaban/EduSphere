"use client";

import * as React from "react";

export function Copyright() {
  return (
    <div
      className="text-xs sm:text-sm font-medium text-[#64748B] dark:text-slate-400 text-center select-none"
      style={{ fontFamily: "'Cairo', sans-serif" }}
    >
      <span>جميع الحقوق محفوظة © 2026 </span>
      <span className="font-bold text-[#0B2D5B] dark:text-white">EduSphere</span>
    </div>
  );
}

export default Copyright;
