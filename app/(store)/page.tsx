import { BestSellers } from "@/components/landing/BestSellers";
import { BrandStatement } from "@/components/landing/BrandStatement";
import { CollectionSpotlight } from "@/components/landing/CollectionSpotlight";
import { FeaturedCategories } from "@/components/landing/FeaturedCategories";
import { Hero } from "@/components/landing/Hero";
import { HowItsMade } from "@/components/landing/HowItsMade";
import { NewArrivals } from "@/components/landing/NewArrivals";
import { Newsletter } from "@/components/landing/Newsletter";
import { SocialProofStrip } from "@/components/landing/SocialProofStrip";
import { UGCGrid } from "@/components/landing/UGCGrid";

export default function Page() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <BestSellers />
      <SocialProofStrip />
      <BrandStatement />
      <CollectionSpotlight />
      <NewArrivals />
      <HowItsMade />
      <UGCGrid />
      <Newsletter />
    </>
  );
}
