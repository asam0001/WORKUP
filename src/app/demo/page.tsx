import React from "react";
import Link from "next/link";
import { MissionDemoPlayer } from "@/components/mission-demo-player";
import { ArrowLeft, Play, Sparkles, Building, Terminal } from "lucide-react";

export const metadata = {
  title: "Watch Mission Demo — [workup]",
  description: "Experience how WORKUP simulates professional engineering: joining a simulated company, receiving an assignment, and earning verified Evidence of Skill.",
};

export default function DemoPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 text-xs text-gray-500 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Sample Mission: FinFlow Technologies (FF-001)</span>
        </div>
      </div>

      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Interactive 4-Minute Experience Walkthrough</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">
          See How WORKUP Simulates Professional Work
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Watch a new learner join FinFlow Technologies, receive ticket FF-001 from team lead Alex Rivera, consult AI mentor Quila, run automated tests, and earn verified Evidence of Skill.
        </p>
      </div>

      {/* Main Interactive Demo Player */}
      <MissionDemoPlayer />

      {/* Next Steps Card */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-950">Ready to try your first mission?</h3>
          <p className="text-xs text-gray-500 mt-1">
            No installation required. Everything runs in your browser with zero setup.
          </p>
        </div>

        <Link
          href="/careers"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-6 py-3 rounded-xl shadow-xs transition text-center shrink-0"
        >
          Explore Beginner Missions
        </Link>
      </div>
    </div>
  );
}
