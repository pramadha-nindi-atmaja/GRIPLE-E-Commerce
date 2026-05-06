"use client";

import Link from "next/link";

import { useCartStore } from "@/lib/stores/cart.store";
import { cn } from "@/lib/utils/cn";

type Props = {
  className?: string;
};

function LogoMark() {
  return (
    <div className="size-6" aria-hidden="true">
      <svg
        fill="none"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        className="text-on-surface"
      >
        <path
          clipRule="evenodd"
          d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
          fill="currentColor"
          fillRule="evenodd"
        />
        <path
          clipRule="evenodd"
          d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
}

export function Navbar({ className }: Props) {
  const itemCount = useCartStore((s) => s.itemCount());

  return (
    <div
      className={cn(
        "sticky top-0 z-40 w-full bg-surface/95 backdrop-blur-md border-b border-outline-variant",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-(--container-container-max) px-4 md:px-margin-edge">
        <header className="flex items-center justify-between whitespace-nowrap py-5">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-4 text-on-surface hover:opacity-80 transition-opacity"
            >
              <LogoMark />
              <div className="text-on-surface text-lg font-bold leading-tight tracking-[-0.015em]">
                Griple
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-9">
              <Link
                href="/men"
                className="text-on-surface-variant font-label-caps text-label-caps hover:text-primary transition-colors"
              >
                Men
              </Link>
              <Link
                href="/women"
                className="text-on-surface-variant font-label-caps text-label-caps hover:text-primary transition-colors"
              >
                Women
              </Link>
              <Link
                href="/store"
                className="text-on-surface-variant font-label-caps text-label-caps hover:text-primary transition-colors"
              >
                Collections
              </Link>
              <Link
                href="/store"
                className="text-on-surface-variant font-label-caps text-label-caps hover:text-primary transition-colors"
              >
                Sale
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <label className="hidden lg:flex flex-col min-w-40 h-10 max-w-64">
              <div className="flex w-full h-full items-stretch rounded-xl border border-outline-variant bg-surface-container-lowest focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-shadow">
                <div className="text-outline flex items-center justify-center pl-4 pr-2">
                  <span className="material-symbols-outlined text-[20px]">
                    search
                  </span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-outline px-0 text-sm font-normal leading-normal"
                  placeholder="Search"
                />
              </div>
            </label>

            <div className="flex gap-2">
              <Link
                aria-label="Cart"
                href="/cart"
                className="relative flex items-center justify-center rounded-full h-10 w-10 bg-transparent text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">
                  shopping_cart
                </span>
                {itemCount > 0 ? (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-on-primary text-[11px] leading-5 text-center">
                    {itemCount}
                  </span>
                ) : null}
              </Link>
              <button
                type="button"
                aria-label="User profile"
                className="flex items-center justify-center rounded-full h-10 w-10 bg-transparent text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">
                  person
                </span>
              </button>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}

