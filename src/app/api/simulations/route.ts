import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const difficulty = searchParams.get("difficulty");
    const professionSlug = searchParams.get("profession");
    const status = searchParams.get("status") || "published";

    const simulations = await prisma.simulation.findMany({
      where: {
        status,
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
        phases: {
          orderBy: { orderIndex: "asc" },
          include: {
            tasks: {
              select: {
                id: true,
                ticketKey: true,
                title: true,
                type: true,
                difficulty: true,
                estimatedMinutes: true,
                status: true,
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
