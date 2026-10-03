import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { hashPassword, verifyPassword, createSession, verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

describe("Authentication & Session Infrastructure", () => {
  let testUserId: string;

  beforeAll(async () => {
    // Ensure test user exists
    const user = await prisma.user.upsert({
      where: { email: "test-auth-unit@workup.dev" },
      update: {},
      create: {
        email: "test-auth-unit@workup.dev",
        name: "Test Auth User",
        passwordHash: await hashPassword("SecurePassword123!"),
        role: "student",
      },
    });
    testUserId = user.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.session.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { email: "test-auth-unit@workup.dev" } });
  });

  it("should securely hash passwords and verify correct passwords", async () => {
    const rawPassword = "ComplexPassword987!";
    const hash = await hashPassword(rawPassword);

    expect(hash).toBeDefined();
    expect(hash).not.toEqual(rawPassword);
    expect(hash.startsWith("$2")).toBe(true);

    const isMatch = await verifyPassword(rawPassword, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await verifyPassword("WrongPassword123", hash);
    expect(isWrongMatch).toBe(false);
  });

  it("should create valid JWT sessions and verify them", async () => {
    const { token, expiresAt, user } = await createSession(testUserId);

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(expiresAt.getTime()).toBeGreaterThan(Date.now());
    expect(user.email).toBe("test-auth-unit@workup.dev");

    // Verify session
    const payload = await verifySession(token);
    expect(payload).not.toBeNull();
    expect(payload?.userId).toBe(testUserId);
    expect(payload?.email).toBe("test-auth-unit@workup.dev");
    expect(payload?.role).toBe("student");
  });

  it("should reject tampered or invalid JWT session tokens", async () => {
    const invalidPayload = await verifySession("tampered.fake.jwt.token");
    expect(invalidPayload).toBeNull();
  });
});
