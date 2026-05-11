import { cn } from "@/lib/utils/cn";

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="aspect-[3/4] rounded-2xl bg-surface-container-high animate-pulse" />
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <div className="h-4 w-3/4 rounded-full bg-surface-container-high animate-pulse" />
          <div className="h-4 w-14 rounded-full bg-surface-container-high animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-3.5 rounded-full bg-surface-container-high animate-pulse" />
          <div className="h-3.5 w-3.5 rounded-full bg-surface-container-high animate-pulse" />
          <div className="h-3.5 w-3.5 rounded-full bg-surface-container-high animate-pulse" />
        </div>
      </div>
    </div>
  );
}
