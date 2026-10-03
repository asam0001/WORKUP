import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  Building2,
  Clock,
  Users,
  ArrowLeft,
  Terminal,
  Play,
  FileText,
  CheckCircle2,
  AlertCircle,
  GitPullRequest,
  Activity,
  Layers,
  Shield,
  ArrowRight,
  Sparkles,
  Cpu,
} from "lucide-react";
import { LaunchWorkspaceButton } from "@/components/launch-workspace-button";

export const revalidate = 0;

export default async function SimulationDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getCurrentUser();

  const simulation = await prisma.simulation.findUnique({
    where: { slug: params.slug },
    include: {
      company: true,
      team: true,
      role: {
        include: {
          profession: true,
        },
      },
      phases: {
        orderBy: { orderIndex: "asc" },
        include: {
          tasks: {
            orderBy: { orderIndex: "asc" },
            include: {
              skills: { include: { skill: true } },
              dependencies: {
                include: {
                  dependsOnTask: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!simulation) {
    notFound();
  }

  const techStack = JSON.parse(simulation.company.techStack || "[]") as string[];
  const slackChannels = JSON.parse(simulation.team.slackChannels || "[]") as string[];
  const prerequisites = JSON.parse(simulation.prerequisiteKnowledge || "[]") as string[];

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Guided":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Assisted":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Independent":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Production simulation":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Ownership":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Link
        href="/careers"
        className="inline-flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-600 font-medium transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Simulations Catalog</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-xs">
            <span className="font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {simulation.role.title}
            </span>
            <span className="text-gray-400">•</span>
            <div className="flex items-center space-x-1.5 text-gray-600 font-medium">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span>{simulation.company.name}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">{simulation.company.size}</span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1 text-gray-500">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>Estimated: ~{simulation.estimatedHours} hours</span>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full capitalize font-semibold border ${getDifficultyBadge(simulation.difficulty)}`}>
              {simulation.difficulty}
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight mb-3">
            {simulation.title}
          </h1>
          <p className="text-base text-gray-600 max-w-4xl leading-relaxed">
            {simulation.summary}
          </p>
        </div>

        {/* Workspace Launcher Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-gray-950 text-white rounded-2xl p-6 border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>DevContainer Environment Ready</span>
            </div>
            <h3 className="text-lg font-bold">Cloud Engineering Workstation</h3>
            <p className="text-xs text-gray-400 max-w-xl">
              Pre-configured with full VS Code server, Git repository template, Docker daemon, local PostgreSQL & Redis instances, and automated test runners.
            </p>
          </div>

          <div>
            {session ? (
              <div className="space-y-2 text-right">
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-xs transition"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Launch Cloud Workspace</span>
                </button>
                <p className="text-[11px] text-gray-400">
                  Provisioning engine activates in Phase 1B
                </p>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-xs transition"
              >
                <span>Sign in to Launch Workstation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Business Scenario, Phases & Tasks */}
        <div className="lg:col-span-2 space-y-10">
          {/* Operational Business Scenario */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Operational Business Scenario</span>
            </h2>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
              {simulation.businessScenario}
            </div>
          </div>

          {/* Dynamic Phases & Tasks */}
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-3">
              <h2 className="text-2xl font-bold text-gray-900">Sprint Phases & Professional Tasks</h2>
              <p className="text-sm text-gray-500">
                Complete tasks sequentially. Tasks enforce real-world constraints, tests, and AI code reviews.
              </p>
            </div>

            {simulation.phases.map((phase, pIndex) => (
              <div key={phase.id} className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex items-center space-x-2 text-xs font-mono text-blue-600 font-bold uppercase">
                    <span>Phase 0{pIndex + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">{phase.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{phase.businessObjective}</p>
                </div>

                {/* ADR if present */}
                {phase.architectureDecisionRecord && (
                  <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 font-mono text-xs space-y-2">
                    <div className="text-blue-400 font-bold uppercase text-[10px] tracking-wider">
                      Architecture Decision Record (ADR)
                    </div>
                    <div className="whitespace-pre-line text-slate-300 leading-relaxed text-xs">
                      {phase.architectureDecisionRecord}
                    </div>
                  </div>
                )}

                {/* Tasks inside this Phase */}
                <div className="space-y-5">
                  {phase.tasks.map((task) => {
                    const requirements = JSON.parse(task.requirements || "[]") as string[];
                    const completionCriteria = JSON.parse(task.completionCriteria || "[]") as string[];
                    const deliverables = JSON.parse(task.deliverables || "[]") as string[];
                    const tools = JSON.parse(task.tools || "[]") as string[];
                    const rubric = JSON.parse(task.rubric || "[]") as Array<{ criteria: string; weight: number; guidelines: string }>;

                    return (
                      <div
                        key={task.id}
                        className="border border-gray-200 rounded-xl p-5 hover:border-blue-400 transition space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center space-x-2.5">
                            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {task.ticketKey}
                            </span>
                            <h4 className="text-base font-bold text-gray-900">{task.title}</h4>
                          </div>

                          <div className="flex items-center space-x-2 text-xs">
                            <span className="text-gray-400">~{task.estimatedMinutes} mins</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getDifficultyBadge(task.difficulty)}`}>
                              {task.difficulty}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-mono font-semibold">
                              {task.type}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-700 font-medium leading-relaxed">
                          <strong>Objective:</strong> {task.objective}
                        </p>

                        <p className="text-xs text-gray-600 leading-relaxed">
                          {task.businessContext}
                        </p>

                        {/* Tools Tags */}
                        {tools.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[10px] uppercase font-bold text-gray-400 mr-1">Tools:</span>
                            {tools.map((t, idx) => (
                              <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Requirements */}
                        {requirements.length > 0 && (
                          <div className="pt-2 border-t border-gray-100">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                              Technical Requirements:
                            </p>
                            <ul className="space-y-1 text-xs text-gray-700">
                              {requirements.map((req, rIdx) => (
                                <li key={rIdx} className="flex items-start space-x-1.5">
                                  <span className="text-blue-500 font-bold">•</span>
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Completion Criteria */}
                        {completionCriteria.length > 0 && (
                          <div className="pt-2 border-t border-gray-100">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                              Completion Criteria:
                            </p>
                            <ul className="space-y-1 text-xs text-emerald-800">
                              {completionCriteria.map((crit, cIdx) => (
                                <li key={cIdx} className="flex items-start space-x-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                  <span>{crit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Rubric Breakdown */}
                        {rubric.length > 0 && (
                          <div className="pt-2 border-t border-gray-100">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                              Evaluation Rubric:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              {rubric.map((item, rubIdx) => (
                                <div key={rubIdx} className="bg-gray-50 border border-gray-200/80 p-2 rounded-lg">
                                  <div className="flex justify-between font-bold text-gray-800">
                                    <span>{item.criteria}</span>
                                    <span className="text-blue-600">{item.weight}%</span>
                                  </div>
                                  <p className="text-[11px] text-gray-500 mt-0.5">{item.guidelines}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Task Dependencies */}
                        {task.dependencies.length > 0 && (
                          <div className="pt-2 flex items-center space-x-2 text-[11px] text-amber-700 bg-amber-50/80 px-2.5 py-1 rounded-md border border-amber-200/60 font-mono">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>
                              Prerequisite: Blocked by {task.dependencies.map((d) => d.dependsOnTask.ticketKey).join(", ")}
                            </span>
                          </div>
                        )}

                        {/* Launch Cloud Workspace Button */}
                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                          <LaunchWorkspaceButton
                            taskId={task.id}
                            simulationId={simulation.id}
                            ticketKey={task.ticketKey}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Employer Context, Team Topology & Skills */}
        <div className="space-y-6">
          {/* Company Card */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Simulated Employer</span>
            </h3>

            <div>
              <p className="font-bold text-gray-900 text-base">{simulation.company.name}</p>
              <p className="text-xs text-gray-500">{simulation.company.industry} • {simulation.company.size}</p>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {simulation.company.description}
            </p>

            <div className="pt-3 border-t border-gray-100">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Team Tech Stack
              </p>
              <div className="flex flex-wrap gap-1.5">
                {techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="text-[11px] bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Team Topology Card */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span>Team & Colleagues</span>
            </h3>

            <div>
              <p className="font-bold text-gray-900 text-sm">{simulation.team.name}</p>
              <p className="text-xs text-gray-500 mt-1">{simulation.team.charter}</p>
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-2">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Direct Supervisor / Tech Lead
              </p>
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                  {simulation.team.leadName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">{simulation.team.leadName}</p>
                  <p className="text-[11px] text-gray-500">{simulation.team.leadRole}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Active Slack Channels
              </p>
              <div className="space-y-1">
                {slackChannels.map((channel, i) => (
                  <p key={i} className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded">
                    {channel}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Prerequisites */}
          {prerequisites.length > 0 && (
            <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Prerequisites</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-gray-700">
                {prerequisites.map((p, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
