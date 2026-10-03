import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { canAuthorContent } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { SimulationCreateInputSchema } from "@/types";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const simulations = await prisma.simulation.findMany({
      include: {
        role: { include: { profession: true } },
        company: true,
        team: true,
        phases: {
          include: {
            tasks: {
              select: { id: true, ticketKey: true, title: true, status: true, difficulty: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess({ simulations });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session || !canAuthorContent(session.role)) {
      return apiError("Forbidden: Content Author or Administrator access required", 403, "FORBIDDEN");
    }

    const body = await req.json();
    const validated = SimulationCreateInputSchema.parse(body);

    const simulation = await prisma.simulation.create({
      data: {
        roleId: validated.roleId,
        companyId: validated.companyId,
        teamId: validated.teamId,
        title: validated.title,
        slug: validated.slug,
        summary: validated.summary,
        businessScenario: validated.businessScenario,
        difficulty: validated.difficulty,
        estimatedHours: validated.estimatedHours,
        prerequisiteKnowledge: JSON.stringify(validated.prerequisiteKnowledge),
        status: validated.status,
        isPublished: validated.status === "published",
        version: validated.version,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "SIMULATION_CREATED",
        entityType: "Simulation",
        entityId: simulation.id,
      },
    });

    return apiSuccess({ simulation }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
