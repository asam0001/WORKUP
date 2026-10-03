import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { canAuthorContent } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { LifecycleStatusSchema } from "@/types";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser();
    if (!session || !canAuthorContent(session.role)) {
      return apiError("Forbidden: Content Author or Administrator access required", 403, "FORBIDDEN");
    }

    const { id } = params;
    const body = await req.json();
    const status = LifecycleStatusSchema.parse(body.status);

    const simulation = await prisma.simulation.findUnique({
      where: { id },
    });

    if (!simulation) {
      return apiError("Simulation not found", 404, "NOT_FOUND");
    }

    const updated = await prisma.simulation.update({
      where: { id },
      data: {
        status,
        isPublished: status === "published",
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: `SIMULATION_STATUS_${status.toUpperCase()}`,
        entityType: "Simulation",
        entityId: simulation.id,
        metadata: JSON.stringify({ from: simulation.status, to: status }),
      },
    });

    return apiSuccess({ simulation: updated });
  } catch (err) {
    return handleApiError(err);
  }
}
