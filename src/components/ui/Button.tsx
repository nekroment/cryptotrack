import { type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
  size?: "sm" | "md";
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-lg font-semibold transition-opacity",
        size === "md" && "px-4 py-2 text-sm",
        size === "sm" && "px-3 py-1.5 text-xs",
        variant === "primary" && "bg-accent text-white hover:opacity-90 disabled:opacity-40",
        variant === "outline" &&
          "border border-border text-secondary hover:border-accent hover:text-accent",
        className,
      )}
    >
      {children}
    </button>
  );
}
