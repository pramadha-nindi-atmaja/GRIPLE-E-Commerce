"use client";

import { cn } from "@/lib/utils/cn";

type ColorOption = {
  name: string;
  hex: string;
};

type Props = {
  colors: ColorOption[];
  value: string;
  onChange: (name: string) => void;
  className?: string;
};

export function ColorSelector({ colors, value, onChange, className }: Props) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {colors.map((c) => {
        const isSelected = c.name === value;
        return (
          <button
            key={c.name}
            type="button"
            aria-label={c.name}
            aria-pressed={isSelected}
            onClick={() => onChange(c.name)}
            className={cn(
              "w-8 h-8 rounded-full border border-outline-variant",
              isSelected ? "border-2 border-primary" : "",
            )}
            style={{ backgroundColor: c.hex }}
          />
        );
      })}
    </div>
  );
}
