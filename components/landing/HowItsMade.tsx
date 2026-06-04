import { Container } from "@/components/shared/Container";

type Feature = {
  icon: string;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: "speed",
    title: "Performance Fabric",
    description:
      "Proprietary blends engineered for maximum breathability, moisture-wicking, and durability under the most intense conditions.",
  },
  {
    icon: "architecture",
    title: "Precision Fit",
    description:
      "Architecturally mapped to the human body, providing compressive support exactly where needed without restricting mobility.",
  },
  {
    icon: "recycling",
    title: "Responsible Materials",
    description:
      "Committed to sustainability, utilizing recycled technical fibers and eco-conscious manufacturing processes without compromising quality.",
  },
];

export function HowItsMade() {
  return (
    <section className="py-section-gap bg-background">
      <Container>
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="font-label-caps text-label-caps text-secondary mb-4">
            Why Griple
          </span>
          <h2 className="text-headline-lg font-headline-lg text-on-background">
            The Difference is in the Details
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className={[
                "glass-card p-8 flex flex-col items-start gap-6",
                // Hover: violet glow + lift
                "transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
                "hover:-translate-y-1.5",
                "hover:border-secondary/30",
                "hover:shadow-[0_0_20px_rgba(139,92,246,0.2),0_8px_32px_rgba(0,0,0,0.5)]",
              ].join(" ")}
            >
              {/* Icon container — neon cyan */}
              <div
                className={[
                  "w-14 h-14 rounded-2xl flex items-center justify-center",
                  "bg-primary/10 text-primary",
                  "border border-primary/20",
                  "shadow-[0_0_12px_rgba(0,245,255,0.15)]",
                ].join(" ")}
              >
                <span className="material-symbols-outlined text-[28px]">
                  {f.icon}
                </span>
              </div>
              <div>
                <h3 className="text-headline-md font-headline-md text-on-background mb-3">
                  {f.title}
                </h3>
                <p className="text-body-md font-body-md text-on-surface-variant">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
