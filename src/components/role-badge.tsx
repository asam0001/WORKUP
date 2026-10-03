import React from "react";
import { UserRole } from "@/types";

interface RoleBadgeProps {
  role: UserRole | string;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const styles: Record<string, string> = {
    student: "bg-blue-100 text-blue-800 border-blue-200",
    content_author: "bg-purple-100 text-purple-800 border-purple-200",
    reviewer: "bg-amber-100 text-amber-800 border-amber-200",
    administrator: "bg-rose-100 text-rose-800 border-rose-200",
  };

  const labels: Record<string, string> = {
    student: "Student",
    content_author: "Content Author",
    reviewer: "Reviewer",
    administrator: "Admin",
  };

  const currentStyle = styles[role] || "bg-gray-100 text-gray-800 border-gray-200";
  const currentLabel = labels[role] || role;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle}`}
    >
      {currentLabel}
    </span>
  );
}
