"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils/cn";

type Props = {
  images: string[];
  alt: string;
  className?: string;
};

function ImageGalleryInner({
  list,
  alt,
  className,
}: {
  list: string[];
  alt: string;
  className?: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const mainSrc = list[selectedIndex] ?? list[0]!;

  return (
    <div className={cn("grid grid-cols-1 gap-4", className)}>
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-container border border-outline-variant">
        <Image
          src={mainSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 700px"
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar">
        {list.map((src, idx) => {
          const isActive = idx === selectedIndex;
          return (
            <button
              key={`${src}-${idx}`}
              type="button"
              aria-label={`View image ${idx + 1}`}
              aria-current={isActive}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden bg-surface-container border transition-colors",
                isActive ? "border-primary ring-2 ring-primary" : "border-outline-variant",
              )}
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes="80px"
                className="object-cover object-center"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ImageGallery({ images, alt, className }: Props) {
  const list = useMemo(
    () => (images.length ? images : ["/images/products/_pool/black.jpg"]),
    [images],
  );

  return (
    <ImageGalleryInner key={list.join("|")} list={list} alt={alt} className={className} />
  );
}
