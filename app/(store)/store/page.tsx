import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { FilterSidebar } from "@/components/store/FilterSidebar";
import { Pagination } from "@/components/store/Pagination";
import { ProductGrid } from "@/components/store/ProductGrid";
import { SortBar } from "@/components/store/SortBar";
import { getAllProducts } from "@/lib/mock/products";

export default function Page() {
  const products = getAllProducts().filter((p) => p.isPublished);

  return (
    <main className="flex-grow w-full max-w-(--container-container-max) mx-auto px-4 md:px-margin-edge py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Store" }]} />

      <div className="flex flex-col md:flex-row gap-gutter">
        <FilterSidebar />

        <div className="flex-grow">
          <SortBar productCount={products.length} />
          <ProductGrid products={products} />
          <Pagination />
        </div>
      </div>
    </main>
  );
}

