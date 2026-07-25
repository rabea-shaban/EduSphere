"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { robotFloatVariants } from "./animations";

export function RobotIllustration() {
  return (
    <div className="relative w-full flex items-center justify-center min-h-[260px] sm:min-h-[300px] select-none">
      {/* Radial Blue Glow behind Robot */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] bg-gradient-to-tr from-[#1E73D8]/20 to-[#93C5FD]/30 dark:from-blue-600/30 dark:to-blue-400/10 rounded-full blur-2xl pointer-events-none"
      />

      {/* Floating 3D Robot */}
      <motion.div
        variants={robotFloatVariants}
        initial="initial"
        animate="animate"
        className="relative z-10 w-56 sm:w-64 lg:w-72 h-auto flex justify-center"
      >
        <Image
          src="/ai_robot_3d.jpg"
          alt="روبوت المساعد الذكي EduSphere"
          width={280}
          height={280}
          className="w-full h-auto object-contain drop-shadow-[0_15px_35px_rgba(30,115,216,0.25)] dark:drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
          priority
        />
      </motion.div>
    </div>
  );
}

export default RobotIllustration;
