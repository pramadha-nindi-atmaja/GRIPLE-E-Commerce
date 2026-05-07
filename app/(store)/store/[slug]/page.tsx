import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import { ProductView } from "@/components/product/ProductView";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import {
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
} from "@/lib/mock/products";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || !product.isPublished) notFound();

  const related = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  return (
    <>
      <main className="mx-auto w-full max-w-(--container-container-max) px-4 md:px-margin-edge py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Store", href: "/store" },
            { label: product.name },
          ]}
        />

        <ProductView product={product}>
          <ProductAccordion
            items={[
              { title: "Description", content: product.description },
              { title: "Fabric & Care", content: `${product.fabric}\n${product.care}` },
              {
                title: "Shipping & Returns",
                content:
                  "Free shipping on orders over $100. 30 days free returns.",
              },
            ]}
          />
        </ProductView>
      </main>

      <RelatedProducts products={related} />
    </>
  );
}
