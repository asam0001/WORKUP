import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { WorkspaceSubmitInputSchema } from "@/types";
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
    const body = await req.json();
    const validated = WorkspaceSubmitInputSchema.parse(body);

    const result = await workspaceOrchestrator.submitWork(id, session.userId, validated);

    return apiSuccess({
      message: "Work successfully submitted, deliverables preserved, and evaluated by Tech Lead.",
      submission: result.submission,
      evaluation: result.evaluation,
      artifactsCount: result.artifacts.length,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
