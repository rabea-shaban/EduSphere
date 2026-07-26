"use client";

import * as React from "react";
import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: "var(--font-cairo), sans-serif",
          direction: "rtl",
          borderRadius: "16px",
          background: "#0B2D5B",
          color: "#ffffff",
          fontSize: "13px",
          fontWeight: 700,
          boxShadow: "0 20px 25px -5px rgba(11, 45, 91, 0.3), 0 8px 10px -6px rgba(11, 45, 91, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          padding: "12px 18px",
        },
        success: {
          duration: 4000,
          iconTheme: {
            primary: "#F58220",
            secondary: "#ffffff",
          },
          style: {
            background: "#0B2D5B",
            color: "#ffffff",
            border: "1px solid rgba(245, 130, 32, 0.4)",
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: "#EF4444",
            secondary: "#ffffff",
          },
          style: {
            background: "#0F274D",
            color: "#ffffff",
            border: "1px solid rgba(239, 68, 68, 0.4)",
          },
        },
      }}
    />
  );
}

export default ToastProvider;
