import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { evaluationEngine } from "@/lib/evaluation/evaluator";

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

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        task: {
          include: {
            phase: {
              include: {
                simulation: {
                  include: {
                    company: true,
                    team: true,
                    role: { include: { profession: true } },
                  },
                },
              },
            },
            skills: { include: { skill: true } },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profile: true,
          },
        },
        evaluations: {
          orderBy: { createdAt: "desc" },
          include: {
            reviewer: {
              select: {
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!submission) {
      return apiError("Submission not found", 404, "NOT_FOUND");
    }

    // Authorization check: owner or staff
    const isOwner = submission.userId === session.userId;
    const isStaff = session.role === "administrator" || session.role === "reviewer";

    if (!isOwner && !isStaff) {
      return apiError("Forbidden: You do not have access to this submission", 403, "FORBIDDEN");
    }

    // Check if there is an associated portfolio item
    const portfolioItem = await prisma.portfolioItem.findFirst({
      where: {
        userId: submission.userId,
        simulationId: submission.task.phase.simulationId,
      },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess({
      submission,
      portfolioItem,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

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
    const isStaff = session.role === "administrator" || session.role === "reviewer";

    const submission = await prisma.submission.findUnique({
      where: { id },
    });

    if (!submission) {
      return apiError("Submission not found", 404, "NOT_FOUND");
    }

    if (submission.userId !== session.userId && !isStaff) {
      return apiError("Forbidden: Cannot evaluate another candidate's submission", 403, "FORBIDDEN");
    }

    // Run evaluation engine
    const reviewerId = isStaff && session.userId !== submission.userId ? session.userId : undefined;
    const evaluation = await evaluationEngine.evaluateSubmission(id, reviewerId);

    return apiSuccess({
      message: "Submission evaluated successfully",
      evaluation,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
