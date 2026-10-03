import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { canAuthorContent } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { z } from "zod";

export const dynamic = "force-dynamic";

const CreateCareerFamilySchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  icon: z.string().optional(),
  displayOrder: z.number().int().default(0),
});

export async function GET() {
  try {
    const families = await prisma.careerFamily.findMany({
      include: {
        professions: {
          select: {
            id: true,
            slug: true,
            name: true,
            roles: { select: { id: true, title: true } },
          },
        },
      },
      orderBy: { displayOrder: "asc" },
    });
    return apiSuccess({ families });
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
    const validated = CreateCareerFamilySchema.parse(body);

    const family = await prisma.careerFamily.create({
      data: validated,
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "CAREER_FAMILY_CREATED",
        entityType: "CareerFamily",
        entityId: family.id,
      },
    });

    return apiSuccess({ family }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
