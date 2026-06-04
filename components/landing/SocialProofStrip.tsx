import { Container } from "@/components/shared/Container";

export function SocialProofStrip() {
  return (
    <section
      className={[
        "border-y py-12",
        "border-white/[0.08]",
        // Glass strip
        "backdrop-filter backdrop-blur-md",
        "bg-[rgba(255,255,255,0.025)]",
      ].join(" ")}
    >
      <Container className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 md:divide-x md:divide-white/[0.08]">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <span className="text-headline-lg font-headline-lg text-primary mb-2 [text-shadow:0_0_20px_rgba(0,245,255,0.5)]">
            50k+
          </span>
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            Happy Customers
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-headline-lg font-headline-lg text-primary [text-shadow:0_0_20px_rgba(0,245,255,0.5)]">
              4.8
            </span>
            <span className="material-symbols-outlined text-primary text-[24px]">
              star
            </span>
          </div>
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            Avg Rating
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-center px-4">
          <span className="text-headline-lg font-headline-lg text-primary mb-2 [text-shadow:0_0_20px_rgba(0,245,255,0.5)]">
            120+
          </span>
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            Products
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-center px-4">
          <span className="text-headline-lg font-headline-lg text-primary mb-2 [text-shadow:0_0_20px_rgba(0,245,255,0.5)]">
            30
          </span>
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            Days Free Returns
          </span>
        </div>
      </Container>
    </section>
  );
}
