import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/shared/Container";
import { cn } from "@/lib/utils/cn";

type Props = {
  className?: string;
};

export function Hero({ className }: Props) {
  return (
    <section className={cn("py-8", className)}>
      <Container>
        <div className="relative w-full aspect-[4/3] md:aspect-[21/9] rounded-2xl overflow-hidden bg-surface-container flex items-end md:items-center justify-start p-8 md:p-16">
          <Image
            src="/images/hero/hero.jpg"
            alt="Griple hero"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1440px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:bg-gradient-to-r md:from-black/60 md:via-black/20 md:to-transparent" />

          <div className="relative z-10 max-w-2xl flex flex-col gap-6 text-left">
            <span className="font-label-caps text-white tracking-widest uppercase">
              New Collection
            </span>
            <h1 className="text-white text-5xl md:text-7xl font-black leading-[1.05] tracking-[-0.033em]">
              Unleash Your Potential
            </h1>
            <p className="text-white/90 text-lg md:text-xl font-normal leading-relaxed max-w-xl">
              Premium athletic gear engineered for maximum performance, ultimate
              comfort, and striking aesthetics.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <Link
                href="/men"
                className="flex items-center justify-center h-12 px-8 rounded-full bg-primary text-on-primary text-base font-bold tracking-wide hover:bg-inverse-surface transition-colors"
              >
                Shop Men
              </Link>
              <Link
                href="/women"
                className="flex items-center justify-center h-12 px-8 rounded-full bg-white text-primary text-base font-bold tracking-wide hover:bg-white/90 transition-colors"
              >
                Shop Women
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

