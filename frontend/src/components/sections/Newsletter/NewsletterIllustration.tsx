"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { envelopeFloatVariants } from "./animations";

export function NewsletterIllustration() {
  return (
    <div className="relative w-full flex items-center justify-center min-h-[280px] sm:min-h-[340px] select-none">
      {/* Soft Blue Circular Background Blob */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[300px] h-[260px] sm:h-[300px] rounded-full bg-[#EBF4FF] dark:bg-blue-950/40 opacity-90 blur-xl pointer-events-none z-0"
      />

      {/* Dotted Grid Pattern top-left */}
      <div
        aria-hidden
        className="absolute top-[8%] left-[8%] grid grid-cols-4 gap-1.5 opacity-20 dark:opacity-30 pointer-events-none z-0"
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#1E73D8] dark:bg-blue-400" />
        ))}
      </div>

      {/* 3D Envelope & Golden Bell Image */}
      <motion.div
        variants={envelopeFloatVariants}
        initial="initial"
        animate="animate"
        className="relative z-10 w-full max-w-[360px] sm:max-w-[420px] h-auto flex justify-center"
      >
        <Image
          src="/newsletter_3d_envelope.png"
          alt="رسالة وجرس التنبيهات للنشرة الإخبارية"
          width={420}
          height={320}
          className="w-full h-auto object-contain drop-shadow-[0_15px_35px_rgba(30,115,216,0.18)] dark:drop-shadow-[0_15px_35px_rgba(0,0,0,0.5)]"
          priority
        />
      </motion.div>
    </div>
  );
}

export default NewsletterIllustration;
