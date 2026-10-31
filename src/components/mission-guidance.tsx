"use client";

import React, { useState } from "react";
import {
  FileText,
  Building,
  Target,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Code2,
  FileCode,
  ShieldCheck,
  Send,
  Lightbulb,
} from "lucide-react";

interface MissionGuidanceProps {
  task: {
    id: string;
    ticketKey: string;
    title: string;
    difficulty: string;
    department?: string | null;
    businessContext: string;
    objective: string;
    whyImportant?: string | null;
    stepByStepInstructions?: string | null;
    toolsAndFiles?: string | null;
    expectedOutput?: string | null;
    prerequisites?: string | null;
    completionCriteria?: string | null;
    rubric?: string | null;
    submissionInstructions?: string | null;
    hints?: string | null;
  };
  company?: {
    name: string;
    industry?: string;
  };
  teamLead?: {
    leadName?: string;
    leadRole?: string;
  };
  onSelectFile?: (filePath: string) => void;
  onAskHelpdesk?: (query: string) => void;
}

export function MissionGuidance({
  task,
  company,
  teamLead,
  onSelectFile,
  onAskHelpdesk,
}: MissionGuidanceProps) {
  // Parse fields
  let steps: string[] = [];
  if (task.stepByStepInstructions) {
    try {
      steps = JSON.parse(task.stepByStepInstructions);
    } catch {
      steps = [task.stepByStepInstructions];
    }
  }

  let files: string[] = [];
  if (task.toolsAndFiles) {
    try {
      files = JSON.parse(task.toolsAndFiles);
    } catch {
      files = [];
    }
  }

  let criteria: string[] = [];
  if (task.completionCriteria) {
    try {
      criteria = JSON.parse(task.completionCriteria);
    } catch {
      criteria = [task.completionCriteria];
    }
  }

  let hints: string[] = [];
  if (task.hints) {
    try {
      hints = JSON.parse(task.hints);
    } catch {
      hints = [task.hints];
    }
  }

  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const revealNextHint = () => {
    if (revealedHints < hints.length) {
      setRevealedHints((prev) => prev + 1);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-900 border-l border-gray-800 p-5 space-y-6 text-gray-200 font-sans text-xs select-text">
      {/* 1. Header & Badges */}
      <div className="space-y-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between">
          <span className="font-mono font-bold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700 text-[11px]">
            {task.ticketKey}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
            {task.difficulty || "Beginner"}
          </span>
        </div>

        <h2 className="text-base font-bold text-white leading-snug">
          {task.title}
        </h2>

        <div className="flex flex-wrap items-center gap-2 text-gray-400 text-[11px]">
          <span className="flex items-center space-x-1">
            <Building className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-gray-300">{company?.name || "Simulated Company"}</span>
          </span>
          <span>•</span>
          <span className="text-gray-400">{task.department || "Backend Engineering"}</span>
        </div>

        {teamLead?.leadName && (
          <div className="mt-2 p-2.5 rounded-xl bg-gray-950/70 border border-gray-800/80 flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-[11px]">
              {teamLead.leadName.charAt(0)}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-200">{teamLead.leadName}</p>
              <p className="text-[10px] text-gray-500">{teamLead.leadRole || "Team Lead"}</p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Business Scenario */}
      <div className="space-y-2">
        <h3 className="text-[11px] font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>The Scenario</span>
        </h3>
        <p className="text-gray-300 leading-relaxed bg-gray-950/60 p-3 rounded-xl border border-gray-800/60">
          {task.businessContext}
        </p>
      </div>

      {/* 3. Why This Task Is Important */}
      {task.whyImportant && (
        <div className="space-y-1.5 bg-blue-950/30 border border-blue-900/50 p-3 rounded-xl">
          <h4 className="text-[11px] font-bold text-blue-300 flex items-center space-x-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-blue-400" />
            <span>Why This Matters</span>
          </h4>
          <p className="text-gray-300 leading-relaxed text-[11px]">{task.whyImportant}</p>
        </div>
      )}

      {/* 4. Tools & Target Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>Files To Edit</span>
          </h3>
          <div className="space-y-1.5">
            {files.map((file, i) => (
              <button
                key={i}
                onClick={() => onSelectFile && onSelectFile(file)}
                className="w-full text-left p-2 rounded-lg bg-gray-950 border border-gray-800 hover:border-blue-500/50 flex items-center justify-between text-xs font-mono text-blue-300 group transition"
              >
                <div className="flex items-center space-x-2 truncate">
                  <FileCode className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400 shrink-0" />
                  <span className="truncate">{file}</span>
                </div>
                <span className="text-[10px] text-gray-500 group-hover:text-white shrink-0">Open</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5. Step-by-Step Instructions */}
      {steps.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>Step-by-Step Instructions</span>
          </h3>
          <div className="space-y-2">
            {steps.map((step, idx) => (
              <div
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`p-2.5 rounded-xl border flex items-start space-x-2.5 cursor-pointer transition ${
                  completedSteps[idx]
                    ? "bg-emerald-950/20 border-emerald-900/40 text-gray-400"
                    : "bg-gray-950/80 border-gray-800 text-gray-200 hover:border-gray-700"
                }`}
              >
                <div className="mt-0.5">
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      completedSteps[idx] ? "text-emerald-400" : "text-gray-600"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-400 mr-1.5">{idx + 1}.</span>
                  <span className={completedSteps[idx] ? "line-through text-gray-400" : "text-gray-200"}>
                    {step}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Expected Outcome */}
      {task.expectedOutput && (
        <div className="space-y-1.5 bg-gray-950/80 border border-gray-800 p-3 rounded-xl">
          <h4 className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Expected Measurable Outcome</span>
          </h4>
          <p className="text-gray-300 leading-relaxed text-[11px] whitespace-pre-wrap">
            {task.expectedOutput}
          </p>
        </div>
      )}

      {/* 7. Progressive Hints */}
      {hints.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Progressive Hints ({revealedHints}/{hints.length})</span>
            </h3>
            {revealedHints < hints.length && (
              <button
                onClick={revealNextHint}
                className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition"
              >
                Reveal Hint {revealedHints + 1}
              </button>
            )}
          </div>

          <div className="space-y-2">
            {hints.slice(0, revealedHints).map((hint, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-amber-200/90 text-[11px] leading-relaxed"
              >
                <span className="font-bold mr-1">Hint {i + 1}:</span>
                <span>{hint}</span>
              </div>
            ))}

            {revealedHints === 0 && (
              <p className="text-[11px] text-gray-500 italic">
                Hints are locked to encourage independent problem-solving. Click &quot;Reveal Hint 1&quot; if you need a gentle push!
              </p>
            )}
          </div>
        </div>
      )}

      {/* 8. Ask AI Helpdesk Button */}
      <div className="pt-2">
        <button
          onClick={() => onAskHelpdesk && onAskHelpdesk("I need guidance with my next step")}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow-xs flex items-center justify-center space-x-2 transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Need Help? Ask AI Helpdesk</span>
        </button>
      </div>
    </div>
  );
}
