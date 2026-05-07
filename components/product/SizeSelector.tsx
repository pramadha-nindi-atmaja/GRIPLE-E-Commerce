"use client";

import { cn } from "@/lib/utils/cn";

type Option = {
  size: string;
  outOfStock?: boolean;
};

type Props = {
  options: Option[];
  value: string;
  onChange: (size: string) => void;
  className?: string;
};

export function SizeSelector({ options, value, onChange, className }: Props) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((o) => {
        const isSelected = o.size === value;
        const isDisabled = Boolean(o.outOfStock);

        return (
          <button
            key={o.size}
            type="button"
            disabled={isDisabled}
            aria-pressed={isSelected}
            onClick={() => {
              if (!isDisabled) onChange(o.size);
            }}
            className={cn(
              "h-10 px-4 border border-outline-variant rounded-full font-label-caps text-label-caps transition-colors",
              isSelected
                ? "border-2 border-primary bg-primary text-on-primary"
                : "text-on-surface hover:border-primary hover:bg-surface-container",
              isDisabled ? "text-outline bg-surface-container-low cursor-not-allowed" : "",
            )}
          >
            {o.size}
          </button>
        );
      })}
    </div>
  );
}
