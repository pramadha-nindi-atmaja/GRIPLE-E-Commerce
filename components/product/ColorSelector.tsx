import { cn } from "@/lib/utils/cn";

type ColorOption = {
  name: string;
  hex: string;
};

type Props = {
  colors: ColorOption[];
  selectedName: string;
  className?: string;
};

export function ColorSelector({ colors, selectedName, className }: Props) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {colors.map((c) => {
        const isSelected = c.name === selectedName;
        return (
          <button
            key={c.name}
            type="button"
            aria-label={c.name}
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

