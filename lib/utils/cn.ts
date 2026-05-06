type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassValue[]
  | { [key: string]: unknown };

function flatten(value: ClassValue, acc: string[]): void {
  if (!value) return;
  if (typeof value === "string" || typeof value === "number") {
    acc.push(String(value));
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) flatten(item, acc);
    return;
  }
  if (typeof value === "object") {
    for (const [key, condition] of Object.entries(value)) {
      if (condition) acc.push(key);
    }
  }
}

/**
 * Lightweight class name combiner. Filters falsy values and supports
 * arrays / objects without pulling in `clsx` or `tailwind-merge`.
 */
export function cn(...inputs: ClassValue[]): string {
  const acc: string[] = [];
  for (const input of inputs) flatten(input, acc);
  return acc.join(" ");
}
