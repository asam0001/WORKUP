import { describe, it, expect } from "vitest";
import { RegisterInputSchema, LoginInputSchema, ResetPasswordInputSchema } from "@/types";

describe("Validation & Schema Security", () => {
  it("should accept valid registration inputs", () => {
    const valid = {
      name: "Marcus Aurelius",
      email: "marcus@rome.org",
      password: "StrongPassword123",
      role: "student",
    };

    const result = RegisterInputSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("should reject weak passwords lacking numbers or uppercase letters", () => {
    const weak1 = {
      name: "John Doe",
      email: "john@example.com",
      password: "lowercaseonly",
    };
    expect(RegisterInputSchema.safeParse(weak1).success).toBe(false);

    const weak2 = {
      name: "John Doe",
      email: "john@example.com",
      password: "NOLOWERCASE123",
    };
    expect(RegisterInputSchema.safeParse(weak2).success).toBe(false);

    const weak3 = {
      name: "John Doe",
      email: "john@example.com",
      password: "NoNumbersPassword",
    };
    expect(RegisterInputSchema.safeParse(weak3).success).toBe(false);

    const short = {
      name: "John Doe",
      email: "john@example.com",
      password: "P1a",
    };
    expect(RegisterInputSchema.safeParse(short).success).toBe(false);
  });

  it("should reject malformed email addresses", () => {
    const malformed = {
      email: "not-an-email",
      password: "AnyPassword123",
    };

    expect(LoginInputSchema.safeParse(malformed).success).toBe(false);
  });

  it("should validate password reset inputs", () => {
    const valid = {
      token: "valid-uuid-token",
      password: "NewPassword123",
    };
    expect(ResetPasswordInputSchema.safeParse(valid).success).toBe(true);

    const invalid = {
      token: "",
      password: "weak",
    };
    expect(ResetPasswordInputSchema.safeParse(invalid).success).toBe(false);
  });
});
