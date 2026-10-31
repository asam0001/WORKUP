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
  Award,
  ExternalLink,
  Activity,
  ChevronRight,
} from "lucide-react";
import { RoleBadge } from "@/components/role-badge";
import { SimulationCard } from "@/components/simulation-card";

export const revalidate = 0;

export default async function DashboardPage() {
  const session = await getCurrentUser();

  if (!session) {
    redirect("/auth/login");
  }

  const [user, simulations, submissions, workspaces, portfolioItems] = await Promise.all([
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
        evaluations: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.workspace.findMany({
      where: {
        userId: session.userId,
        status: { in: ["Requested", "Provisioning", "Ready", "Running", "Idle"] },
      },
      include: {
        task: true,
        simulation: {
          include: {
            company: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.portfolioItem.findMany({
      where: { userId: session.userId },
      include: {
        simulation: {
          include: {
            company: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const activeWorkspace = workspaces[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      {/* 1. Dashboard Header */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
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

        <div className="flex items-center flex-wrap gap-2.5">
          <Link
            href="/demo"
            className="inline-flex items-center space-x-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition"
          >
            <Play className="w-3.5 h-3.5 fill-blue-600" />
            <span>Watch Demo</span>
          </Link>
          <Link
            href="/careers"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition"
          >
            <Briefcase className="w-4 h-4" />
            <span>Browse Careers</span>
          </Link>
          <Link
            href="/portfolio"
            className="inline-flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition"
          >
            <Award className="w-4 h-4" />
            <span>My Portfolio</span>
          </Link>
        </div>
      </div>

      {/* Active Workspace In-Progress Alert */}
      {activeWorkspace && (
        <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
              <Terminal className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Active Sandbox Session ({activeWorkspace.status})
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                {activeWorkspace.task?.ticketKey || "SPRINT"}: {activeWorkspace.task?.title || activeWorkspace.simulation.title}
              </h3>
              <p className="text-xs text-slate-400">
                {activeWorkspace.simulation.company.name} • Quota: {activeWorkspace.cpuLimit} vCPU / {activeWorkspace.memoryLimitMb}MB RAM
              </p>
            </div>
          </div>

          <Link
            href={`/workspaces/${activeWorkspace.id}`}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition self-start sm:self-auto"
          >
            <span>Resume Workbench</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Active Sandboxes
          </p>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-extrabold text-gray-900">{workspaces.length}</p>
            <span className="text-xs text-emerald-600 font-semibold font-mono">running</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Isolated OCI developer environments</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Task Submissions
          </p>
          <p className="text-3xl font-extrabold text-blue-600">{submissions.length}</p>
          <p className="text-xs text-gray-500 mt-2">Evaluated code pull requests & reports</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Verified Credentials
          </p>
          <p className="text-3xl font-extrabold text-emerald-600">{portfolioItems.length}</p>
          <p className="text-xs text-gray-500 mt-2">Evidence of Skill portfolio credentials</p>
        </div>
      </div>

      {/* 3. Verified Evidence of Skill (Portfolio Preview) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>Verified Evidence of Skill</span>
            </h2>
            <p className="text-sm text-gray-500">
              Authentic sprint deliverables cryptographically signed by Tech Leads.
            </p>
          </div>
          <Link
            href="/portfolio"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View Full Portfolio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {portfolioItems.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-8 text-center space-y-2">
            <p className="text-sm font-semibold text-gray-700">No verified credentials earned yet.</p>
            <p className="text-xs text-gray-400">
              Submit your sprint code for review to unlock verified Evidence of Skill items for employers!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{item.simulation.company.name}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{item.summary}</p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/portfolio/${item.slug}`}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Submissions & Code Reviews */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-600" />
          <span>Workstation Submissions & Tech Lead Reviews</span>
        </h3>

        {submissions.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 border border-dashed border-gray-200 rounded-2xl">
            <p className="text-sm text-gray-500">No submissions yet.</p>
            <p className="text-xs text-gray-400 mt-1">
              Launch a simulation above to start writing code and opening pull requests!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {submissions.map((sub) => {
              const evalItem = sub.evaluations?.[0];
              const isApproved = evalItem?.approved ?? false;

              return (
                <div key={sub.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {sub.task.ticketKey}
                      </span>
                      <span className="font-semibold text-gray-900 text-sm">{sub.task.title}</span>
                    </div>
                    <p className="text-gray-500 font-mono text-[11px]">
                      Branch: {sub.branchName || "main"} • Commit: {sub.commitSha?.substring(0, 8)} • Submitted {new Date(sub.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    {evalItem && evalItem.score !== null && (
                      <span className={`font-mono font-bold text-xs ${evalItem.score >= 70 ? "text-emerald-700" : "text-amber-700"}`}>
                        Score: {evalItem.score}/100
                      </span>
                    )}

                    <span
                      className={`px-2.5 py-1 rounded-full font-semibold text-xs inline-flex items-center space-x-1 ${
                        sub.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : sub.status === "SUBMITTED"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {isApproved ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                      <span>{sub.status}</span>
                    </span>

                    <Link
                      href={`/submissions/${sub.id}`}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition inline-flex items-center space-x-1"
                    >
                      <span>Review</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Available Simulations Catalog */}
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
    </div>
  );
}
