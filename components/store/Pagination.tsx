"use client";

import { useStoreQuery } from "@/lib/hooks/useStoreQuery";
import { cn } from "@/lib/utils/cn";

type Props = {
  page: number;
  totalPages: number;
  className?: string;
};

function pagesToShow(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const result: (number | "ellipsis")[] = [1];

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) result.push("ellipsis");
  for (let i = start; i <= end; i++) result.push(i);
  if (end < total - 1) result.push("ellipsis");

  result.push(total);
  return result;
}

export function Pagination({ page, totalPages, className }: Props) {
  const { query, replaceQuery } = useStoreQuery();

  if (totalPages <= 1) return null;

  const goTo = (next: number) => {
    if (next < 1 || next > totalPages || next === page) return;
    replaceQuery({ ...query, page: next }, { preservePage: true });
  };

  const itemBase =
    "h-10 min-w-10 px-3 inline-flex items-center justify-center rounded-full border border-outline-variant font-label-caps text-label-caps transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const items = pagesToShow(page, totalPages);

  return (
    <div className={cn("flex justify-center mt-12", className)}>
      <nav
        aria-label="Pagination"
        className="flex items-center gap-2 flex-wrap justify-center"
      >
        <button
          type="button"
          onClick={() => goTo(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className={cn(itemBase, "hover:bg-surface-container")}
        >
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>

        {items.map((it, idx) =>
          it === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 text-outline"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={it}
              type="button"
              onClick={() => goTo(it)}
              aria-current={it === page ? "page" : undefined}
              className={cn(
                itemBase,
                it === page
                  ? "border-primary bg-primary text-on-primary"
                  : "hover:bg-surface-container",
              )}
            >
              {it}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => goTo(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
          className={cn(itemBase, "hover:bg-surface-container")}
        >
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </nav>
    </div>
  );
}
