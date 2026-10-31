import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { HelpdeskAssistant } from "@/lib/helpdesk/assistant";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401);
    }

    const body = await req.json();
    const { taskId, message, hintLevel = 0, activeFilePath, testResult } = body;

    if (!taskId || !message) {
      return errorResponse("VALIDATION_ERROR", "taskId and message are required", 400);
    }

    // Load Task from DB
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        phase: {
          include: {
            simulation: {
              include: {
                company: true,
                team: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      return errorResponse("NOT_FOUND", "Task not found", 404);
    }

    // Persist incoming user message
    await prisma.helpdeskMessage.create({
      data: {
        userId: user.userId,
        taskId: task.id,
        role: "user",
        content: message,
      },
    });

    // Generate mentor response
    const response = await HelpdeskAssistant.generateReply({
      task: {
        id: task.id,
        ticketKey: task.ticketKey,
        title: task.title,
        difficulty: task.difficulty,
        department: task.department || task.phase?.simulation?.team?.name || "Engineering",
        businessContext: task.businessContext,
        objective: task.objective,
        whyImportant: task.whyImportant,
        stepByStepInstructions: task.stepByStepInstructions,
        toolsAndFiles: task.toolsAndFiles,
        expectedOutput: task.expectedOutput,
        hints: task.hints,
        teamLeadName: task.phase?.simulation?.team?.leadName,
      },
      userMessage: message,
      hintLevel: Number(hintLevel) || 0,
      activeFilePath,
      testResult,
    });

    // Persist assistant reply
    await prisma.helpdeskMessage.create({
      data: {
        userId: user.userId,
        taskId: task.id,
        role: "assistant",
        content: response.reply,
      },
    });

    return successResponse({
      reply: response.reply,
      hintLevel: response.hintLevel,
      hasMoreHints: response.hasMoreHints,
      suggestedPrompts: response.suggestedPrompts,
    });
  } catch (err: any) {
    console.error("AI Helpdesk API error:", err);
    return errorResponse("INTERNAL_SERVER_ERROR", err.message || "Failed to process helpdesk query", 500);
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401);
    }

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return errorResponse("VALIDATION_ERROR", "taskId is required", 400);
    }

    const messages = await prisma.helpdeskMessage.findMany({
      where: {
        userId: user.userId,
        taskId,
      },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return successResponse({ messages });
  } catch (err: any) {
    console.error("AI Helpdesk history error:", err);
    return errorResponse("INTERNAL_SERVER_ERROR", err.message, 500);
  }
}
