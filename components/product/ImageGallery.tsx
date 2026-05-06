import Image from "next/image";

import { cn } from "@/lib/utils/cn";

type Props = {
  images: string[];
  alt: string;
  className?: string;
};

export function ImageGallery({ images, alt, className }: Props) {
  const [first, ...rest] = images.length ? images : ["/images/products/_pool/black.jpg"];
  const thumbs = rest.length ? rest : [first];

  return (
    <div className={cn("grid grid-cols-1 gap-4", className)}>
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-container border border-outline-variant">
        <Image
          src={first}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 700px"
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar">
        {thumbs.map((src, idx) => (
          <div
            key={`${src}-${idx}`}
            className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden bg-surface-container border border-outline-variant"
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="80px"
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

