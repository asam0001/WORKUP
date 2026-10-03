import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProfessionCard } from "@/components/profession-card";
import { SimulationCard } from "@/components/simulation-card";
import { Compass, Briefcase, Sparkles } from "lucide-react";

export const revalidate = 0;

export default async function CareersPage() {
  const [professions, simulations] = await Promise.all([
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
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
          <Compass className="w-3.5 h-3.5" />
          <span>Career Explorer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight mb-4">
          Explore Professions, Roles & Enterprise Simulations
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Discover high-demand engineering careers, inspect real-world role requirements, and test your skills in live operational simulations.
        </p>
      </div>

      {/* Professions Grid */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">Professions</h2>
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

      {/* All Available Simulations */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">All Enterprise Simulations</h2>
          <p className="text-sm text-gray-500">
            Production sprints designed to simulate day-to-day engineering inside high-scale organizations.
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
