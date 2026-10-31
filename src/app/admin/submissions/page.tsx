"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  Search,
  User,
  Shield,
  Layers,
} from "lucide-react";

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/submissions?all=true");
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to load submissions");
      }
      setSubmissions(json.data.submissions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const filtered = submissions.filter((s) => {
    const term = searchTerm.toLowerCase();
    const student = s.user?.name?.toLowerCase() || "";
    const ticket = s.task?.ticketKey?.toLowerCase() || "";
    const sim = s.task?.phase?.simulation?.title?.toLowerCase() || "";
    return student.includes(term) || ticket.includes(term) || sim.includes(term);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin"
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-950">Submissions & Code Reviews</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                Staff Audit
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Audit student sprint deliverables, inspect automated AI Tech Lead evaluations, and override scores.
            </p>
          </div>
        </div>

        <button
          onClick={fetchSubmissions}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition self-start sm:self-auto"
          title="Refresh Submissions"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by student name, ticket key (e.g. ML-101), or simulation title..."
          className="flex-1 text-xs text-slate-800 focus:outline-none bg-transparent"
        />
      </div>

      {/* Submissions Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Task Ticket</th>
                <th className="px-6 py-4">Simulation</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Submitted At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                    Loading submissions...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No submissions found.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => {
                  const evalItem = sub.evaluations?.[0];
                  const isApproved = evalItem?.approved ?? false;

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{sub.user?.name}</div>
                        <div className="text-xs text-slate-400 font-mono">{sub.user?.email}</div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {sub.task?.ticketKey}
                        </span>
                        <div className="text-xs text-slate-700 font-medium mt-1 truncate max-w-xs">
                          {sub.task?.title}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-600 truncate max-w-xs">
                        {sub.task?.phase?.simulation?.title}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            sub.status === "APPROVED"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : sub.status === "SUBMITTED"
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {isApproved ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          <span>{sub.status}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4 font-mono text-xs font-bold">
                        {evalItem ? (
                          <span className={evalItem.score >= 70 ? "text-emerald-600" : "text-amber-600"}>
                            {evalItem.score} / 100
                          </span>
                        ) : (
                          <span className="text-slate-400">Pending</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/submissions/${sub.id}`}
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition"
                        >
                          <span>Review</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </Link>
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
