export function ProductDetailSkeleton() {
  return (
    <main className="mx-auto w-full max-w-(--container-container-max) px-4 md:px-margin-edge py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-3.5 w-10 rounded-full bg-surface-container-high animate-pulse" />
        <div className="h-3.5 w-2 rounded-full bg-surface-container-high animate-pulse" />
        <div className="h-3.5 w-12 rounded-full bg-surface-container-high animate-pulse" />
        <div className="h-3.5 w-2 rounded-full bg-surface-container-high animate-pulse" />
        <div className="h-3.5 w-32 rounded-full bg-surface-container-high animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square rounded-2xl bg-surface-container-high animate-pulse" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-surface-container-high animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="flex flex-col">
          <div className="h-3.5 w-28 rounded-full bg-surface-container-high animate-pulse mb-4" />
          <div className="h-9 w-3/4 rounded-xl bg-surface-container-high animate-pulse mb-2" />
          <div className="h-9 w-1/2 rounded-xl bg-surface-container-high animate-pulse mb-6" />

          {/* Price */}
          <div className="h-8 w-24 rounded-full bg-surface-container-high animate-pulse mb-8" />

          {/* Color label */}
          <div className="h-3.5 w-20 rounded-full bg-surface-container-high animate-pulse mb-3" />
          {/* Color swatches */}
          <div className="flex gap-3 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-surface-container-high animate-pulse"
              />
            ))}
          </div>

          {/* Size label */}
          <div className="h-3.5 w-16 rounded-full bg-surface-container-high animate-pulse mb-3" />
          {/* Size buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-16 rounded-xl bg-surface-container-high animate-pulse"
              />
            ))}
          </div>

          {/* Add to cart */}
          <div className="h-14 w-full rounded-full bg-surface-container-high animate-pulse mb-4" />
          <div className="h-14 w-full rounded-full bg-surface-container-high animate-pulse" />
        </div>
      </div>
    </main>
  );
}
