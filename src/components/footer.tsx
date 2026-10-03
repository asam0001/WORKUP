import React from "react";
import Link from "next/link";
import { Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-800 text-sm py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white font-mono">[workup]</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Virtual Professional Experience Platform. Bridge the gap between theory and industry engineering through authentic business simulations.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-4">
              Professions
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/careers/software-engineering" className="hover:text-white transition">
                  Software Engineering
                </Link>
              </li>
              <li>
                <Link href="/careers/ai-machine-learning" className="hover:text-white transition">
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link href="/careers/cloud-devops" className="hover:text-white transition">
                  Cloud & DevOps
                </Link>
              </li>
              <li>
                <Link href="/careers/cybersecurity" className="hover:text-white transition">
                  Cybersecurity
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/careers" className="hover:text-white transition">
                  Browse All Simulations
                </Link>
              </li>
              <li>
                <span className="text-gray-600">Cloud Workspaces (Phase 1)</span>
              </li>
              <li>
                <span className="text-gray-600">AI Tech Lead Reviews</span>
              </li>
              <li>
                <span className="text-gray-600">Evidence of Skill Dossiers</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-4">
              Engineering Loop
            </h4>
            <p className="text-xs font-mono text-gray-400 bg-gray-900 p-3 rounded-lg border border-gray-800 leading-normal">
              Problem → Task → Cloud Workspace → Code → Test → AI Review → CI Deploy → Telemetry → Evidence
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} [workup] Virtual Professional Experience Platform. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono">Environment: Local Production Foundation</p>
        </div>
      </div>
    </footer>
  );
}
