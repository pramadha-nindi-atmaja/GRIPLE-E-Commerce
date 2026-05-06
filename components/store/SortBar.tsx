type Props = {
  productCount: number;
};

export function SortBar({ productCount }: Props) {
  return (
    <div className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant">
      <span className="font-label-caps text-label-caps text-on-surface-variant">
        {productCount} Products
      </span>
      <div className="flex items-center gap-2">
        <span className="font-label-caps text-label-caps text-on-surface-variant">
          Sort By
        </span>
        <select className="form-select border-0 bg-transparent py-0 pl-2 pr-8 font-label-caps text-label-caps focus:ring-0 cursor-pointer rounded-2xl">
          <option>Newest</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Best Selling</option>
        </select>
      </div>
    </div>
  );
}

