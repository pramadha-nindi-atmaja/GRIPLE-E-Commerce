import Link from "next/link";

import { cn } from "@/lib/utils/cn";

type Props = {
  className?: string;
};

export function EmptyCartState({ className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-24 gap-6",
        className,
      )}
    >
      <div className="flex items-center justify-center h-20 w-20 rounded-full bg-surface-container text-on-surface-variant">
        <span className="material-symbols-outlined text-[40px]">shopping_bag</span>
      </div>

      <h2 className="font-headline-lg text-headline-lg text-on-background">
        Your cart is empty
      </h2>
      <p className="font-body-md text-on-surface-variant max-w-sm">
        Looks like you haven&apos;t added anything yet. Browse the store to find your
        next training essential.
      </p>

      <Link
        href="/store"
        className="inline-flex h-12 items-center justify-center px-8 rounded-full bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-widest hover:bg-inverse-surface transition-colors"
      >
        Browse store
      </Link>
    </div>
  );
}
