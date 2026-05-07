"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import {
  parseStoreSearchParams,
  serializeStoreQuery,
  type ParsedStoreQuery,
} from "@/lib/utils/filters";

type ReplaceOptions = {
  /** When true, keep current `page`. Default: reset to 1 (filter/sort changes). */
  preservePage?: boolean;
};

export function useStoreQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = useMemo<ParsedStoreQuery>(() => {
    const raw = Object.fromEntries(searchParams.entries());
    return parseStoreSearchParams(raw);
  }, [searchParams]);

  const replaceQuery = useCallback(
    (next: ParsedStoreQuery, opts?: ReplaceOptions) => {
      const merged: ParsedStoreQuery = opts?.preservePage
        ? next
        : { ...next, page: 1 };
      router.replace(`${pathname}${serializeStoreQuery(merged)}`, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  const clearAll = useCallback(() => {
    const cleared = parseStoreSearchParams({});
    cleared.sort = query.sort;
    router.replace(`${pathname}${serializeStoreQuery(cleared)}`, {
      scroll: false,
    });
  }, [pathname, query.sort, router]);

  return { query, replaceQuery, clearAll };
}
