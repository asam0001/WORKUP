import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const simulation = await prisma.simulation.findUnique({
      where: { slug },
      include: {
        company: true,
        team: true,
        role: {
          include: {
            profession: true,
            skills: {
              include: {
                skill: true,
              },
            },
          },
        },
        projects: {
          orderBy: { orderIndex: "asc" },
          include: {
            tasks: {
              orderBy: { orderIndex: "asc" },
              include: {
                skills: {
                  include: {
                    skill: true,
                  },
                },
                dependencies: {
                  include: {
                    dependsOnTask: {
                      select: {
                        id: true,
                        ticketKey: true,
                        title: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!simulation) {
      return apiError("Simulation not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ simulation });
  } catch (err) {
    return handleApiError(err);
  }
}
