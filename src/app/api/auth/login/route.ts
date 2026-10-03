import { NextRequest } from "next/server";
import { LoginInputSchema } from "@/types";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession, setSessionCookie } from "@/lib/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = LoginInputSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase().trim() },
      include: { profile: true },
    });

    if (!user) {
      return apiError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    if (user.status !== "active") {
      return apiError("Your account has been suspended. Please contact support.", 403, "ACCOUNT_SUSPENDED");
    }

    const isValidPassword = await verifyPassword(validated.password, user.passwordHash);
    if (!isValidPassword) {
      logger.warn("Failed login attempt", { email: user.email });
      return apiError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const { token, expiresAt } = await createSession(user.id);
    const headers = new Headers();
    setSessionCookie(headers, token, expiresAt);

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "LOGIN_SUCCESS",
        entityType: "User",
        entityId: user.id,
        ipAddress: req.headers.get("x-forwarded-for") || req.ip || "unknown",
        userAgent: req.headers.get("user-agent"),
      },
    });

    logger.info("User logged in successfully", { userId: user.id, email: user.email, role: user.role });

    return apiSuccess(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      200,
      headers
    );
  } catch (err) {
    return handleApiError(err);
  }
}
