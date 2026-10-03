import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SimulationCard } from "@/components/simulation-card";
import { ArrowLeft, CheckCircle2, TrendingUp, Cpu, Award } from "lucide-react";

export const revalidate = 0;

export default async function ProfessionDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const profession = await prisma.profession.findUnique({
    where: { slug: params.slug },
    include: {
      roles: {
        include: {
          skills: {
            include: {
              skill: true,
            },
          },
          simulations: {
            where: { isPublished: true },
            include: {
              company: true,
              team: true,
            },
          },
        },
      },
    },
  });

  if (!profession) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <Link
        href="/careers"
        className="inline-flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-600 font-medium transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Professions</span>
      </Link>

      {/* Header */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-8 sm:p-10 shadow-xs space-y-4">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          {profession.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
          {profession.name}
        </h1>
        <p className="text-base text-gray-600 max-w-3xl leading-relaxed">
          {profession.description}
        </p>
      </div>

      {/* Roles in this Profession */}
      <div className="space-y-10">
        <div className="border-b border-gray-200 pb-3">
          <h2 className="text-2xl font-bold text-gray-900">Career Roles in {profession.name}</h2>
          <p className="text-sm text-gray-500">
            Responsibilities, required skillsets, and active simulation programs for each role.
          </p>
        </div>

        <div className="space-y-8">
          {profession.roles.map((role) => {
            const responsibilities = JSON.parse(role.responsibilities || "[]") as string[];

            return (
              <div
                key={role.id}
                className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-xl font-bold text-gray-900">{role.title}</h3>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize border border-slate-200">
                        {role.level} Level
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{role.summary}</p>
                  </div>

                  {role.marketDemand && (
                    <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex-shrink-0">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{role.marketDemand}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                      Day-to-Day Responsibilities
                    </h4>
                    <ul className="space-y-2 text-xs text-gray-700">
                      {responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                      Core Technical Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {role.skills.map((rs) => (
                        <span
                          key={rs.skill.id}
                          className="text-xs bg-gray-50 border border-gray-200 text-gray-800 px-2.5 py-1 rounded-md font-medium"
                        >
                          {rs.skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {role.simulations.length > 0 && (
                  <div className="pt-6 border-t border-gray-100 space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Active Simulations for {role.title}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {role.simulations.map((sim) => (
                        <SimulationCard
                          key={sim.id}
                          simulation={{ ...sim, role: { title: role.title } }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
