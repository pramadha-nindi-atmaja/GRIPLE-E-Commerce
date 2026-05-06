import Image from "next/image";

import { Container } from "@/components/shared/Container";

const images = [
  "/images/ugc/ugc-1.jpg",
  "/images/ugc/ugc-2.jpg",
  "/images/ugc/ugc-3.jpg",
  "/images/ugc/ugc-4.jpg",
  "/images/ugc/ugc-5.jpg",
  "/images/ugc/ugc-6.jpg",
];

export function UGCGrid() {
  return (
    <section className="py-section-gap">
      <Container>
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="font-label-caps text-label-caps text-outline mb-4">
            As Worn by the Community
          </span>
          <h2 className="text-headline-lg font-headline-lg text-on-background">
            Real Athletes. Real Gear.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {images.map((src) => (
            <div
              key={src}
              className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
            >
              <Image
                src={src}
                alt="Community photo"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[32px] opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">
                  photo_camera
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button className="flex items-center gap-2 border border-outline text-on-background rounded-full px-6 py-3 font-label-caps uppercase hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[18px]">
              photo_camera
            </span>{" "}
            Follow @Griple
          </button>
        </div>
      </Container>
    </section>
  );
}

