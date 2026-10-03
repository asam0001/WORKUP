import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { canAuthorContent } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { z } from "zod";

export const dynamic = "force-dynamic";

const CreateCompanySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  industry: z.string().min(2),
  size: z.string().default("Series B (100 employees)"),
  description: z.string().min(10),
  culture: z.string().optional(),
  techStack: z.array(z.string()).default([]),
  logoUrl: z.string().optional(),
  architectureOverview: z.string().optional(),
});

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      include: {
        teams: true,
        simulations: true,
      },
      orderBy: { name: "asc" },
    });
    return apiSuccess({ companies });
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
    const validated = CreateCompanySchema.parse(body);

    const company = await prisma.company.create({
      data: {
        name: validated.name,
        slug: validated.slug,
        industry: validated.industry,
        size: validated.size,
        description: validated.description,
        culture: validated.culture,
        techStack: JSON.stringify(validated.techStack),
        logoUrl: validated.logoUrl,
        architectureOverview: validated.architectureOverview,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "COMPANY_CREATED",
        entityType: "Company",
        entityId: company.id,
      },
    });

    return apiSuccess({ company }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
