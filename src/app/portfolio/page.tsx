"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Building2,
  Clock,
  ArrowRight,
  Share2,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function PortfolioPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const res = await fetch("/api/portfolio");
        const json = await res.json();
        if (res.ok && json.data?.portfolioItems) {
          setItems(json.data.portfolioItems);
        }
      } catch (err) {
        console.error("Failed to load portfolio items", err);
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, []);

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/portfolio/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Cryptographically Verified Evidence of Skill</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Professional Engineering Portfolio
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Every credential below represents real, verified engineering work completed inside isolated company sandboxes, inspected by Tech Leads, and signed with SHA-256 cryptographic proofs.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col items-center justify-center text-center shrink-0 min-w-[160px]">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Verified Credentials
          </span>
          <span className="text-4xl font-black text-slate-900">{items.length}</span>
          <span className="text-[11px] font-semibold text-emerald-600 mt-1">100% Tamper Proof</span>
        </div>
      </div>

      {/* Portfolio Items List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Sprint Credentials & Evidence Items</h2>
          <Link
            href="/careers"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Browse More Sprints</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 bg-white border border-slate-200/90 rounded-3xl">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">Retrieving portfolio credentials...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-3xl p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Verified Credentials Yet</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Launch a simulation sprint in your cloud workspace, pass automated test benchmarks, and submit your work for AI Tech Lead code review to earn verified portfolio items.
            </p>
            <Link
              href="/careers"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition"
            >
              <span>Explore Career Sprints</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {items.map((item) => {
              let skills: string[] = [];
              try {
                skills = JSON.parse(item.skillsAcquired || "[]");
              } catch {}

              let dossier: any = {};
              try {
                dossier = JSON.parse(item.verificationDossier || "{}");
              } catch {}

              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs hover:border-blue-400 transition space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-slate-600 font-mono">
                            {item.simulation.company.name}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-semibold text-blue-600">
                            {item.simulation.role.title}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mt-0.5">{item.title}</h3>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopyLink(item.slug)}
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition"
                      >
                        {copiedSlug === item.slug ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>

                      <Link
                        href={`/portfolio/${item.slug}`}
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-xl shadow-xs transition"
                      >
                        <span>Public Dossier</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{item.summary}</p>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {skills.map((skill: string, sIdx: number) => (
                      <span
                        key={sIdx}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Footer metadata */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 font-mono pt-4 border-t border-slate-100 gap-2">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Signature: {dossier.verificationSignature?.substring(0, 24)}...</span>
                    </div>
                    <span>Verified on {new Date(item.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
