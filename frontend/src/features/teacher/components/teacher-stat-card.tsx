"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Wallet,
  BookOpen,
  PlayCircle,
  ShoppingBag,
  Star,
  TrendingUp,
  FileCheck2,
} from "lucide-react";
import { TeacherStat } from "../types";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users className="h-5 w-5 sm:h-6 sm:w-6" />,
  Wallet: <Wallet className="h-5 w-5 sm:h-6 sm:w-6" />,
  BookOpen: <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />,
  PlayCircle: <PlayCircle className="h-5 w-5 sm:h-6 sm:w-6" />,
  ShoppingBag: <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />,
  Star: <Star className="h-5 w-5 sm:h-6 sm:w-6" />,
  TrendingUp: <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />,
  FileCheck2: <FileCheck2 className="h-5 w-5 sm:h-6 sm:w-6" />,
};

const schemeStyles = {
  navy: "from-[#0B2D5B] to-[#0F274D] text-white shadow-[#0B2D5B]/20",
  orange: "from-[#F58220] to-[#FF9A2A] text-white shadow-[#F58220]/25",
  blue: "from-[#1E73D8] to-[#3B82F6] text-white shadow-[#1E73D8]/20",
  emerald: "from-emerald-500 to-teal-600 text-white shadow-emerald-500/20",
  amber: "from-amber-500 to-orange-500 text-white shadow-amber-500/20",
  purple: "from-indigo-600 to-purple-600 text-white shadow-indigo-600/20",
};

interface TeacherStatCardProps {
  stat: TeacherStat;
  index?: number;
}

export function TeacherStatCard({ stat, index = 0 }: TeacherStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl p-3.5 sm:p-5 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden text-right"
    >
      {/* Background icon watermark */}
      <div className="absolute -left-3 -bottom-3 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none text-slate-800 dark:text-white">
        {React.cloneElement(
          (iconMap[stat.iconName] || <BookOpen className="h-20 w-20" />) as React.ReactElement<{ className?: string }>,
          { className: "h-16 w-16 sm:h-24 sm:w-24" }
        )}
      </div>

      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div
          className={cn(
            "h-9 w-9 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center bg-gradient-to-tr shadow-md shrink-0",
            schemeStyles[stat.colorScheme]
          )}
        >
          {iconMap[stat.iconName] || <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />}
        </div>
        <span
          className={cn(
            "text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border",
            stat.isPositive
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
          )}
        >
          {stat.change}
        </span>
      </div>

      <div>
        <h4 className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 mb-0.5 sm:mb-1 truncate">
          {stat.title}
        </h4>
        <div className="text-lg sm:text-2xl font-black text-[#0B2D5B] dark:text-white tracking-tight truncate">
          {stat.value}
        </div>
      </div>
    </motion.div>
  );
}

export default TeacherStatCard;
