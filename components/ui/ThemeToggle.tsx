"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { useHasMounted } from "@/lib/hooks/useHasMounted";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const mounted = useHasMounted();

  // Prevent hydration mismatch — render placeholder until mounted
  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-full" aria-hidden="true" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      id="theme-toggle"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className={[
        // Base: pill icon button
        "relative flex h-10 w-10 items-center justify-center rounded-full shrink-0",
        // Glass base style
        "border transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
        // Dark mode styling
        isDark
          ? [
              "bg-surface-container border-white/[0.10] text-primary",
              "hover:border-primary/50 hover:bg-primary/10",
              "hover:shadow-[0_0_12px_rgba(0,245,255,0.35),0_0_24px_rgba(0,245,255,0.15)]",
              "hover:scale-[1.08]",
            ].join(" ")
          : [
              // Light mode: warm amber/yellow styling
              "bg-surface-container border-outline-variant text-on-surface",
              "hover:bg-surface-container-high hover:border-outline",
              "hover:scale-[1.08]",
            ].join(" "),
      ].join(" ")}
    >
      {/* Icon swap with smooth rotate+fade */}
      <span
        aria-hidden="true"
        className={[
          "material-symbols-outlined text-[22px]",
          "transition-all duration-300",
          isDark ? "rotate-0 opacity-100" : "rotate-180 opacity-0 absolute",
        ].join(" ")}
      >
        dark_mode
      </span>
      <span
        aria-hidden="true"
        className={[
          "material-symbols-outlined text-[22px]",
          "transition-all duration-300",
          isDark ? "rotate-180 opacity-0 absolute" : "rotate-0 opacity-100",
        ].join(" ")}
        style={{ color: isDark ? undefined : "#d97706" }}
      >
        light_mode
      </span>
    </button>
  );
}
