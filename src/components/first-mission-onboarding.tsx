"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Terminal,
  Compass,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Bot,
  Play,
  FileCode,
  ShieldCheck,
  Building,
  RotateCcw,
} from "lucide-react";

interface OnboardingProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export function FirstMissionOnboarding({ forceOpen = false, onClose }: OnboardingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setCurrentStep(0);
      return;
    }
    // Check if user has already completed onboarding
    const seen = localStorage.getItem("workup_onboarding_completed");
    if (!seen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  const handleFinish = () => {
    localStorage.setItem("workup_onboarding_completed", "true");
    setIsOpen(false);
    if (onClose) onClose();
  };

  const steps = [
    {
      title: "Welcome to [workup]",
      subtitle: "The Virtual Professional Experience Platform",
      icon: Terminal,
      content: (
        <div className="space-y-4 text-sm text-gray-300">
          <p>
            Welcome to <strong className="text-white">[workup]</strong>! This is not another online quiz platform or generic video course.
          </p>
          <div className="bg-blue-950/40 border border-blue-800/60 p-4 rounded-2xl text-blue-200 space-y-2">
            <p className="font-semibold text-white">How WORKUP Works:</p>
            <p>
              You step into the shoes of a newly hired engineer at real simulated companies. You receive genuine operational tickets, work inside a cloud development workbench, consult team mentors, and earn cryptographic <strong>Evidence of Skill</strong>.
            </p>
          </div>
          <p className="text-xs text-gray-400">
            Even if you have never worked inside a software company before, our guided missions walk you through every single step.
          </p>
        </div>
      ),
    },
    {
      title: "Step 1: Choose Your Profession",
      subtitle: "Explore Real Tech Career Families",
      icon: Compass,
      content: (
        <div className="space-y-4 text-sm text-gray-300">
          <p>
            Choose a career path you want to experience firsthand. We provide beginner-friendly starter missions designed for 10–30 minutes:
          </p>
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-1">
              <span className="font-bold text-blue-400">Backend Developer</span>
              <p className="text-gray-400 text-[11px]">Fix API logic & email validation (FinFlow)</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-1">
              <span className="font-bold text-emerald-400">Frontend Developer</span>
              <p className="text-gray-400 text-[11px]">Fix broken checkout button (Nova Commerce)</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-1">
              <span className="font-bold text-purple-400">Data Analyst</span>
              <p className="text-gray-400 text-[11px]">Analyze turnaround delivery times (MetroLogistics)</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-1">
              <span className="font-bold text-amber-400">ML Engineer</span>
              <p className="text-gray-400 text-[11px]">Triage model drift & thresholds (OmniRetail)</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Step 2: Meet Your Simulated Team",
      subtitle: "Join FinFlow Technologies & Team Lead Alex",
      icon: Users,
      content: (
        <div className="space-y-4 text-sm text-gray-300">
          <p>
            In your first assignment, you join <strong>FinFlow Technologies</strong>, a fast-growing fintech scale-up processing payments for thousands of merchants.
          </p>
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg shrink-0">
              AR
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Alex Rivera</h4>
              <p className="text-xs text-blue-400">Senior Backend Tech Lead • FinFlow</p>
              <p className="text-xs text-gray-400 mt-1">
                &ldquo;Welcome to the team! Customers reported that login accepts empty emails. I assigned you ticket <strong>FF-001</strong> to fix this!&rdquo;
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Step 3: Understand Your Mission",
      subtitle: "Plain Language Instructions & Clear Expected Outcomes",
      icon: FileCode,
      content: (
        <div className="space-y-3 text-sm text-gray-300">
          <p>
            Every mission explains <strong>why</strong> the task matters, <strong>what</strong> needs to be accomplished, and provides step-by-step instructions.
          </p>
          <div className="bg-emerald-950/30 border border-emerald-900/50 p-3.5 rounded-xl space-y-1.5 text-xs text-emerald-200">
            <span className="font-bold text-white flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Measurable Expected Outcome:</span>
            </span>
            <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
              <li>Empty email inputs should be rejected with a helpful error.</li>
              <li>Valid email addresses should continue working.</li>
              <li>All automated tests should pass.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Step 4: Explore Your Cloud Workspace",
      subtitle: "Real Tools in an Isolated Environment",
      icon: Terminal,
      content: (
        <div className="space-y-3 text-sm text-gray-300">
          <p>
            When you click <strong>Launch Workspace</strong>, you receive an isolated developer sandbox with everything set up:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <strong className="text-white">File Explorer:</strong> Browse repository files and target modules.
            </div>
            <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <strong className="text-white">Code Editor:</strong> Make edits with syntax highlighting and auto-save.
            </div>
            <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <strong className="text-white">Run Tests:</strong> 1-click execution to verify your changes.
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Step 5: Meet AI Helpdesk (Quila)",
      subtitle: "Your Always-Available Virtual Colleague",
      icon: Bot,
      content: (
        <div className="space-y-4 text-sm text-gray-300">
          <p>
            Never feel stuck. The floating <strong>AI Helpdesk</strong> behaves like an experienced colleague sitting next to you.
          </p>
          <div className="bg-indigo-950/40 border border-indigo-800/60 p-4 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-indigo-300 font-bold">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Progressive Guidance, Not Spoilers</span>
            </div>
            <p className="text-gray-300">
              Quila will give you progressive hints, explain test failure errors in plain language, and help you understand unfamiliar programming concepts.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Step 6: Submit & Earn Evidence of Skill",
      subtitle: "Formal Code Review & Cryptographically Signed Portfolio",
      icon: ShieldCheck,
      content: (
        <div className="space-y-4 text-sm text-gray-300">
          <p>
            Once all tests pass, click <strong>Submit Work</strong>:
          </p>
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Automated Tech Lead Review Letter</span>
            </div>
            <p className="text-gray-300">
              Your submission is graded against a real engineering rubric. If approved (≥70%), an immutable, cryptographically hashed credential is added to your public portfolio for recruiters to verify!
            </p>
          </div>
        </div>
      ),
    },
  ];

  if (!isOpen) return null;

  const current = steps[currentStep];
  const StepIcon = current.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 font-sans select-text">
      <div className="bg-gray-950 border border-gray-800 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col text-gray-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-gray-900 via-blue-950/40 to-gray-900 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <StepIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">{current.title}</h3>
              <p className="text-xs text-blue-300 font-medium">{current.subtitle}</p>
            </div>
          </div>
          <button
            onClick={handleFinish}
            className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {current.content}
        </div>

        {/* Footer Navigation */}
        <div className="p-6 bg-gray-900/90 border-t border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentStep
                    ? "w-6 bg-blue-500"
                    : i < currentStep
                    ? "bg-blue-800"
                    : "bg-gray-800"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="text-xs font-semibold text-gray-400 hover:text-white px-3 py-2 rounded-xl transition flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition flex items-center space-x-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition flex items-center space-x-1.5"
              >
                <span>Ready to Begin!</span>
                <Play className="w-3.5 h-3.5 fill-white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
