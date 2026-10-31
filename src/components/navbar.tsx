"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Terminal, User, LogOut, LayoutDashboard, Compass, Shield, Award, Building, BookOpen, Play, CheckCircle2 } from "lucide-react";
import { RoleBadge } from "./role-badge";

interface CurrentUser {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setUser(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to load user in Navbar", err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-950 font-mono">
                [workup]
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-5 text-sm font-medium text-gray-700">
              <Link
                href="/demo"
                className="flex items-center space-x-1.5 text-blue-600 hover:text-blue-700 transition"
              >
                <Play className="w-3.5 h-3.5 fill-blue-600" />
                <span>Watch Demo</span>
              </Link>
              <Link
                href="/careers"
                className="flex items-center space-x-1.5 hover:text-blue-600 transition"
              >
                <Compass className="w-4 h-4" />
                <span>Missions</span>
              </Link>
              <Link
                href="/companies"
                className="flex items-center space-x-1.5 hover:text-blue-600 transition"
              >
                <Building className="w-4 h-4" />
                <span>Companies</span>
              </Link>
              <Link
                href="/resources"
                className="flex items-center space-x-1.5 hover:text-blue-600 transition"
              >
                <BookOpen className="w-4 h-4" />
                <span>Resources</span>
              </Link>
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-1.5 hover:text-blue-600 transition"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>My Workstation</span>
                  </Link>
                  <Link
                    href="/portfolio"
                    className="flex items-center space-x-1.5 hover:text-blue-600 transition"
                  >
                    <Award className="w-4 h-4" />
                    <span>Verified Portfolio</span>
                  </Link>
                </>
              )}
              {(user?.role === "administrator" || user?.role === "content_author") && (
                <Link
                  href="/admin"
                  className="flex items-center space-x-1.5 text-rose-600 hover:text-rose-700 transition font-semibold"
                >
                  <Shield className="w-4 h-4" />
                  <span>{user.role === "administrator" ? "Admin Panel" : "Author Studio"}</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-20 h-8 bg-gray-100 animate-pulse rounded-md" />
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-sm text-gray-800 hover:text-blue-600 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 font-medium text-xs">
                    {user.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline font-medium">{user.name}</span>
                  <RoleBadge role={user.role} />
                </Link>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-1.5 text-xs text-gray-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Log out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 text-sm font-medium">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg transition"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
