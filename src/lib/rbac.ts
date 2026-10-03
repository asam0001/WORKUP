import { UserRole } from "@/types";

export type Permission =
  | "simulations:view"
  | "simulations:enroll"
  | "submissions:create"
  | "evaluations:view_own"
  | "content:create"
  | "content:edit"
  | "evaluations:review"
  | "admin:view_all"
  | "admin:manage_users"
  | "admin:audit_logs";

const rolePermissions: Record<UserRole, Permission[]> = {
  student: [
    "simulations:view",
    "simulations:enroll",
    "submissions:create",
    "evaluations:view_own",
  ],
  content_author: [
    "simulations:view",
    "simulations:enroll",
    "submissions:create",
    "evaluations:view_own",
    "content:create",
    "content:edit",
  ],
  reviewer: [
    "simulations:view",
    "evaluations:view_own",
    "evaluations:review",
  ],
  administrator: [
    "simulations:view",
    "simulations:enroll",
    "submissions:create",
    "evaluations:view_own",
    "content:create",
    "content:edit",
    "evaluations:review",
    "admin:view_all",
    "admin:manage_users",
    "admin:audit_logs",
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = rolePermissions[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

export function canAccessAdmin(role: UserRole): boolean {
  return role === "administrator";
}

export function canAuthorContent(role: UserRole): boolean {
  return role === "content_author" || role === "administrator";
}

export function canReview(role: UserRole): boolean {
  return role === "reviewer" || role === "administrator";
}
