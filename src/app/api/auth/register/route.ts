import { NextRequest } from "next/server";
import { RegisterInputSchema } from "@/types";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession, setSessionCookie } from "@/lib/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = RegisterInputSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (existingUser) {
      return apiError("An account with this email address already exists", 409, "EMAIL_EXISTS");
    }

    const passwordHash = await hashPassword(validated.password);

    // Create user and profile in transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: validated.name.trim(),
          email: validated.email.toLowerCase().trim(),
          passwordHash,
          role: validated.role || "student",
          profile: {
            create: {
              experienceLevel: "beginner",
            },
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: newUser.id,
          action: "USER_REGISTERED",
          entityType: "User",
          entityId: newUser.id,
          ipAddress: req.headers.get("x-forwarded-for") || req.ip || "unknown",
          userAgent: req.headers.get("user-agent"),
        },
      });

      return newUser;
    });

    // Create session and set cookie
    const { token, expiresAt } = await createSession(user.id);
    const headers = new Headers();
    setSessionCookie(headers, token, expiresAt);

    logger.info("New user registered successfully", { userId: user.id, email: user.email, role: user.role });

    return apiSuccess({ user }, 201, headers);
  } catch (err) {
    return handleApiError(err);
  }
}
