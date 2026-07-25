"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Logo } from "./logo";
import { Spinner } from "../ui/spinner";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-col items-center gap-4 text-center select-none"
      >
        <Logo size="lg" showText={true} />
        <Spinner size="md" className="mt-4 text-primary" />
      </motion.div>
    </div>
  );
}
export default LoadingScreen;
