export const ADMIN_ROLES = [
  "super_admin",
  "admin",
  "manager",
  "staff",
] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export function isAdminRole(role: string | null | undefined): role is AdminRole {
  return ADMIN_ROLES.includes(role as AdminRole);
}
