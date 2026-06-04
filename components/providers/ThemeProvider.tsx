"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  // Track mount to avoid SSR mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("griple-theme") as Theme | null;
    const preferred =
      stored ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const initial: Theme = preferred === "light" ? "light" : "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
    setMounted(true);
  }, []);

  const toggle = () => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("griple-theme", next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme: mounted ? theme : "dark", toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
