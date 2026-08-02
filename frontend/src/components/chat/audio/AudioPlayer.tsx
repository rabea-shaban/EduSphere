"use client";

import * as React from "react";
import { Waveform } from "./Waveform";
import { AudioControls } from "./AudioControls";
import { AudioFooter } from "./AudioFooter";

export interface AudioPlayerProps {
  src: string;
  timestamp: string;
  isSent: boolean;
  isRead: boolean;
  status?: string;
  /** Only set when message is received — not shown for own messages */
  senderName?: string;
}

/** Zero-padded MM:SS — "--:--" while not yet loaded */
function fmtDur(sec: number): string {
  if (!isFinite(sec) || isNaN(sec) || sec <= 0) return "--:--";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayer({
  src,
  timestamp,
  isSent,
  isRead,
  status,
  senderName,
}: AudioPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying]     = React.useState(false);
  const [isLoading, setIsLoading]     = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration]       = React.useState(NaN);   // NaN = not yet loaded
  const [isHovered, setIsHovered]     = React.useState(false);

  // Init audio element once per src
  React.useEffect(() => {
    const audio = new Audio(src);
    audio.preload = "metadata";
    audioRef.current = audio;

    // Track whether we triggered the seek-trick to resolve Infinity duration
    let seekingForDuration = false;

    const onLoadedMeta = () => {
      const d = audio.duration;
      if (isFinite(d) && d > 0) {
        setDuration(d);
      } else {
        // WebM / Ogg from MediaRecorder: duration is Infinity until we seek
        // Force the browser to calculate real duration by seeking to an impossible time
        seekingForDuration = true;
        audio.currentTime = 1e9;
      }
    };

    const onDurationChange = () => {
      const d = audio.duration;
      if (isFinite(d) && d > 0) {
        setDuration(d);
        // If we triggered the trick, reset position silently
        if (seekingForDuration) {
          seekingForDuration = false;
          audio.currentTime = 0;
        }
      }
    };

    const onTimeUpdate = () => {
      // Ignore time updates that come from our seek trick
      if (!seekingForDuration) {
        setCurrentTime(audio.currentTime);
      }
    };

    const onEnded   = () => { setIsPlaying(false); setCurrentTime(0); };
    const onCanPlay = () => setIsLoading(false);
    const onWaiting = () => setIsLoading(true);

    audio.addEventListener("loadedmetadata", onLoadedMeta);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("timeupdate",     onTimeUpdate);
    audio.addEventListener("ended",          onEnded);
    audio.addEventListener("canplay",        onCanPlay);
    audio.addEventListener("waiting",        onWaiting);

    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener("loadedmetadata", onLoadedMeta);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("timeupdate",     onTimeUpdate);
      audio.removeEventListener("ended",          onEnded);
      audio.removeEventListener("canplay",        onCanPlay);
      audio.removeEventListener("waiting",        onWaiting);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      audio.play()
        .then(() => { setIsPlaying(true);  setIsLoading(false); })
        .catch(() => { setIsLoading(false); });
    }
  };

  const handleSeek = (progress: number) => {
    const audio = audioRef.current;
    if (!audio || !isFinite(duration) || duration <= 0) return;
    audio.currentTime = progress * duration;
    setCurrentTime(audio.currentTime);
  };

  const progress = isFinite(duration) && duration > 0 ? currentTime / duration : 0;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full rounded-[14px] p-[6px_10px_4px_10px] bg-white dark:bg-[#123D7A] border border-[#E5EAF2] dark:border-white/15 shadow-xs hover:-translate-y-[1px] transition-all duration-200 min-w-[170px] max-w-[215px] select-none"
    >
      {/* Subtle blue glow overlay while playing */}
      {isPlaying && (
        <div
          className="absolute inset-0 rounded-[14px] pointer-events-none transition-opacity duration-300"
          style={{
            background: "linear-gradient(135deg, rgba(30,93,184,0.04) 0%, transparent 100%)",
            border:     "1px solid rgba(30,93,184,0.18)",
          }}
        />
      )}

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 mb-1">
        {/* Mic icon badge */}
        <div
          className="h-3.5 w-3.5 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #1E5DB8, #123D7A)" }}
        >
          <svg viewBox="0 0 16 16" fill="white" className="h-[8px] w-[8px]">
            <path d="M8 10.5a3 3 0 003-3v-4a3 3 0 00-6 0v4a3 3 0 003 3zm5-3a1 1 0 01-2 0 3 3 0 01-6 0 1 1 0 01-2 0 5 5 0 0010 0zM7 13.9V15h2v-1.1A5.002 5.002 0 0013 9a1 1 0 00-2 0 3 3 0 01-6 0 1 1 0 00-2 0 5.002 5.002 0 004 4.9z" />
          </svg>
        </div>

        {/* Label */}
        <div className="flex items-baseline gap-1 leading-none">
          <span
            className="text-[9.5px] font-semibold"
            style={{ color: "#1E5DB8", fontFamily: "'Cairo', sans-serif" }}
          >
            رسالة صوتية
          </span>
          {!isSent && senderName && (
            <span
              className="text-[8.5px] truncate max-w-[90px]"
              style={{ color: "#64748B", fontFamily: "'Cairo', sans-serif", fontWeight: 500 }}
            >
              • {senderName}
            </span>
          )}
        </div>
      </div>

      {/* ── Player row ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5">
        <AudioControls
          isPlaying={isPlaying}
          isLoading={isLoading}
          onToggle={togglePlay}
          size="xs"
        />

        {/* Waveform */}
        <div className="flex-1 min-w-0">
          <Waveform
            url={src}
            progress={progress}
            isPlaying={isPlaying}
            barCount={26}
            onSeek={handleSeek}
            className="h-5"
          />
        </div>

        {/* Right: total duration */}
        <span
          className="text-[9px] font-bold tabular-nums shrink-0"
          style={{
            color:      isPlaying ? "#F7941D" : "#64748B",
            fontFamily: "'Cairo', sans-serif",
            transition: "color 200ms ease",
            minWidth:   "28px",
            textAlign:  "right",
          }}
        >
          {fmtDur(duration)}
        </span>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <AudioFooter
        timestamp={timestamp}
        duration={duration}
        currentTime={currentTime}
        isSent={isSent}
        isRead={isRead}
        status={status}
        compact
      />
    </div>
  );
}
