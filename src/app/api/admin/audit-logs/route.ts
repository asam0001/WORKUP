import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session || !canAccessAdmin(session.role)) {
      return apiError("Forbidden: Administrator access required", 403, "FORBIDDEN");
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);

    const logs = await prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return apiSuccess({ logs });
  } catch (err) {
    return handleApiError(err);
  }
}
