"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize2,
  CheckCircle2,
  Terminal,
  Bot,
  FileCode,
  Building,
  Award,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface Chapter {
  id: number;
  timeSec: number;
  title: string;
  badge: string;
  speaker: string;
  narration: string;
  actionSnippet: React.ReactNode;
}

export function MissionDemoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSec, setCurrentSec] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const totalDurationSec = 240; // 4 minutes

  const chapters: Chapter[] = [
    {
      id: 1,
      timeSec: 0,
      title: "1. Welcome & Career Selection",
      badge: "Platform Explorer",
      speaker: "WORKUP Guide",
      narration:
        "Welcome to WORKUP! Instead of memorizing coding trivia, learners join simulated companies. In this demo, we select 'Backend Developer' to experience real software engineering.",
      actionSnippet: (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs text-blue-400 font-mono">
            <span>Careers</span> &gt; <span>Software Engineering</span> &gt; <span>Backend Developer</span>
          </div>
          <h4 className="text-sm font-bold text-white">Junior Backend Engineer Track</h4>
          <p className="text-xs text-gray-400">
            Learn high-availability APIs, SQL optimization, and authentication logic at top scale-ups.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      timeSec: 45,
      title: "2. Receiving Ticket FF-001 at FinFlow",
      badge: "Company Simulation",
      speaker: "Alex Rivera (Tech Lead)",
      narration:
        "You receive an onboarding briefing at FinFlow Technologies. Your Senior Backend Lead, Alex Rivera, assigns ticket FF-001: Customers are reporting empty email logins. Your task is to investigate and reject empty fields.",
      actionSnippet: (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded border border-blue-700">
              FF-001
            </span>
            <span className="text-[11px] text-amber-400 font-semibold">Priority: High</span>
          </div>
          <h4 className="text-sm font-bold text-white">Fix login email validation issue</h4>
          <p className="text-xs text-gray-300 leading-relaxed">
            &ldquo;Hey! We have an issue where our auth API accepts empty email strings. Open your cloud workspace and update <code>src/auth/validator.py</code>.&rdquo;
          </p>
        </div>
      ),
    },
    {
      id: 3,
      timeSec: 90,
      title: "3. Provisioning Isolated Cloud Workspace",
      badge: "Developer Workspace",
      speaker: "Cloud Orchestrator",
      narration:
        "Clicking 'Launch Workspace' provisions an isolated sandbox in seconds. The code editor opens to validator.py, with the file explorer, interactive terminal, and Mission Guidance drawer ready.",
      actionSnippet: (
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-3 font-mono text-xs space-y-1.5 text-gray-300">
          <div className="text-gray-500">// src/auth/validator.py</div>
          <div className="text-purple-400">def <span className="text-blue-400">validate_login_input</span>(email: str, password: str):</div>
          <div className="pl-4 text-emerald-400">&quot;&quot;&quot;Validate credentials before authentication.&quot;&quot;&quot;</div>
          <div className="pl-4 text-rose-400">// BUG: Currently accepts empty emails!</div>
          <div className="pl-4 text-gray-400">if email is None: return &#123;&quot;valid&quot;: False&#125;</div>
          <div className="pl-4 text-amber-400">return &#123;&quot;valid&quot;: True&#125; <span className="text-gray-500">// &lt;-- Erroneous fallback</span></div>
        </div>
      ),
    },
    {
      id: 4,
      timeSec: 135,
      title: "4. Asking AI Helpdesk (Quila)",
      badge: "Virtual Colleague",
      speaker: "Quila (Team Mentor)",
      narration:
        "Unsure what to check? Click the floating AI Helpdesk. Quila provides progressive hints without spoiling the answer, explaining how to test for empty strings and '@' domain symbols.",
      actionSnippet: (
        <div className="bg-indigo-950/40 border border-indigo-800/60 rounded-xl p-3 text-xs space-y-2">
          <div className="flex items-center space-x-2 text-indigo-300 font-bold">
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>Quila • Progressive Hint 1 of 3</span>
          </div>
          <p className="text-gray-200 text-xs">
            &ldquo;Check what <code>validate_login_input</code> returns when given an empty string <code>&quot;&quot;</code>. In Python, you can test <code>if not email or len(email.strip()) == 0:</code> to reject it!&rdquo;
          </p>
        </div>
      ),
    },
    {
      id: 5,
      timeSec: 180,
      title: "5. Implementing Fix & Running Tests",
      badge: "Automated Testing",
      speaker: "Automated Pytest Suite",
      narration:
        "We update the validation logic, press Ctrl+S to save, and click 'Run Tests'. The test runner executes all 5 unit tests in the container sandbox. All 5 tests pass!",
      actionSnippet: (
        <div className="bg-gray-950 border border-emerald-800/80 rounded-xl p-3 font-mono text-xs space-y-1 text-emerald-300">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-bold mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>pytest tests/test_validator.py — ALL PASSED (5/5)</span>
          </div>
          <div>✓ test_empty_email_rejected PASSED [20%]</div>
          <div>✓ test_whitespace_email_rejected PASSED [40%]</div>
          <div>✓ test_missing_at_symbol_rejected PASSED [60%]</div>
          <div>✓ test_valid_email_accepted PASSED [80%]</div>
          <div>✓ test_empty_password_rejected PASSED [100%]</div>
        </div>
      ),
    },
    {
      id: 6,
      timeSec: 215,
      title: "6. Submission & Evidence of Skill",
      badge: "Credential Verification",
      speaker: "AI Tech Lead Review",
      narration:
        "We click 'Submit Work'. The platform runs automated Tech Lead rubric grading (Score: 95%). An immutable, cryptographically signed Evidence of Skill credential is minted to our public portfolio!",
      actionSnippet: (
        <div className="bg-gradient-to-r from-emerald-950/50 to-blue-950/50 border border-emerald-700/60 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Evidence of Skill Issued</span>
            </span>
            <span className="font-mono text-[10px] text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded font-bold">
              SCORE: 95%
            </span>
          </div>
          <p className="text-xs text-gray-300">
            Alex Rivera approved your PR! Added to public portfolio at <code>/portfolio/alex-rivera-finflow</code>.
          </p>
        </div>
      ),
    },
  ];

  // Active chapter lookup
  const activeChapter =
    chapters
      .slice()
      .reverse()
      .find((c) => currentSec >= c.timeSec) || chapters[0];

  // Ticker for demo playback
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSec((prev) => {
          if (prev >= totalDurationSec) {
            setIsPlaying(false);
            return totalDurationSec;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, totalDurationSec]);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s.toString().padStart(2, "0")}`;
  };

  const jumpToChapter = (timeSec: number) => {
    setCurrentSec(timeSec);
  };

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col font-sans select-text">
      {/* 1. Video Stage Screen */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 p-6 flex flex-col justify-between overflow-hidden">
        {/* Top Overlay Badge */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white">Live Walkthrough Demo</span>
            <span className="text-gray-400">•</span>
            <span className="text-blue-300 font-mono text-[11px]">{activeChapter.badge}</span>
          </div>

          <div className="text-xs font-mono text-gray-400 bg-black/60 px-3 py-1 rounded-full border border-white/10">
            {formatTime(currentSec)} / {formatTime(totalDurationSec)}
          </div>
        </div>

        {/* Center Stage Presentation Content */}
        <div className="my-auto max-w-2xl mx-auto w-full space-y-4 z-10">
          <div className="space-y-1">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-400">
              {activeChapter.speaker}
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {activeChapter.title}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              {activeChapter.narration}
            </p>
          </div>

          {/* Action Simulation Box */}
          <div className="mt-4">{activeChapter.actionSnippet}</div>
        </div>

        {/* Decorative Grid BG */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      </div>

      {/* 2. Scrubber & Media Controls Bar */}
      <div className="bg-gray-900 border-t border-gray-800 p-4 space-y-3">
        {/* Scrubber Progress Bar */}
        <div className="relative w-full h-2 bg-gray-800 rounded-full cursor-pointer overflow-hidden group">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
            style={{ width: `${(currentSec / totalDurationSec) * 100}%` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition shadow-xs"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
            </button>

            <button
              onClick={() => setCurrentSec(0)}
              className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition"
              title="Replay from start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-1.5 text-xs text-gray-400">
              <span>Speed:</span>
              {[1, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                    playbackSpeed === spd
                      ? "bg-blue-600 text-white font-bold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/careers"
              className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-xs"
            >
              <span>Try This Mission in Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Chapter Selection Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-2 scrollbar-none">
          {chapters.map((ch) => (
            <button
              key={ch.id}
              onClick={() => jumpToChapter(ch.timeSec)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition shrink-0 border ${
                activeChapter.id === ch.id
                  ? "bg-blue-950 text-blue-300 border-blue-700"
                  : "bg-gray-950 text-gray-400 border-gray-800 hover:text-gray-200"
              }`}
            >
              {ch.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
