import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { workspaceOrchestrator } from "@/lib/workspace/orchestrator";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return apiError("Unauthorized: Authentication required", 401, "UNAUTHORIZED");
    }

    const { id } = params;
    const workspace = await workspaceOrchestrator.getValidatedWorkspace(id, session.userId, false);

    return apiSuccess({ workspace });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return apiError("Unauthorized: Authentication required", 401, "UNAUTHORIZED");
    }

    const { id } = params;
    const result = await workspaceOrchestrator.destroyWorkspace(id, session.userId, "USER_DESTROY");

    return apiSuccess({
      message: "Workspace successfully destroyed and resources released",
      artifactsPreserved: result.artifactsPreserved,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
