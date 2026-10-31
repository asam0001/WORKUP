import React from "react";
import Link from "next/link";
import { BookOpen, Terminal, Sparkles, CheckCircle2, Shield, ArrowRight, FileCode, Play } from "lucide-react";

export const metadata = {
  title: "Learning Resources — [workup]",
  description: "Beginner-friendly engineering guides on reading tickets, running tests, and collaborating with AI mentors.",
};

export default function ResourcesPage() {
  const guides = [
    {
      title: "How to Read an Issue Ticket",
      category: "Workplace Skills",
      readTime: "3 min read",
      summary: "Understand tickets like FF-001: separating the user bug report from the underlying code failure and locating the target function.",
      icon: FileCode,
    },
    {
      title: "Automated Testing 101: Understanding Assertions",
      category: "Testing & QA",
      readTime: "4 min read",
      summary: "Why companies use pytest and unit assertions, how test runners check edge cases like empty strings, and how to read tracebacks.",
      icon: CheckCircle2,
    },
    {
      title: "Working with AI Mentor Quila",
      category: "Mentorship",
      readTime: "2 min read",
      summary: "How to ask progressive questions, get hints without spoiling answers, and understand errors with your virtual technical mentor.",
      icon: Sparkles,
    },
    {
      title: "Git Pull Requests & Evidence of Skill",
      category: "Career Proof",
      readTime: "5 min read",
      summary: "How code submissions are packaged into verified cryptographic credentials that recruiters and hiring managers can audit.",
      icon: Shield,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      <div className="bg-white border border-gray-200/90 rounded-3xl p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 mb-2 inline-block">
            Foundations & Tooling
          </span>
          <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">
            Learning Resources & Engineering Handbooks
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Practical, zero-jargon guides designed to help first-time engineers navigate real codebases, understand automated testing, and work alongside mentors.
          </p>
        </div>

        <Link
          href="/demo"
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Watch Mission Demo</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((guide, i) => {
          const Icon = guide.icon;
          return (
            <div
              key={i}
              className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-xs space-y-4 hover:border-blue-500/50 transition group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="font-semibold text-blue-600">{guide.category}</span>
                  <span>•</span>
                  <span>{guide.readTime}</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-950 group-hover:text-blue-600 transition">
                  {guide.title}
                </h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {guide.summary}
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/careers"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  <span>Apply in a Live Mission</span>
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
