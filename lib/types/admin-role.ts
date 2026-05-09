export const ADMIN_ROLES = ["SUPER_ADMIN", "STAFF"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

