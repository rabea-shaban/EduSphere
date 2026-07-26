"use client";

import * as React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { CustomInput, CustomInputProps } from "./custom-input";

export interface PasswordInputProps
  extends Omit<CustomInputProps, "type" | "endIcon"> {
  showToggle?: boolean;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ label = "كلمة المرور", icon = <Lock className="h-5 w-5" />, showToggle = true, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <CustomInput
      ref={ref}
      type={showPassword ? "text" : "password"}
      label={label}
      icon={icon}
      endIcon={
        showToggle ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-[#0B2D5B] dark:focus:ring-[#F58220] rounded-md"
            aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        ) : undefined
      }
      {...props}
    />
  );
});

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
