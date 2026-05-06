import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

type Props = {
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  badge?: string | null;
  image: string;
  hoverImage?: string;
  className?: string;
};

export function ProductCard({
  name,
  slug,
  price,
  originalPrice,
  badge,
  image,
  hoverImage,
  className,
}: Props) {
  const href = `/store/${slug}`;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Link
        href={href}
        className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface-container border border-outline-variant"
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 80vw, 320px"
          className={cn(
            "object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]",
            hoverImage ? "group-hover:opacity-0" : "",
          )}
          priority={false}
        />

        {hoverImage ? (
          <Image
            src={hoverImage}
            alt={name}
            fill
            sizes="(max-width: 768px) 80vw, 320px"
            className="object-cover object-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            priority={false}
          />
        ) : null}

        {badge ? (
          <div className="absolute left-4 top-4">
            <span className="bg-surface text-on-surface font-label-caps px-3 py-1 rounded-full text-[10px] border border-outline-variant">
              {badge}
            </span>
          </div>
        ) : null}

        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            aria-label="Quick add"
            className="h-10 w-10 bg-surface rounded-full flex items-center justify-center text-primary border border-outline-variant hover:bg-primary hover:text-on-primary hover:border-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        </div>
      </Link>

      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="font-body-md font-semibold text-on-background truncate">
              {name}
            </div>
          </div>
          <div className="shrink-0 font-body-md font-medium text-on-background">
            {originalPrice ? (
              <span className="flex items-center gap-2">
                <span className="text-outline line-through">
                  ${originalPrice.toFixed(2)}
                </span>
                <span>${price.toFixed(2)}</span>
              </span>
            ) : (
              <span>${price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

