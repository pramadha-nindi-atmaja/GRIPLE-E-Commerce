import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/shared/Container";

export function BrandStatement() {
  return (
    <section className="py-section-gap">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="order-2 md:order-1 flex flex-col gap-8 max-w-lg">
            <span className="font-label-caps text-label-caps text-secondary border-b border-secondary/30 w-fit pb-1">
              The Philosophy
            </span>
            <h2 className="text-headline-lg font-headline-lg text-on-background leading-tight">
              Engineered for the relentless. Designed for the modern athlete.
            </h2>
            <p className="text-body-lg font-body-lg text-on-surface-variant">
              We believe that true performance requires no compromises. Our
              garments are meticulously crafted using advanced technical fabrics
              that move seamlessly with your body, stripped of unnecessary
              distractions. The result is a highly functional, brutally
              minimalist aesthetic that performs flawlessly under pressure while
              maintaining a refined, editorial edge outside the gym.
            </p>
            <Link
              href="/"
              className={[
                "inline-flex items-center gap-2 font-label-caps text-label-caps w-fit",
                "text-primary border-b border-primary/40 pb-1",
                "transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
                "hover:text-on-surface-variant hover:border-on-surface-variant/30",
                "hover:[text-shadow:0_0_12px_rgba(0,245,255,0.4)]",
                "mt-4",
              ].join(" ")}
            >
              Discover Our Process{" "}
              <span className="material-symbols-outlined text-[16px] transition-transform duration-300 hover:translate-x-0.5">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="order-1 md:order-2">
            <div
              className={[
                "relative w-full aspect-square overflow-hidden bg-surface-container",
                "rounded-[20px] border border-white/[0.08]",
              ].join(" ")}
            >
              <Image
                src="/images/editorial/fabric-macro.jpg"
                alt="Fabric macro"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
