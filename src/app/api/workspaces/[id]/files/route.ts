import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { WorkspaceFileInputSchema } from "@/types";
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
    const { searchParams } = new URL(req.url);
    const filePath = searchParams.get("path");

    if (filePath) {
      // Read specific file content
      const content = await workspaceOrchestrator.readFile(id, session.userId, filePath);
      return apiSuccess({ path: filePath, content });
    } else {
      // List file tree
      const subPath = searchParams.get("dir") || "";
      const files = await workspaceOrchestrator.listFiles(id, session.userId, subPath);
      return apiSuccess({ files });
    }
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(
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
    const validated = WorkspaceFileInputSchema.parse(body);

    await workspaceOrchestrator.writeFile(id, session.userId, validated.path, validated.content);

    return apiSuccess({ message: "File saved successfully", path: validated.path });
  } catch (err) {
    return handleApiError(err);
  }
}
