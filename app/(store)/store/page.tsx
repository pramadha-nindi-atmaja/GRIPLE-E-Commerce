import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { StoreProducts } from "@/components/store/StoreProducts";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  return (
    <main className="flex-grow w-full max-w-(--container-container-max) mx-auto px-4 md:px-margin-edge py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Store" }]} />

      <StoreProducts searchParams={sp} />
    </main>
  );
}
