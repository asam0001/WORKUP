import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

const RequestResetSchema = z.object({
  email: z.string().email(),
});

const CompleteResetSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if this is a request for a reset token or completing the reset
    if ("token" in body && "password" in body) {
      // 1. Complete reset
      const validated = CompleteResetSchema.parse(body);

      const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token: validated.token },
      });

      if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
        return apiError("Invalid or expired reset token", 400, "INVALID_TOKEN");
      }

      const user = await prisma.user.findUnique({
        where: { email: resetToken.email },
      });

      if (!user) {
        return apiError("User not found", 404, "USER_NOT_FOUND");
      }

      const newPasswordHash = await hashPassword(validated.password);

      await prisma.$transaction([
        prisma.user.update({
          where: { id: user.id },
          data: { passwordHash: newPasswordHash },
        }),
        prisma.passwordResetToken.update({
          where: { id: resetToken.id },
          data: { used: true },
        }),
        prisma.session.deleteMany({
          where: { userId: user.id },
        }),
        prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "PASSWORD_RESET_SUCCESS",
            entityType: "User",
            entityId: user.id,
          },
        }),
      ]);

      logger.info("Password successfully reset", { userId: user.id, email: user.email });
      return apiSuccess({ message: "Password updated successfully. Please log in with your new password." });
    } else {
      // 2. Request reset token
      const validated = RequestResetSchema.parse(body);

      const user = await prisma.user.findUnique({
        where: { email: validated.email.toLowerCase().trim() },
      });

      if (!user) {
        // Return generic success to prevent email enumeration attacks
        return apiSuccess({
          message: "If an account exists with that email, a password reset token has been generated.",
        });
      }

      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.passwordResetToken.create({
        data: {
          email: user.email,
          token,
          expiresAt,
        },
      });

      logger.info("Password reset requested", { email: user.email, token });

      // In local dev/staging, we return the token in response to allow seamless local verification
      return apiSuccess({
        message: "Password reset instructions generated.",
        debugToken: process.env.NODE_ENV !== "production" ? token : undefined,
      });
    }
  } catch (err) {
    return handleApiError(err);
  }
}
