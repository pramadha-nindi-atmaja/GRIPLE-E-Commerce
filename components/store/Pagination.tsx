import { cn } from "@/lib/utils/cn";

type Props = {
  className?: string;
};

export function Pagination({ className }: Props) {
  const itemBase =
    "h-10 w-10 inline-flex items-center justify-center rounded-full border border-outline-variant font-label-caps text-label-caps hover:bg-surface-container transition-colors";

  return (
    <div className={cn("flex justify-center mt-12", className)}>
      <div className="flex items-center gap-2">
        <button className={cn(itemBase, "border-primary bg-primary text-on-primary")}>
          1
        </button>
        <button className={itemBase}>2</button>
        <button className={itemBase}>3</button>
        <span className="px-2 text-outline">…</span>
        <button className={itemBase}>Next</button>
      </div>
    </div>
  );
}

