import React from "react";
import Link from "next/link";
import {
  Terminal,
  ArrowRight,
  ShieldCheck,
  Cpu,
  GitPullRequest,
  Activity,
  Layers,
  Sparkles,
  CheckCircle,
  Building,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProfessionCard } from "@/components/profession-card";
import { SimulationCard } from "@/components/simulation-card";

export const revalidate = 0;

async function getLandingData() {
  const [professions, simulations] = await Promise.all([
    prisma.profession.findMany({
      where: { isPublished: true },
      include: {
        roles: true,
      },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.simulation.findMany({
      where: { isPublished: true },
      include: {
        company: true,
        team: true,
        role: true,
      },
      take: 4,
    }),
  ]);

  return { professions, simulations };
}

export default async function LandingPage() {
  const { professions, simulations } = await getLandingData();

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-16 sm:pt-24 border-b border-gray-200/80 bg-gradient-to-b from-white via-slate-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Virtual Professional Experience Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-950 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
            Experience how engineers <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              actually work inside companies.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Not another passive video course or isolated LeetCode puzzle. Solve real business problems, write production code in cloud workspaces, endure strict AI code reviews, and earn verifiable proof-of-work.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-xl shadow-sm hover:shadow transition"
            >
              <span>Start Experience</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/careers"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-semibold px-7 py-3.5 rounded-xl shadow-xs transition"
            >
              <span>Explore Roles & Tracks</span>
            </Link>
          </div>

          {/* The Engineering Loop Bar */}
          <div className="max-w-5xl mx-auto bg-gray-950 text-gray-300 rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-800 text-left mb-12">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-gray-400 ml-2">the-professional-loop.sh</span>
              </div>
              <span className="text-xs font-mono text-blue-400">Industry Fidelity</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center font-mono text-xs">
              <div className="bg-gray-900 border border-gray-800 p-2.5 rounded-lg">
                <p className="text-gray-400 text-[10px]">01</p>
                <p className="font-semibold text-white">Business Ticket</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-2.5 rounded-lg">
                <p className="text-gray-400 text-[10px]">02</p>
                <p className="font-semibold text-white">Cloud Workspace</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-2.5 rounded-lg">
                <p className="text-gray-400 text-[10px]">03</p>
                <p className="font-semibold text-white">Legacy Codebase</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-2.5 rounded-lg">
                <p className="text-gray-400 text-[10px]">04</p>
                <p className="font-semibold text-white">AI PR Review</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-2.5 rounded-lg">
                <p className="text-gray-400 text-[10px]">05</p>
                <p className="font-semibold text-white">CI Deployment</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-2.5 rounded-lg">
                <p className="text-gray-400 text-[10px]">06</p>
                <p className="font-semibold text-white">Live Alert Triage</p>
              </div>
              <div className="bg-blue-950/60 border border-blue-800 p-2.5 rounded-lg">
                <p className="text-blue-400 text-[10px]">07</p>
                <p className="font-bold text-blue-300">Skill Dossier</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. What [workup] is NOT vs What it IS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
            Built for Real Competence, Not Superficial Badges
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Hiring managers are tired of paper certificates and single-file coding test solutions. [workup] simulates the full multi-tier complexity of real engineering jobs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-8 space-y-4">
            <h3 className="text-lg font-bold text-rose-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-200 flex items-center justify-center text-rose-700 text-xs font-mono">✕</span>
              What [workup] is NOT
            </h3>
            <ul className="space-y-3 text-sm text-rose-900/80">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">•</span>
                <span><strong>Not a video course:</strong> No 40-hour lecture playlists with multiple-choice quizzes.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">•</span>
                <span><strong>Not an algorithm grind:</strong> No isolated algorithmic puzzle sandboxes detached from business context.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">•</span>
                <span><strong>Not a generic AI chatbot:</strong> No sycophantic chat assistants writing the code for you.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">•</span>
                <span><strong>Not a fake virtual office:</strong> No walking 2D pixel avatars or superficial virtual rooms.</span>
              </li>
            </ul>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-8 space-y-4">
            <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 text-xs font-mono">✓</span>
              What [workup] IS
            </h3>
            <ul className="space-y-3 text-sm text-emerald-900/80">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span><strong>Authentic Company Context:</strong> Join simulated companies with Architecture Decision Records (ADRs) and existing technical debt.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span><strong>Real Cloud Workspaces:</strong> Work inside full containerized VS Code environments with Git, Docker, and terminal runtimes.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span><strong>AI Tech Lead Review:</strong> Experience real pull-request scrutiny enforcing clean code, testing, and security.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span><strong>Verifiable Evidence of Skill:</strong> Graduate with an immutable Git commit history and evidence dossier recruiters can audit.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Featured Flagship Simulations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Flagship Programs
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
              Active Enterprise Simulations
            </h2>
            <p className="text-gray-600 text-sm mt-2 max-w-xl">
              Step into real operational problems engineered from real tech company post-mortems and sprints.
            </p>
          </div>
          <Link
            href="/careers"
            className="mt-4 md:mt-0 text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            <span>View All Tracks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {simulations.map((sim) => (
            <SimulationCard key={sim.id} simulation={sim} />
          ))}
        </div>
      </section>

      {/* 4. Explore by Profession */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Career Paths
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
            Choose Your Profession
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            Each track is designed with domain-agnostic extensible architecture to support evolving technical careers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {professions.map((profession) => (
            <ProfessionCard key={profession.id} profession={profession} />
          ))}
        </div>
      </section>

      {/* 5. Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to build verifiable engineering proof-of-work?
            </h3>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Create your account in seconds, launch your first simulation, and test yourself against authentic business challenges.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href="/auth/register"
              className="inline-flex items-center space-x-2 bg-white hover:bg-blue-50 text-blue-700 font-bold px-8 py-4 rounded-xl shadow-md transition"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
