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
    <section className="py-section-gap bg-surface">
      <Container>
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="font-label-caps text-label-caps text-outline mb-4">
            Why Griple
          </span>
          <h2 className="text-headline-lg font-headline-lg text-on-background">
            The Difference is in the Details
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-outline-variant p-8 rounded-2xl flex flex-col items-start gap-6 hover:border-outline transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary">
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

