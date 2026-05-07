"use client";

import { cn } from "@/lib/utils/cn";

type Props = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  className?: string;
};

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: Props) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-outline-variant overflow-hidden",
        className,
      )}
    >
      <button
        type="button"
        className="h-10 w-10 inline-flex items-center justify-center hover:bg-surface-container transition-colors disabled:opacity-40"
        aria-label="Decrease quantity"
        onClick={dec}
        disabled={value <= min}
      >
        <span className="material-symbols-outlined text-[18px]">remove</span>
      </button>
      <div className="h-10 w-12 inline-flex items-center justify-center text-body-md font-body-md">
        {value}
      </div>
      <button
        type="button"
        className="h-10 w-10 inline-flex items-center justify-center hover:bg-surface-container transition-colors disabled:opacity-40"
        aria-label="Increase quantity"
        onClick={inc}
        disabled={value >= max}
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
      </button>
    </div>
  );
}
