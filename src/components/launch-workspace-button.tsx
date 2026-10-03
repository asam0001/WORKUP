"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Terminal, RefreshCw, AlertCircle } from "lucide-react";

interface LaunchWorkspaceButtonProps {
  taskId: string;
  simulationId: string;
  ticketKey: string;
}

export function LaunchWorkspaceButton({
  taskId,
  simulationId,
  ticketKey,
}: LaunchWorkspaceButtonProps) {
  const router = useRouter();
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLaunch = async () => {
    setIsProvisioning(true);
    setError(null);
    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          simulationId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // If concurrency limit exceeded, fetch user's active workspaces and prompt
        if (data.error?.message?.includes("Concurrency Limit Exceeded")) {
          // Let's find existing active workspace and redirect to it
          const listRes = await fetch("/api/workspaces");
          const listData = await listRes.json();
          const active = listData.data?.workspaces?.find((w: any) =>
            ["Requested", "Provisioning", "Ready", "Running", "Idle"].includes(w.status)
          );
          if (active) {
            router.push(`/workspaces/${active.id}`);
            return;
          }
        }
        throw new Error(data.error?.message || "Failed to provision workspace");
      }

      const workspaceId = data.data.connectionInfo.workspaceId;
      router.push(`/workspaces/${workspaceId}`);
    } catch (err: any) {
      setError(err.message);
      setIsProvisioning(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2">
      <button
        onClick={handleLaunch}
        disabled={isProvisioning}
        className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition"
      >
        {isProvisioning ? (
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
        ) : (
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
        )}
        <span>{isProvisioning ? `Provisioning Sandbox for ${ticketKey}...` : `Launch Cloud Workspace`}</span>
      </button>

      {error && (
        <span className="text-xs text-rose-600 flex items-center space-x-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </span>
      )}
    </div>
  );
}
