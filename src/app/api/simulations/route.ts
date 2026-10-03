import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const difficulty = searchParams.get("difficulty");
    const professionSlug = searchParams.get("profession");

    const simulations = await prisma.simulation.findMany({
      where: {
        isPublished: true,
        ...(difficulty ? { difficulty } : {}),
        ...(professionSlug
          ? {
              role: {
                profession: {
                  slug: professionSlug,
                },
              },
            }
          : {}),
      },
      include: {
        company: true,
        team: true,
        role: {
          include: {
            profession: true,
          },
        },
        projects: {
          include: {
            tasks: {
              select: {
                id: true,
                ticketKey: true,
                title: true,
                type: true,
                estimatedMinutes: true,
              },
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
