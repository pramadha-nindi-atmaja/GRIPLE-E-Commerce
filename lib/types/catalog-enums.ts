export const GENDERS = ["MEN", "WOMEN", "ALL"] as const;
export type Gender = (typeof GENDERS)[number];

export const BADGES = ["BEST_SELLER", "NEW", "SALE"] as const;
export type Badge = (typeof BADGES)[number];

