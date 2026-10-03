import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { workspaceOrchestrator } from "@/lib/workspace/orchestrator";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return apiError("Unauthorized: Authentication required", 401, "UNAUTHORIZED");
    }

    const { id } = params;
    const testResult = await workspaceOrchestrator.runTests(id, session.userId);

    return apiSuccess({ testResult });
  } catch (err) {
    return handleApiError(err);
  }
}
