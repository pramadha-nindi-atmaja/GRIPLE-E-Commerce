import Image from "next/image";
import Link from "next/link";

export function CollectionSpotlight() {
  return (
    <section className="w-full h-[716px] min-h-[500px] relative bg-surface">
      <Image
        src="/images/editorial/collection-spotlight.jpg"
        alt="Collection spotlight"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto z-10">
        <span className="font-label-caps text-label-caps text-white/90 tracking-widest mb-6">
          Featured Collection
        </span>
        <h2 className="text-white text-5xl md:text-7xl font-black leading-tight tracking-[-0.033em] mb-6">
          The Essential Series
        </h2>
        <p className="text-white/90 text-body-lg font-body-lg mb-10 max-w-xl">
          A curated selection of foundational pieces designed to elevate your
          everyday performance. Stripped back. Engineered to perfection.
        </p>
        <Link
          href="/store"
          className="bg-white text-primary px-8 py-4 rounded-full font-bold tracking-wide hover:bg-surface transition-colors"
        >
          Shop the Collection
        </Link>
      </div>
    </section>
  );
}

