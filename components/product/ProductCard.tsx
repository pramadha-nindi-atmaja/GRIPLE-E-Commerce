import Image from "next/image";
import Link from "next/link";

import { QuickAddButton } from "@/components/product/QuickAddButton";
import { cn } from "@/lib/utils/cn";
import type { ProductColor } from "@/lib/types";

type SwatchColor = { name: string; hex: string };

type QuickAddConfig = {
  productId: string;
  sizes: string[];
  stock: Record<string, number>;
  colors: ProductColor[];
};

type Props = {
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  badge?: string | null;
  image: string;
  hoverImage?: string;
  colors?: SwatchColor[];
  quickAdd?: QuickAddConfig;
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
  colors,
  quickAdd,
  className,
}: Props) {
  const href = `/store/${slug}`;
  const visibleSwatches = colors?.slice(0, 4) ?? [];
  const overflow = colors && colors.length > 4 ? colors.length - 4 : 0;
  const showQuick = Boolean(quickAdd);

  return (
    <div className={cn("flex flex-col gap-4 group/card", className)}>
      {/* Image container — glassmorphism border + premium lift hover */}
      <div
        className={cn(
          "relative aspect-[3/4] overflow-hidden rounded-[20px] bg-surface-container",
          "border border-white/[0.08]",
          // Card hover: subtle lift + neon cyan border glow
          "transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
          "group-hover/card:-translate-y-1",
          "group-hover/card:border-primary/30",
          "group-hover/card:shadow-[0_0_20px_rgba(0,245,255,0.12),0_8px_32px_rgba(0,0,0,0.5)]",
        )}
      >
        <Link
          href={href}
          className="block absolute inset-0 z-0"
          aria-label={name}
        >
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 80vw, 320px"
            className={cn(
              "object-cover object-center transition-transform duration-700 group-hover/card:scale-[1.04]",
              hoverImage ? "group-hover/card:opacity-0" : "",
            )}
            priority={false}
          />

          {hoverImage ? (
            <Image
              src={hoverImage}
              alt={name}
              fill
              sizes="(max-width: 768px) 80vw, 320px"
              className="object-cover object-center opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
              priority={false}
            />
          ) : null}

          {/* Dark vignette overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

          {badge ? (
            <div className="absolute left-3 top-3 z-[1]">
              <span
                className={cn(
                  "font-label-caps px-3 py-1 rounded-full text-[10px]",
                  "backdrop-filter backdrop-blur-md",
                  badge.toLowerCase() === "sale"
                    ? "bg-secondary/80 text-white border border-secondary/40"
                    : "bg-black/50 text-primary border border-primary/30",
                )}
              >
                {badge}
              </span>
            </div>
          ) : null}
        </Link>

        {showQuick && quickAdd ? (
          <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none group-hover/card:pointer-events-auto">
            <QuickAddButton
              productId={quickAdd.productId}
              slug={slug}
              name={name}
              price={price}
              colors={quickAdd.colors}
              sizes={quickAdd.sizes}
              stock={quickAdd.stock}
            />
          </div>
        ) : null}
      </div>

      {/* Info row */}
      <div className="flex flex-col gap-2 px-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="font-body-md font-semibold text-on-background truncate">
              {name}
            </div>
          </div>
          <div className="shrink-0 font-body-md font-medium text-on-background">
            {originalPrice ? (
              <span className="flex items-center gap-2">
                <span className="text-on-surface-variant line-through text-sm">
                  ${originalPrice.toFixed(2)}
                </span>
                <span className="text-primary">${price.toFixed(2)}</span>
              </span>
            ) : (
              <span>${price.toFixed(2)}</span>
            )}
          </div>
        </div>

        {visibleSwatches.length > 0 ? (
          <div className="flex items-center gap-2">
            {visibleSwatches.map((c) => (
              <span
                key={c.name}
                title={c.name}
                aria-label={c.name}
                className="inline-block h-3.5 w-3.5 rounded-full border border-white/20"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {overflow > 0 ? (
              <span className="font-label-caps text-[10px] text-on-surface-variant">
                +{overflow}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
