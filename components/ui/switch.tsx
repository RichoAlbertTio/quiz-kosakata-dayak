"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export type SwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(({ checked, defaultChecked, onCheckedChange, disabled, className }, ref) => {
  return (
    <label className={cn("inline-flex items-center cursor-pointer select-none", className)}>
      <input ref={ref} type="checkbox" className="sr-only" checked={checked} defaultChecked={defaultChecked} onChange={(e) => onCheckedChange?.(e.target.checked)} disabled={disabled} />
      <span aria-hidden className={cn("w-10 h-6 inline-flex items-center rounded-full transition-colors", disabled ? "opacity-50" : "", checked ? "bg-black" : "bg-gray-300")}>
        <span className={cn("w-4 h-4 bg-white rounded-full shadow transform transition-transform ml-1", checked ? "translate-x-4" : "translate-x-0")} />
      </span>
    </label>
  );
});
Switch.displayName = "Switch";

export default Switch;
