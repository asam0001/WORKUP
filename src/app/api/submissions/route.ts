import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return apiError("Unauthorized: Authentication required", 401, "UNAUTHORIZED");
    }

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");
    const all = searchParams.get("all") === "true";

    const isStaff = session.role === "administrator" || session.role === "reviewer";

    const submissions = await prisma.submission.findMany({
      where: {
        ...(all && isStaff ? {} : { userId: session.userId }),
        ...(taskId ? { taskId } : {}),
      },
      include: {
        task: {
          select: {
            id: true,
            ticketKey: true,
            title: true,
            difficulty: true,
            phase: {
              select: {
                title: true,
                simulation: {
                  select: {
                    id: true,
                    title: true,
                    slug: true,
                    company: {
                      select: {
                        name: true,
                        logoUrl: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        evaluations: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess({ submissions });
  } catch (err) {
    return handleApiError(err);
  }
}
