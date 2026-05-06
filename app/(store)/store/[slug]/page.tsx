import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ImageGallery } from "@/components/product/ImageGallery";
import { ColorSelector } from "@/components/product/ColorSelector";
import { SizeSelector } from "@/components/product/SizeSelector";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import {
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
} from "@/lib/mock/products";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export default function Page({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product || !product.isPublished) notFound();

  const defaultColor = product.colors[0]!;
  const defaultSize =
    product.sizes.find((s) => (product.stock?.[s] ?? 0) > 0) ?? product.sizes[0]!;

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <ImageGallery images={defaultColor.images} alt={product.name} />

          <div>
            <div className="font-label-caps text-label-caps text-outline mb-4">
              {product.gender} / {product.category}
            </div>
            <h1 className="text-headline-lg font-headline-lg text-on-background">
              {product.name}
            </h1>

            <div className="mt-6 flex items-baseline gap-3">
              <div className="text-headline-md font-headline-md text-on-background">
                ${product.price.toFixed(2)}
              </div>
              {product.originalPrice ? (
                <div className="text-body-md font-body-md text-outline line-through">
                  ${product.originalPrice.toFixed(2)}
                </div>
              ) : null}
              {product.badge ? (
                <span className="ml-auto bg-surface text-on-surface font-label-caps px-3 py-1 rounded-full text-[10px] border border-outline-variant">
                  {product.badge}
                </span>
              ) : null}
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <div className="mb-3 font-label-caps text-label-caps text-on-surface-variant">
                  Color
                </div>
                <ColorSelector
                  colors={product.colors.map((c) => ({ name: c.name, hex: c.hex }))}
                  selectedName={defaultColor.name}
                />
              </div>

              <div>
                <div className="mb-3 font-label-caps text-label-caps text-on-surface-variant">
                  Size
                </div>
                <SizeSelector
                  selectedSize={defaultSize}
                  options={product.sizes.map((s) => ({
                    size: s,
                    outOfStock: (product.stock?.[s] ?? 0) <= 0,
                  }))}
                />
              </div>

              <div>
                <div className="mb-3 font-label-caps text-label-caps text-on-surface-variant">
                  Quantity
                </div>
                <QuantitySelector />
              </div>

              <button className="w-full h-12 rounded-full bg-primary text-on-primary font-label-caps uppercase hover:bg-inverse-surface transition-colors">
                Add to Cart
              </button>
            </div>

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
          </div>
        </div>
      </main>

      <RelatedProducts products={related} />
    </>
  );
}

