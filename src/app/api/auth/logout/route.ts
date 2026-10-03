import { NextRequest } from "next/server";
import { getCurrentUser, revokeSession, clearSessionCookie } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const headers = new Headers();
    clearSessionCookie(headers);

    if (user) {
      await revokeSession(user.sessionId);

      await prisma.auditLog.create({
        data: {
          userId: user.userId,
          action: "LOGOUT",
          entityType: "User",
          entityId: user.userId,
          ipAddress: req.headers.get("x-forwarded-for") || req.ip || "unknown",
          userAgent: req.headers.get("user-agent"),
        },
      });

      logger.info("User logged out", { userId: user.userId });
    }

    return apiSuccess({ message: "Logged out successfully" }, 200, headers);
  } catch (err) {
    return handleApiError(err);
  }
}
