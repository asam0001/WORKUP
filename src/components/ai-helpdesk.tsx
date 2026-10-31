"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Lightbulb,
  Compass,
  HelpCircle,
  ChevronRight,
  RefreshCw,
  Terminal,
} from "lucide-react";

interface HelpdeskProps {
  taskId: string;
  ticketKey?: string;
  taskTitle?: string;
  department?: string;
  activeFilePath?: string;
  testResult?: any;
  onOpenFile?: (path: string) => void;
}

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

export function AiHelpdesk({
  taskId,
  ticketKey = "MISSION",
  taskTitle = "Active Mission",
  department = "Engineering",
  activeFilePath,
  testResult,
  onOpenFile,
}: HelpdeskProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([
    "Explain this mission in simple terms",
    "Where should I start?",
    "Can you give me a hint?",
    "How do I submit my work?",
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Load chat history on mount or when taskId changes
  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch(`/api/helpdesk/chat?taskId=${taskId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.messages && json.data.messages.length > 0) {
            setMessages(json.data.messages);
          } else {
            // Default warm welcome
            setMessages([
              {
                role: "assistant",
                content: `👋 Hey there! I'm **Quila**, your Virtual Team Assistant for **${ticketKey}**. I'm here as your helpful colleague and technical mentor.\n\nWhenever you don't understand an assignment, need a gentle hint on the code, or wonder what step to take next, ask me anytime! I won't spoil the answers — I'll guide you step by step. 😊`,
              },
            ]);
          }
        }
      } catch (err) {
        console.error("Failed to load helpdesk history", err);
      }
    }
    if (taskId) {
      loadHistory();
    }
  }, [taskId, ticketKey]);

  const sendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const newMsg: Message = { role: "user", content: userText };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/helpdesk/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          message: userText,
          hintLevel,
          activeFilePath,
          testResult,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: json.data.reply },
        ]);
        if (json.data.hintLevel !== undefined) {
          setHintLevel(json.data.hintLevel);
        }
        if (json.data.suggestedPrompts && json.data.suggestedPrompts.length > 0) {
          setSuggestedPrompts(json.data.suggestedPrompts);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I ran into a temporary error. Could you try asking again?",
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Network error: ${err.message}. Please check your connection.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 1. Floating Helpdesk Pill Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-3 rounded-full shadow-2xl flex items-center space-x-2.5 transition-all transform hover:scale-105 active:scale-95 group border border-white/20"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-blue-600"></span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold leading-tight flex items-center space-x-1">
              <span>AI Helpdesk</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </span>
            <span className="text-[10px] text-blue-100 font-mono">Quila • Team Mentor</span>
          </div>
        </button>
      )}

      {/* 2. Floating AI Helpdesk Drawer */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-96 sm:w-[420px] h-[580px] max-h-[85vh] bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden font-sans text-gray-200">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-gray-900 via-indigo-950/80 to-gray-900 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-xs">
                <Bot className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-gray-900"></span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white">AI Helpdesk</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700 font-mono">
                    {ticketKey}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Virtual Team Colleague & Technical Mentor
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition"
              title="Minimize Helpdesk"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Context Banner */}
          <div className="px-3.5 py-1.5 bg-gray-950/80 border-b border-gray-800/80 flex items-center justify-between text-[11px] text-gray-400">
            <span className="truncate max-w-[260px] font-mono">
              Mission: <span className="text-gray-200">{taskTitle}</span>
            </span>
            <span className="text-emerald-400 font-mono text-[10px] flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Context Ready</span>
            </span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gray-950/60">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-2.5 ${
                  m.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs ${
                    m.role === "user"
                      ? "bg-blue-600 text-white font-bold"
                      : "bg-indigo-600/30 text-indigo-400 border border-indigo-500/30"
                  }`}
                >
                  {m.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-xs"
                      : "bg-gray-900 border border-gray-800 text-gray-200 rounded-tl-xs whitespace-pre-wrap"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl rounded-tl-xs px-3.5 py-2 flex items-center space-x-1.5 text-xs text-gray-400">
                  <RefreshCw className="w-3 h-3 animate-spin text-blue-400" />
                  <span>Quila is typing advice...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompt Chips */}
          <div className="px-3 py-2 bg-gray-900 border-t border-gray-800/80 overflow-x-auto whitespace-nowrap flex items-center space-x-1.5 scrollbar-none">
            {suggestedPrompts.slice(0, 3).map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt)}
                disabled={isLoading}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-[11px] font-medium transition shrink-0 border border-gray-700/60"
              >
                <span>{prompt}</span>
                <ChevronRight className="w-3 h-3 text-gray-500" />
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="p-3 bg-gray-900 border-t border-gray-800 flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or request a progressive hint..."
              disabled={isLoading}
              className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white p-2 rounded-xl transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
