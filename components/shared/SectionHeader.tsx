import Link from "next/link";

import { cn } from "@/lib/utils/cn";

type Props = {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  href,
  linkLabel = "View All",
  className,
}: Props) {
  return (
    <div className={cn("flex items-end justify-between gap-6", className)}>
      <div className="min-w-0">
        {eyebrow ? (
          <div className="mb-4 text-outline font-label-caps text-label-caps">
            {eyebrow}
          </div>
        ) : null}
        <h2 className="text-headline-lg font-headline-lg text-on-background">
          {title}
        </h2>
      </div>

      {href ? (
        <Link
          href={href}
          className="shrink-0 font-label-caps text-label-caps text-primary hover:text-outline transition-colors border-b border-primary pb-1"
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}

