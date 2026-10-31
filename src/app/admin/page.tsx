import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { canAccessAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Shield, Users, Briefcase, FileText, Activity, AlertTriangle, Clock, Layers, FileCheck } from "lucide-react";
import { RoleBadge } from "@/components/role-badge";
import { formatDate, formatTimeAgo } from "@/lib/utils";

export const revalidate = 0;

export default async function AdminPage() {
  const session = await getCurrentUser();

  if (!session) {
    redirect("/auth/login");
  }

  if (!canAccessAdmin(session.role)) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-sm text-gray-600 mb-6">
          Your current role (<RoleBadge role={session.role} />) does not have administrator privileges.
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

  const [userCount, professionCount, simulationCount, submissionCount, auditLogs, recentUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.profession.count(),
      prisma.simulation.count(),
      prisma.submission.count(),
      prisma.auditLog.findMany({
        take: 15,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              email: true,
              name: true,
              role: true,
            },
          },
        },
      }),
      prisma.user.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          profile: true,
        },
      }),
    ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-950">Platform Administration</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                Super Admin
              </span>
            </div>
            <p className="text-sm text-gray-500">
              System governance, user authorization, and immutable audit logs.
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          <Link
            href="/admin/submissions"
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition"
          >
            <FileCheck className="w-4 h-4" />
            <span>Submissions & Reviews</span>
          </Link>
          <Link
            href="/admin/workspaces"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition"
          >
            <Activity className="w-4 h-4" />
            <span>Workspace Fleet</span>
          </Link>
          <Link
            href="/admin/authoring"
            className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition"
          >
            <Layers className="w-4 h-4" />
            <span>Content Authoring Studio</span>
          </Link>
          <div className="text-xs text-gray-400 font-mono hidden sm:inline">
            Security: High (RBAC)
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-gray-950">{userCount}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Professions</span>
            <Briefcase className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-extrabold text-gray-950">{professionCount}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Simulations</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-gray-950">{simulationCount}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Submissions</span>
            <Activity className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-extrabold text-gray-950">{submissionCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Users */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-gray-900">Recent Users</h3>
          <div className="divide-y divide-gray-100">
            {recentUsers.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-900">{u.name}</p>
                  <p className="text-[11px] text-gray-500">{u.email}</p>
                </div>
                <RoleBadge role={u.role} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (2 cols): System Audit Logs */}
        <div className="lg:col-span-2 bg-white border border-gray-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Platform Audit Logs</h3>
            <span className="text-xs text-gray-400">Last 15 Events</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead>
                <tr className="text-left text-gray-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3">Action</th>
                  <th className="pb-3">Entity</th>
                  <th className="pb-3">User</th>
                  <th className="pb-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50">
                    <td className="py-2.5 font-mono font-semibold text-blue-600">
                      {log.action}
                    </td>
                    <td className="py-2.5 text-gray-600">{log.entityType}</td>
                    <td className="py-2.5 text-gray-800">
                      {log.user ? log.user.email : "system"}
                    </td>
                    <td className="py-2.5 text-gray-400 font-mono">
                      {formatTimeAgo(log.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
