import { cn } from "@/lib/utils/cn";

type Option = {
  size: string;
  outOfStock?: boolean;
};

type Props = {
  options: Option[];
  selectedSize: string;
  className?: string;
};

export function SizeSelector({ options, selectedSize, className }: Props) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((o) => {
        const isSelected = o.size === selectedSize;
        const isDisabled = Boolean(o.outOfStock);

        return (
          <button
            key={o.size}
            type="button"
            disabled={isDisabled}
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

