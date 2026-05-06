import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-(--container-container-max) px-4 md:px-margin-edge py-section-gap">
      <div className="max-w-xl">
        <div className="font-label-caps text-label-caps text-outline mb-4">
          Not found
        </div>
        <h1 className="text-headline-lg font-headline-lg text-on-background">
          Product not found
        </h1>
        <p className="mt-4 text-body-md font-body-md text-on-surface-variant">
          The product you’re looking for doesn’t exist (or is unpublished).
        </p>
        <div className="mt-8">
          <Link
            href="/store"
            className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-primary text-on-primary font-label-caps uppercase hover:bg-inverse-surface transition-colors"
          >
            Back to store
          </Link>
        </div>
      </div>
    </div>
  );
}

