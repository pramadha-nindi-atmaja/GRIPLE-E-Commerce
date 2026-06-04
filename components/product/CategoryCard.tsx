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
        "group relative aspect-[3/4] rounded-[20px] overflow-hidden bg-surface-container block",
        // Glassmorphism border
        "border border-white/[0.08]",
        // Premium lift + neon glow on hover
        "transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-1.5",
        "hover:border-primary/35",
        "hover:shadow-[0_0_24px_rgba(0,245,255,0.18),0_12px_40px_rgba(0,0,0,0.6)]",
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
      {/* Dark gradient overlay — more dramatic for dark theme */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Subtle top vignette */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent" />

      <div className="absolute bottom-0 left-0 p-6 flex flex-col gap-2">
        <h3 className="text-white text-xl font-bold leading-tight">{title}</h3>
        <span
          className={cn(
            "font-label-caps text-[11px] flex items-center gap-1",
            "text-white/70 group-hover:text-primary",
            "transition-colors duration-300",
          )}
        >
          Shop Now{" "}
          <span className="material-symbols-outlined text-[14px] transition-transform duration-300 group-hover:translate-x-0.5">
            arrow_forward
          </span>
        </span>
      </div>
    </Link>
  );
}
