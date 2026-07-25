"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { illustrationFloatVariants } from "./animations";

export function CTAIllustration() {
  return (
    <div className="relative w-full flex items-center justify-center min-h-[300px] sm:min-h-[380px] select-none">
      {/* 3D Composition Image */}
      <motion.div
        variants={illustrationFloatVariants}
        initial="initial"
        animate="animate"
        className="relative z-10 w-full max-w-[480px] lg:max-w-[520px] h-auto flex justify-center"
      >
        <Image
          src="/cta_3d_illustration.png"
          alt="مستلزمات التعلم والشهادات ثلاثية الأبعاد"
          width={520}
          height={400}
          className="w-full h-auto object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.35)]"
          priority
        />
      </motion.div>
    </div>
  );
}

export default CTAIllustration;
