"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  Eye,
  FileText,
  User,
  Building,
  Sparkles,
} from "lucide-react";

interface OutcomeRecord {
  id: string;
  status: string;
  score: number | null;
  testResults: string | null;
  feedback: string | null;
  submissionId: string | null;
  startedAt: string;
  completedAt: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  task: {
    id: string;
    ticketKey: string;
    title: string;
    difficulty: string;
    department?: string;
    author?: { name: string; email: string };
    company?: { name: string };
  };
}

export default function MissionOutcomesPage() {
  const [outcomes, setOutcomes] = useState<OutcomeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState<OutcomeRecord | null>(null);

  const fetchOutcomes = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = statusFilter === "ALL" ? "/api/admin/outcomes" : `/api/admin/outcomes?status=${statusFilter}`;
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to load outcomes");
      }
      setOutcomes(json.data.outcomes || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutcomes();
  }, [statusFilter]);

  const filteredOutcomes = outcomes.filter((o) => {
    const q = searchQuery.toLowerCase();
    const matchesUser = o.user.name.toLowerCase().includes(q) || o.user.email.toLowerCase().includes(q);
    const matchesTask = o.task.ticketKey.toLowerCase().includes(q) || o.task.title.toLowerCase().includes(q);
    return matchesUser || matchesTask;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PASSED":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Passed</span>
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>In Progress</span>
          </span>
        );
      case "SUBMITTED":
      case "UNDER_REVIEW":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <RefreshCw className="w-3 h-3 text-purple-600" />
            <span>Under Review</span>
          </span>
        );
      case "NEEDS_IMPROVEMENT":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>Needs Improvement</span>
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>Failed</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* 1. Header */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <Link
              href="/admin"
              className="text-gray-400 hover:text-gray-900 transition p-1 rounded-lg"
              title="Back to Admin Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-950">Mission Outcome Tracking</h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 pl-8">
            Complete historical records of every learner mission attempt, automated test results, feedback, and final outcomes.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/authoring"
            className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl transition"
          >
            Mission Management
          </Link>
          <button
            onClick={fetchOutcomes}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl shadow-xs transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by learner name, email, or ticket key..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none text-xs">
          {["ALL", "PASSED", "IN_PROGRESS", "SUBMITTED", "NEEDS_IMPROVEMENT", "FAILED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
                statusFilter === st
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st === "ALL" ? "All Outcomes" : st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Outcomes Table */}
      <div className="bg-white border border-gray-200/90 rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm flex flex-col items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mb-2" />
            <span>Loading mission outcome records...</span>
          </div>
        ) : error ? (
          <div className="p-10 text-center text-rose-600 text-sm">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-rose-500" />
            <span>{error}</span>
          </div>
        ) : filteredOutcomes.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No mission outcome records found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Learner</th>
                  <th className="py-3 px-4">Mission</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Started / Completed</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOutcomes.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                          {item.user.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{item.user.name}</p>
                          <p className="text-[11px] text-gray-400">{item.user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono font-bold text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {item.task.ticketKey}
                          </span>
                          <span className="font-medium text-gray-900 truncate max-w-xs">
                            {item.task.title}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400">
                          {item.task.company?.name || "Company"} • {item.task.department || "Engineering"}
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>

                    <td className="py-3.5 px-4">
                      {item.score !== null ? (
                        <div className="flex items-center space-x-2">
                          <span className="font-bold font-mono text-gray-900">{item.score}%</span>
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${item.score >= 70 ? "bg-emerald-500" : "bg-rose-500"}`}
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">Pending</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                      <div>Started: {new Date(item.startedAt).toLocaleDateString()}</div>
                      {item.completedAt && (
                        <div className="text-gray-400">
                          Done: {new Date(item.completedAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOutcome(item)}
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Inspection Detail Modal */}
      {selectedOutcome && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[85vh] text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {selectedOutcome.task.ticketKey}
                </span>
                <h3 className="text-base font-bold text-gray-950 mt-1">
                  {selectedOutcome.task.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOutcome(null)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3.5 rounded-2xl">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Learner</span>
                <span className="font-bold text-gray-900">{selectedOutcome.user.name}</span> ({selectedOutcome.user.email})
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Status & Score</span>
                <span className="font-bold">{selectedOutcome.status}</span> — {selectedOutcome.score !== null ? `${selectedOutcome.score}%` : "No score yet"}
              </div>
            </div>

            {/* Test Results Output */}
            <div>
              <h4 className="font-bold text-gray-800 mb-1">Automated Test Execution:</h4>
              <div className="bg-gray-950 text-gray-200 p-3 rounded-xl font-mono text-[11px] whitespace-pre-wrap overflow-x-auto">
                {selectedOutcome.testResults || "No automated test output recorded."}
              </div>
            </div>

            {/* Reviewer Feedback */}
            {selectedOutcome.feedback && (
              <div>
                <h4 className="font-bold text-gray-800 mb-1">Tech Lead Reviewer Feedback:</h4>
                <div className="bg-blue-50/70 border border-blue-100 p-3 rounded-xl text-gray-700 leading-relaxed text-[11px]">
                  {selectedOutcome.feedback}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOutcome(null)}
                className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
