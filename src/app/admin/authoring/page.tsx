"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Play,
  ArrowLeft,
  FileCheck,
  Building,
  Briefcase,
  HelpCircle,
  Eye,
  Send,
  Archive,
  RefreshCw,
} from "lucide-react";
import { DifficultyLevel, LifecycleStatus, UserRole } from "@/types";

interface SimulationSummary {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  status: string;
  company: { name: string };
  role: { title: string };
  phases: Array<{
    id: string;
    title: string;
    orderIndex: number;
    tasks: Array<{
      id: string;
      ticketKey: string;
      title: string;
      difficulty: string;
      status: string;
    }>;
  }>;
}

interface ValidationReport {
  isValid: boolean;
  score: number;
  errors: Array<{ field: string; message: string; severity: string; fixSuggestion?: string }>;
  warnings: Array<{ field: string; message: string; severity: string; fixSuggestion?: string }>;
  checksPassed: string[];
}

export default function AdminAuthoringPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"simulations" | "create-sim" | "task-builder" | "entities">("simulations");
  const [simulations, setSimulations] = useState<SimulationSummary[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [professions, setProfessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Simulation form state
  const [simTitle, setSimTitle] = useState("");
  const [simSlug, setSimSlug] = useState("");
  const [simSummary, setSimSummary] = useState("");
  const [simScenario, setSimScenario] = useState("");
  const [simDifficulty, setSimDifficulty] = useState<DifficultyLevel>("Production simulation");
  const [simRoleId, setSimRoleId] = useState("");
  const [simCompanyId, setSimCompanyId] = useState("");
  const [simTeamId, setSimTeamId] = useState("");
  const [simStatus, setSimStatus] = useState<LifecycleStatus>("published");

  // Task form state
  const [selectedPhaseId, setSelectedPhaseId] = useState("");
  const [taskTicketKey, setTaskTicketKey] = useState("ML-201");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskSlug, setTaskSlug] = useState("");
  const [taskType, setTaskType] = useState("IMPLEMENTATION");
  const [taskDifficulty, setTaskDifficulty] = useState<DifficultyLevel>("Production simulation");
  const [taskObjective, setTaskObjective] = useState("");
  const [taskContext, setTaskContext] = useState("");
  const [taskRequirements, setTaskRequirements] = useState("Configure automated feature scaling\nTrain model with early stopping");
  const [taskCompletion, setTaskCompletion] = useState("Unit tests pass with 0 errors\nValidation AUC >= 0.92");
  const [taskDeliverables, setTaskDeliverables] = useState("Pull request on feature branch\nMLflow experiment run");
  const [taskTools, setTaskTools] = useState("Python, MLflow, LightGBM, pytest");
  const [taskTestCommand, setTaskTestCommand] = useState("pytest tests/");
  const [taskRubricJson, setTaskRubricJson] = useState(
    JSON.stringify(
      [
        { criteria: "Engineering Architecture", weight: 50, guidelines: "Clean, modular code adhering to standards" },
        { criteria: "Testing & Validation", weight: 50, guidelines: "Passes automated test suite and edge cases" },
      ],
      null,
      2
    )
  );

  // Validation report state
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [validating, setValidating] = useState(false);

  // Load initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [simsRes, compRes, rolesRes, profRes] = await Promise.all([
        fetch("/api/admin/simulations"),
        fetch("/api/admin/companies"),
        fetch("/api/admin/roles"),
        fetch("/api/admin/professions"),
      ]);

      const simsData = await simsRes.json();
      const compData = await compRes.json();
      const rolesData = await rolesRes.json();
      const profData = await profRes.json();

      if (simsData.success) setSimulations(simsData.data.simulations);
      if (compData.success) {
        setCompanies(compData.data.companies);
        if (compData.data.companies.length > 0) {
          setSimCompanyId(compData.data.companies[0].id);
          if (compData.data.companies[0].teams?.length > 0) {
            setTeams(compData.data.companies[0].teams);
            setSimTeamId(compData.data.companies[0].teams[0].id);
          }
        }
      }
      if (rolesData.success) {
        setRoles(rolesData.data.roles);
        if (rolesData.data.roles.length > 0) setSimRoleId(rolesData.data.roles[0].id);
      }
      if (profData.success) setProfessions(profData.data.professions);
    } catch (err) {
      console.error("Failed to load authoring data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCompanyChange = (companyId: string) => {
    setSimCompanyId(companyId);
    const comp = companies.find((c) => c.id === companyId);
    if (comp && comp.teams?.length > 0) {
      setTeams(comp.teams);
      setSimTeamId(comp.teams[0].id);
    } else {
      setTeams([]);
      setSimTeamId("");
    }
  };

  // Create Simulation
  const handleCreateSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: simTitle,
          slug: simSlug || simTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          summary: simSummary,
          businessScenario: simScenario,
          difficulty: simDifficulty,
          roleId: simRoleId,
          companyId: simCompanyId,
          teamId: simTeamId,
          status: simStatus,
          estimatedHours: 4,
          prerequisiteKnowledge: ["Python", "Git", "REST APIs"],
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        alert(json.error?.message || "Failed to create simulation");
        return;
      }

      setStatusMessage(`Simulation "${simTitle}" created successfully!`);
      // Create a default phase for it
      await fetch("/api/admin/phases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simulationId: json.data.simulation.id,
          title: "Phase 1: Architecture & Core Implementation",
          slug: "phase-1-core",
          businessObjective: "Establish initial functional baseline",
          orderIndex: 0,
        }),
      });

      await fetchData();
      setActiveTab("simulations");
    } catch (err) {
      alert("Network error creating simulation");
    }
  };

  // Validate Task
  const handleValidateTask = async () => {
    setValidating(true);
    setValidationReport(null);

    let parsedRubric = [];
    try {
      parsedRubric = JSON.parse(taskRubricJson);
    } catch {
      alert("Invalid JSON format in Evaluation Rubric field.");
      setValidating(false);
      return;
    }

    const payload = {
      phaseId: selectedPhaseId || (simulations[0]?.phases[0]?.id ?? "dummy-phase"),
      ticketKey: taskTicketKey,
      title: taskTitle,
      objective: taskObjective,
      businessContext: taskContext,
      difficulty: taskDifficulty,
      requirements: taskRequirements.split("\n").filter(Boolean),
      completionCriteria: taskCompletion.split("\n").filter(Boolean),
      deliverables: taskDeliverables.split("\n").filter(Boolean),
      tools: taskTools.split(",").map((s) => s.trim()).filter(Boolean),
      automatedTests: { command: taskTestCommand },
      rubric: parsedRubric,
      environmentConfiguration: { runtime: "python:3.12", memory: "2Gi" },
      startingState: { templateRepoUrl: "https://github.com/workup/template" },
    };

    try {
      // Call client-side or server validator
      const res = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, slug: taskTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"), status: "draft" }),
      });

      const json = await res.json();
      if (json.data?.validationReport) {
        setValidationReport(json.data.validationReport);
      } else if (json.error?.details) {
        setValidationReport(json.error.details);
      } else {
        alert(json.error?.message || "Validation executed");
      }
    } catch (err) {
      alert("Validation check failed");
    } finally {
      setValidating(false);
    }
  };

  // Toggle Simulation Status
  const handleToggleStatus = async (simId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/admin/simulations/${simId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      alert("Failed to toggle status");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center space-x-1.5 text-xs text-gray-500 hover:text-blue-600 mb-2 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Admin Dashboard</span>
          </Link>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
              Simulation Content Engine
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-semibold border border-purple-200">
              Authoring Studio
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Data-driven hierarchy: Family → Profession → Role → Company → Team → Simulation → Phase → Task → Rubric
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("create-sim")}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Simulation</span>
          </button>
          <button
            onClick={() => setActiveTab("task-builder")}
            className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition"
          >
            <FileCheck className="w-4 h-4" />
            <span>Task Validator</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 flex space-x-8 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("simulations")}
          className={`pb-3 border-b-2 transition ${
            activeTab === "simulations"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Active Simulations ({simulations.length})
        </button>
        <button
          onClick={() => setActiveTab("create-sim")}
          className={`pb-3 border-b-2 transition ${
            activeTab === "create-sim"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Create Simulation
        </button>
        <button
          onClick={() => setActiveTab("task-builder")}
          className={`pb-3 border-b-2 transition ${
            activeTab === "task-builder"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Task Builder & Validator
        </button>
      </div>

      {/* TAB 1: Simulations List */}
      {activeTab === "simulations" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {simulations.map((sim) => (
              <div
                key={sim.id}
                className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                        {sim.company.name}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900">{sim.title}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Role: <span className="font-semibold text-blue-600">{sim.role.title}</span> • Difficulty:{" "}
                      <span className="font-semibold">{sim.difficulty}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize border ${
                        sim.status === "published"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {sim.status}
                    </span>
                    <button
                      onClick={() => handleToggleStatus(sim.id, sim.status)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-3 py-1.5 rounded-lg transition"
                    >
                      {sim.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                    <Link
                      href={`/simulations/${sim.slug}`}
                      className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </Link>
                  </div>
                </div>

                {/* Phases and Tasks */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Phases & Associated Tasks ({sim.phases.reduce((acc, p) => acc + p.tasks.length, 0)} total tasks)
                  </h4>
                  <div className="space-y-3">
                    {sim.phases.map((phase) => (
                      <div key={phase.id} className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span>{phase.title}</span>
                          <span className="text-[11px] text-slate-500 font-normal">
                            {phase.tasks.length} tasks
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {phase.tasks.map((task) => (
                            <div
                              key={task.id}
                              className="bg-white border border-gray-200 rounded-lg p-2.5 text-xs flex items-center justify-between"
                            >
                              <div className="truncate pr-2">
                                <span className="font-mono font-bold text-blue-600 mr-1.5">
                                  {task.ticketKey}
                                </span>
                                <span className="text-gray-800">{task.title}</span>
                              </div>
                              <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 flex-shrink-0">
                                {task.difficulty}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Create Simulation Form */}
      {activeTab === "create-sim" && (
        <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 shadow-xs max-w-4xl space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900">Create New Professional Simulation</h2>
            <p className="text-xs text-gray-500">
              Entirely data-driven. The new simulation will be immediately live across all public career explorer pages.
            </p>
          </div>

          <form onSubmit={handleCreateSimulation} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Simulation Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed LLM Serving & Model Compression"
                  value={simTitle}
                  onChange={(e) => setSimTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="e.g. distributed-llm-serving"
                  value={simSlug}
                  onChange={(e) => setSimSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Career Role
                </label>
                <select
                  value={simRoleId}
                  onChange={(e) => setSimRoleId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.profession?.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Simulated Company
                </label>
                <select
                  value={simCompanyId}
                  onChange={(e) => handleCompanyChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.industry})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Engineering Team
                </label>
                <select
                  value={simTeamId}
                  onChange={(e) => setSimTeamId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Difficulty Level
                </label>
                <select
                  value={simDifficulty}
                  onChange={(e) => setSimDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm"
                >
                  <option value="Guided">1. Guided (Step-by-step, low ambiguity)</option>
                  <option value="Assisted">2. Assisted (Clear requirements, partial templates)</option>
                  <option value="Independent">3. Independent (Ambiguous prompt, student designs architecture)</option>
                  <option value="Production simulation">4. Production simulation (Legacy codebase, active alerts)</option>
                  <option value="Ownership">5. Ownership (Full autonomy, system design trade-offs)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Initial Lifecycle Status
                </label>
                <select
                  value={simStatus}
                  onChange={(e) => setSimStatus(e.target.value as LifecycleStatus)}
                  className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm"
                >
                  <option value="published">Published (Immediately visible to students)</option>
                  <option value="draft">Draft (Work in progress)</option>
                  <option value="review">Review (Pending peer approval)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Executive Summary
              </label>
              <textarea
                rows={2}
                required
                placeholder="High-level summary of the operational challenge..."
                value={simSummary}
                onChange={(e) => setSimSummary(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Detailed Business Scenario (Markdown)
              </label>
              <textarea
                rows={5}
                required
                placeholder="Describe the company background, customer problem, financial/technical impact..."
                value={simScenario}
                onChange={(e) => setSimScenario(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono text-xs"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create Simulation & Phase</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Task Builder & Validator */}
      {activeTab === "task-builder" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form: Left 2 Cols */}
          <div className="lg:col-span-2 bg-white border border-gray-200/90 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-gray-900">Task Builder & Validator</h2>
              <p className="text-xs text-gray-500">
                Author reusable tasks with environment runtimes, automated tests, rubrics, and failure scenarios.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Ticket Key
                </label>
                <input
                  type="text"
                  value={taskTicketKey}
                  onChange={(e) => setTaskTicketKey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Task Title
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Optimize KV-Cache Memory in vLLM Serving"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Difficulty Level (Cognitive Load)
                </label>
                <select
                  value={taskDifficulty}
                  onChange={(e) => setTaskDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm"
                >
                  <option value="Guided">1. Guided</option>
                  <option value="Assisted">2. Assisted</option>
                  <option value="Independent">3. Independent</option>
                  <option value="Production simulation">4. Production simulation</option>
                  <option value="Ownership">5. Ownership</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Test Command
                </label>
                <input
                  type="text"
                  value={taskTestCommand}
                  onChange={(e) => setTaskTestCommand(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Objective
              </label>
              <input
                type="text"
                value={taskObjective}
                onChange={(e) => setTaskObjective(e.target.value)}
                placeholder="The single primary outcome the engineer must achieve..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Business Context
              </label>
              <textarea
                rows={3}
                value={taskContext}
                onChange={(e) => setTaskContext(e.target.value)}
                placeholder="Why does this matter to the company? What happens if this fails?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Requirements (One per line)
                </label>
                <textarea
                  rows={3}
                  value={taskRequirements}
                  onChange={(e) => setTaskRequirements(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Completion Criteria (One per line)
                </label>
                <textarea
                  rows={3}
                  value={taskCompletion}
                  onChange={(e) => setTaskCompletion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Evaluation Rubric (JSON with weights summing to 100%)
              </label>
              <textarea
                rows={5}
                value={taskRubricJson}
                onChange={(e) => setTaskRubricJson(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono"
              />
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleValidateTask}
                disabled={validating}
                className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-xs transition"
              >
                <FileCheck className="w-4 h-4" />
                <span>{validating ? "Running Validation..." : "Validate Task Schema"}</span>
              </button>
            </div>
          </div>

          {/* Validation Report Card: Right 1 Col */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Validation Report</span>
            </h3>

            {!validationReport ? (
              <div className="text-center py-12 text-gray-400 text-xs">
                Click <strong>"Validate Task Schema"</strong> to test required fields, dependency cycles, rubric weights, and environment configs.
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    validationReport.isValid
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  <div className="flex items-center space-x-2 font-bold text-sm">
                    {validationReport.isValid ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                    <span>{validationReport.isValid ? "PASSED VALIDATION" : "VALIDATION FAILED"}</span>
                  </div>
                  <span className="text-xs font-mono font-bold">Score: {validationReport.score}/100</span>
                </div>

                {/* Errors */}
                {validationReport.errors.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-red-700 uppercase tracking-wider">
                      Blocking Errors ({validationReport.errors.length})
                    </p>
                    {validationReport.errors.map((err, i) => (
                      <div key={i} className="p-2.5 bg-red-50/70 border border-red-200 rounded-lg text-xs space-y-1">
                        <p className="font-semibold text-red-900">• {err.message}</p>
                        {err.fixSuggestion && (
                          <p className="text-[11px] text-red-700 italic">Fix: {err.fixSuggestion}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Warnings */}
                {validationReport.warnings.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                      Warnings ({validationReport.warnings.length})
                    </p>
                    {validationReport.warnings.map((warn, i) => (
                      <div key={i} className="p-2 bg-amber-50/70 border border-amber-200 rounded-lg text-xs">
                        <p className="text-amber-900">• {warn.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Checks Passed */}
                <div className="space-y-1.5 pt-2 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Checks Passed ({validationReport.checksPassed.length})
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {validationReport.checksPassed.map((check, i) => (
                      <li key={i} className="flex items-center space-x-1.5 text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{check}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
