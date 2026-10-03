import { getCurrentUser } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session || !canAccessAdmin(session.role)) {
      return apiError("Forbidden: Administrator access required", 403, "FORBIDDEN");
    }

    const [userCount, professionCount, simulationCount, submissionCount, auditLogCount, recentUsers] =
      await Promise.all([
        prisma.user.count(),
        prisma.profession.count(),
        prisma.simulation.count(),
        prisma.submission.count(),
        prisma.auditLog.count(),
        prisma.user.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            status: true,
            createdAt: true,
          },
        }),
      ]);

    return apiSuccess({
      stats: {
        totalUsers: userCount,
        totalProfessions: professionCount,
        totalSimulations: simulationCount,
        totalSubmissions: submissionCount,
        totalAuditLogs: auditLogCount,
      },
      recentUsers,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
