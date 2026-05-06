import Image from "next/image";

import type { CartItem as CartItemType } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

type Props = {
  item: CartItemType;
  className?: string;
};

export function CartItem({ item, className }: Props) {
  return (
    <div
      className={cn(
        "py-8 flex flex-row items-center gap-6 border-b border-outline-variant",
        className,
      )}
    >
      <div className="relative w-20 h-[100px] rounded-2xl overflow-hidden bg-surface-container-highest shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="80px"
          className="object-cover object-center"
        />
      </div>

      <div className="flex-grow flex flex-col gap-2 min-w-0">
        <span className="font-body-lg text-body-lg text-primary truncate">
          {item.name}
        </span>
        <span className="font-body-md text-body-md text-on-surface-variant">
          {item.color} / {item.size}
        </span>
      </div>

      <div className="flex items-center border border-outline-variant h-10 w-24 rounded-xl overflow-hidden shrink-0">
        <button
          type="button"
          aria-label="Decrease quantity"
          className="flex-1 flex items-center justify-center hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">remove</span>
        </button>
        <span className="flex-1 text-center font-label-caps text-label-caps">
          {item.qty}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          className="flex-1 flex items-center justify-center hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
        </button>
      </div>

      <div className="w-24 text-right font-body-lg text-body-lg text-primary shrink-0">
        ${(item.price * item.qty).toFixed(2)}
      </div>

      <button
        type="button"
        aria-label="Remove item"
        className="text-on-surface-variant hover:text-primary transition-colors ml-4 shrink-0"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
}
