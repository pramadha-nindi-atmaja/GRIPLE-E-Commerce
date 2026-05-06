"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils/cn";

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

  const [isVisible, setIsVisible] = useState(true);
  const [idx, setIdx] = useState(0);

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
        onClick={() => setIsVisible(false)}
      >
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
}

