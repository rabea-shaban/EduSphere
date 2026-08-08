"use client";

import * as React from "react";
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react";

interface VoiceMessagePlayerProps {
  src: string;
  isMyMessage?: boolean;
}

export const VoiceMessagePlayer: React.FC<VoiceMessagePlayerProps> = ({ src, isMyMessage = false }) => {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(false);

  React.useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      if (isFinite(audio.duration) && audio.duration >= 0) {
        setDuration(audio.duration);
      } else {
        setDuration(null);
      }
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setIsLoading(false);
      setDuration(null);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    audio.load();

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current || !duration) return;
    const seekTime = Number(e.target.value);
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (seconds: number | null): string => {
    if (seconds === null || !isFinite(seconds) || seconds < 0 || isNaN(seconds)) {
      return "--:--";
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progressPercent = duration && duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`flex items-center gap-3 p-2.5 rounded-2xl max-w-xs sm:max-w-sm transition-all ${
        isMyMessage
          ? "bg-[#1769D3] text-white shadow-xs"
          : "bg-white dark:bg-[#172033] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-[#243047] shadow-xs"
      }`}
      dir="ltr"
    >
      <button
        type="button"
        onClick={togglePlay}
        disabled={isLoading}
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 ${
          isMyMessage
            ? "bg-white text-[#1769D3] hover:bg-blue-50"
            : "bg-[#1769D3] text-white hover:bg-blue-700"
        }`}
        aria-label={isPlaying ? "Pause voice message" : "Play voice message"}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>

      <div className="flex-1 flex flex-col justify-center gap-1 min-w-0">
        <div className="relative flex items-center h-4 group cursor-pointer">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            disabled={isLoading || !duration}
            className="absolute inset-0 w-full opacity-0 z-10 cursor-pointer"
          />
          <div className="w-full flex items-center gap-0.5 h-full">
            {[40, 70, 30, 90, 60, 100, 45, 80, 55, 95, 65, 35, 75, 50, 85, 40, 90, 60, 30, 70].map(
              (heightPct, idx) => {
                const isActive = (idx / 20) * 100 <= progressPercent;
                return (
                  <div
                    key={idx}
                    className={`flex-1 rounded-full transition-colors duration-150 ${
                      isActive
                        ? isMyMessage
                          ? "bg-white"
                          : "bg-[#1769D3]"
                        : isMyMessage
                        ? "bg-blue-300/40"
                        : "bg-slate-300 dark:bg-slate-600"
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                );
              }
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono tracking-tight opacity-80">
          <span>{formatTime(currentTime)}</span>
          <span>{isLoading ? "--:--" : formatTime(duration)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={toggleMute}
        className={`p-1 rounded-full hover:bg-black/10 transition-colors shrink-0 ${
          isMyMessage ? "text-blue-100" : "text-slate-400 dark:text-slate-500"
        }`}
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};

export default VoiceMessagePlayer;
