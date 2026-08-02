"use client";

import * as React from "react";
import { Play, Pause } from "lucide-react";

export interface AudioControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  onToggle: () => void;
  size?: "xs" | "sm" | "md";
}

export function AudioControls({
  isPlaying,
  isLoading,
  onToggle,
  size = "md",
}: AudioControlsProps) {
  const dim = size === "xs" ? "h-7.5 w-7.5 min-w-[30px] min-h-[30px]" : size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const iconSize = size === "xs" ? "h-3 w-3" : size === "sm" ? "h-3.5 w-3.5" : "h-[17px] w-[17px]";

  return (
    <button
      onClick={onToggle}
      disabled={isLoading}
      aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
      className={`
        relative shrink-0 ${dim} rounded-full flex items-center justify-center
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E73D8] focus-visible:ring-offset-2
        transition-all duration-200 ease-out
        hover:scale-110 hover:brightness-110
        active:scale-90
        group
      `}
      style={{
        background: "linear-gradient(135deg, #1E5DB8 0%, #123D7A 100%)",
        boxShadow: isPlaying
          ? "0 4px 18px rgba(30,93,184,0.50)"
          : "0 3px 12px rgba(30,93,184,0.32)",
      }}
    >
      {/* Ripple / pulse ring while playing */}
      {isPlaying && (
        <>
          {/* Outer slow ring */}
          <span
            className="absolute inset-[-4px] rounded-full pointer-events-none"
            style={{
              border: "2px solid rgba(30,93,184,0.30)",
              animation: "audioPulseOuter 1.8s ease-out infinite",
            }}
          />
          {/* Inner faster ring */}
          <span
            className="absolute inset-[-1px] rounded-full pointer-events-none"
            style={{
              border: "2px solid rgba(30,93,184,0.20)",
              animation: "audioPulseInner 1.8s ease-out 0.4s infinite",
            }}
          />
        </>
      )}

      {/* Hover glow overlay */}
      <span
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{ background: "rgba(255,255,255,0.14)" }}
      />

      {/* Icon */}
      {isLoading ? (
        <svg
          className={`${iconSize} animate-spin text-white`}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="40" strokeDashoffset="20"
          />
        </svg>
      ) : isPlaying ? (
        <Pause className={`${iconSize} text-white fill-white`} />
      ) : (
        <Play className={`${iconSize} text-white fill-white ml-0.5`} />
      )}
    </button>
  );
}
