import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const professions = await prisma.profession.findMany({
      where: {
        isPublished: true,
        ...(category ? { category } : {}),
      },
      include: {
        roles: {
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
            simulations: {
              where: { isPublished: true },
              select: {
                id: true,
                slug: true,
                title: true,
                difficulty: true,
                estimatedHours: true,
                company: {
                  select: {
                    name: true,
                    industry: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { displayOrder: "asc" },
    });

    return apiSuccess({ professions });
  } catch (err) {
    return handleApiError(err);
  }
}
