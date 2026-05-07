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
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface-container border border-outline-variant">
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
            <div className="absolute left-4 top-4 z-[1]">
              <span className="bg-surface text-on-surface font-label-caps px-3 py-1 rounded-full text-[10px] border border-outline-variant">
                {badge}
              </span>
            </div>
          ) : null}
        </Link>

        {showQuick && quickAdd ? (
          <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
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

      <div className="flex flex-col gap-2">
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

        {visibleSwatches.length > 0 ? (
          <div className="flex items-center gap-2">
            {visibleSwatches.map((c) => (
              <span
                key={c.name}
                title={c.name}
                aria-label={c.name}
                className="inline-block h-3.5 w-3.5 rounded-full border border-outline-variant"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {overflow > 0 ? (
              <span className="font-label-caps text-[10px] text-outline">
                +{overflow}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
