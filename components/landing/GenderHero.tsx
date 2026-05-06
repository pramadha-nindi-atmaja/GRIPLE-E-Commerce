import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/shared/Container";
import { cn } from "@/lib/utils/cn";

type Props = {
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaHref: string;
  ctaLabel: string;
  className?: string;
};

export function GenderHero({
  image,
  eyebrow,
  title,
  subtitle,
  ctaHref,
  ctaLabel,
  className,
}: Props) {
  return (
    <section className={cn("relative w-full h-[520px] md:h-[640px] bg-surface", className)}>
      <Image src={image} alt={title} fill priority sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-black/45" />

      <Container className="relative z-10 h-full flex items-center">
        <div className="max-w-2xl flex flex-col gap-6">
          <span className="font-label-caps text-label-caps text-white/90 tracking-widest uppercase">
            {eyebrow}
          </span>
          <h1 className="text-white text-5xl md:text-7xl font-black leading-[1.05] tracking-[-0.033em]">
            {title}
          </h1>
          <p className="text-white/90 text-body-lg font-body-lg max-w-xl">
            {subtitle}
          </p>
          <div className="mt-4">
            <Link
              href={ctaHref}
              className="inline-flex h-12 px-8 items-center justify-center rounded-full bg-white text-primary text-base font-bold tracking-wide hover:bg-white/90 transition-colors"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

