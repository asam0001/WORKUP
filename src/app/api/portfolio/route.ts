import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return apiError("Unauthorized: Authentication required", 401, "UNAUTHORIZED");
    }

    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get("userId") || session.userId;

    const portfolioItems = await prisma.portfolioItem.findMany({
      where: {
        userId: targetUserId,
        ...(targetUserId !== session.userId ? { isPublic: true } : {}),
      },
      include: {
        simulation: {
          include: {
            company: true,
            team: true,
            role: { include: { profession: true } },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess({ portfolioItems });
  } catch (err) {
    return handleApiError(err);
  }
}
