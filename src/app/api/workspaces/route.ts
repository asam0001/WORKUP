import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WorkspaceProvisionInputSchema } from "@/types";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { workspaceOrchestrator } from "@/lib/workspace/orchestrator";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return apiError("Unauthorized: Authentication required", 401, "UNAUTHORIZED");
    }

    const workspaces = await prisma.workspace.findMany({
      where: { userId: session.userId },
      include: {
        task: {
          select: {
            id: true,
            ticketKey: true,
            title: true,
            difficulty: true,
          },
        },
        simulation: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess({ workspaces });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return apiError("Unauthorized: Authentication required", 401, "UNAUTHORIZED");
    }

    const body = await req.json();
    const validated = WorkspaceProvisionInputSchema.parse(body);

    const connectionInfo = await workspaceOrchestrator.provisionWorkspace(
      session.userId,
      validated.taskId,
      validated.simulationId
    );

    return apiSuccess({ connectionInfo }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
