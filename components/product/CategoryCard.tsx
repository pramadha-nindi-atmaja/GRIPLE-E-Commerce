import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

type Props = {
  title: string;
  href: string;
  image: string;
  className?: string;
};

export function CategoryCard({ title, href, image, className }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container border border-outline-variant block",
        className,
      )}
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 80vw, 320px"
        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
      <div className="absolute bottom-0 left-0 p-6 flex flex-col gap-2">
        <h3 className="text-white text-xl font-bold leading-tight">{title}</h3>
        <span className="text-white/80 font-label-caps flex items-center gap-1 group-hover:text-white transition-colors">
          Shop Now{" "}
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </span>
      </div>
    </Link>
  );
}

