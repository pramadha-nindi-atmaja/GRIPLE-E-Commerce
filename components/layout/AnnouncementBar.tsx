"use client";

import { useEffect, useMemo, useState } from "react";

import { useHasMounted } from "@/lib/hooks/useHasMounted";
import { cn } from "@/lib/utils/cn";

const STORAGE_KEY = "griple-announcement-dismissed";
const ROTATE_MS = 5000;

type Props = {
  className?: string;
};

export function AnnouncementBar({ className }: Props) {
  const messages = useMemo(
    () => [
      "Free shipping on orders over $100",
      "New drops every Friday",
      "Join 50,000+ athletes",
    ],
    [],
  );

  const mounted = useHasMounted();
  const [isVisible, setIsVisible] = useState(true);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) {
        // Sync dismiss state from a prior session (cannot run during SSR).
        // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only persistence read
        setIsVisible(false);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!mounted || !isVisible) return;
    const id = window.setInterval(() => {
      setIdx((v) => (v + 1) % messages.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [mounted, isVisible, messages.length]);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "bg-[#1A1A1A] text-white py-2 px-4 flex justify-between items-center z-50 relative",
        className,
      )}
    >
      <div className="flex-1 flex justify-center items-center overflow-hidden">
        <button
          type="button"
          className="text-[13px] font-medium tracking-wide"
          aria-label="Next announcement"
          onClick={() => setIdx((v) => (v + 1) % messages.length)}
        >
          {messages[idx]}
        </button>
      </div>
      <button
        type="button"
        aria-label="Close announcement"
        className="text-white hover:text-outline-variant transition-colors"
        onClick={dismiss}
      >
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
}
