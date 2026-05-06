export function FilterSidebar() {
  return (
    <aside className="w-full md:w-[260px] shrink-0 border-r border-outline-variant pr-gutter pb-12 hidden md:block">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-headline-md font-headline-md">Filter</h2>
        <button className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary underline underline-offset-4 rounded-full">
          Clear All
        </button>
      </div>

      <div className="border-b border-outline-variant py-4">
        <button className="flex justify-between items-center w-full group">
          <span className="font-label-caps text-label-caps text-primary">
            Gender
          </span>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
            expand_less
          </span>
        </button>
        <div className="mt-4 flex flex-col gap-3">
          {["Men", "Women", "Unisex"].map((g) => (
            <label key={g} className="flex items-center gap-3 cursor-pointer">
              <input
                className="form-checkbox h-4 w-4 text-primary border-outline-variant focus:ring-primary focus:ring-offset-0 bg-surface rounded-md"
                type="checkbox"
              />
              <span className="text-body-md font-body-md text-on-surface-variant">
                {g}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-b border-outline-variant py-4">
        <button className="flex justify-between items-center w-full group">
          <span className="font-label-caps text-label-caps text-primary">
            Category
          </span>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
            expand_more
          </span>
        </button>
      </div>

      <div className="border-b border-outline-variant py-4">
        <button className="flex justify-between items-center w-full group">
          <span className="font-label-caps text-label-caps text-primary">
            Size
          </span>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
            expand_less
          </span>
        </button>
        <div className="mt-4 flex flex-wrap gap-2">
          {["XS", "S", "M", "L", "XL"].map((s) => (
            <button
              key={s}
              className="w-10 h-10 border border-outline-variant flex items-center justify-center font-label-caps text-label-caps hover:border-primary hover:bg-surface-container transition-colors rounded-full"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-outline-variant py-4">
        <button className="flex justify-between items-center w-full group">
          <span className="font-label-caps text-label-caps text-primary">
            Color
          </span>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
            expand_more
          </span>
        </button>
      </div>

      <div className="border-b border-outline-variant py-4">
        <button className="flex justify-between items-center w-full group">
          <span className="font-label-caps text-label-caps text-primary">
            Price
          </span>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
            expand_more
          </span>
        </button>
      </div>
    </aside>
  );
}

