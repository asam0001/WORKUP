import React from "react";
import Link from "next/link";
import { Code2, BrainCircuit, Cloud, Shield, ArrowRight, Briefcase } from "lucide-react";

interface RolePreview {
  id: string;
  title: string;
  level: string;
  marketDemand?: string | null;
}

interface ProfessionCardProps {
  profession: {
    id: string;
    slug: string;
    name: string;
    category: string;
    description: string;
    icon?: string | null;
    roles: RolePreview[];
  };
}

export function ProfessionCard({ profession }: ProfessionCardProps) {
  const getIcon = (category: string) => {
    switch (category) {
      case "Software Engineering":
        return <Code2 className="w-6 h-6 text-blue-600" />;
      case "AI & Machine Learning":
        return <BrainCircuit className="w-6 h-6 text-purple-600" />;
      case "Cloud & DevOps":
        return <Cloud className="w-6 h-6 text-emerald-600" />;
      case "Cybersecurity":
        return <Shield className="w-6 h-6 text-amber-600" />;
      default:
        return <Briefcase className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition group flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
            {getIcon(profession.category)}
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
            {profession.roles.length} {profession.roles.length === 1 ? "Role" : "Roles"}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition mb-2">
          {profession.name}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          {profession.description}
        </p>

        <div className="space-y-2 mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Available Roles
          </p>
          <div className="flex flex-wrap gap-2">
            {profession.roles.map((role) => (
              <span
                key={role.id}
                className="text-xs bg-slate-50 border border-slate-200/80 text-slate-700 px-2.5 py-1 rounded-md"
              >
                {role.title}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Link
        href={`/careers/${profession.slug}`}
        className="inline-flex items-center justify-between text-sm font-semibold text-blue-600 hover:text-blue-700 pt-4 border-t border-gray-100 mt-2"
      >
        <span>Explore Track</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
      </Link>
    </div>
  );
}
