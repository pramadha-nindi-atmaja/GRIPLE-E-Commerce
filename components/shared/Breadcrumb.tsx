import Link from "next/link";

import { cn } from "@/lib/utils/cn";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumb({ items, className }: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-2 mb-12 text-on-surface-variant", className)}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const content = item.href && !isLast ? (
          <Link
            href={item.href}
            className="font-label-caps text-label-caps hover:text-primary transition-colors"
          >
            {item.label}
          </Link>
        ) : (
          <span
            className={cn(
              "font-label-caps text-label-caps",
              isLast ? "text-primary" : "",
            )}
          >
            {item.label}
          </span>
        );

        return (
          <span key={`${item.label}-${idx}`} className="flex items-center gap-2">
            {content}
            {!isLast ? (
              <span className="font-label-caps text-label-caps">&gt;</span>
            ) : null}
          </span>
        );
      })}
    </nav>
  );
}

