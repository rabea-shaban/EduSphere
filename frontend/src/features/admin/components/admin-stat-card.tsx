"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Wallet,
  GraduationCap,
  BookOpen,
  CreditCard,
  UserCheck,
  Star,
  Activity,
} from "lucide-react";
import { AdminStat } from "../types";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users className="h-6 w-6" />,
  Wallet: <Wallet className="h-6 w-6" />,
  GraduationCap: <GraduationCap className="h-6 w-6" />,
  BookOpen: <BookOpen className="h-6 w-6" />,
  CreditCard: <CreditCard className="h-6 w-6" />,
  UserCheck: <UserCheck className="h-6 w-6" />,
  Star: <Star className="h-6 w-6" />,
  Activity: <Activity className="h-6 w-6" />,
};

const schemeStyles = {
  navy: "from-[#0B2D5B] to-[#0F274D] text-white shadow-[#0B2D5B]/20",
  orange: "from-[#F58220] to-[#FF9A2A] text-white shadow-[#F58220]/25",
  blue: "from-[#1E73D8] to-[#3B82F6] text-white shadow-[#1E73D8]/20",
  emerald: "from-emerald-500 to-teal-600 text-white shadow-emerald-500/20",
  amber: "from-amber-500 to-orange-500 text-white shadow-amber-500/20",
  purple: "from-indigo-600 to-purple-600 text-white shadow-indigo-600/20",
};

interface AdminStatCardProps {
  stat: AdminStat;
  index?: number;
}

export function AdminStatCard({ stat, index = 0 }: AdminStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-3xl p-5 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden text-right"
    >
      <div className="absolute -left-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none text-slate-800 dark:text-white">
        {React.cloneElement(
          (iconMap[stat.iconName] || <Activity className="h-24 w-24" />) as React.ReactElement<{ className?: string }>,
          { className: "h-24 w-24" }
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <div
          className={cn(
            "h-12 w-12 rounded-2xl flex items-center justify-center bg-gradient-to-tr shadow-md",
            schemeStyles[stat.colorScheme]
          )}
        >
          {iconMap[stat.iconName] || <Activity className="h-6 w-6" />}
        </div>
        <span
          className={cn(
            "text-xs font-bold px-2.5 py-1 rounded-full border",
            stat.isPositive
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
          )}
        >
          {stat.change}
        </span>
      </div>

      <div>
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
          {stat.title}
        </h4>
        <div className="text-2xl font-black text-[#0B2D5B] dark:text-white tracking-tight">
          {stat.value}
        </div>
      </div>
    </motion.div>
  );
}

export default AdminStatCard;
