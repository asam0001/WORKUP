import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Building, ArrowRight, Code2, Users, Layers, ExternalLink } from "lucide-react";

export const revalidate = 0;

export default async function CompaniesPage() {
  const companies = await prisma.company.findMany({
    include: {
      teams: true,
      simulations: {
        include: {
          phases: {
            include: {
              tasks: true,
            },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      {/* Header */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 mb-2 inline-block">
            Simulated Workplace Ecosystem
          </span>
          <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">
            Simulated Companies & Engineering Teams
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Step inside realistic tech companies across fintech, e-commerce, cloud infrastructure, and AI. Experience their architecture, engineering culture, and real operational tickets.
          </p>
        </div>
        <Link
          href="/careers"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition text-center shrink-0"
        >
          Explore All Missions
        </Link>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => {
          let techStackList: string[] = [];
          if (company.techStack) {
            try {
              techStackList = JSON.parse(company.techStack);
            } catch {
              techStackList = [company.techStack];
            }
          }

          const totalMissions = company.simulations.reduce(
            (acc, sim) => acc + sim.phases.reduce((pAcc, p) => pAcc + p.tasks.length, 0),
            0
          );

          return (
            <div
              key={company.id}
              className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:border-blue-500/50 hover:shadow-md transition group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                    {company.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                    {company.industry}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-950 group-hover:text-blue-600 transition">
                    {company.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">{company.size}</p>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                  {company.description}
                </p>

                {/* Teams */}
                {company.teams.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Teams & Tech Leads
                    </span>
                    {company.teams.slice(0, 2).map((t) => (
                      <div key={t.id} className="flex items-center justify-between text-gray-600">
                        <span className="font-medium text-gray-800">{t.name}</span>
                        <span className="text-gray-400 text-[11px]">{t.leadName}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {techStackList.slice(0, 4).map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-gray-50 text-gray-600 border border-gray-200"
                    >
                      {tech}
                    </span>
                  ))}
                  {techStackList.length > 4 && (
                    <span className="px-1.5 py-0.5 text-[10px] text-gray-400">
                      +{techStackList.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Footer Action */}
              <div className="pt-6 mt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">
                  {totalMissions} active {totalMissions === 1 ? "mission" : "missions"}
                </span>

                <Link
                  href={company.simulations[0] ? `/simulations/${company.simulations[0].slug}` : "/careers"}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-800 group-hover:translate-x-0.5 transition"
                >
                  <span>View Simulations</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
