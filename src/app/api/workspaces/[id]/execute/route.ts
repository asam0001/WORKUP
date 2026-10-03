import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { WorkspaceExecuteInputSchema } from "@/types";
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
    const validated = WorkspaceExecuteInputSchema.parse(body);

    const result = await workspaceOrchestrator.executeCommand(
      id,
      session.userId,
      validated.command,
      validated.args,
      validated.env
    );

    return apiSuccess({ result });
  } catch (err) {
    return handleApiError(err);
  }
}
