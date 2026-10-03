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
    const status = searchParams.get("status");
    const activeOnly = searchParams.get("active") === "true";

    const workspaces = await prisma.workspace.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(activeOnly
          ? { status: { in: ["Requested", "Provisioning", "Ready", "Running", "Idle"] } }
          : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
        task: {
          select: {
            id: true,
            ticketKey: true,
            title: true,
            difficulty: true,
          },
        },
        simulation: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const activeCount = workspaces.filter((w) =>
      ["Requested", "Provisioning", "Ready", "Running", "Idle"].includes(w.status)
    ).length;

    const totalEstimatedCost = workspaces.reduce((sum, w) => sum + (w.estimatedCost || 0), 0);

    return apiSuccess({
      workspaces,
      summary: {
        total: workspaces.length,
        active: activeCount,
        totalCost: Math.round(totalEstimatedCost * 100) / 100,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
