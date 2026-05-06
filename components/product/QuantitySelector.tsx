export function QuantitySelector() {
  return (
    <div className="inline-flex items-center rounded-full border border-outline-variant overflow-hidden">
      <button
        type="button"
        className="h-10 w-10 inline-flex items-center justify-center hover:bg-surface-container transition-colors"
        aria-label="Decrease quantity"
      >
        <span className="material-symbols-outlined text-[18px]">remove</span>
      </button>
      <div className="h-10 w-12 inline-flex items-center justify-center text-body-md font-body-md">
        1
      </div>
      <button
        type="button"
        className="h-10 w-10 inline-flex items-center justify-center hover:bg-surface-container transition-colors"
        aria-label="Increase quantity"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
      </button>
    </div>
  );
}

