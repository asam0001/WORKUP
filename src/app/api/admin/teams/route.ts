import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { canAuthorContent } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { z } from "zod";

export const dynamic = "force-dynamic";

const CreateTeamSchema = z.object({
  companyId: z.string().min(1),
  name: z.string().min(2),
  charter: z.string().min(10),
  leadName: z.string().min(2),
  leadRole: z.string().min(2),
  slackChannels: z.array(z.string()).default([]),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    const teams = await prisma.team.findMany({
      where: companyId ? { companyId } : {},
      include: { company: true },
      orderBy: { name: "asc" },
    });
    return apiSuccess({ teams });
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
    const validated = CreateTeamSchema.parse(body);

    const team = await prisma.team.create({
      data: {
        companyId: validated.companyId,
        name: validated.name,
        charter: validated.charter,
        leadName: validated.leadName,
        leadRole: validated.leadRole,
        slackChannels: JSON.stringify(validated.slackChannels),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "TEAM_CREATED",
        entityType: "Team",
        entityId: team.id,
      },
    });

    return apiSuccess({ team }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
