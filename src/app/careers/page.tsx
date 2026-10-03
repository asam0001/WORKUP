import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProfessionCard } from "@/components/profession-card";
import { SimulationCard } from "@/components/simulation-card";
import { Compass, Briefcase, Sparkles, Layers, ArrowRight } from "lucide-react";

export const revalidate = 0;

export default async function CareersPage() {
  const [families, professions, simulations] = await Promise.all([
    prisma.careerFamily.findMany({
      include: {
        professions: {
          where: { isPublished: true },
          include: {
            roles: {
              include: {
                skills: { include: { skill: true } },
              },
            },
          },
        },
      },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.profession.findMany({
      where: { isPublished: true },
      include: {
        roles: {
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
          },
        },
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
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
          <Compass className="w-3.5 h-3.5" />
          <span>Data-Driven Career Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight mb-4">
          Career Families, Disciplines & Enterprise Simulations
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Explore structured engineering hierarchies from broad career families down to specific production tasks, evaluated against industry standards.
        </p>
      </div>

      {/* 1. Career Families Overview */}
      {families.length > 0 && (
        <section className="space-y-6">
          <div className="border-b border-gray-200 pb-3">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-600" />
              <span>Career Families</span>
            </h2>
            <p className="text-sm text-gray-500">
              Broad technical domains grouping specialized engineering professions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {families.map((fam) => (
              <div
                key={fam.id}
                className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs hover:border-blue-300 transition space-y-4"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{fam.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{fam.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Professions in this Family ({fam.professions.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {fam.professions.map((p) => (
                      <Link
                        key={p.id}
                        href={`/careers/${p.slug}`}
                        className="text-xs bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 px-2.5 py-1 rounded-md transition font-medium text-slate-800"
                      >
                        {p.name} →
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Professions Grid */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 pb-3">
          <h2 className="text-2xl font-bold text-gray-900">All Professions</h2>
          <p className="text-sm text-gray-500">
            Select a career discipline to view specific role progression and technical expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {professions.map((profession) => (
            <ProfessionCard key={profession.id} profession={profession} />
          ))}
        </div>
      </section>

      {/* 3. All Available Simulations */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 pb-3">
          <h2 className="text-2xl font-bold text-gray-900">Active Enterprise Simulations</h2>
          <p className="text-sm text-gray-500">
            Multi-phase production sprints designed from real tech company post-mortems and sprints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {simulations.map((sim) => (
            <SimulationCard key={sim.id} simulation={sim} />
          ))}
        </div>
      </section>
    </div>
  );
}
