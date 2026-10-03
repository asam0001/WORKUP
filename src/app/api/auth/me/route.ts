import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return apiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        profile: true,
      },
    });

    if (!user) {
      return apiError("User not found", 404, "NOT_FOUND");
    }

    return apiSuccess({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      profile: user.profile,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
