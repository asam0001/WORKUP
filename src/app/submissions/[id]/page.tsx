"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  ArrowLeft,
  FileCode,
  Shield,
  FileText,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Building2,
  Sparkles,
} from "lucide-react";

export default function SubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reEvaluating, setReEvaluating] = useState(false);

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/submissions/${submissionId}`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to load submission");
      }
      setData(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmission();
  }, [submissionId]);

  const handleReEvaluate = async () => {
    setReEvaluating(true);
    try {
      const res = await fetch(`/api/submissions/${submissionId}`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Evaluation failed");
      }
      await fetchSubmission();
    } catch (err: any) {
      alert(`Evaluation error: ${err.message}`);
    } finally {
      setReEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-sm font-semibold text-slate-600">Loading code review & evaluation...</p>
      </div>
    );
  }

  if (error || !data?.submission) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Submission Not Found</h1>
        <p className="text-sm text-slate-600 mb-6">{error || "Could not retrieve the requested submission."}</p>
        <Link href="/dashboard" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          ← Return to Dashboard
        </Link>
      </div>
    );
  }

  const { submission, portfolioItem } = data;
  const task = submission.task;
  const simulation = task.phase.simulation;
  const evaluation = submission.evaluations?.[0];

  let rubricScores: any[] = [];
  if (evaluation?.rubricScores) {
    try {
      rubricScores = JSON.parse(evaluation.rubricScores);
    } catch {}
  }

  let artifacts: any[] = [];
  if (submission.diffSummary) {
    try {
      const parsed = JSON.parse(submission.diffSummary);
      if (Array.isArray(parsed)) artifacts = parsed;
    } catch {}
  }

  const isApproved = evaluation?.approved ?? false;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workstation</span>
        </Link>

        {portfolioItem && (
          <Link
            href={`/portfolio/${portfolioItem.slug}`}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-1.5 rounded-xl transition"
          >
            <Award className="w-4 h-4" />
            <span>View Verified Portfolio Dossier</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </Link>
        )}
      </div>

      {/* Main Review Card Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                {task.ticketKey}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-600">{simulation.company.name}</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-mono text-slate-400">
                Commit: {submission.commitSha?.substring(0, 8)}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{task.title}</h1>
            <p className="text-xs text-slate-500">
              Submitted on {new Date(submission.createdAt).toLocaleDateString()} at{" "}
              {new Date(submission.createdAt).toLocaleTimeString()}
            </p>
          </div>

          {/* Score Badge */}
          {evaluation ? (
            <div
              className={`p-6 rounded-2xl border flex flex-col items-center justify-center shrink-0 min-w-[180px] text-center ${
                isApproved
                  ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                  : "bg-amber-50/80 border-amber-200 text-amber-900"
              }`}
            >
              <div className="flex items-center space-x-1.5 mb-1">
                {isApproved ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Clock className="w-5 h-5 text-amber-600" />
                )}
                <span className="text-xs font-bold uppercase tracking-wider">
                  {isApproved ? "Approved" : "Revision Needed"}
                </span>
              </div>
              <div className="text-4xl font-black">{evaluation.score}<span className="text-lg font-bold text-slate-400">/100</span></div>
              <span className="text-[11px] font-semibold mt-1 opacity-80">
                {isApproved ? "Production Ready" : "Review Feedback Below"}
              </span>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center space-x-3">
              <button
                onClick={handleReEvaluate}
                disabled={reEvaluating}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl"
              >
                {reEvaluating ? "Evaluating..." : "Run AI Tech Lead Review"}
              </button>
            </div>
          )}
        </div>

        {/* Student Notes */}
        {submission.studentNotes && (
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-700">
            <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block mb-1">
              Candidate Pull Request Notes:
            </span>
            <p className="italic">"{submission.studentNotes}"</p>
          </div>
        )}

        {/* Rubric Scorecard Grid */}
        {rubricScores.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Weighted Rubric Scorecard
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rubricScores.map((item, idx) => (
                <div key={idx} className="bg-slate-50/60 border border-slate-200/90 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{item.criteria}</span>
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {item.score}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.score >= 85 ? "bg-emerald-500" : item.score >= 70 ? "bg-blue-500" : "bg-amber-500"
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{item.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tech Lead Review Feedback */}
      {evaluation && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              <UserCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Tech Lead Feedback & Code Review</h2>
              <p className="text-xs text-slate-500">Official architectural evaluation from engineering leadership</p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-slate-800 whitespace-pre-line leading-relaxed font-sans text-xs">
            {evaluation.feedback}
          </div>
        </div>
      )}

      {/* Deliverable Artifacts Vault */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <FileCode className="w-4 h-4 text-blue-600" />
          <span>Preserved Deliverables & Verification Hashes ({artifacts.length})</span>
        </h3>
        <p className="text-xs text-slate-500">
          These artifacts were cryptographically captured from your workspace prior to sandbox decommissioning.
        </p>

        {artifacts.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No deliverable artifacts recorded.</p>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
            {artifacts.map((art: any, i: number) => (
              <div key={i} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50 transition">
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="font-mono font-semibold text-slate-900">{art.relativePath}</span>
                    <div className="text-[11px] text-slate-400 font-mono">
                      SHA-256: {art.sha256Hash}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {Math.round((art.sizeBytes / 1024) * 10) / 10} KB
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
