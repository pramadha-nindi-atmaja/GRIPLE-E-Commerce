"use client";

import { useSyncExternalStore } from "react";

/** True on the client after hydration; false on the server. */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
