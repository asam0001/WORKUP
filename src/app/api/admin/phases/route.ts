import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { canAuthorContent } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { z } from "zod";

export const dynamic = "force-dynamic";

const CreatePhaseSchema = z.object({
  simulationId: z.string().min(1),
  title: z.string().min(3),
  slug: z.string().min(3),
  orderIndex: z.number().int().default(0),
  summary: z.string().optional(),
  businessObjective: z.string().min(10),
  architectureDecisionRecord: z.string().optional(),
  repositoryTemplateUrl: z.string().optional(),
  stagingUrl: z.string().optional(),
  status: z.enum(["draft", "review", "approved", "published", "archived"]).default("published"),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const simulationId = searchParams.get("simulationId");

    const phases = await prisma.phase.findMany({
      where: simulationId ? { simulationId } : {},
      include: {
        simulation: { select: { id: true, title: true, slug: true } },
        tasks: {
          select: { id: true, ticketKey: true, title: true, difficulty: true, status: true },
        },
      },
      orderBy: { orderIndex: "asc" },
    });
    return apiSuccess({ phases });
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
    const validated = CreatePhaseSchema.parse(body);

    const phase = await prisma.phase.create({
      data: validated,
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "PHASE_CREATED",
        entityType: "Phase",
        entityId: phase.id,
      },
    });

    return apiSuccess({ phase }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
