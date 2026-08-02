"use client";

import * as React from "react";
import { AudioPlayer } from "./AudioPlayer";

export interface AudioMessageProps {
  src: string;
  timestamp: string;
  isSent: boolean;       // true = we sent it (right side), false = received (left side)
  isRead: boolean;
  status?: string;
  senderName?: string;
  senderAvatar?: string;
}

export function AudioMessage({
  src,
  timestamp,
  isSent,
  isRead,
  status,
  senderName,
  senderAvatar,
}: AudioMessageProps) {
  return (
    <div
      className={`flex items-end gap-2 w-full ${isSent ? "flex-row-reverse" : "flex-row"}`}
      style={{ fontFamily: "'Cairo', sans-serif" }}
    >
      {/* Avatar (received only) */}
      {!isSent && (
        <div
          className="h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold mb-0.5"
          style={{ background: "linear-gradient(135deg, #1E73D8, #1557a8)" }}
        >
          {senderAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={senderAvatar} alt={senderName || "مرسل"} className="h-full w-full rounded-full object-cover" />
          ) : (
            (senderName?.[0] || "؟").toUpperCase()
          )}
        </div>
      )}

      {/* Card */}
      <AudioPlayer
        src={src}
        timestamp={timestamp}
        isSent={isSent}
        isRead={isRead}
        status={status}
        senderName={!isSent ? senderName : undefined}
      />
    </div>
  );
}

export default AudioMessage;
