import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-6 text-label-caps",
  md: "h-12 px-8 text-label-caps",
  lg: "h-14 px-10 text-label-caps",
};

const variantClasses: Record<ButtonVariant, string> = {
  /* Neon Cyan primary with glow lift on hover */
  primary:
    "bg-primary text-on-primary border border-primary " +
    "hover:-translate-y-0.5 hover:scale-[1.02] hover:glow-cyan " +
    "hover:shadow-[0_0_20px_rgba(0,245,255,0.5),0_0_40px_rgba(0,245,255,0.2),0_4px_24px_rgba(0,0,0,0.4)]",

  /* Glass secondary with subtle cyan border glow on hover */
  secondary:
    "glass-card text-on-surface border border-outline-variant " +
    "hover:-translate-y-0.5 hover:scale-[1.02] " +
    "hover:border-primary/40 hover:shadow-[0_0_12px_rgba(0,245,255,0.2),0_2px_16px_rgba(0,0,0,0.3)]",

  /* Transparent ghost for minimal CTA */
  ghost:
    "bg-transparent text-on-surface-variant " +
    "hover:text-primary hover:-translate-y-0.5",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        // Base
        "inline-flex items-center justify-center whitespace-nowrap rounded-full font-label-caps uppercase",
        // Premium cubic-bezier transition
        "transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
        // Focus ring in cyan
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        // Disabled
        "disabled:opacity-40 disabled:pointer-events-none",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
