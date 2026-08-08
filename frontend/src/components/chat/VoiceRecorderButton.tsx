"use client";

import * as React from "react";
import { Mic, Square, Trash2, Send, Pause, Play, Loader2 } from "lucide-react";
import api from "@/services/api";
import { toast } from "react-hot-toast";

interface VoiceRecorderButtonProps {
  onSendVoice: (audioUrl: string) => void;
  disabled?: boolean;
}

export const VoiceRecorderButton: React.FC<VoiceRecorderButtonProps> = ({ onSendVoice, disabled = false }) => {
  const [isRecording, setIsRecording] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [recordingTime, setRecordingTime] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied:", err);
      toast.error("يرجى إعطاء صلاحية استخدام المايكروفون للتسجيل الصوتى");
    }
  };

  const stopRecordingTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    stopRecordingTimer();
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    audioChunksRef.current = [];
  };

  const pauseResumeRecording = () => {
    if (!mediaRecorderRef.current) return;
    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      stopRecordingTimer();
    }
  };

  const finishAndSend = () => {
    if (!mediaRecorderRef.current) return;
    stopRecordingTimer();

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());

      if (audioBlob.size === 0) {
        cancelRecording();
        return;
      }

      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", audioBlob, `voice_${Date.now()}.webm`);

        const res = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const fileUrl = res.data?.data?.url || res.data?.url;
        if (!fileUrl) {
          throw new Error("Failed to get audio file URL");
        }

        onSendVoice(fileUrl);
      } catch (err) {
        console.error("Voice upload error:", err);
        toast.error("تعذر رفع التسجيل الصوتي، يرجى المحاولة مرة أخرى");
      } finally {
        setIsUploading(false);
        setIsRecording(false);
        setIsPaused(false);
        setRecordingTime(0);
        audioChunksRef.current = [];
      }
    };

    mediaRecorderRef.current.stop();
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (isRecording || isUploading) {
    return (
      <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700/80 px-3 py-1.5 rounded-2xl animate-in fade-in duration-200">
        {/* Delete / Cancel Button */}
        <button
          type="button"
          onClick={cancelRecording}
          disabled={isUploading}
          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full transition-colors"
          title="إلغاء التسجيل"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        {/* Pause / Resume Button */}
        <button
          type="button"
          onClick={pauseResumeRecording}
          disabled={isUploading}
          className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-full transition-colors"
          title={isPaused ? "استئناف" : "إيقاف مؤقت"}
        >
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </button>

        {/* Recording Timer & Pulse */}
        <div className="flex items-center gap-2 px-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isPaused ? "bg-amber-500" : "bg-red-500 animate-pulse"}`} />
          <span className="font-mono text-sm text-neutral-200 font-medium">{formatTimer(recordingTime)}</span>
        </div>

        {/* Finish & Send Button */}
        <button
          type="button"
          onClick={finishAndSend}
          disabled={isUploading || recordingTime === 0}
          className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all active:scale-95 disabled:opacity-50"
          title="إرسال التسجيل الصوتي"
        >
          {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={startRecording}
      disabled={disabled}
      className="p-2.5 text-neutral-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all disabled:opacity-50"
      title="تسجيل رسالة صوتية"
    >
      <Mic className="w-5 h-5" />
    </button>
  );
};

export default VoiceRecorderButton;
