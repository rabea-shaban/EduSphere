"use client";

import * as React from "react";
import { Mic, MicOff, Send, X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { Button } from "@/components/ui/button";

interface VoiceRecorderButtonProps {
  onVoiceSent: (audioUrl: string) => void;
  disabled?: boolean;
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function VoiceRecorderButton({ onVoiceSent, disabled }: VoiceRecorderButtonProps) {
  const {
    recordingState,
    recordingSeconds,
    startRecording,
    stopRecording,
    cancelRecording,
    uploadAndSend,
    error,
  } = useVoiceRecorder();

  React.useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleSendVoice = async () => {
    await uploadAndSend((url) => {
      onVoiceSent(url);
      toast.success("تم إرسال الرسالة الصوتية ✅");
    });
  };

  // IDLE — show mic button
  if (recordingState === "idle") {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={startRecording}
        disabled={disabled}
        className="rounded-2xl h-11 w-11 bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/15 text-slate-600 dark:text-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
        title="تسجيل رسالة صوتية"
      >
        <Mic className="h-4 w-4" />
      </Button>
    );
  }

  // RECORDING — show animated recorder bar
  if (recordingState === "recording") {
    return (
      <div className="flex items-center gap-2 flex-1 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-2xl px-3 py-2">
        {/* Pulse animation */}
        <span className="relative flex h-3 w-3 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
        </span>

        {/* Waveform bars */}
        <div className="flex items-center gap-0.5 h-5">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="w-0.5 rounded-full bg-red-400"
              style={{
                height: `${30 + Math.sin(Date.now() / 200 + i) * 30}%`,
                animation: `waveBar ${0.5 + i * 0.07}s ease-in-out infinite alternate`,
                animationDelay: `${i * 60}ms`,
              }}
            />
          ))}
        </div>

        <span className="text-xs font-bold text-red-600 dark:text-red-400 font-mono min-w-[38px]">
          {formatDuration(recordingSeconds)}
        </span>

        <span className="text-[10px] font-semibold text-red-500 flex-1">جارٍ التسجيل...</span>

        {/* Cancel */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={cancelRecording}
          className="h-8 w-8 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
          title="إلغاء"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Stop & preview */}
        <Button
          type="button"
          size="icon"
          onClick={stopRecording}
          className="h-8 w-8 rounded-xl bg-red-500 hover:bg-red-600 text-white"
          title="إيقاف التسجيل"
        >
          <MicOff className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // STOPPED — preview & confirm send
  if (recordingState === "stopped") {
    return (
      <div className="flex items-center gap-2 flex-1 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl px-3 py-2">
        <div className="h-8 w-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
          <Mic className="h-4 w-4 text-emerald-600" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">رسالة صوتية</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-500 font-mono">
            {formatDuration(recordingSeconds)}
          </div>
        </div>

        {/* Cancel */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={cancelRecording}
          className="h-8 w-8 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-100"
          title="إلغاء"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Send voice */}
        <Button
          type="button"
          size="icon"
          onClick={handleSendVoice}
          className="h-8 w-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white"
          title="إرسال الرسالة الصوتية"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // UPLOADING
  return (
    <div className="flex items-center gap-2 flex-1 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-2xl px-3 py-2">
      <Loader2 className="h-4 w-4 animate-spin text-[#1E5DB8] shrink-0" />
      <span className="text-xs font-bold text-[#1E5DB8]">جاري رفع الرسالة الصوتية...</span>
    </div>
  );
}

export default VoiceRecorderButton;
