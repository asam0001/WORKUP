import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { canAuthorContent } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { TaskCreateInputSchema } from "@/types";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { validateTask } from "@/lib/validation/task-validator";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phaseId = searchParams.get("phaseId");
    const simulationId = searchParams.get("simulationId");

    const tasks = await prisma.task.findMany({
      where: {
        ...(phaseId ? { phaseId } : {}),
        ...(simulationId ? { phase: { simulationId } } : {}),
      },
      include: {
        phase: {
          select: {
            id: true,
            title: true,
            simulation: { select: { id: true, title: true, slug: true } },
          },
        },
        skills: { include: { skill: true } },
        dependencies: {
          include: {
            dependsOnTask: { select: { id: true, ticketKey: true, title: true } },
          },
        },
      },
      orderBy: { orderIndex: "asc" },
    });

    return apiSuccess({ tasks });
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
    const validated = TaskCreateInputSchema.parse(body);

    // Run validator
    const validationReport = await validateTask(validated);
    if (!validationReport.isValid && validated.status === "published") {
      return apiError(
        "Task validation failed: Cannot publish task with validation errors",
        422,
        "TASK_VALIDATION_FAILED",
        validationReport
      );
    }

    // Create task inside transaction
    const createdTask = await prisma.$transaction(async (tx) => {
      const task = await tx.task.create({
        data: {
          phaseId: validated.phaseId,
          professionId: validated.professionId,
          roleId: validated.roleId,
          companyId: validated.companyId,
          ticketKey: validated.ticketKey,
          title: validated.title,
          slug: validated.slug,
          orderIndex: validated.orderIndex,
          type: validated.type,
          difficulty: validated.difficulty,
          businessContext: validated.businessContext,
          objective: validated.objective,
          prerequisites: JSON.stringify(validated.prerequisites),
          tools: JSON.stringify(validated.tools),
          environmentConfiguration: JSON.stringify(validated.environmentConfiguration),
          startingState: JSON.stringify(validated.startingState),
          requirements: JSON.stringify(validated.requirements),
          constraints: JSON.stringify(validated.constraints),
          deliverables: JSON.stringify(validated.deliverables),
          automatedTests: JSON.stringify(validated.automatedTests),
          hiddenTests: JSON.stringify(validated.hiddenTests),
          rubric: JSON.stringify(validated.rubric),
          mentorConfiguration: JSON.stringify(validated.mentorConfiguration),
          failureScenarios: JSON.stringify(validated.failureScenarios),
          completionCriteria: JSON.stringify(validated.completionCriteria),
          portfolioEvidence: JSON.stringify(validated.portfolioEvidence),
          status: validated.status,
          estimatedMinutes: validated.estimatedMinutes,
        },
      });

      // Link skills
      if (validated.skillIds && validated.skillIds.length > 0) {
        await tx.taskSkill.createMany({
          data: validated.skillIds.map((skillId) => ({
            taskId: task.id,
            skillId,
          })),
        });
      }

      // Link dependencies
      if (validated.dependencies && validated.dependencies.length > 0) {
        await tx.taskDependency.createMany({
          data: validated.dependencies.map((dep) => ({
            taskId: task.id,
            dependsOnTaskId: dep.dependsOnTaskId,
            dependencyType: dep.dependencyType || "PREREQUISITE",
            unlockCondition: dep.unlockCondition ? JSON.stringify(dep.unlockCondition) : null,
            completionCondition: dep.completionCondition ? JSON.stringify(dep.completionCondition) : null,
          })),
        });
      }

      await tx.auditLog.create({
        data: {
          userId: session.userId,
          action: "TASK_CREATED",
          entityType: "Task",
          entityId: task.id,
          metadata: JSON.stringify({ ticketKey: task.ticketKey, title: task.title }),
        },
      });

      return task;
    });

    return apiSuccess({ task: createdTask, validationReport }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
