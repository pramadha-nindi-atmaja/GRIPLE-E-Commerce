"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { AdminIcon } from "@/components/admin/AdminIcon";

export function AdminTopBarSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const urlQ = params.get("q") ?? "";
  const [query, setQuery] = useState(urlQ);

  useEffect(() => {
    setQuery(urlQ);
  }, [urlQ]);

  function targetPath(q: string) {
    if (pathname.startsWith("/admin/orders")) return `/admin/orders?q=${encodeURIComponent(q)}`;
    return `/admin/products?q=${encodeURIComponent(q)}`;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    router.push(targetPath(query.trim()));
  }

  return (
    <form onSubmit={onSubmit} className="relative ml-4 hidden sm:block shrink-0">
      <AdminIcon
        name="search"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[18px] pointer-events-none"
      />
      <input
        className="pl-10 pr-4 py-1.5 bg-surface-container-low border-none rounded-full text-admin-body focus:ring-1 focus:ring-primary w-64 outline-none"
        placeholder="Search data..."
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        name="topSearch"
      />
    </form>
  );
}
