import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/rbac";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { workspaceOrchestrator } from "@/lib/workspace/orchestrator";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session || !canAccessAdmin(session.role)) {
      return apiError("Forbidden: Administrator access required", 403, "FORBIDDEN");
    }

    const reaped = await workspaceOrchestrator.reapExpiredWorkspaces();

    return apiSuccess({
      message: `Successfully reaped ${reaped.length} idle/expired workspaces.`,
      reaped,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
