"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { getCategoriesByGender } from "@/lib/mock/categories";
import { useCartStore } from "@/lib/stores/cart.store";
import { cn } from "@/lib/utils/cn";
import type { Category } from "@/lib/types";
import { UserProfileDropdown } from "@/components/layout/UserProfileDropdown";
import { useHasMounted } from "@/lib/hooks/useHasMounted";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

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
  const pathname = usePathname();
  const mounted = useHasMounted();
  const itemCount = useCartStore((s) => s.itemCount());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menCats, setMenCats] = useState<Category[]>([]);
  const [womenCats, setWomenCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const isHome = pathname === "/";

  useEffect(() => {
    async function loadCategories() {
      try {
        const [menCategories, womenCategories] = await Promise.all([
          getCategoriesByGender("men"),
          getCategoriesByGender("women"),
        ]);
        setMenCats(menCategories);
        setWomenCats(womenCategories);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const barSolid = !isHome || scrolled;

  return (
    <div
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-all duration-300",
        barSolid
          ? "bg-background/85 backdrop-blur-xl border-white/[0.08]"
          : "bg-transparent border-transparent",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-(--container-container-max) px-4 md:px-margin-edge">
        <header className="flex items-center justify-between whitespace-nowrap py-5">
          <div className="flex items-center gap-4 md:gap-8 min-w-0">
            <button
              type="button"
              className="md:hidden flex items-center justify-center rounded-full h-10 w-10 text-on-surface hover:bg-surface-container shrink-0"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <span className="material-symbols-outlined text-[26px]">menu</span>
            </button>

            <Link
              href="/"
              className="flex items-center gap-4 text-on-surface hover:opacity-80 transition-opacity shrink-0"
            >
              <LogoMark />
              <div className="text-on-surface text-lg font-bold leading-tight tracking-[-0.015em]">
                Griple
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-9">
              <div className="relative group">
                <span className="inline-flex">
                  <Link
                    href="/store?gender=men"
                    className="text-on-surface-variant font-label-caps text-label-caps hover:text-primary transition-colors py-2"
                  >
                    Men
                  </Link>
                </span>
                <div
                  className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                  role="menu"
                >
                  <div className="min-w-[220px] rounded-[20px] border border-white/[0.08] bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] py-3 px-2 flex flex-col gap-1">
                    {loading ? (
                      <div className="flex flex-col gap-1 px-3 py-1">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="h-8 rounded-xl bg-surface-container-high animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      <>
                        {menCats.slice(0, 6).map((c) => (
                          <Link
                            key={c.id}
                            role="menuitem"
                            href={`/store?category=${encodeURIComponent(c.slug)}`}
                            className="font-body-md text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-xl px-3 py-2 transition-colors"
                          >
                            {c.name}
                          </Link>
                        ))}
                        <Link
                          role="menuitem"
                          href="/store?gender=men"
                          className="font-label-caps text-[11px] text-primary hover:bg-surface-container rounded-xl px-3 py-2 transition-colors mt-1 border-t border-outline-variant pt-2"
                        >
                          View all Men →
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative group">
                <span className="inline-flex">
                  <Link
                    href="/store?gender=women"
                    className="text-on-surface-variant font-label-caps text-label-caps hover:text-primary transition-colors py-2"
                  >
                    Women
                  </Link>
                </span>
                <div
                  className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                  role="menu"
                >
                  <div className="min-w-[220px] rounded-[20px] border border-white/[0.08] bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] py-3 px-2 flex flex-col gap-1">
                    {loading ? (
                      <div className="flex flex-col gap-1 px-3 py-1">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="h-8 rounded-xl bg-surface-container-high animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      <>
                        {womenCats.slice(0, 6).map((c) => (
                          <Link
                            key={c.id}
                            role="menuitem"
                            href={`/store?category=${encodeURIComponent(c.slug)}`}
                            className="font-body-md text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-xl px-3 py-2 transition-colors"
                          >
                            {c.name}
                          </Link>
                        ))}
                        <Link
                          role="menuitem"
                          href="/store?gender=women"
                          className="font-label-caps text-[11px] text-primary hover:bg-surface-container rounded-xl px-3 py-2 transition-colors mt-1 border-t border-outline-variant pt-2"
                        >
                          View all Women →
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Link
                href="/store"
                className="text-on-surface-variant font-label-caps text-label-caps hover:text-primary transition-colors"
              >
                Collections
              </Link>
              <Link
                href="/store?badge=sale"
                className="text-on-surface-variant font-label-caps text-label-caps hover:text-primary transition-colors"
              >
                Sale
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <label className="hidden lg:flex flex-col min-w-40 h-10 max-w-64">
              <div className="flex w-full h-full items-stretch rounded-xl border border-white/[0.08] bg-surface-container-lowest/60 backdrop-blur-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30 transition-all duration-300">
                <div className="text-on-surface-variant flex items-center justify-center pl-4 pr-2">
                  <span className="material-symbols-outlined text-[20px]">
                    search
                  </span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-on-surface-variant px-0 text-sm font-normal leading-normal text-on-surface"
                  placeholder="Search"
                />
              </div>
            </label>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link
                aria-label="Cart"
                href="/cart"
                className="relative flex items-center justify-center rounded-full h-10 w-10 bg-transparent text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">
                  shopping_cart
                </span>
                {mounted && itemCount > 0 ? (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-on-primary text-[11px] leading-5 text-center shadow-[0_0_8px_rgba(0,245,255,0.6)]">
                    {itemCount}
                  </span>
                ) : null}
              </Link>
              <div className="hidden sm:flex">
                <UserProfileDropdown />
              </div>
            </div>
          </div>
        </header>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[min(100%,320px)] bg-surface-container-lowest border-r border-white/[0.08] shadow-[4px_0_40px_rgba(0,0,0,0.7)] flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-outline-variant">
              <span className="font-headline-md text-headline-md">Menu</span>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-container"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-8">
              <div>
                <div className="font-label-caps text-label-caps text-outline mb-3">
                  Men
                </div>
                <div className="flex flex-col gap-1">
                  <Link
                    href="/store?gender=men"
                    className="py-2 font-body-md text-on-surface"
                    onClick={() => setMobileOpen(false)}
                  >
                    All Men
                  </Link>
                  {loading ? (
                    <div className="flex flex-col gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-8 rounded-xl bg-surface-container-high animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <>
                      {menCats.slice(0, 6).map((c) => (
                        <Link
                          key={c.id}
                          href={`/store?category=${encodeURIComponent(c.slug)}`}
                          className="py-2 font-body-md text-on-surface-variant"
                          onClick={() => setMobileOpen(false)}
                        >
                          {c.name}
                        </Link>
                      ))}
                      <Link
                        href="/store?gender=men"
                        className="py-2 font-label-caps text-[11px] text-primary"
                        onClick={() => setMobileOpen(false)}
                      >
                        View all Men →
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <div>
                <div className="font-label-caps text-label-caps text-outline mb-3">
                  Women
                </div>
                <div className="flex flex-col gap-1">
                  <Link
                    href="/store?gender=women"
                    className="py-2 font-body-md text-on-surface"
                    onClick={() => setMobileOpen(false)}
                  >
                    All Women
                  </Link>
                  {loading ? (
                    <div className="flex flex-col gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-8 rounded-xl bg-surface-container-high animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <>
                      {womenCats.slice(0, 6).map((c) => (
                        <Link
                          key={c.id}
                          href={`/store?category=${encodeURIComponent(c.slug)}`}
                          className="py-2 font-body-md text-on-surface-variant"
                          onClick={() => setMobileOpen(false)}
                        >
                          {c.name}
                        </Link>
                      ))}
                      <Link
                        href="/store?gender=women"
                        className="py-2 font-label-caps text-[11px] text-primary"
                        onClick={() => setMobileOpen(false)}
                      >
                        View all Women →
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <Link
                href="/store"
                className="font-label-caps text-label-caps text-primary py-2"
                onClick={() => setMobileOpen(false)}
              >
                Collections
              </Link>
              <Link
                href="/store?badge=sale"
                className="font-label-caps text-label-caps text-primary py-2"
                onClick={() => setMobileOpen(false)}
              >
                Sale
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}
