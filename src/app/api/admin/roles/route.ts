import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { canAuthorContent } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { z } from "zod";

export const dynamic = "force-dynamic";

const CreateRoleSchema = z.object({
  professionId: z.string().min(1),
  title: z.string().min(3),
  slug: z.string().min(3),
  level: z.enum(["junior", "mid", "senior", "lead", "principal"]).default("junior"),
  summary: z.string().min(10),
  description: z.string().min(20),
  marketDemand: z.string().optional(),
  responsibilities: z.array(z.string()).default([]),
  status: z.enum(["draft", "review", "approved", "published", "archived"]).default("published"),
  skillIds: z.array(z.string()).default([]),
});

export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      include: {
        profession: true,
        skills: { include: { skill: true } },
        simulations: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess({ roles });
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
    const validated = CreateRoleSchema.parse(body);

    const role = await prisma.$transaction(async (tx) => {
      const createdRole = await tx.role.create({
        data: {
          professionId: validated.professionId,
          title: validated.title,
          slug: validated.slug,
          level: validated.level,
          summary: validated.summary,
          description: validated.description,
          marketDemand: validated.marketDemand,
          responsibilities: JSON.stringify(validated.responsibilities),
          status: validated.status,
        },
      });

      if (validated.skillIds.length > 0) {
        await tx.roleSkill.createMany({
          data: validated.skillIds.map((skillId) => ({
            roleId: createdRole.id,
            skillId,
          })),
        });
      }

      await tx.auditLog.create({
        data: {
          userId: session.userId,
          action: "ROLE_CREATED",
          entityType: "Role",
          entityId: createdRole.id,
        },
      });

      return createdRole;
    });

    return apiSuccess({ role }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
