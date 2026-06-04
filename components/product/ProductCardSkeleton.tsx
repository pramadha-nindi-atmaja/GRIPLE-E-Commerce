import { cn } from "@/lib/utils/cn";

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Image skeleton with glassmorphism border */}
      <div
        className={cn(
          "aspect-[3/4] rounded-[20px] animate-pulse",
          "bg-surface-container-high",
          "border border-white/[0.06]",
        )}
      />
      <div className="flex flex-col gap-2 px-1">
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
