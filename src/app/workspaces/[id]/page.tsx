"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Terminal,
  Play,
  Save,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  HardDrive,
  Trash2,
  FileCode,
  Folder,
  FileText,
  AlertTriangle,
  Send,
  RefreshCw,
  ArrowLeft,
  DollarSign,
  Shield,
  Layers,
} from "lucide-react";

interface FileEntry {
  path: string;
  name: string;
  type: "file" | "directory";
  size: number;
  lastModified: string;
}

export default function WorkspaceWorkbenchPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;

  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Files
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [activeFilePath, setActiveFilePath] = useState<string>("README.md");
  const [fileContent, setFileContent] = useState<string>("");
  const [isDirty, setIsDirty] = useState(false);
  const [savingFile, setSavingFile] = useState(false);

  // Terminal & Execution
  const [command, setCommand] = useState<string>("pytest tests/");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<{
    stdout: string;
    stderr: string;
    exitCode: number;
    durationMs: number;
    timedOut: boolean;
  } | null>(null);

  // Test Runner
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResult, setTestResult] = useState<{
    stdout: string;
    stderr: string;
    exitCode: number;
    passed: boolean;
    durationMs: number;
  } | null>(null);

  // Tab State: 'terminal' | 'tests' | 'brief'
  const [bottomTab, setBottomTab] = useState<"terminal" | "tests" | "brief">("terminal");

  // Submit Modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [studentNotes, setStudentNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDestroying, setIsDestroying] = useState(false);

  // Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Fetch workspace details
  const fetchWorkspace = async () => {
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to load workspace");
      }
      setWorkspace(data.data.workspace);

      if (data.data.workspace.startedAt) {
        const start = new Date(data.data.workspace.startedAt).getTime();
        setElapsedSeconds(Math.max(0, Math.floor((Date.now() - start) / 1000)));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch file tree
  const fetchFiles = async () => {
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/files`);
      const data = await res.json();
      if (res.ok && data.data?.files) {
        setFiles(data.data.files);
        // If README.md exists, load it by default
        const hasReadme = data.data.files.some((f: FileEntry) => f.path === "README.md");
        if (hasReadme) {
          loadFileContent("README.md");
        } else if (data.data.files.length > 0) {
          const firstFile = data.data.files.find((f: FileEntry) => f.type === "file");
          if (firstFile) loadFileContent(firstFile.path);
        }
      }
    } catch (err) {
      console.error("Error loading files", err);
    }
  };

  // Load specific file content
  const loadFileContent = async (path: string) => {
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/files?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      if (res.ok) {
        setActiveFilePath(path);
        setFileContent(data.data.content);
        setIsDirty(false);
      }
    } catch (err) {
      console.error("Error loading file content", err);
    }
  };

  // Save current file
  const handleSaveFile = async () => {
    if (!activeFilePath) return;
    setSavingFile(true);
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/files`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: activeFilePath,
          content: fileContent,
        }),
      });
      if (res.ok) {
        setIsDirty(false);
      }
    } catch (err) {
      console.error("Error saving file", err);
    } finally {
      setSavingFile(false);
    }
  };

  // Execute terminal command
  const handleExecuteCommand = async (cmdToRun?: string) => {
    const toExecute = cmdToRun || command;
    if (!toExecute.trim()) return;

    setIsExecuting(true);
    setBottomTab("terminal");
    const [cmd, ...args] = toExecute.trim().split(" ");

    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: cmd,
          args,
        }),
      });
      const data = await res.json();
      if (res.ok && data.data?.result) {
        setExecutionOutput(data.data.result);
      } else {
        setExecutionOutput({
          stdout: "",
          stderr: data.error?.message || "Execution failed",
          exitCode: 1,
          durationMs: 0,
          timedOut: false,
        });
      }
    } catch (err: any) {
      setExecutionOutput({
        stdout: "",
        stderr: err.message,
        exitCode: 1,
        durationMs: 0,
        timedOut: false,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Run automated test suite
  const handleRunTests = async () => {
    setIsRunningTests(true);
    setBottomTab("tests");
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/test`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.data?.testResult) {
        setTestResult(data.data.testResult);
      }
    } catch (err: any) {
      setTestResult({
        stdout: "",
        stderr: err.message,
        exitCode: 1,
        passed: false,
        durationMs: 0,
      });
    } finally {
      setIsRunningTests(false);
    }
  };

  // Submit Work
  const handleSubmitWork = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentNotes,
          branchName: "feature/solution",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to submit work");
      }
      setIsSubmitModalOpen(false);
      if (data.data?.submission?.id) {
        router.push(`/submissions/${data.data.submission.id}`);
      } else {
        router.push(`/dashboard?submitted=true`);
      }
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Destroy Environment
  const handleDestroyWorkspace = async () => {
    if (!confirm("Are you sure you want to destroy this workspace? Any uncommitted changes will be cleaned up and resources released.")) {
      return;
    }
    setIsDestroying(true);
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push(workspace?.simulation ? `/simulations/${workspace.simulation.slug}` : "/dashboard");
      }
    } catch (err: any) {
      alert(`Destroy error: ${err.message}`);
    } finally {
      setIsDestroying(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
    fetchFiles();
  }, [workspaceId]);

  // Elapsed timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white">
        <RefreshCw className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <h2 className="text-xl font-semibold">Connecting to Isolated Cloud Sandbox...</h2>
        <p className="text-sm text-gray-400 mt-1">Preparing OCI container and scenario volume</p>
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white px-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Workspace Unavailable</h2>
        <p className="text-sm text-gray-400 max-w-md text-center mb-6">
          {error || "The requested cloud development environment could not be found or has been terminated."}
        </p>
        <Link
          href="/dashboard"
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const task = workspace.task;
  const simulation = workspace.simulation;

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-200 overflow-hidden font-sans">
      {/* 1. TOP STATUS & ACTION BAR */}
      <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 z-20">
        <div className="flex items-center space-x-3">
          <Link
            href={simulation ? `/simulations/${simulation.slug}` : "/dashboard"}
            className="text-gray-400 hover:text-white transition p-1.5 rounded-lg hover:bg-gray-800"
            title="Back to Simulation"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700">
              {task?.ticketKey || "TICKET"}
            </span>
            <span className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
              {task?.title || "Cloud Workspace"}
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-gray-800">
            <span className="inline-flex items-center space-x-1.5 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono">{workspace.status}</span>
            </span>
            <span className="text-xs text-gray-500">•</span>
            <span className="inline-flex items-center space-x-1 text-xs text-gray-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>{formatTime(elapsedSeconds)}</span>
            </span>
          </div>
        </div>

        {/* Telemetry & Action Buttons */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-4 px-3 py-1 bg-gray-950 rounded-lg border border-gray-800 text-xs font-mono text-gray-400">
            <span className="flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>{workspace.currentCpuPercent.toFixed(1)}%</span>
            </span>
            <span className="flex items-center space-x-1">
              <HardDrive className="w-3.5 h-3.5 text-purple-400" />
              <span>{workspace.currentMemoryMb}MB</span>
            </span>
            <span className="flex items-center space-x-1 text-emerald-400">
              <DollarSign className="w-3.5 h-3.5" />
              <span>${workspace.estimatedCost.toFixed(4)}</span>
            </span>
          </div>

          <button
            onClick={handleRunTests}
            disabled={isRunningTests}
            className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition"
          >
            <Play className={`w-3.5 h-3.5 ${isRunningTests ? "animate-spin" : ""}`} />
            <span>{isRunningTests ? "Testing..." : "Run Tests"}</span>
          </button>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Work</span>
          </button>

          <button
            onClick={handleDestroyWorkspace}
            disabled={isDestroying}
            className="text-gray-400 hover:text-rose-400 transition p-1.5 rounded-lg hover:bg-gray-800"
            title="Destroy Environment"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKBENCH BODY (Split view) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: File Explorer */}
        <aside className="w-64 bg-gray-900/90 border-r border-gray-800 flex flex-col shrink-0 select-none">
          <div className="p-3 border-b border-gray-800 flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <span>Repository Explorer</span>
            <button
              onClick={fetchFiles}
              className="text-gray-500 hover:text-gray-300 transition"
              title="Refresh Files"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {files.map((file) => (
              <button
                key={file.path}
                onClick={() => file.type === "file" && loadFileContent(file.path)}
                className={`w-full text-left flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-mono transition ${
                  activeFilePath === file.path
                    ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                }`}
              >
                {file.type === "directory" ? (
                  <Folder className="w-4 h-4 text-amber-400 shrink-0" />
                ) : file.name.endsWith(".py") ? (
                  <FileCode className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : file.name.endsWith(".md") ? (
                  <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                ) : (
                  <FileCode className="w-4 h-4 text-gray-400 shrink-0" />
                )}
                <span className="truncate">{file.path}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Center: Code Editor & Right/Bottom Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Editor Header */}
          <div className="h-10 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-gray-200">{activeFilePath}</span>
              {isDirty && (
                <span className="w-2 h-2 rounded-full bg-amber-400" title="Unsaved changes"></span>
              )}
            </div>
            <button
              onClick={handleSaveFile}
              disabled={savingFile || !isDirty}
              className="inline-flex items-center space-x-1.5 text-xs text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 disabled:opacity-40 px-2.5 py-1 rounded transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingFile ? "Saving..." : "Save (Ctrl+S)"}</span>
            </button>
          </div>

          {/* Editor Body */}
          <div className="flex-1 relative bg-gray-950 overflow-hidden">
            <textarea
              value={fileContent}
              onChange={(e) => {
                setFileContent(e.target.value);
                setIsDirty(true);
              }}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                  e.preventDefault();
                  handleSaveFile();
                }
              }}
              className="w-full h-full bg-transparent p-4 font-mono text-sm text-gray-200 resize-none focus:outline-none leading-relaxed selection:bg-blue-600/30"
              spellCheck={false}
            />
          </div>

          {/* 3. BOTTOM PANEL: Terminal / Test Runner / Brief */}
          <div className="h-64 bg-gray-900 border-t border-gray-800 flex flex-col shrink-0">
            {/* Panel Tabs */}
            <div className="h-9 bg-gray-900/90 border-b border-gray-800 flex items-center px-3 space-x-2 shrink-0">
              <button
                onClick={() => setBottomTab("terminal")}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-semibold transition ${
                  bottomTab === "terminal"
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Interactive Terminal</span>
              </button>

              <button
                onClick={() => setBottomTab("tests")}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-semibold transition ${
                  bottomTab === "tests"
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Automated Tests</span>
                {testResult && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      testResult.passed
                        ? "bg-emerald-900 text-emerald-300"
                        : "bg-rose-900 text-rose-300"
                    }`}
                  >
                    {testResult.passed ? "PASSED" : "FAILED"}
                  </span>
                )}
              </button>

              <button
                onClick={() => setBottomTab("brief")}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-semibold transition ${
                  bottomTab === "brief"
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Task Briefing</span>
              </button>
            </div>

            {/* Tab 1: Terminal */}
            {bottomTab === "terminal" && (
              <div className="flex-1 flex flex-col overflow-hidden p-3 font-mono text-xs">
                {/* Command Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleExecuteCommand();
                  }}
                  className="flex items-center space-x-2 mb-2 bg-gray-950 p-1.5 rounded-lg border border-gray-800"
                >
                  <span className="text-emerald-400 font-bold pl-1.5">$</span>
                  <input
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="Enter command (e.g. pytest tests/, python src/drift/detector.py)"
                    className="flex-1 bg-transparent text-gray-200 focus:outline-none text-xs"
                    disabled={isExecuting}
                  />
                  <button
                    type="submit"
                    disabled={isExecuting}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-[11px] font-bold px-3 py-1 rounded transition"
                  >
                    {isExecuting ? "Executing..." : "Execute"}
                  </button>
                </form>

                {/* Output Console */}
                <div className="flex-1 bg-gray-950 rounded-lg p-3 overflow-y-auto border border-gray-800 text-gray-300 whitespace-pre-wrap select-text">
                  {executionOutput ? (
                    <div>
                      {executionOutput.stdout && (
                        <div className="text-gray-300">{executionOutput.stdout}</div>
                      )}
                      {executionOutput.stderr && (
                        <div className="text-rose-400 mt-1">{executionOutput.stderr}</div>
                      )}
                      <div className="mt-2 text-[10px] text-gray-500 border-t border-gray-900 pt-1 flex items-center justify-between">
                        <span>Exit code: {executionOutput.exitCode}</span>
                        <span>Duration: {executionOutput.durationMs}ms</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-600">
                      Isolated cloud shell ready. Execute any python, pytest, or git command above.
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Test Results */}
            {bottomTab === "tests" && (
              <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
                {testResult ? (
                  <div className="space-y-3">
                    <div
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        testResult.passed
                          ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
                          : "bg-rose-950/40 border-rose-800 text-rose-300"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {testResult.passed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-400" />
                        )}
                        <span className="font-semibold text-sm">
                          {testResult.passed ? "All Task Tests Passed!" : "Test Suite Failed"}
                        </span>
                      </div>
                      <span className="text-xs opacity-75">
                        Duration: {testResult.durationMs}ms
                      </span>
                    </div>

                    <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 text-gray-300 whitespace-pre-wrap">
                      {testResult.stdout || testResult.stderr || "No test output recorded."}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-2">No tests have been executed yet.</p>
                    <button
                      onClick={handleRunTests}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                    >
                      Run Automated Tests
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Task Brief */}
            {bottomTab === "brief" && (
              <div className="flex-1 overflow-y-auto p-4 text-xs space-y-3 text-gray-300">
                <div>
                  <h4 className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider mb-1">
                    Objective
                  </h4>
                  <p className="text-white text-sm">{task?.objective}</p>
                </div>
                <div>
                  <h4 className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider mb-1">
                    Business Context
                  </h4>
                  <p className="text-gray-300 leading-relaxed">{task?.businessContext}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. SUBMIT MODAL */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Submit Work for Review</span>
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Submitting will package your code changes, preserve required deliverables to the artifact
              vault, and decommission this temporary sandbox.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Student Notes / Pull Request Summary
              </label>
              <textarea
                value={studentNotes}
                onChange={(e) => setStudentNotes(e.target.value)}
                placeholder="Explain your approach, drift calculations, or architectural decisions..."
                className="w-full h-24 bg-gray-950 border border-gray-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                disabled={isSubmitting}
                className="text-xs text-gray-400 hover:text-white px-4 py-2 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitWork}
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2 rounded-xl transition flex items-center space-x-1.5"
              >
                {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>{isSubmitting ? "Submitting..." : "Confirm & Submit"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
