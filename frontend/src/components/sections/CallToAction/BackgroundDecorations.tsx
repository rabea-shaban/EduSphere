"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { starPulseVariants } from "./animations";

export function BackgroundDecorations() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Soft Ambient Radial Blue Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-3xl" />

      {/* Abstract Wave Shapes */}
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-48 opacity-15"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,213.3C672,224,768,192,864,165.3C960,139,1056,117,1152,122.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          fill="#FFFFFF"
        />
      </svg>

      {/* Floating White Stars (✦) */}
      <motion.div
        variants={starPulseVariants}
        initial="initial"
        animate="animate"
        className="absolute top-12 right-[32%] text-white text-lg font-black opacity-90 select-none"
      >
        ✦
      </motion.div>

      <motion.div
        variants={starPulseVariants}
        initial="initial"
        animate="animate"
        className="absolute bottom-16 right-[12%] text-white text-xs font-black opacity-80 select-none"
      >
        ✦
      </motion.div>

      <motion.div
        variants={starPulseVariants}
        initial="initial"
        animate="animate"
        className="absolute top-24 left-[44%] text-white text-sm font-black opacity-85 select-none"
      >
        ✦
      </motion.div>
    </div>
  );
}

export default BackgroundDecorations;
