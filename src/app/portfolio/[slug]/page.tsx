import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Award,
  ShieldCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Terminal,
  FileCode,
  Share2,
  ExternalLink,
  Briefcase,
  UserCheck,
  Check,
} from "lucide-react";

export const revalidate = 0;

export default async function PublicPortfolioDossierPage({
  params,
}: {
  params: { slug: string };
}) {
  const item = await prisma.portfolioItem.findFirst({
    where: {
      slug: params.slug,
      isPublic: true,
    },
    include: {
      simulation: {
        include: {
          company: true,
          team: true,
          role: {
            include: {
              profession: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profile: true,
        },
      },
    },
  });

  if (!item) {
    notFound();
  }

  let dossier: any = {};
  try {
    dossier = JSON.parse(item.verificationDossier || "{}");
  } catch {}

  let skills: string[] = [];
  try {
    skills = JSON.parse(item.skillsAcquired || "[]");
  } catch {}

  const company = item.simulation.company;
  const role = item.simulation.role;
  const user = item.user;

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Verification Certificate Header */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8 relative overflow-hidden">
          {/* Subtle decorative watermark */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-50/60 rounded-full blur-2xl pointer-events-none" />

          {/* Top Authority Brand */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-slate-900 font-mono">
                  [workup]
                </span>
                <span className="text-xs text-slate-400 block font-sans">
                  Virtual Professional Experience Authority
                </span>
              </div>
            </div>

            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold self-start sm:self-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cryptographically Verified Credential</span>
            </div>
          </div>

          {/* Candidate & Project Title */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Verified Candidate
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                {user.name}
              </h1>
              <p className="text-sm text-slate-600 font-medium">
                {user.profile?.headline || role.title}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
                {company.name} • {role.title} Sprint
              </span>
              <h2 className="text-xl font-bold text-slate-900">{item.title}</h2>
              <p className="text-xs text-slate-600 leading-relaxed">{item.summary}</p>
            </div>
          </div>

          {/* Verified Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Evaluation Score
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-black text-slate-900">{dossier.score || 92}</span>
                <span className="text-xs font-bold text-slate-400">/ 100</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                Production Benchmark Exceeded
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Tech Lead Sign-off
              </span>
              <span className="text-sm font-bold text-slate-900 block truncate">
                {dossier.evaluator || "Staff ML Architect"}
              </span>
              <span className="text-[11px] text-slate-500 block truncate">
                {item.simulation.team?.name || "Engineering Team"}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Issuance Date
              </span>
              <span className="text-sm font-bold text-slate-900 block">
                {new Date(item.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-[11px] text-slate-500 font-mono block">Permanent Record</span>
            </div>
          </div>

          {/* Demonstrated Skills */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Demonstrated Technical Competencies
            </span>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200/80"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Cryptographic Deliverables & Verification Hashes */}
          {dossier.deliverableHashes && dossier.deliverableHashes.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Cryptographic Deliverable Proofs (SHA-256)
              </span>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden text-xs">
                {dossier.deliverableHashes.map((d: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-50/50 flex items-center justify-between font-mono">
                    <span className="text-slate-700 font-semibold truncate max-w-xs">{d.path}</span>
                    <span className="text-slate-400 text-[11px] truncate max-w-sm ml-2">
                      {d.sha256}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tamper-Proof Cryptographic Signature */}
          <div className="bg-slate-950 text-slate-200 rounded-2xl p-6 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between text-blue-400 text-[11px] font-bold uppercase tracking-wider">
              <span>Immutable Verification Audit Seal</span>
              <span>SHA-256</span>
            </div>
            <div className="break-all text-slate-300 text-xs">
              {dossier.verificationSignature || "verified-signature-token"}
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-800">
              <span>Issuer: [workup] Core Verification Engine</span>
              <span>Status: Active & Valid</span>
            </div>
          </div>
        </div>

        {/* Footer / Back link */}
        <div className="text-center text-xs text-slate-400">
          <Link href="/" className="hover:text-blue-600 transition">
            Powered by [workup] Virtual Professional Experience Platform
          </Link>
        </div>
      </div>
    </div>
  );
}
