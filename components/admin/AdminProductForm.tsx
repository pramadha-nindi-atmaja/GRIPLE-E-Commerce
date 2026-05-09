"use client";

import { Badge, Gender } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import {
  createProductAction,
  updateProductAction,
  type ProductActionResult,
} from "@/lib/actions/admin/products";
import type { AdminProductPayload } from "@/lib/schemas/admin-product";
import { slugify } from "@/lib/utils/slug";

import { AdminIcon } from "@/components/admin/AdminIcon";
import { AiCopyStub } from "@/components/admin/AiCopyStub";
import { VariantColorCard } from "@/components/admin/VariantColorCard";

const SIZE_KEYS = ["XS", "S", "M", "L", "XL", "XXL"] as const;

const SIZE_LABELS: Record<(typeof SIZE_KEYS)[number], string> = {
  XS: "Extra Small",
  S: "Small",
  M: "Medium",
  L: "Large",
  XL: "Extra Large",
  XXL: "2X Large",
};

const BADGE_OPTIONS: { value: string; label: string }[] = [
  { value: "NONE", label: "None" },
  { value: Badge.BEST_SELLER, label: "Best Seller" },
  { value: Badge.NEW, label: "New" },
  { value: Badge.SALE, label: "Sale" },
];

function emptyVariant(): AdminProductPayload["variants"][0] {
  return {
    name: "New color",
    hex: "#1A1A1A",
    images: [],
    stock: Object.fromEntries(SIZE_KEYS.map((s) => [s, 0])) as Record<string, number>,
  };
}

function defaultPayload(categories: { id: string }[]): AdminProductPayload {
  return {
    name: "",
    slug: "",
    categoryId: categories[0]?.id ?? "",
    gender: Gender.ALL,
    price: 59,
    originalPrice: null,
    badge: null,
    description: "",
    fabric: "",
    care: "",
    isPublished: true,
    isFeatured: false,
    isNewArrival: false,
    variants: [emptyVariant()],
  };
}

type SubmitSource = "natural" | "draft" | "publish";

function totalStockForSize(payload: AdminProductPayload, sz: string): number {
  return payload.variants.reduce((sum, v) => sum + (v.stock[sz] ?? 0), 0);
}

type AdminProductFormProps = {
  categories: { id: string; name: string }[];
  mode: "create" | "edit";
  productId?: string;
  initial?: AdminProductPayload;
};

