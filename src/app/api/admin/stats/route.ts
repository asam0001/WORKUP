import { getCurrentUser } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401);
    }

    const isAdmin = canAccessAdmin(session.role);
    const isAuthor = session.role === "content_author";

    if (!isAdmin && !isAuthor) {
      return errorResponse("FORBIDDEN", "Staff privileges required", 403);
    }

    // If author (and not super admin), return Author Dashboard metrics scoped strictly to their authored missions
    if (isAuthor && !isAdmin) {
      const authoredTasks = await prisma.task.findMany({
        where: { authorId: session.userId },
        select: { id: true, status: true, title: true, ticketKey: true },
      });

      const taskIds = authoredTasks.map((t) => t.id);
      const totalCreated = authoredTasks.length;
      const published = authoredTasks.filter((t) => t.status === "published").length;
      const draft = authoredTasks.filter((t) => t.status === "draft").length;
      const archived = authoredTasks.filter((t) => t.status === "archived").length;

      const outcomes = await prisma.missionOutcome.findMany({
        where: { taskId: { in: taskIds } },
      });

      const totalAttempts = outcomes.length;
      const completed = outcomes.filter((o) => o.status === "PASSED").length;
      const failed = outcomes.filter((o) => o.status === "FAILED").length;
      const inProgress = outcomes.filter((o) => o.status === "IN_PROGRESS").length;

      const scores = outcomes.filter((o) => o.score !== null).map((o) => o.score as number);
      const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const completionRate = totalAttempts > 0 ? Math.round((completed / totalAttempts) * 100) : 0;

      return successResponse({
        isAuthorView: true,
        metrics: {
          totalCreated,
          published,
          draft,
          archived,
          totalAttempts,
          completed,
          failed,
          inProgress,
          averageScore: avgScore,
          completionRate,
        },
      });
    }

    // Platform-Wide Admin Statistics
    const [allTasks, allOutcomes, allAuthors, usersCount] = await Promise.all([
      prisma.task.findMany({
        select: {
          id: true,
          status: true,
          title: true,
          ticketKey: true,
          difficulty: true,
          department: true,
          authorId: true,
          author: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.missionOutcome.findMany({
        include: {
          user: { select: { name: true, email: true } },
          task: { select: { title: true, ticketKey: true } },
        },
      }),
      prisma.user.findMany({
        where: { role: "content_author" },
        select: { id: true, name: true, email: true },
      }),
      prisma.user.count(),
    ]);

    const totalCreated = allTasks.length;
    const published = allTasks.filter((t) => t.status === "published").length;
    const draft = allTasks.filter((t) => t.status === "draft").length;
    const archived = allTasks.filter((t) => t.status === "archived").length;

    const totalAttempts = allOutcomes.length;
    const completed = allOutcomes.filter((o) => o.status === "PASSED").length;
    const failed = allOutcomes.filter((o) => o.status === "FAILED").length;
    const inProgress = allOutcomes.filter((o) => o.status === "IN_PROGRESS").length;
    const underReview = allOutcomes.filter((o) => o.status === "SUBMITTED" || o.status === "UNDER_REVIEW").length;

    const scores = allOutcomes.filter((o) => o.score !== null).map((o) => o.score as number);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const completionRate = totalAttempts > 0 ? Math.round((completed / totalAttempts) * 100) : 0;

    // Mission-wise learner performance
    const missionPerformance = allTasks.map((t) => {
      const taskOutcomes = allOutcomes.filter((o) => o.taskId === t.id);
      const attempts = taskOutcomes.length;
      const passed = taskOutcomes.filter((o) => o.status === "PASSED").length;
      const taskScores = taskOutcomes.filter((o) => o.score !== null).map((o) => o.score as number);
      const taskAvg = taskScores.length > 0 ? Math.round(taskScores.reduce((a, b) => a + b, 0) / taskScores.length) : 0;

      return {
        taskId: t.id,
        ticketKey: t.ticketKey,
        title: t.title,
        difficulty: t.difficulty,
        department: t.department,
        attempts,
        passed,
        avgScore: taskAvg,
        passRate: attempts > 0 ? Math.round((passed / attempts) * 100) : 0,
      };
    });

    // Author-wise contributions
    const authorContributions = allAuthors.map((author) => {
      const authored = allTasks.filter((t) => t.authorId === author.id);
      const authoredIds = authored.map((t) => t.id);
      const authorOutcomes = allOutcomes.filter((o) => authoredIds.includes(o.taskId));

      return {
        authorId: author.id,
        name: author.name,
        email: author.email,
        missionsCount: authored.length,
        totalAttempts: authorOutcomes.length,
        completions: authorOutcomes.filter((o) => o.status === "PASSED").length,
      };
    });

    return successResponse({
      isAdminView: true,
      metrics: {
        totalCreated,
        published,
        draft,
        archived,
        totalAttempts,
        completed,
        failed,
        inProgress,
        underReview,
        averageScore: avgScore,
        completionRate,
        totalUsers: usersCount,
      },
      missionPerformance,
      authorContributions,
    });
  } catch (err: any) {
    console.error("Admin stats error:", err);
    return errorResponse("INTERNAL_SERVER_ERROR", err.message, 500);
  }
}
