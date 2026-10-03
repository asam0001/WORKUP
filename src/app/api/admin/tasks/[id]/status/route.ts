import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { canAuthorContent } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { LifecycleStatusSchema } from "@/types";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { validateTask } from "@/lib/validation/task-validator";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser();
    if (!session || !canAuthorContent(session.role)) {
      return apiError("Forbidden: Content Author or Administrator access required", 403, "FORBIDDEN");
    }

    const { id } = params;
    const body = await req.json();
    const status = LifecycleStatusSchema.parse(body.status);

    const task = await prisma.task.findUnique({
      where: { id },
      include: { dependencies: true },
    });

    if (!task) {
      return apiError("Task not found", 404, "NOT_FOUND");
    }

    // If publishing, task must be valid
    if (status === "published") {
      const report = await validateTask(task);
      if (!report.isValid) {
        return apiError("Cannot publish task: Task has validation errors", 422, "TASK_INVALID", report);
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: `TASK_STATUS_${status.toUpperCase()}`,
        entityType: "Task",
        entityId: task.id,
        metadata: JSON.stringify({ from: task.status, to: status }),
      },
    });

    return apiSuccess({ task: updatedTask });
  } catch (err) {
    return handleApiError(err);
  }
}