export function AdminProductForm({
  categories,
  mode,
  productId,
  initial,
}: AdminProductFormProps) {
  const router = useRouter();
  const base = useMemo(
    () => initial ?? defaultPayload(categories),
    [initial, categories],
  );
  const [payload, setPayload] = useState<AdminProductPayload>(base);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const submitSourceRef = useRef<SubmitSource>("natural");
  const formRef = useRef<HTMLFormElement>(null);

  function setField<K extends keyof AdminProductPayload>(key: K, value: AdminProductPayload[K]) {
    setPayload((p) => ({ ...p, [key]: value }));
  }

  function updateVariant(
    index: number,
    patch: Partial<AdminProductPayload["variants"][0]>,
  ) {
    setPayload((p) => {
      const variants = [...p.variants];
      variants[index] = { ...variants[index], ...patch };
      return { ...p, variants };
    });
  }

  function updateStock(variantIdx: number, size: string, qty: number) {
    setPayload((p) => {
      const variants = [...p.variants];
      const v = { ...variants[variantIdx], stock: { ...variants[variantIdx].stock } };
      v.stock[size] = qty;
      variants[variantIdx] = v;
      return { ...p, variants };
    });
  }

  function requestSubmit(source: SubmitSource) {
    submitSourceRef.current = source;
    formRef.current?.requestSubmit();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const source = submitSourceRef.current;
    submitSourceRef.current = "natural";

    const slug = payload.slug.trim() || slugify(payload.name);
    let isPublished = payload.isPublished;
    if (source === "draft") isPublished = false;
    if (source === "publish") isPublished = true;

    const body: AdminProductPayload = {
      ...payload,
      slug,
      isPublished,
      fabric: payload.fabric || null,
      care: payload.care || null,
      variants: payload.variants.map((v) => ({
        ...v,
        images: v.images.filter(Boolean),
      })),
    };

    const fd = new FormData();
    fd.set("payload", JSON.stringify(body));

    setPending(true);
    let res: ProductActionResult;
    if (mode === "create") {
      res = await createProductAction(fd);
    } else if (productId) {
      res = await updateProductAction(productId, fd);
    } else {
      setPending(false);
      return;
    }
    setPending(false);

    if (!res.ok) {
      setError(res.message);
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  const breadcrumbCurrent = mode === "create" ? "New Product" : "Edit product";

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      <div className="sticky top-16 z-30 -mx-container-padding px-container-padding py-3 bg-surface border-b border-admin-border flex flex-wrap items-center justify-between gap-4">
        <nav className="flex text-admin-body gap-2 items-center min-w-0">
          <Link href="/admin/products" className="text-secondary hover:text-primary shrink-0">
            Products
          </Link>
          <AdminIcon name="chevron_right" className="text-[16px] text-outline-variant shrink-0" />
          <span className="text-primary font-semibold truncate">{breadcrumbCurrent}</span>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            disabled={pending}
            onClick={() => requestSubmit("draft")}
            className="px-6 py-2 rounded-full border border-admin-border text-primary font-medium text-admin-body hover:bg-surface-container-low transition-all disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => requestSubmit("publish")}
            className="px-6 py-2 rounded-full bg-primary text-on-primary font-medium text-admin-body hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-error bg-error-container/50 px-4 py-3 text-admin-body text-error">
          {error}
        </div>
      ) : null}

      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col lg:flex-row gap-gutter items-start">
        <div className="w-full lg:w-[65%] flex flex-col gap-stack-lg">
          <section className="bg-surface rounded-2xl border border-admin-border p-stack-lg shadow-sm flex flex-col gap-stack-md">
            <h2 className="font-section-label text-section-label-secondary">BASIC INFORMATION</h2>
            <div className="flex flex-col gap-stack-sm">
              <label className="text-[11px] font-medium tracking-[0.02em] text-on-surface-variant">
                Product Name
              </label>
              <input
                required
                value={payload.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setPayload((p) => ({
                    ...p,
                    name,
                    slug: mode === "create" ? slugify(name) : p.slug,
                  }));
                }}
                className="w-full px-4 py-3 rounded-xl border border-admin-border bg-background text-admin-body outline-none focus:ring-1 focus:ring-primary"
                placeholder="e.g. Minimalist Wool Overcoat"
              />
            </div>
            <div className="flex flex-col gap-stack-sm">
              <label className="text-[11px] font-medium tracking-[0.02em] text-on-surface-variant">
                URL Slug
              </label>
              <div className="relative">
                <input
                  required
                  value={payload.slug}
                  onChange={(e) => setField("slug", slugify(e.target.value))}
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-admin-border bg-surface-container-low font-mono text-[13px] text-text-primary outline-none focus:ring-1 focus:ring-primary"
                />
                <AdminIcon
                  name="edit"
                  className="absolute right-3 top-3 text-secondary text-[20px] pointer-events-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-stack-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-[11px] font-medium tracking-[0.02em] text-on-surface-variant">
                  Description
                </label>
                <AiCopyStub onApply={(text) => setField("description", text)} />
              </div>
              <textarea
                required
                rows={6}
                value={payload.description}
                onChange={(e) => setField("description", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-admin-border bg-background text-admin-body resize-none outline-none focus:ring-1 focus:ring-primary"
                placeholder="Describe your product details, materials and fit..."
              />
            </div>
          </section>

          <section className="bg-surface rounded-2xl border border-admin-border p-stack-lg shadow-sm flex flex-col gap-stack-md">
            <h2 className="font-section-label text-section-label-secondary">PRICING</h2>
            <div className="grid grid-cols-2 gap-stack-md">
              <label className="flex flex-col gap-stack-sm">
                <span className="text-[11px] font-medium tracking-[0.02em] text-on-surface-variant">
                  Price ($)
                </span>
                <input
                  required
                  type="number"
                  step="0.01"
                  min={0}
                  value={payload.price}
                  onChange={(e) => setField("price", Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-admin-border bg-background text-admin-body outline-none focus:ring-1 focus:ring-primary"
                  placeholder="0.00"
                />
              </label>
              <label className="flex flex-col gap-stack-sm">
                <span className="text-[11px] font-medium tracking-[0.02em] text-on-surface-variant">
                  Original Price ($)
                </span>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={payload.originalPrice ?? ""}
                  onChange={(e) =>
                    setField(
                      "originalPrice",
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl border border-admin-border bg-background text-admin-body outline-none focus:ring-1 focus:ring-primary"
                  placeholder="0.00"
                />
              </label>
            </div>
            <p className="text-[11px] font-medium text-secondary italic">
              Set an original price to automatically show a Sale badge.
            </p>
          </section>

          <section className="bg-surface rounded-2xl border border-admin-border p-6 space-y-6 shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="font-section-label text-section-label-secondary">COLOR VARIANTS</h2>
            </div>

            <div className="flex flex-col gap-6">
              {payload.variants.map((v, vi) => (
                <div key={vi} className="flex flex-col gap-4">
                  <VariantColorCard
                    name={v.name}
                    hex={v.hex}
                    images={v.images}
                    canRemoveVariant={payload.variants.length > 1}
                    onUpdate={(patch) => updateVariant(vi, patch)}
                    onRemoveVariant={() =>
                      setPayload((p) => ({
                        ...p,
                        variants: p.variants.filter((_, i) => i !== vi),
                      }))
                    }
                  />
                  <div className="px-0 sm:px-1">
                    <p className="text-admin-label-sm text-text-muted mb-2">Stok per ukuran</p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {SIZE_KEYS.map((sz) => (
                        <label key={sz} className="flex flex-col gap-1">
                          <span className="text-[11px] text-text-muted">{sz}</span>
                          <input
                            type="number"
                            min={0}
                            value={v.stock[sz] ?? 0}
                            onChange={(e) =>
                              updateStock(vi, sz, Math.max(0, Number(e.target.value) || 0))
                            }
                            className="rounded-lg border border-admin-border px-2 py-1 text-admin-body"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setPayload((p) => ({ ...p, variants: [...p.variants, emptyVariant()] }))
              }
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-admin-border text-admin-body font-medium text-secondary hover:text-primary hover:border-primary transition-all"
            >
              <AdminIcon name="add" />
              Add Color Variant
            </button>
          </section>

          <section className="bg-surface rounded-2xl border border-admin-border p-stack-lg shadow-sm flex flex-col gap-stack-md">
            <h2 className="font-section-label text-section-label-secondary">FABRIC &amp; CARE</h2>
            <div className="grid grid-cols-1 gap-stack-md">
              <label className="flex flex-col gap-stack-sm">
                <span className="text-[11px] font-medium tracking-[0.02em] text-on-surface-variant">
                  Fabric
                </span>
                <input
                  value={payload.fabric ?? ""}
                  onChange={(e) => setField("fabric", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-admin-border bg-background text-admin-body outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g. 100% Merino Wool"
                />
              </label>
              <label className="flex flex-col gap-stack-sm">
                <span className="text-[11px] font-medium tracking-[0.02em] text-on-surface-variant">
                  Care Instructions
                </span>
                <input
                  value={payload.care ?? ""}
                  onChange={(e) => setField("care", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-admin-border bg-background text-admin-body outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Dry clean only"
                />
              </label>
            </div>
          </section>
        </div>

        <aside className="w-full lg:w-[35%] flex flex-col gap-stack-lg lg:sticky lg:top-[7.25rem] self-start">
          <div className="bg-surface rounded-2xl border border-admin-border p-stack-lg shadow-sm flex flex-col gap-stack-md">
            <div className="flex justify-between items-center gap-4">
              <span className="text-admin-body font-medium text-primary">Status</span>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={payload.isPublished}
                  onChange={(e) => setField("isPublished", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:border-admin-border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success" />
                <span
                  className={`ms-3 text-[11px] font-medium ${payload.isPublished ? "text-success" : "text-text-muted"}`}
                >
                  {payload.isPublished ? "Published" : "Draft"}
                </span>
              </label>
            </div>
            <button
              type="button"
              disabled={pending}
              onClick={() => requestSubmit("natural")}
              className="w-full py-3 bg-primary text-on-primary rounded-full font-medium text-admin-body hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save Changes"}
            </button>
          </div>

          <div className="bg-surface rounded-2xl border border-admin-border p-stack-lg shadow-sm flex flex-col gap-stack-md">
            <h2 className="font-section-label text-section-label-secondary">ORGANIZATION</h2>
            <label className="flex flex-col gap-stack-sm">
              <span className="text-[11px] font-medium tracking-[0.02em] text-on-surface-variant">
                Category
              </span>
              <select
                required
                value={payload.categoryId}
                onChange={(e) => setField("categoryId", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-admin-border bg-background text-admin-body appearance-none outline-none focus:ring-1 focus:ring-primary"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-col gap-stack-sm">
              <span className="text-[11px] font-medium tracking-[0.02em] text-on-surface-variant">
                Gender
              </span>
              <div className="flex p-1 bg-surface-container-low rounded-xl border border-admin-border">
                {([Gender.MEN, Gender.WOMEN, Gender.ALL] as const).map((g) => {
                  const active = payload.gender === g;
                  const label = g === Gender.MEN ? "Men" : g === Gender.WOMEN ? "Women" : "Unisex";
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setField("gender", g)}
                      className={`flex-1 py-2 text-[11px] font-medium rounded-lg transition-all ${
                        active
                          ? "bg-white shadow-sm text-primary"
                          : "text-secondary hover:text-primary"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <label className="flex flex-col gap-stack-sm">
              <span className="text-[11px] font-medium tracking-[0.02em] text-on-surface-variant">
                Badge
              </span>
              <select
                value={payload.badge ?? "NONE"}
                onChange={(e) =>
                  setField(
                    "badge",
                    e.target.value === "NONE" ? null : (e.target.value as Badge),
                  )
                }
                className="w-full px-4 py-3 rounded-xl border border-admin-border bg-background text-admin-body appearance-none outline-none focus:ring-1 focus:ring-primary"
              >
                {BADGE_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="bg-surface rounded-2xl border border-admin-border p-stack-lg shadow-sm flex flex-col gap-stack-md">
            <h2 className="font-section-label text-section-label-secondary">SIZES &amp; STOCK</h2>
            <p className="text-[11px] text-text-muted -mt-1 mb-1">
              Total units per size (all color variants).
            </p>
            <div className="flex flex-col gap-3">
              {SIZE_KEYS.map((sz) => {
                const total = totalStockForSize(payload, sz);
                return (
                  <div key={sz} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-[11px] font-bold shrink-0">
                        {sz}
                      </span>
                      <span className="text-admin-body text-primary truncate">
                        {SIZE_LABELS[sz]}
                      </span>
                    </div>
                    <span className="w-14 text-center rounded-lg border border-admin-border bg-surface-container-low text-admin-body font-medium py-1">
                      {total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-admin-border p-stack-lg shadow-sm flex flex-col gap-stack-md">
            <h2 className="font-section-label text-section-label-secondary">VISIBILITY</h2>
            <div className="flex justify-between items-center gap-4">
              <span className="text-admin-body text-on-surface">Featured on homepage</span>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={payload.isFeatured}
                  onChange={(e) => setField("isFeatured", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:border-admin-border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-admin-body text-on-surface">Show as New Arrival</span>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={payload.isNewArrival}
                  onChange={(e) => setField("isNewArrival", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:border-admin-border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="text-center text-[13px] font-medium text-secondary hover:text-primary py-2"
          >
            Cancel
          </button>
        </aside>
      </form>
    </div>
  );
}
