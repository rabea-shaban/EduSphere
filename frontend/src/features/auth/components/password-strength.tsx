"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password?: string;
  showRequirements?: boolean;
}

export function PasswordStrength({
  password = "",
  showRequirements = true,
}: PasswordStrengthProps) {
  const requirements = [
    { label: "8 أحرف على الأقل", test: (pw: string) => pw.length >= 8 },
    { label: "حرف كبير واحد (A-Z)", test: (pw: string) => /[A-Z]/.test(pw) },
    { label: "حرف صغير واحد (a-z)", test: (pw: string) => /[a-z]/.test(pw) },
    { label: "رقم واحد (0-9)", test: (pw: string) => /[0-9]/.test(pw) },
  ];

  const passedCount = requirements.filter((req) => req.test(password)).length;

  const getStrengthInfo = () => {
    if (!password) return { label: "", color: "bg-slate-200 dark:bg-slate-700", width: "0%" };
    if (passedCount <= 1)
      return { label: "ضعيفة جداً", color: "bg-red-500", width: "25%" };
    if (passedCount === 2)
      return { label: "ضعيفة", color: "bg-orange-500", width: "50%" };
    if (passedCount === 3)
      return { label: "جيدة", color: "bg-yellow-500", width: "75%" };
    return { label: "قوية جداً", color: "bg-emerald-500", width: "100%" };
  };

  const strength = getStrengthInfo();

  if (!password && !showRequirements) return null;

  return (
    <div className="space-y-3 text-right">
      {password && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500 dark:text-slate-400">قوة كلمة المرور</span>
            <span
              className={cn(
                "transition-colors",
                passedCount <= 1 && "text-red-500",
                passedCount === 2 && "text-orange-500",
                passedCount === 3 && "text-yellow-600 dark:text-yellow-400",
                passedCount === 4 && "text-emerald-500"
              )}
            >
              {strength.label}
            </span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-[#0F274D] overflow-hidden">
            <div
              className={cn("h-full transition-all duration-300 rounded-full", strength.color)}
              style={{ width: strength.width }}
            />
          </div>
        </div>
      )}

      {showRequirements && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
          {requirements.map((req, index) => {
            const isMet = req.test(password);
            return (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-medium transition-colors",
                  isMet
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-400 dark:text-slate-500"
                )}
              >
                {isMet ? (
                  <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                ) : (
                  <X className="h-3.5 w-3.5 shrink-0 opacity-50" />
                )}
                <span>{req.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PasswordStrength;
