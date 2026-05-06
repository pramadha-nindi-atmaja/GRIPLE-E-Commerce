import { Container } from "@/components/shared/Container";

export function SocialProofStrip() {
  return (
    <section className="bg-surface-container-lowest border-y border-outline-variant py-12">
      <Container className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 md:divide-x md:divide-outline-variant">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <span className="text-headline-lg font-headline-lg text-primary mb-2">
            50k+
          </span>
          <span className="font-label-caps text-label-caps text-outline">
            Happy Customers
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-headline-lg font-headline-lg text-primary">
              4.8
            </span>
            <span className="material-symbols-outlined text-primary text-[24px]">
              star
            </span>
          </div>
          <span className="font-label-caps text-label-caps text-outline">
            Avg Rating
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-center px-4">
          <span className="text-headline-lg font-headline-lg text-primary mb-2">
            120+
          </span>
          <span className="font-label-caps text-label-caps text-outline">
            Products
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-center px-4">
          <span className="text-headline-lg font-headline-lg text-primary mb-2">
            30
          </span>
          <span className="font-label-caps text-label-caps text-outline">
            Days Free Returns
          </span>
        </div>
      </Container>
    </section>
  );
}

