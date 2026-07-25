"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Award, Cloud, TrendingUp, Headphones } from "lucide-react";

// ─── Interfaces ───────────────────────────────────────────────────────────────
export interface FeatureBarItem {
  icon: "award" | "cloud" | "trending-up" | "headphones";
  title: string;
  description: string;
}

interface FeatureBarProps {
  items: FeatureBarItem[];
}

// ─── Icon resolver ────────────────────────────────────────────────────────────
function FeatureIcon({ name }: { name: FeatureBarItem["icon"] }) {
  const cls = "h-6 w-6 text-[#1E73D8] dark:text-blue-400 shrink-0";
  switch (name) {
    case "award":      return <Award className={cls} />;
    case "cloud":      return <Cloud className={cls} />;
    case "trending-up":return <TrendingUp className={cls} />;
    case "headphones": return <Headphones className={cls} />;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export function HeroFeatureBar({ items }: FeatureBarProps) {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border-t border-[#E2E8F0] dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-row-reverse items-center gap-3 text-right select-none"
            >
              {/* Icon circle */}
              <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-[#EBF4FF] dark:bg-blue-950/80">
                <FeatureIcon name={item.icon} />
              </div>
              {/* Text */}
              <div>
                <p
                  className="text-sm font-bold text-[#0B2D5B] dark:text-slate-100 leading-tight"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  {item.title}
                </p>
                <p
                  className="text-[11px] text-[#64748B] dark:text-slate-400 font-medium leading-tight mt-0.5"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroFeatureBar;
