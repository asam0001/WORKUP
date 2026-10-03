import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/rbac";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { workspaceOrchestrator } from "@/lib/workspace/orchestrator";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser();
    if (!session || !canAccessAdmin(session.role)) {
      return apiError("Forbidden: Administrator access required", 403, "FORBIDDEN");
    }

    const { id } = params;
    const result = await workspaceOrchestrator.destroyWorkspace(id, session.userId, "ADMIN_TERMINATED");

    return apiSuccess({
      message: "Workspace successfully terminated by administrator",
      artifactsPreserved: result.artifactsPreserved,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
