import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401);
    }

    const isAdmin = canAccessAdmin(session.role);
    const isAuthor = session.role === "content_author";

    if (!isAdmin && !isAuthor) {
      return errorResponse("FORBIDDEN", "Staff access required", 403);
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");
    const taskIdFilter = searchParams.get("taskId");

    // Base query filter
    const whereClause: any = {};

    // Authors can ONLY see outcomes for missions they authored unless admin
    if (!isAdmin && isAuthor) {
      whereClause.task = {
        authorId: session.userId,
      };
    }

    if (statusFilter && statusFilter !== "ALL") {
      whereClause.status = statusFilter;
    }

    if (taskIdFilter) {
      whereClause.taskId = taskIdFilter;
    }

    const outcomes = await prisma.missionOutcome.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        task: {
          select: {
            id: true,
            ticketKey: true,
            title: true,
            difficulty: true,
            department: true,
            authorId: true,
            author: {
              select: {
                name: true,
                email: true,
              },
            },
            company: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return successResponse({ outcomes, count: outcomes.length });
  } catch (err: any) {
    console.error("Failed to fetch mission outcomes:", err);
    return errorResponse("INTERNAL_SERVER_ERROR", err.message, 500);
  }
}
