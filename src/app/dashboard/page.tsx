import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Terminal,
  Play,
  Briefcase,
  GitPullRequest,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
} from "lucide-react";
import { RoleBadge } from "@/components/role-badge";
import { SimulationCard } from "@/components/simulation-card";

export const revalidate = 0;

export default async function DashboardPage() {
  const session = await getCurrentUser();

  if (!session) {
    redirect("/auth/login");
  }

  const [user, simulations, submissions, workspaces] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        profile: true,
      },
    }),
    prisma.simulation.findMany({
      where: { isPublished: true },
      include: {
        company: true,
        team: true,
        role: true,
      },
    }),
    prisma.submission.findMany({
      where: { userId: session.userId },
      include: {
        task: true,
        evaluations: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.workspace.findMany({
      where: { userId: session.userId },
      include: {
        simulation: {
          include: {
            company: true,
          },
        },
      },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Dashboard Header */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-bold text-xl flex items-center justify-center shadow-xs">
            {user?.name.substring(0, 2).toUpperCase() || "ME"}
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <RoleBadge role={user?.role || "student"} />
            </div>
            <p className="text-sm text-gray-500">
              {user?.profile?.headline || "Engineering Candidate on [workup]"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {user?.email} • Account Status: <span className="text-emerald-600 font-semibold">{user?.status}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/careers"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition"
          >
            <Briefcase className="w-4 h-4" />
            <span>Browse Careers</span>
          </Link>
          <Link
            href="/profile"
            className="inline-flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition"
          >
            <span>Edit Profile</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Active Workspaces
          </p>
          <p className="text-3xl font-extrabold text-gray-900">{workspaces.length}</p>
          <p className="text-xs text-gray-500 mt-2">Containerized cloud sandbox sessions</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Task Submissions
          </p>
          <p className="text-3xl font-extrabold text-blue-600">{submissions.length}</p>
          <p className="text-xs text-gray-500 mt-2">Pull requests & test runs submitted</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Available Simulations
          </p>
          <p className="text-3xl font-extrabold text-purple-600">{simulations.length}</p>
          <p className="text-xs text-gray-500 mt-2">Flagship enterprise programs ready to launch</p>
        </div>
      </div>

      {/* 3. Available Simulations Catalog */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Enterprise Simulations</h2>
            <p className="text-sm text-gray-500">
              Select an enterprise simulation to begin your virtual professional sprint.
            </p>
          </div>
          <Link
            href="/careers"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {simulations.map((sim) => (
            <SimulationCard key={sim.id} simulation={sim} />
          ))}
        </div>
      </div>

      {/* 4. Recent Activity / Workstation Log */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-600" />
          <span>Workstation Activity & Submissions</span>
        </h3>

        {submissions.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 border border-dashed border-gray-200 rounded-xl">
            <p className="text-sm text-gray-500">No submissions yet.</p>
            <p className="text-xs text-gray-400 mt-1">
              Launch a simulation above to start writing code and opening pull requests!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {submissions.map((sub) => (
              <div key={sub.id} className="py-3.5 flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-800">
                    {sub.task.ticketKey}: {sub.task.title}
                  </p>
                  <p className="text-gray-500 font-mono">
                    Branch: {sub.branchName || "main"} • Status: {sub.status}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
