import type { StageVariant } from "./types";

export const STAGE_VARIANT_STYLES: Record<
  StageVariant,
  {
    iconBg: string;
    iconColor: string;
    cardBgGradient: string;
    statsBg: string;
    statsBorder: string;
    buttonBorder: string;
    buttonText: string;
    buttonHoverBg: string;
    accentColor: string;
  }
> = {
  blue: {
    iconBg: "bg-blue-50 dark:bg-blue-950/60",
    iconColor: "text-[#1E73D8] dark:text-blue-400",
    cardBgGradient: "from-blue-50/50 via-slate-50/30 to-transparent dark:from-blue-950/20 dark:via-slate-900/30",
    statsBg: "bg-[#F0F6FE] dark:bg-blue-950/40",
    statsBorder: "border-blue-100/60 dark:border-blue-900/40",
    buttonBorder: "border-[#1E73D8] dark:border-blue-500",
    buttonText: "text-[#1E73D8] dark:text-blue-400",
    buttonHoverBg: "hover:bg-[#1E73D8] hover:text-white dark:hover:bg-blue-600 dark:hover:text-white",
    accentColor: "#1E73D8",
  },
  green: {
    iconBg: "bg-emerald-50 dark:bg-emerald-950/60",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    cardBgGradient: "from-emerald-50/50 via-slate-50/30 to-transparent dark:from-emerald-950/20 dark:via-slate-900/30",
    statsBg: "bg-[#F0FDF4] dark:bg-emerald-950/40",
    statsBorder: "border-emerald-100/60 dark:border-emerald-900/40",
    buttonBorder: "border-emerald-600 dark:border-emerald-500",
    buttonText: "text-emerald-600 dark:text-emerald-400",
    buttonHoverBg: "hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white",
    accentColor: "#16A34A",
  },
  orange: {
    iconBg: "bg-orange-50 dark:bg-orange-950/60",
    iconColor: "text-[#F58220] dark:text-orange-400",
    cardBgGradient: "from-orange-50/50 via-slate-50/30 to-transparent dark:from-orange-950/20 dark:via-slate-900/30",
    statsBg: "bg-[#FFF7ED] dark:bg-orange-950/40",
    statsBorder: "border-orange-100/60 dark:border-orange-900/40",
    buttonBorder: "border-[#F58220] dark:border-orange-500",
    buttonText: "text-[#F58220] dark:text-orange-400",
    buttonHoverBg: "hover:bg-[#F58220] hover:text-white dark:hover:bg-orange-500 dark:hover:text-white",
    accentColor: "#F58220",
  },
};
