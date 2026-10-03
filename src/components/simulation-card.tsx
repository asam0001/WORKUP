import React from "react";
import Link from "next/link";
import { Clock, Building2, Users, ArrowRight, CheckCircle2 } from "lucide-react";

interface SimulationCardProps {
  simulation: {
    id: string;
    slug: string;
    title: string;
    summary: string;
    difficulty: string;
    estimatedHours: number;
    company: {
      name: string;
      industry: string;
    };
    team?: {
      name: string;
    } | null;
    role?: {
      title: string;
    } | null;
  };
}

export function SimulationCard({ simulation }: SimulationCardProps) {
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "advanced":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-sm hover:shadow-md hover:border-blue-400 transition group flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center space-x-1.5 text-gray-500 font-medium">
            <Building2 className="w-3.5 h-3.5" />
            <span>{simulation.company.name}</span>
            <span className="text-gray-300">•</span>
            <span>{simulation.company.industry}</span>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full font-semibold capitalize border ${getDifficultyBadge(
              simulation.difficulty
            )}`}
          >
            {simulation.difficulty}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition mb-2">
          {simulation.title}
        </h3>

        {simulation.role && (
          <p className="text-xs font-semibold text-blue-600 mb-3">
            Role: {simulation.role.title}
          </p>
        )}

        <p className="text-sm text-gray-600 line-clamp-3 mb-6 leading-relaxed">
          {simulation.summary}
        </p>
      </div>

      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>~{simulation.estimatedHours} hrs</span>
          </div>
          {simulation.team && (
            <div className="flex items-center space-x-1">
              <Users className="w-3.5 h-3.5" />
              <span>{simulation.team.name}</span>
            </div>
          )}
        </div>

        <Link
          href={`/simulations/${simulation.slug}`}
          className="inline-flex items-center space-x-1 text-xs font-semibold bg-gray-900 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition"
        >
          <span>View Mission</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
