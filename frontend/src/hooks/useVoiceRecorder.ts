"use client";

import * as React from "react";

export type RecordingState = "idle" | "recording" | "stopped" | "uploading";

export interface UseVoiceRecorderReturn {
  recordingState: RecordingState;
  recordingSeconds: number;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  cancelRecording: () => void;
  uploadAndSend: (onUploaded: (url: string) => void) => Promise<void>;
  error: string | null;
}

export function useVoiceRecorder(): UseVoiceRecorderReturn {
  const [recordingState, setRecordingState] = React.useState<RecordingState>("idle");
  const [recordingSeconds, setRecordingSeconds] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const streamRef = React.useRef<MediaStream | null>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const audioBlobRef = React.useRef<Blob | null>(null);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopStream();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    setError(null);
    chunksRef.current = [];
    audioBlobRef.current = null;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Pick best supported format
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/ogg";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        audioBlobRef.current = blob;
        stopStream();
        setRecordingState("stopped");
      };

      recorder.start(250); // collect chunks every 250ms
      setRecordingState("recording");
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } catch (err: any) {
      setError("لا يمكن الوصول إلى الميكروفون. تأكد من منح الصلاحية.");
      setRecordingState("idle");
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    // state changes to "stopped" inside recorder.onstop
  };

  const cancelRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    stopStream();
    chunksRef.current = [];
    audioBlobRef.current = null;
    setRecordingSeconds(0);
    setRecordingState("idle");
  };

  const uploadAndSend = async (onUploaded: (url: string) => void) => {
    if (!audioBlobRef.current) return;
    setRecordingState("uploading");

    try {
      const ext = audioBlobRef.current.type.includes("ogg") ? "ogg" : "webm";
      const file = new File([audioBlobRef.current], `voice_${Date.now()}.${ext}`, {
        type: audioBlobRef.current.type,
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "chat/voice");

      // Dynamic import to avoid circular deps
      const { default: api } = await import("@/services/api");
      const res = await api.post("/upload/file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = res.data?.data?.url || res.data?.url;
      if (!url) throw new Error("No URL returned from upload");

      onUploaded(url);
    } catch (err: any) {
      setError(err?.response?.data?.message || "فشل رفع الرسالة الصوتية");
    } finally {
      audioBlobRef.current = null;
      chunksRef.current = [];
      setRecordingSeconds(0);
      setRecordingState("idle");
    }
  };

  return {
    recordingState,
    recordingSeconds,
    startRecording,
    stopRecording,
    cancelRecording,
    uploadAndSend,
    error,
  };
}

export default useVoiceRecorder;
