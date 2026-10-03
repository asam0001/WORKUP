import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { canAuthorContent } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { z } from "zod";

export const dynamic = "force-dynamic";

const CreateProfessionSchema = z.object({
  careerFamilyId: z.string().optional(),
  name: z.string().min(3),
  slug: z.string().min(3),
  category: z.string().default("Engineering"),
  description: z.string().min(10),
  icon: z.string().optional(),
  status: z.enum(["draft", "review", "approved", "published", "archived"]).default("published"),
  displayOrder: z.number().int().default(0),
});

export async function GET() {
  try {
    const professions = await prisma.profession.findMany({
      include: {
        careerFamily: true,
        roles: true,
      },
      orderBy: { displayOrder: "asc" },
    });
    return apiSuccess({ professions });
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
    const validated = CreateProfessionSchema.parse(body);

    const profession = await prisma.profession.create({
      data: {
        ...validated,
        isPublished: validated.status === "published",
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "PROFESSION_CREATED",
        entityType: "Profession",
        entityId: profession.id,
      },
    });

    return apiSuccess({ profession }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
