"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Users, Clock, User, Star } from "lucide-react";

// ─── Interfaces ───────────────────────────────────────────────────────────────
export interface StatCardItem {
  icon: "users" | "clock" | "user" | "star";
  value: string;
  label: string;
}

interface HeroStatsProps {
  stats: StatCardItem[];
}

// ─── Icon resolver ────────────────────────────────────────────────────────────
function StatIcon({ name }: { name: StatCardItem["icon"] }) {
  const cls = "h-8 w-8 text-white shrink-0";
  switch (name) {
    case "users": return <Users className={cls} />;
    case "clock": return <Clock className={cls} />;
    case "user":  return <User className={cls} />;
    case "star":  return <Star className={cls} strokeWidth={1.8} />;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export function HeroStats({ stats }: HeroStatsProps) {
  return (
    <div className="relative w-full select-none">
      {/* Wave top SVG – white on blue */}
      <div className="relative" aria-hidden>
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="w-full h-16 sm:h-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Orange strip at very bottom of wave */}
          <path
            d="M0,80 L1440,80 L1440,70 Q720,10 0,70 Z"
            fill="#F58220"
          />
          {/* Blue wave on top of orange */}
          <path
            d="M0,80 L1440,80 L1440,60 Q720,0 0,60 Z"
            fill="#0B2D5B"
          />
        </svg>
      </div>

      {/* Stats container */}
      <div className="bg-[#0B2D5B] pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.55,
                  delay: idx * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-center gap-4 text-right"
              >
                {/* Icon */}
                <div className="shrink-0">
                  <StatIcon name={stat.icon} />
                </div>
                {/* Numbers + label */}
                <div>
                  <p
                    className="text-2xl sm:text-3xl font-black text-white leading-none"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-xs sm:text-sm text-[#93C5FD] font-semibold mt-1 leading-tight"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroStats;
