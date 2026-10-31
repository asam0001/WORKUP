import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import {
  Shield,
  Users,
  Briefcase,
  FileText,
  Activity,
  AlertTriangle,
  Clock,
  Layers,
  FileCheck,
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { RoleBadge } from "@/components/role-badge";
import { formatDate, formatTimeAgo } from "@/lib/utils";

export const revalidate = 0;

export default async function AdminPage() {
  const session = await getCurrentUser();

  if (!session) {
    redirect("/auth/login");
  }

  const isAdmin = canAccessAdmin(session.role);
  const isAuthor = session.role === "content_author";

  if (!isAdmin && !isAuthor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-sm text-gray-600 mb-6">
          Your current role (<RoleBadge role={session.role} />) does not have staff privileges.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Load platform-wide or author-scoped tasks & outcomes
  const taskWhere = isAuthor && !isAdmin ? { authorId: session.userId } : {};

  const [
    tasks,
    outcomes,
    authors,
    userCount,
    simulationCount,
    auditLogs,
    recentUsers,
  ] = await Promise.all([
    prisma.task.findMany({
      where: taskWhere,
      select: {
        id: true,
        ticketKey: true,
        title: true,
        status: true,
        difficulty: true,
        department: true,
        authorId: true,
        author: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.missionOutcome.findMany({
      where: isAuthor && !isAdmin ? { task: { authorId: session.userId } } : {},
      include: {
        user: { select: { name: true, email: true } },
        task: { select: { ticketKey: true, title: true } },
      },
    }),
    prisma.user.findMany({
      where: { role: "content_author" },
      select: { id: true, name: true, email: true },
    }),
    prisma.user.count(),
    prisma.simulation.count(),
    prisma.auditLog.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { email: true, name: true, role: true } },
      },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { profile: true },
    }),
  ]);

  // Compute Required Metrics
  const totalCreated = tasks.length;
  const published = tasks.filter((t) => t.status === "published").length;
  const draft = tasks.filter((t) => t.status === "draft").length;
  const archived = tasks.filter((t) => t.status === "archived").length;

  const totalAttempts = outcomes.length;
  const completed = outcomes.filter((o) => o.status === "PASSED").length;
  const failed = outcomes.filter((o) => o.status === "FAILED").length;
  const inProgress = outcomes.filter((o) => o.status === "IN_PROGRESS").length;

  const scores = outcomes.filter((o) => o.score !== null).map((o) => o.score as number);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const completionRate = totalAttempts > 0 ? Math.round((completed / totalAttempts) * 100) : 0;

  // Mission-wise learner performance
  const missionPerformance = tasks.map((t) => {
    const taskOutcomes = outcomes.filter((o) => o.taskId === t.id);
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
  const authorContributions = authors.map((author) => {
    const authored = tasks.filter((t) => t.authorId === author.id);
    const authoredIds = authored.map((t) => t.id);
    const authorOutcomes = outcomes.filter((o) => authoredIds.includes(o.taskId));

    return {
      authorId: author.id,
      name: author.name,
      email: author.email,
      missionsCount: authored.length,
      totalAttempts: authorOutcomes.length,
      completions: authorOutcomes.filter((o) => o.status === "PASSED").length,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      {/* 1. Top Header */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-950">
                {isAuthor && !isAdmin ? "Author Studio & Analytics" : "Platform Administration & Governance"}
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {session.role.replace("_", " ").toUpperCase()}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              {isAuthor && !isAdmin
                ? "Manage your authored professional missions and monitor learner completion outcomes."
                : "Platform-wide mission management, learner performance analytics, and workspace telemetry."}
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <Link
            href="/admin/outcomes"
            className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mission Outcomes</span>
          </Link>
          <Link
            href="/admin/authoring"
            className="inline-flex items-center space-x-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition"
          >
            <Layers className="w-4 h-4" />
            <span>Mission Management</span>
          </Link>
          {isAdmin && (
            <Link
              href="/admin/workspaces"
              className="inline-flex items-center space-x-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition"
            >
              <Activity className="w-4 h-4" />
              <span>Workspace Fleet</span>
            </Link>
          )}
        </div>
      </div>

      {/* 2. Key Metrics Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Missions</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-950">{totalCreated}</p>
          <div className="flex items-center space-x-2 text-[11px] text-gray-500 pt-1">
            <span className="text-emerald-600 font-semibold">{published} published</span>
            <span>•</span>
            <span className="text-amber-600 font-semibold">{draft} drafts</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Attempts</span>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-950">{totalAttempts}</p>
          <div className="flex items-center space-x-2 text-[11px] text-gray-500 pt-1">
            <span className="text-emerald-600 font-semibold">{completed} passed</span>
            <span>•</span>
            <span className="text-blue-600 font-semibold">{inProgress} active</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <span>Completion Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-950">{completionRate}%</p>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${completionRate}%` }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <span>Average Score</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-950">{avgScore}%</p>
          <p className="text-[11px] text-gray-400 pt-1">Across all evaluated rubrics</p>
        </div>
      </div>

      {/* 3. Mission-wise Learner Performance */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-950">Mission-Wise Learner Performance</h2>
            <p className="text-xs text-gray-500">
              Breakdown of student attempts, pass rates, and rubric scores per mission.
            </p>
          </div>
          <Link
            href="/admin/outcomes"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            View All Outcome Logs &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Mission Title</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Attempts</th>
                <th className="py-3 px-4">Pass Rate</th>
                <th className="py-3 px-4">Avg Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {missionPerformance.map((item) => (
                <tr key={item.taskId} className="hover:bg-gray-50/60 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                    {item.ticketKey}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-gray-900">
                    {item.title}
                  </td>
                  <td className="py-3.5 px-4 text-gray-500">
                    {item.department || "Engineering"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">
                      {item.difficulty}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-700">
                    {item.attempts}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-semibold ${
                        item.passRate >= 70
                          ? "text-emerald-600"
                          : item.attempts === 0
                          ? "text-gray-400"
                          : "text-amber-600"
                      }`}
                    >
                      {item.attempts > 0 ? `${item.passRate}%` : "—"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                    {item.avgScore > 0 ? `${item.avgScore}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Author-wise Contributions (Admin view) */}
      {isAdmin && (
        <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-950">Author-Wise Mission Contributions</h2>
          <p className="text-xs text-gray-500">
            Missions authored, student attempts, and successful completions per content author.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Missions Created</th>
                  <th className="py-3 px-4">Learner Attempts</th>
                  <th className="py-3 px-4">Completions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {authorContributions.map((auth) => (
                  <tr key={auth.authorId} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      {auth.name} <span className="text-gray-400 font-normal">({auth.email})</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-700">
                      {auth.missionsCount}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-700">
                      {auth.totalAttempts}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-600 font-bold">
                      {auth.completions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
