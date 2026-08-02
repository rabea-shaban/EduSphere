"use client";

import * as React from "react";
import { Check, CheckCheck } from "lucide-react";

export interface AudioFooterProps {
  timestamp: string;
  duration: number;
  currentTime: number;
  isSent: boolean;
  isRead: boolean;
  status?: string;
  compact?: boolean;
}

/** Zero-padded MM:SS — returns "--:--" if value is not a valid finite number */
function fmt(sec: number): string {
  if (!isFinite(sec) || isNaN(sec) || sec < 0) return "--:--";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function AudioFooter({
  timestamp,
  duration,
  currentTime,
  isSent,
  isRead,
  status,
  compact = false,
}: AudioFooterProps) {
  const durationReady = isFinite(duration) && !isNaN(duration) && duration > 0;
  const isActivelyPlaying = currentTime > 0 && currentTime < duration && durationReady;

  const isReadState = isRead || status === "read";
  const isDelivered = !isReadState && status === "delivered";

  return (
    <div className={`flex items-center justify-between ${compact ? "mt-1.5" : "mt-2.5"} px-0.5`}>
      {/* Left: time progress */}
      <span
        className={`${compact ? "text-[9.5px]" : "text-[10px]"} tabular-nums transition-all duration-200 select-none`}
        style={{ color: "#64748B", fontFamily: "'Cairo', sans-serif", fontWeight: 500 }}
      >
        {isActivelyPlaying
          ? `${fmt(currentTime)} / ${fmt(duration)}`
          : durationReady
          ? fmt(duration)
          : "--:--"}
      </span>

      {/* Right: timestamp + status icon */}
      <div className="flex items-center gap-1">
        <span
          className={`${compact ? "text-[9.5px]" : "text-[10px]"}`}
          style={{ color: "#64748B", fontFamily: "'Cairo', sans-serif", fontWeight: 500 }}
        >
          {timestamp}
        </span>

        {isSent && (
          isReadState ? (
            <CheckCheck className="h-3 w-3 text-[#1E5DB8]" />
          ) : isDelivered ? (
            <CheckCheck className="h-3 w-3 text-[#94A3B8]" />
          ) : (
            <Check className="h-3 w-3 text-[#94A3B8]" />
          )
        )}
      </div>
    </div>
  );
}

