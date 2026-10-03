import { describe, it, expect } from "vitest";
import { hasPermission, canAccessAdmin, canAuthorContent, canReview } from "@/lib/rbac";

describe("Role-Based Access Control (RBAC)", () => {
  it("should restrict admin permissions strictly to administrators", () => {
    expect(canAccessAdmin("administrator")).toBe(true);
    expect(canAccessAdmin("student")).toBe(false);
    expect(canAccessAdmin("content_author")).toBe(false);
    expect(canAccessAdmin("reviewer")).toBe(false);

    expect(hasPermission("administrator", "admin:manage_users")).toBe(true);
    expect(hasPermission("student", "admin:manage_users")).toBe(false);
    expect(hasPermission("reviewer", "admin:manage_users")).toBe(false);
  });

  it("should allow content authors and administrators to author content", () => {
    expect(canAuthorContent("content_author")).toBe(true);
    expect(canAuthorContent("administrator")).toBe(true);
    expect(canAuthorContent("student")).toBe(false);
    expect(canAuthorContent("reviewer")).toBe(false);
  });

  it("should allow reviewers and administrators to review submissions", () => {
    expect(canReview("reviewer")).toBe(true);
    expect(canReview("administrator")).toBe(true);
    expect(canReview("student")).toBe(false);
    expect(canReview("content_author")).toBe(false);
  });

  it("should allow students to view and enroll in simulations", () => {
    expect(hasPermission("student", "simulations:view")).toBe(true);
    expect(hasPermission("student", "simulations:enroll")).toBe(true);
    expect(hasPermission("student", "submissions:create")).toBe(true);
  });
});
