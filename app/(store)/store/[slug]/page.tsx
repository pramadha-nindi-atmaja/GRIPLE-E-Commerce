"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";

import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import { ProductDetailSkeleton } from "@/components/product/ProductDetailSkeleton";
import { ProductView } from "@/components/product/ProductView";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import {
  getProductBySlug,
  getProductsByCategory,
} from "@/lib/mock/products";
import type { Product } from "@/lib/types";

export default function Page() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const [productData, relatedData] = await Promise.all([
          getProductBySlug(slug),
          getProductsByCategory(product?.category || "").then(products =>
            products.filter((p) => p.slug !== slug).slice(0, 4)
          ),
        ]);

        if (!productData || !productData.isPublished) {
          notFound();
          return;
        }

        setProduct(productData);
        setRelated(relatedData);
      } catch (error) {
        console.error("Failed to load product:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadProduct();
    }
  }, [slug]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    notFound();
  }

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
