import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

type Props = {
  className?: string;
};

export function Hero({ className }: Props) {
  return (
    <section
      className={cn(
        // Full viewport width — no side constraints
        "relative w-full overflow-hidden bg-background",
        // Full screen height on all devices
        "h-screen min-h-[600px] max-h-[1000px]",
        // Pull up to bleed behind the sticky navbar (navbar py-5 + content ≈ 72px)
        "-mt-[90px]",
        className,
      )}
    >
      {/* ── Background Image ─────────────────────────── */}
      <Image
        src="/images/hero/hero.jpg"
        alt="Griple hero — Unleash Your Potential"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* ── Multi-layer dark gradient overlays ───────── */}
      {/* Bottom vignette — text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      {/* Left sweep — text column depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/20 to-transparent" />
      {/* Top fade — soften behind transparent navbar */}
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/50 to-transparent" />

      {/* ── Neon cyan hairline at bottom ─────────────── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,245,255,0.5) 35%, rgba(0,245,255,0.5) 65%, transparent 100%)",
        }}
      />

      {/* ── Hero content (vertically centered, offset for navbar) ── */}
      <div className="absolute inset-0 flex items-center pt-[72px]">
        <div className="w-full max-w-(--container-container-max) mx-auto px-6 md:px-12 lg:px-[48px]">
          <div className="max-w-2xl flex flex-col gap-6">

            {/* Eyebrow — neon cyan with glowing dot */}
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="inline-block h-2 w-2 rounded-full bg-primary shrink-0"
                style={{
                  boxShadow:
                    "0 0 6px rgba(0,245,255,1), 0 0 18px rgba(0,245,255,0.6)",
                }}
              />
              <span
                className="font-label-caps text-label-caps tracking-[0.2em] uppercase"
                style={{
                  color: "#00F5FF",
                  textShadow: "0 0 12px rgba(0,245,255,0.55)",
                }}
              >
                New Collection 2026
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-white font-black leading-[1.02] tracking-[-0.033em] text-[clamp(2.8rem,6vw,5rem)]">
              Unleash Your
              <br />
              <span
                style={{
                  color: "#00F5FF",
                  textShadow: "0 0 30px rgba(0,245,255,0.4), 0 0 60px rgba(0,245,255,0.15)",
                }}
              >
                Potential
              </span>
            </h1>

            {/* Sub-copy */}
            <p className="text-white/80 text-lg md:text-xl font-normal leading-relaxed max-w-lg">
              Premium athletic gear engineered for maximum performance, ultimate
              comfort, and striking aesthetics.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mt-2">
              {/* Primary — Neon Cyan */}
              <Link
                href="/men"
                className={[
                  "flex items-center justify-center h-12 px-8 rounded-full",
                  "bg-primary text-on-primary text-base font-bold tracking-wide",
                  "transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
                  "hover:-translate-y-0.5 hover:scale-[1.02]",
                  "hover:shadow-[0_0_20px_rgba(0,245,255,0.65),0_0_50px_rgba(0,245,255,0.3),0_6px_24px_rgba(0,0,0,0.5)]",
                ].join(" ")}
              >
                Shop Men
              </Link>
              {/* Secondary — glass */}
              <Link
                href="/women"
                className={[
                  "flex items-center justify-center h-12 px-8 rounded-full",
                  "bg-white/10 backdrop-blur-md text-white text-base font-bold tracking-wide",
                  "border border-white/30",
                  "transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
                  "hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-white/20 hover:border-white/50",
                ].join(" ")}
              >
                Shop Women
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ─────────────────────────── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        aria-hidden="true"
      >
        <span
          className="font-label-caps text-[9px] tracking-[0.25em] uppercase"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          Scroll
        </span>
        <span
          className="material-symbols-outlined text-[22px] animate-bounce"
          style={{
            color: "rgba(255,255,255,0.35)",
            animationDuration: "1.6s",
          }}
        >
          keyboard_arrow_down
        </span>
      </div>
    </section>
  );
}
