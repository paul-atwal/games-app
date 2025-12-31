"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          // Variants
          variant === "primary" &&
            "bg-[var(--foreground)] text-[var(--background)] hover:opacity-90",
          variant === "secondary" &&
            "bg-[var(--border)] text-[var(--foreground)] hover:opacity-80",
          variant === "outline" &&
            "border border-[var(--border)] bg-transparent hover:bg-[var(--border)]",
          variant === "ghost" && "hover:bg-[var(--border)]",
          // Sizes
          size === "sm" && "h-8 px-3 text-sm rounded",
          size === "md" && "h-10 px-4 text-sm rounded-md",
          size === "lg" && "h-12 px-6 text-base rounded-md",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
