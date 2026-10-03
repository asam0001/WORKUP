"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Cpu,
  HardDrive,
  Clock,
  DollarSign,
  AlertTriangle,
  Trash2,
  RefreshCw,
  Play,
  CheckCircle2,
  Layers,
  ArrowLeft,
  Shield,
  Activity,
  User as UserIcon,
} from "lucide-react";

export default function AdminWorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [summary, setSummary] = useState<{ total: number; active: number; totalCost: number }>({
    total: 0,
    active: 0,
    totalCost: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterActive, setFilterActive] = useState(false);
  const [reaping, setReaping] = useState(false);
  const [reapMessage, setReapMessage] = useState<string | null>(null);

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const url = filterActive ? "/api/admin/workspaces?active=true" : "/api/admin/workspaces";
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to load workspaces");
      }
      setWorkspaces(data.data.workspaces);
      setSummary(data.data.summary);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, [filterActive]);

  const handleForceTerminate = async (workspaceId: string) => {
    if (!confirm("Are you sure you want to force terminate this active workspace?")) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/workspaces/${workspaceId}/terminate`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        fetchWorkspaces();
      } else {
        alert(data.error?.message || "Termination failed");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleTriggerReaper = async () => {
    setReaping(true);
    setReapMessage(null);
    try {
      const res = await fetch("/api/admin/workspaces/reap", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setReapMessage(data.data.message);
        fetchWorkspaces();
      }
    } catch (err: any) {
      setReapMessage(`Reaper failed: ${err.message}`);
    } finally {
      setReaping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin"
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-950">Cloud Workspace Orchestration</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Live Fleet Monitor
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Active sandbox containers, resource quotas, automated reaping, and compute billing telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleTriggerReaper}
            disabled={reaping}
            className="inline-flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reaping ? "animate-spin" : ""}`} />
            <span>Trigger Idle Reaper</span>
          </button>
          <button
            onClick={fetchWorkspaces}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition"
            title="Refresh Fleet"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {reapMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-amber-600" />
          <span>{reapMessage}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Sandboxes</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-extrabold text-gray-950">{summary.active}</p>
            <span className="text-xs text-gray-500 font-mono">running</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Workspaces</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-gray-950">{summary.total}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Estimated Fleet Cost</span>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-extrabold text-gray-950">${summary.totalCost.toFixed(2)}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setFilterActive(false)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              !filterActive ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            All Workspaces ({summary.total})
          </button>
          <button
            onClick={() => setFilterActive(true)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterActive ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Active Only ({summary.active})
          </button>
        </div>
      </div>

      {/* Workspaces Table */}
      <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Task / Ticket</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Resources</th>
                <th className="px-6 py-4">Runtime</th>
                <th className="px-6 py-4">Cost</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                    Loading workspace telemetry...
                  </td>
                </tr>
              ) : workspaces.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 font-medium">
                    No workspaces found.
                  </td>
                </tr>
              ) : (
                workspaces.map((ws) => {
                  const isActive = ["Requested", "Provisioning", "Ready", "Running", "Idle"].includes(
                    ws.status
                  );
                  return (
                    <tr key={ws.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{ws.user?.name || "Student"}</div>
                        <div className="text-xs text-gray-400 font-mono">{ws.user?.email}</div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {ws.task?.ticketKey || "CUSTOM"}
                          </span>
                          <span className="text-xs text-gray-700 font-medium truncate max-w-xs">
                            {ws.task?.title || ws.simulation?.title}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-400 truncate max-w-xs mt-0.5">
                          {ws.simulation?.title}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            ws.status === "Running" || ws.status === "Ready"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : ws.status === "Provisioning" || ws.status === "Requested"
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : ws.status === "Idle"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>}
                          <span>{ws.status}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4 font-mono text-xs text-gray-700">
                        <div className="flex items-center space-x-2">
                          <span>{ws.currentCpuPercent.toFixed(1)}% CPU</span>
                          <span>•</span>
                          <span>{ws.currentMemoryMb}MB RAM</span>
                        </div>
                        <div className="text-[11px] text-gray-400">
                          Quota: {ws.cpuLimit} vCPU / {ws.memoryLimitMb}MB
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs font-mono text-gray-500">
                        <div>
                          {ws.startedAt ? new Date(ws.startedAt).toLocaleTimeString() : "—"}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          Expires: {ws.expiresAt ? new Date(ws.expiresAt).toLocaleTimeString() : "—"}
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-900">
                        ${ws.estimatedCost ? ws.estimatedCost.toFixed(4) : "0.0000"}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {isActive ? (
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/workspaces/${ws.id}`}
                              className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 transition"
                            >
                              Connect
                            </Link>
                            <button
                              onClick={() => handleForceTerminate(ws.id)}
                              className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 transition"
                            >
                              Terminate
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 font-mono">
                            {ws.terminationReason || "Decommissioned"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
