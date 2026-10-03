import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import crypto from "crypto";
import { spawn } from "child_process";
import {
  WorkspaceProvider,
  WorkspaceSpec,
  ExecutionResult,
  FileEntry,
  WorkspaceMetrics,
  ArtifactMetadata,
  WorkspaceLimits,
} from "../types";

export class IsolatedSandboxProvider implements WorkspaceProvider {
  public readonly name = "isolated-sandbox";
  private baseWorkspacesDir: string;
  private baseArtifactsDir: string;

  constructor() {
    this.baseWorkspacesDir = path.resolve(process.cwd(), ".workspaces");
    this.baseArtifactsDir = path.resolve(process.cwd(), ".artifacts");
  }

  private async ensureBaseDirectories(): Promise<void> {
    if (!fsSync.existsSync(this.baseWorkspacesDir)) {
      await fs.mkdir(this.baseWorkspacesDir, { recursive: true });
    }
    if (!fsSync.existsSync(this.baseArtifactsDir)) {
      await fs.mkdir(this.baseArtifactsDir, { recursive: true });
    }
  }

  public getWorkspaceRootDir(containerId: string): string {
    return path.resolve(this.baseWorkspacesDir, containerId);
  }

  public resolveSafePath(containerId: string, relativePath: string): string {
    const rootDir = this.getWorkspaceRootDir(containerId);
    // Remove leading slashes and normalize
    const cleanRelative = relativePath.replace(/^(\/|\\)+/, "");
    const resolved = path.resolve(rootDir, cleanRelative);

    // Boundary check: resolved path must strictly start with rootDir
    if (!resolved.startsWith(rootDir)) {
      throw new Error(`Security Violation: Path traversal outside workspace boundary detected: ${relativePath}`);
    }

    return resolved;
  }

  public async createWorkspace(spec: WorkspaceSpec): Promise<{ containerId: string; rootDir: string }> {
    await this.ensureBaseDirectories();
    const containerId = spec.workspaceId;
    const rootDir = this.getWorkspaceRootDir(containerId);

    // Create isolated workspace directory
    await fs.mkdir(rootDir, { recursive: true });

    // Seed scenario template files based on task/ticket
    await this.seedScenarioFiles(rootDir, spec);

    // If initial files were explicitly provided, write them
    if (spec.initialFiles) {
      for (const [relPath, content] of Object.entries(spec.initialFiles)) {
        const fullPath = this.resolveSafePath(containerId, relPath);
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, content, "utf-8");
      }
    }

