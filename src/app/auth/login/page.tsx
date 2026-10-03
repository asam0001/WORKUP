"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Terminal, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || "Failed to log in. Please check your credentials.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Password123");
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-sm mb-4">
          <Terminal className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Sign in to your workstation
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Or{" "}
          <Link href="/auth/register" className="font-semibold text-blue-600 hover:text-blue-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-gray-200/90 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Work Email
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@company.com"
                  className="block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-blue-600 hover:text-blue-500 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-xl shadow-xs text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 transition"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Account Selector */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 text-center">
              Quick Sign-in (Demo Accounts)
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillDemoAccount("student@workup.dev")}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 text-left transition font-mono"
              >
                <span className="font-semibold block text-blue-600">Student</span>
                <span className="text-[10px] text-gray-500">student@workup.dev</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount("admin@workup.dev")}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 text-left transition font-mono"
              >
                <span className="font-semibold block text-rose-600">Admin</span>
                <span className="text-[10px] text-gray-500">admin@workup.dev</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount("author@workup.dev")}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 text-left transition font-mono"
              >
                <span className="font-semibold block text-purple-600">Author</span>
                <span className="text-[10px] text-gray-500">author@workup.dev</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount("reviewer@workup.dev")}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 text-left transition font-mono"
              >
                <span className="font-semibold block text-amber-600">Reviewer</span>
                <span className="text-[10px] text-gray-500">reviewer@workup.dev</span>
              </button>
            </div>
            <p className="text-[11px] text-center text-gray-400 mt-2">
              Default password: <code className="bg-gray-100 px-1 py-0.5 rounded">Password123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
