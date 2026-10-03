import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { canAuthorContent } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { validateTask } from "@/lib/validation/task-validator";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser();
    if (!session || !canAuthorContent(session.role)) {
      return apiError("Forbidden: Content Author or Administrator access required", 403, "FORBIDDEN");
    }

    const { id } = params;

    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        dependencies: true,
      },
    });

    if (!task) {
      return apiError("Task not found", 404, "NOT_FOUND");
    }

    const report = await validateTask({
      id: task.id,
      phaseId: task.phaseId,
      ticketKey: task.ticketKey,
      title: task.title,
      objective: task.objective,
      businessContext: task.businessContext,
      difficulty: task.difficulty,
      requirements: task.requirements,
      constraints: task.constraints,
      deliverables: task.deliverables,
      tools: task.tools,
      environmentConfiguration: task.environmentConfiguration,
      startingState: task.startingState,
      automatedTests: task.automatedTests,
      hiddenTests: task.hiddenTests,
      rubric: task.rubric,
      mentorConfiguration: task.mentorConfiguration,
      failureScenarios: task.failureScenarios,
      completionCriteria: task.completionCriteria,
      portfolioEvidence: task.portfolioEvidence,
      dependencies: task.dependencies,
    });

    return apiSuccess({ report });
  } catch (err) {
    return handleApiError(err);
  }
}