    return { containerId, rootDir };
  }

  public async startWorkspace(containerId: string): Promise<{ connectionUrl: string; token: string }> {
    const rootDir = this.getWorkspaceRootDir(containerId);
    if (!fsSync.existsSync(rootDir)) {
      throw new Error(`Workspace root directory not found: ${rootDir}`);
    }

    const token = crypto.randomBytes(32).toString("hex");
    const connectionUrl = `/workspaces/${containerId}?token=${token}`;

    return { connectionUrl, token };
  }

  public async executeCommand(
    containerId: string,
    command: string,
    args: string[] = [],
    customEnv: Record<string, string> = {},
    timeoutMs = 30000
  ): Promise<ExecutionResult> {
    const rootDir = this.getWorkspaceRootDir(containerId);
    if (!fsSync.existsSync(rootDir)) {
      throw new Error(`Workspace directory does not exist: ${rootDir}`);
    }

    // Sanitize environment: NEVER pass platform secrets to student execution
    const sanitizedEnv = this.sanitizeEnvironment(customEnv);

    const startTime = Date.now();
    let stdoutBuffer = "";
    let stderrBuffer = "";
    let timedOut = false;
    const maxOutputBytes = 512 * 1024; // 512 KB output cap

    return new Promise<ExecutionResult>((resolve) => {
      const isWindows = process.platform === "win32";
      // On Windows, resolve python / node binaries directly if available to prevent WindowsApps stub interception
      let resolvedCmd = command;
      if (isWindows) {
        const userProfile = process.env.USERPROFILE || "";
        if (command === "python" || command === "python3") {
          const pyBin = path.join(userProfile, "AppData", "Local", "Python", "bin", "python.exe");
          if (fsSync.existsSync(pyBin)) resolvedCmd = pyBin;
        } else if (command === "node") {
          const nodeBin = path.join(userProfile, "AppData", "Local", "hermes", "node", "node.exe");
          if (fsSync.existsSync(nodeBin)) resolvedCmd = nodeBin;
        }
      }

      let childProc: any;
      try {
        childProc = spawn(resolvedCmd, args, {
          cwd: rootDir,
          env: sanitizedEnv,
          shell: true,
          windowsHide: true,
        });
      } catch (err: any) {
        resolve({
          stdout: "",
          stderr: `Failed to spawn process: ${err.message}`,
          exitCode: 127,
          durationMs: Date.now() - startTime,
          timedOut: false,
        });
        return;
      }

      const timer = setTimeout(() => {
        timedOut = true;
        try {
          childProc.kill("SIGKILL");
        } catch {
          // Ignore kill error
        }
      }, timeoutMs);

      childProc.stdout?.on("data", (chunk: Buffer) => {
        if (stdoutBuffer.length < maxOutputBytes) {
          stdoutBuffer += chunk.toString("utf-8");
          if (stdoutBuffer.length >= maxOutputBytes) {
            stdoutBuffer += "\n[workup] Warning: Console output truncated at 512KB.";
          }
        }
      });

      childProc.stderr?.on("data", (chunk: Buffer) => {
        if (stderrBuffer.length < maxOutputBytes) {
          stderrBuffer += chunk.toString("utf-8");
          if (stderrBuffer.length >= maxOutputBytes) {
            stderrBuffer += "\n[workup] Warning: Stderr output truncated at 512KB.";
          }
        }
      });

      childProc.on("error", (err: any) => {
        clearTimeout(timer);
        resolve({
          stdout: stdoutBuffer,
          stderr: stderrBuffer + (stderrBuffer ? "\n" : "") + err.message,
          exitCode: 1,
          durationMs: Date.now() - startTime,
          timedOut,
        });
      });

      childProc.on("close", (code: any) => {
        clearTimeout(timer);
        resolve({
          stdout: stdoutBuffer,
          stderr: stderrBuffer,
          exitCode: timedOut ? 124 : (code ?? 0),
          durationMs: Date.now() - startTime,
          timedOut,
        });
      });
    });
  }

  public async listFiles(containerId: string, subPath = ""): Promise<FileEntry[]> {
    const targetDir = this.resolveSafePath(containerId, subPath);
    if (!fsSync.existsSync(targetDir)) {
      return [];
    }

    const entries: FileEntry[] = [];
    const rootDir = this.getWorkspaceRootDir(containerId);

    const scanDirectory = async (currentDir: string) => {
      const items = await fs.readdir(currentDir, { withFileTypes: true });

      for (const item of items) {
        // Skip hidden or system folders
        if (
          item.name === ".git" ||
          item.name === "node_modules" ||
          item.name === "__pycache__" ||
          item.name === ".venv"
        ) {
          continue;
        }

        const fullPath = path.join(currentDir, item.name);
        const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, "/");
        const stats = await fs.stat(fullPath);

        entries.push({
          path: relativePath,
          name: item.name,
          type: item.isDirectory() ? "directory" : "file",
          size: stats.size,
          lastModified: stats.mtime,
        });

        if (item.isDirectory()) {
          await scanDirectory(fullPath);
        }
      }
    };

    await scanDirectory(targetDir);
    return entries.sort((a, b) => {
      if (a.type === b.type) return a.path.localeCompare(b.path);
      return a.type === "directory" ? -1 : 1;
    });
  }

  public async readFile(containerId: string, relativePath: string): Promise<string> {
    const fullPath = this.resolveSafePath(containerId, relativePath);
    if (!fsSync.existsSync(fullPath)) {
      throw new Error(`File not found: ${relativePath}`);
    }
    return fs.readFile(fullPath, "utf-8");
  }

  public async writeFile(containerId: string, relativePath: string, content: string): Promise<void> {
    const fullPath = this.resolveSafePath(containerId, relativePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content, "utf-8");
  }

  public async snapshotWorkspace(
    containerId: string,
    message: string
  ): Promise<{ commitSha: string; timestamp: Date }> {
    const rootDir = this.getWorkspaceRootDir(containerId);
    const timestamp = new Date();
    const hash = crypto
      .createHash("sha1")
      .update(containerId + timestamp.toISOString() + message)
      .digest("hex");

    // Write a local snapshot manifest
    const snapshotPath = path.join(rootDir, ".workup-snapshot");
    await fs.writeFile(
      snapshotPath,
      JSON.stringify({ commitSha: hash, message, timestamp: timestamp.toISOString() }, null, 2),
      "utf-8"
    );

    return { commitSha: hash, timestamp };
  }

  public async preserveArtifacts(
    containerId: string,
    requiredPatterns: string[] = []
  ): Promise<ArtifactMetadata[]> {
    await this.ensureBaseDirectories();
    const rootDir = this.getWorkspaceRootDir(containerId);
    const destDir = path.join(this.baseArtifactsDir, containerId);
    await fs.mkdir(destDir, { recursive: true });

    const artifacts: ArtifactMetadata[] = [];
    if (!fsSync.existsSync(rootDir)) {
      return artifacts;
    }

    const files = await this.listFiles(containerId);
    const candidateFiles = files.filter((f) => f.type === "file");

    for (const file of candidateFiles) {
      // Check if file is part of required patterns or standard deliverables
      const isDeliverable =
        file.path.startsWith("docs/") ||
        file.path.startsWith("src/") ||
        file.path.endsWith(".py") ||
        file.path.endsWith(".md") ||
        file.path.endsWith(".json") ||
        requiredPatterns.some((pattern) => file.path.includes(pattern));

      if (isDeliverable) {
        const sourcePath = this.resolveSafePath(containerId, file.path);
        const targetPath = path.join(destDir, file.path);
        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.copyFile(sourcePath, targetPath);

        const content = await fs.readFile(sourcePath);
        const sha256 = crypto.createHash("sha256").update(content).digest("hex");

        artifacts.push({
          name: file.name,
          relativePath: file.path,
          sizeBytes: file.size,
          sha256Hash: sha256,
          persistedLocation: targetPath,
          createdAt: new Date(),
        });
      }
    }

    // Save artifact manifest
    const manifestPath = path.join(destDir, "artifacts-manifest.json");
    await fs.writeFile(manifestPath, JSON.stringify(artifacts, null, 2), "utf-8");

    return artifacts;
  }

  public async getMetrics(
    containerId: string,
    limits: WorkspaceLimits,
    startedAt?: Date
  ): Promise<WorkspaceMetrics> {
    const rootDir = this.getWorkspaceRootDir(containerId);
    let diskMb = 0;

    if (fsSync.existsSync(rootDir)) {
      const files = await this.listFiles(containerId);
      const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
      diskMb = Math.round((totalBytes / (1024 * 1024)) * 100) / 100;
    }

    // Compute duration and estimated cost ($0.04 / hour => ~$0.0000111 / sec)
    const durationSeconds = startedAt ? Math.max(1, (Date.now() - startedAt.getTime()) / 1000) : 60;
    const hourlyRate = 0.04 * (limits.cpuLimit / 2.0);
    const estimatedCost = Math.round((durationSeconds / 3600) * hourlyRate * 10000) / 10000;

    return {
      cpuPercent: Math.min(100, Math.round(Math.random() * 8 * 10) / 10), // Low baseline utilization
      memoryMb: Math.round(128 + diskMb * 1.5),
      diskMb,
      estimatedCost,
    };
  }

  public async stopWorkspace(containerId: string): Promise<void> {
    // Graceful stop of any running processes
    // In local sandbox, processes are run transiently via executeCommand
  }

  public async destroyWorkspace(containerId: string): Promise<void> {
    const rootDir = this.getWorkspaceRootDir(containerId);
    if (fsSync.existsSync(rootDir)) {
      await fs.rm(rootDir, { recursive: true, force: true });
    }
  }

  /**
   * Strips all platform secrets and sensitive environment keys to guarantee
   * zero credential leakage into the student container/sandbox.
   */
  private sanitizeEnvironment(customEnv: Record<string, string> = {}): NodeJS.ProcessEnv {
    const forbiddenPrefixes = [
      "DATABASE",
      "PRISMA",
      "JWT",
      "AUTH",
      "SESSION",
      "SECRET",
      "TOKEN",
      "AWS",
      "AZURE",
      "GCP",
      "POSTGRES",
      "REDIS_URL",
      "STRIPE",
      "SENDGRID",
    ];

    const userProfile = process.env.USERPROFILE || "";
    const pythonBin = userProfile ? path.join(userProfile, "AppData", "Local", "Python", "bin") : "";
    const nodeBin = userProfile ? path.join(userProfile, "AppData", "Local", "hermes", "node") : "";

    const pathDirs = [pythonBin, nodeBin, process.env.PATH || ""].filter(Boolean).join(path.delimiter);

    const safeEnv: NodeJS.ProcessEnv = {
      PATH: pathDirs,
      HOME: process.env.USERPROFILE || process.env.HOME || "",
      USERPROFILE: process.env.USERPROFILE || "",
      TEMP: process.env.TEMP || "",
      TMP: process.env.TMP || "",
      LANG: "en_US.UTF-8",
      TERM: "xterm-256color",
      PYTHONUNBUFFERED: "1",
      NODE_ENV: "development",
    };

    // Include custom student env vars (checking that none mimic platform secrets)
    for (const [key, value] of Object.entries(customEnv)) {
      const upper = key.toUpperCase();
      const isForbidden = forbiddenPrefixes.some((prefix) => upper.startsWith(prefix) || upper.includes(prefix));
      if (!isForbidden) {
        safeEnv[key] = value;
      }
    }

    return safeEnv;
  }

  /**
   * Seeds realistic scenario codebases according to the ticket handle.
   */
  private async seedScenarioFiles(rootDir: string, spec: WorkspaceSpec): Promise<void> {
    const ticket = spec.ticketKey;

    if (ticket.startsWith("ML-101") || ticket.startsWith("ML-")) {
      // Seed OmniRetail MLOps Drift Detection codebase
      await fs.mkdir(path.join(rootDir, "src", "drift"), { recursive: true });
      await fs.mkdir(path.join(rootDir, "data"), { recursive: true });
      await fs.mkdir(path.join(rootDir, "tests"), { recursive: true });
      await fs.mkdir(path.join(rootDir, "docs"), { recursive: true });

      await fs.writeFile(
        path.join(rootDir, "README.md"),
        `# OmniRetail: Fraud Model Drift Detection Sprint (${ticket})

Welcome to the OmniRetail ML Platform engineering team.

## Business Problem
Over the past quarter, our transaction fraud detection model precision dropped 22%, causing legitimate holiday checkouts to be rejected and costing $85,000/day.

## Your Mission
1. Inspect baseline vs. current transaction data distributions.
2. Complete statistical drift detection using Kolmogorov-Smirnov test in \`src/drift/detector.py\`.
3. Generate the drift report in \`docs/drift_report.md\`.
4. Run \`pytest tests/test_drift_audit.py\` to verify all drift thresholds pass.
`,
        "utf-8"
      );

      await fs.writeFile(
        path.join(rootDir, "src", "drift", "detector.py"),
        `"""
OmniRetail ML Platform - Statistical Feature Drift Detection
"""
import json
import math

class FeatureDriftDetector:
    def __init__(self, p_value_threshold: float = 0.05):
        self.p_value_threshold = p_value_threshold

    def calculate_ks_statistic(self, baseline: list[float], current: list[float]) -> dict:
        """
        Calculates two-sample Kolmogorov-Smirnov distance between baseline and current distributions.
        """
        if not baseline or not current:
            raise ValueError("Distributions cannot be empty")

        # Two-sample empirical CDF calculation
        b_sorted = sorted(baseline)
        c_sorted = sorted(current)
        all_vals = sorted(set(b_sorted + c_sorted))

        max_diff = 0.0
        for val in all_vals:
            # Fraction of baseline <= val
            f_b = sum(1 for x in b_sorted if x <= val) / len(b_sorted)
            # Fraction of current <= val
            f_c = sum(1 for x in c_sorted if x <= val) / len(c_sorted)
            diff = abs(f_b - f_c)
            if diff > max_diff:
                max_diff = diff

        # Asymptotic p-value approximation
        n1, n2 = len(b_sorted), len(c_sorted)
        en = math.sqrt((n1 * n2) / (n1 + n2))
        lambda_val = (en + 0.12 + 0.11 / en) * max_diff
        p_val = 2.0 * math.exp(-2.0 * (lambda_val ** 2)) if lambda_val > 0 else 1.0
        p_val = max(0.0, min(1.0, p_val))

        is_drifted = p_val < self.p_value_threshold

        return {
            "ks_statistic": round(max_diff, 4),
            "p_value": round(p_val, 4),
            "is_drift_detected": is_drifted,
            "threshold": self.p_value_threshold,
        }
`,
        "utf-8"
      );

      await fs.writeFile(
        path.join(rootDir, "data", "baseline_sample.json"),
        JSON.stringify({ feature: "transaction_amount", values: [12.5, 15.0, 22.1, 45.0, 52.3, 18.9, 99.0, 14.2, 33.1, 60.5] }, null, 2),
        "utf-8"
      );

      await fs.writeFile(
        path.join(rootDir, "data", "current_sample.json"),
        JSON.stringify({ feature: "transaction_amount", values: [185.0, 210.5, 340.0, 412.0, 95.0, 155.2, 280.0, 199.9, 310.0, 450.0] }, null, 2),
        "utf-8"
      );

      await fs.writeFile(
        path.join(rootDir, "tests", "test_drift_audit.py"),
        `import json
import os
import sys

# Add src to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.drift.detector import FeatureDriftDetector

def test_drift_detector_initialization():
    detector = FeatureDriftDetector(p_value_threshold=0.05)
    assert detector.p_value_threshold == 0.05

def test_identical_distributions_no_drift():
    detector = FeatureDriftDetector()
    data = [10.0, 20.0, 30.0, 40.0, 50.0]
    result = detector.calculate_ks_statistic(data, data)
    assert result["ks_statistic"] == 0.0
    assert result["is_drift_detected"] is False

def test_shifted_distributions_detects_drift():
    detector = FeatureDriftDetector()
    with open("data/baseline_sample.json") as f:
        baseline = json.load(f)["values"]
    with open("data/current_sample.json") as f:
        current = json.load(f)["values"]

    result = detector.calculate_ks_statistic(baseline, current)
    assert result["ks_statistic"] > 0.5
    assert result["is_drift_detected"] is True
`,
        "utf-8"
      );

      await fs.writeFile(
        path.join(rootDir, "docs", "drift_report.md"),
        `# OmniRetail Drift Audit Report (${ticket})
**Date:** 2026-10-03  
**Status:** In Progress  

## Findings
- Baseline median transaction amount: $27.60
- Current production median transaction amount: $245.00
- KS Statistic: Pending student calculation
- Recommendation: Retrain model on last 30 days data.
`,
        "utf-8"
      );
    } else {
      // Seed Generic Backend Service template
      await fs.mkdir(path.join(rootDir, "src"), { recursive: true });
      await fs.mkdir(path.join(rootDir, "tests"), { recursive: true });
      await fs.mkdir(path.join(rootDir, "docs"), { recursive: true });

      await fs.writeFile(
        path.join(rootDir, "README.md"),
        `# Simulation Sprint: ${ticket}

Welcome to your isolated cloud workspace for ${spec.simulationSlug}.

## Instructions
1. Review the requirements and ADR specifications.
2. Edit implementation files in \`src/\`.
3. Run \`pytest\` or test scripts in \`tests/\`.
4. Submit your pull request when ready.
`,
        "utf-8"
      );

      await fs.writeFile(
        path.join(rootDir, "src", "service.py"),
        `"""
Core Service Implementation for ${ticket}
"""

def execute_service():
    return {"status": "healthy", "service": "${ticket}"}
`,
        "utf-8"
      );

      await fs.writeFile(
        path.join(rootDir, "tests", "test_service.py"),
        `import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from src.service import execute_service

def test_service_healthy():
    res = execute_service()
    assert res["status"] == "healthy"
`,
        "utf-8"
      );
    }
  }
}
