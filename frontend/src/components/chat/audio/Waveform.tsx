"use client";

import * as React from "react";

// ─── Deterministic waveform from URL hash ─────────────────────────────────────
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateBars(url: string, count: number): number[] {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = (hash * 31 + url.charCodeAt(i)) & 0xffffffff;
  }
  const rand = seededRandom(hash);
  return Array.from({ length: count }, () => 0.25 + rand() * 0.75);
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface WaveformProps {
  url: string;
  progress: number;        // 0–1
  isPlaying: boolean;
  barCount?: number;
  onSeek?: (progress: number) => void;
  className?: string;
}

// ─── Waveform ─────────────────────────────────────────────────────────────────
export const Waveform = React.memo(function Waveform({
  url,
  progress,
  isPlaying,
  barCount = 40,
  onSeek,
  className = "",
}: WaveformProps) {
  const bars = React.useMemo(() => generateBars(url, barCount), [url, barCount]);
  const [tick, setTick] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Animate bars while playing — 100ms ticks for smooth motion
  React.useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => setTick((t) => t + 1), 100);
    return () => clearInterval(id);
  }, [isPlaying]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    onSeek(Math.max(0, Math.min(1, ratio)));
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`flex items-end gap-[2.5px] cursor-pointer select-none ${className}`}
      aria-label="شريط الصوت — انقر للتخطي"
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      {bars.map((height, i) => {
        const playedFraction = i / barCount;
        const isPlayed = playedFraction < progress;
        // 2 bars around the playhead get the animated "head" treatment
        const isHead = isPlaying && Math.abs(playedFraction - progress) < 2 / barCount;

        // Organic animation: each bar oscillates at its own phase & frequency
        const animJitter = isPlaying
          ? isHead
            ? 1 + Math.sin(tick * 2.2 + i * 0.9) * 0.45          // head: big bounce
            : isPlayed
            ? 0.8 + Math.sin(tick * 1.4 + i * 0.55) * 0.15       // played: subtle pulse
            : 0.6 + Math.sin(tick * 0.9 + i * 0.35) * 0.25       // unplayed: gentle sway
          : 1;

        const barH = Math.max(0.08, Math.min(1, height * animJitter));

        // Colors
        let bg: string;
        if (isHead) {
          bg = "linear-gradient(180deg, #F7941D 0%, #E67E00 100%)";   // Orange accent at head
        } else if (isPlayed) {
          bg = "#1E5DB8";                                               // EduSphere Primary Blue for played
        } else {
          // Idle / unplayed
          bg = isPlaying
            ? "rgba(30, 93, 184, 0.20)"   // lighter when playing
            : "rgba(30, 93, 184, 0.14)";  // lightest when idle
        }

        return (
          <div
            key={i}
            className="rounded-full flex-1"
            style={{
              height: `${barH * 22}px`,
              minHeight: "3px",
              maxHeight: "22px",
              background: bg,
              transition: isPlaying
                ? "height 100ms ease-in-out, background 200ms ease"
                : "height 200ms ease, background 200ms ease",
              transform: isHead ? "scaleY(1.1)" : "scaleY(1)",
            }}
          />
        );
      })}
    </div>
  );
});
