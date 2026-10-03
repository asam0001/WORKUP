import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { IsolatedSandboxProvider } from "@/lib/workspace/providers/sandbox-provider";
import { WorkspaceSpec } from "@/lib/workspace/types";
import path from "path";
import fs from "fs/promises";
import fsSync from "fs";

describe("IsolatedSandboxProvider Security & Isolation", () => {
  let provider: IsolatedSandboxProvider;
  const testWorkspaceId = "test-ws-" + Date.now();

  const spec: WorkspaceSpec = {
    workspaceId: testWorkspaceId,
    userId: "test-user-123",
    taskId: "task-ml-101",
    ticketKey: "ML-101",
    simulationId: "sim-ml-omniretail",
    simulationSlug: "fraud-detection-drift-mitigation",
    limits: {
      cpuLimit: 2.0,
      memoryLimitMb: 4096,
      diskLimitMb: 10240,
      maxRuntimeMinutes: 120,
      idleTimeoutMinutes: 30,
      networkPolicy: "RESTRICTED",
    },
  };

  beforeEach(() => {
    provider = new IsolatedSandboxProvider();
  });

  afterEach(async () => {
    try {
      await provider.destroyWorkspace(testWorkspaceId);
    } catch {}
  });

  it("should create an isolated workspace sandbox with scenario seed files", async () => {
    const { containerId, rootDir } = await provider.createWorkspace(spec);

    expect(containerId).toBe(testWorkspaceId);
    expect(fsSync.existsSync(rootDir)).toBe(true);

    // Verify scenario template files are present
    const readmeExists = fsSync.existsSync(path.join(rootDir, "README.md"));
    expect(readmeExists).toBe(true);

    const detectorExists = fsSync.existsSync(path.join(rootDir, "src", "drift", "detector.py"));
    expect(detectorExists).toBe(true);

    const baselineDataExists = fsSync.existsSync(path.join(rootDir, "data", "baseline_sample.json"));
    expect(baselineDataExists).toBe(true);

    const testExists = fsSync.existsSync(path.join(rootDir, "tests", "test_drift_audit.py"));
    expect(testExists).toBe(true);
  });

  it("should strictly block directory traversal attempts outside workspace boundary", async () => {
    await provider.createWorkspace(spec);

    // Attempting to read outside workspace root
    await expect(provider.readFile(testWorkspaceId, "../../package.json")).rejects.toThrow(
      /Security Violation: Path traversal/
    );

    await expect(provider.readFile(testWorkspaceId, "../../../../etc/passwd")).rejects.toThrow(
      /Security Violation: Path traversal/
    );

    // Attempting to write outside workspace root
    await expect(
      provider.writeFile(testWorkspaceId, "../../escaped_file.txt", "malicious payload")
    ).rejects.toThrow(/Security Violation: Path traversal/);
  });

  it("should strip platform credentials and secrets from the execution environment", async () => {
    await provider.createWorkspace(spec);

    // Inject temporary mock platform secrets into process.env
    process.env.DATABASE_URL = "postgres://supersecret:5432/db";
    process.env.JWT_SECRET = "super-secret-jwt-signing-key";
    process.env.AWS_SECRET_ACCESS_KEY = "AKIA_DUMMY_SECRET_KEY";

    // Run command that prints env variables
    const isWindows = process.platform === "win32";
    const cmd = isWindows ? "set" : "env";

    const result = await provider.executeCommand(testWorkspaceId, cmd, [], {
      STUDENT_NAME: "Alex Rivera",
      DATABASE_FAKE_INJECTED: "attempted-leak", // Should also be blocked by prefix filter
    });

    // Verify platform secrets are NOT present in stdout
    expect(result.stdout).not.toContain("supersecret");
    expect(result.stdout).not.toContain("super-secret-jwt-signing-key");
    expect(result.stdout).not.toContain("AKIA_DUMMY_SECRET_KEY");
    expect(result.stdout).not.toContain("attempted-leak");

    // Clean up mock env
    delete process.env.DATABASE_URL;
    delete process.env.JWT_SECRET;
    delete process.env.AWS_SECRET_ACCESS_KEY;
  });

  it("should enforce process execution timeouts", async () => {
    await provider.createWorkspace(spec);

    const isWindows = process.platform === "win32";
    // Ping localhost 10 times to simulate long-running command, with a 500ms timeout
    const cmd = isWindows ? "ping -n 5 127.0.0.1" : "sleep 5";

    const result = await provider.executeCommand(testWorkspaceId, cmd, [], {}, 500);

    expect(result.timedOut).toBe(true);
    expect(result.exitCode).toBe(124);
  });

  it("should support file writing, reading, and listing within isolated sandbox", async () => {
    await provider.createWorkspace(spec);

    const testContent = "print('Hello from isolated student container!')\n";
    await provider.writeFile(testWorkspaceId, "src/hello.py", testContent);

    const readBack = await provider.readFile(testWorkspaceId, "src/hello.py");
    expect(readBack).toBe(testContent);

    const files = await provider.listFiles(testWorkspaceId);
    expect(files.some((f) => f.path === "src/hello.py")).toBe(true);
  });

  it("should preserve required deliverables into persistent artifacts before destruction", async () => {
    await provider.createWorkspace(spec);

    await provider.writeFile(
      testWorkspaceId,
      "docs/drift_report.md",
      "# Verified KS Drift Audit Report\nModel Precision Drift: -22%\n"
    );

    const artifacts = await provider.preserveArtifacts(testWorkspaceId);

    expect(artifacts.length).toBeGreaterThan(0);
    const reportArtifact = artifacts.find((a) => a.relativePath === "docs/drift_report.md");
    expect(reportArtifact).toBeDefined();
    expect(reportArtifact?.sha256Hash).toBeDefined();
    expect(fsSync.existsSync(reportArtifact!.persistedLocation)).toBe(true);

    // Clean up artifact files created during test
    await fs.rm(path.dirname(reportArtifact!.persistedLocation), { recursive: true, force: true });
  });

  it("should completely remove the sandbox workspace directory upon destruction", async () => {
    const { rootDir } = await provider.createWorkspace(spec);
    expect(fsSync.existsSync(rootDir)).toBe(true);

    await provider.destroyWorkspace(testWorkspaceId);
    expect(fsSync.existsSync(rootDir)).toBe(false);
  });
});
