import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { prisma } from "@/lib/prisma";
import { workspaceOrchestrator } from "@/lib/workspace/orchestrator";

describe("Workspace Orchestrator Lifecycle & Acceptance Criteria", () => {
  let studentUser: any;
  let reviewerUser: any;
  let mlTask: any;
  let mlSimulation: any;

  beforeEach(async () => {
    studentUser = await prisma.user.findFirst({ where: { email: "student@workup.dev" } });
    reviewerUser = await prisma.user.findFirst({ where: { email: "reviewer@workup.dev" } });
    mlTask = await prisma.task.findFirst({
      where: { ticketKey: "ML-101" },
      include: { phase: { include: { simulation: true } } },
    });
    mlSimulation = mlTask?.phase?.simulation;

    // Clean up any lingering test workspaces
    if (studentUser) {
      const lingering = await prisma.workspace.findMany({
        where: { userId: studentUser.id },
      });
      for (const ws of lingering) {
        try {
          await workspaceOrchestrator.destroyWorkspace(ws.id, studentUser.id, "TEST_CLEANUP");
        } catch {}
      }
    }
  });

  afterEach(async () => {
    if (studentUser) {
      const active = await prisma.workspace.findMany({
        where: { userId: studentUser.id },
      });
      for (const ws of active) {
        try {
          await workspaceOrchestrator.destroyWorkspace(ws.id, studentUser.id, "TEST_CLEANUP");
        } catch {}
      }
    }
  });

  it("should fulfill the full student lifecycle: provision -> work -> run code -> test -> snapshot -> submit -> destroy", async () => {
    expect(studentUser).toBeDefined();
    expect(mlTask).toBeDefined();

    // 1. Start a task and receive an isolated cloud workspace
    const connInfo = await workspaceOrchestrator.provisionWorkspace(
      studentUser.id,
      mlTask.id,
      mlSimulation.id
    );

    expect(connInfo.workspaceId).toBeDefined();
    expect(connInfo.status).toBe("Ready");
    expect(connInfo.connectionToken).toBeDefined();
    expect(connInfo.connectionUrl).toContain(connInfo.workspaceId);

    const wsRecord = await prisma.workspace.findUnique({
      where: { id: connInfo.workspaceId },
    });
    expect(wsRecord?.status).toBe("Ready");
    expect(wsRecord?.cpuLimit).toBeGreaterThanOrEqual(1.0);

    // 2. Work inside it: list files and read initial files
    const files = await workspaceOrchestrator.listFiles(connInfo.workspaceId, studentUser.id);
    expect(files.length).toBeGreaterThan(0);
    expect(files.some((f) => f.path === "README.md")).toBe(true);
    expect(files.some((f) => f.path === "src/drift/detector.py")).toBe(true);

    const readmeContent = await workspaceOrchestrator.readFile(
      connInfo.workspaceId,
      studentUser.id,
      "README.md"
    );
    expect(readmeContent).toContain("OmniRetail: Fraud Model Drift Detection");

    // 3. Edit code in the workspace
    const updatedCode =
      (await workspaceOrchestrator.readFile(connInfo.workspaceId, studentUser.id, "src/drift/detector.py")) +
      "\nprint('Hello from student python code!')\n";
    await workspaceOrchestrator.writeFile(
      connInfo.workspaceId,
      studentUser.id,
      "src/drift/detector.py",
      updatedCode
    );

    const reRead = await workspaceOrchestrator.readFile(
      connInfo.workspaceId,
      studentUser.id,
      "src/drift/detector.py"
    );
    expect(reRead).toContain("Hello from student python code!");

    // 4. Run code inside the workspace
    const execResult = await workspaceOrchestrator.executeCommand(
      connInfo.workspaceId,
      studentUser.id,
      "python",
      ["src/drift/detector.py"]
    );
    expect(execResult.exitCode).toBe(0);
    expect(execResult.stdout).toContain("Hello from student python code!");

    // Workspace status should transition to Running after command execution
    const updatedWs = await prisma.workspace.findUnique({
      where: { id: connInfo.workspaceId },
    });
    expect(updatedWs?.status).toBe("Running");

    // 5. Run automated test suite
    const testResult = await workspaceOrchestrator.runTests(connInfo.workspaceId, studentUser.id);
    expect(testResult.durationMs).toBeGreaterThan(0);
    // Tests execute against pytest; exitCode is recorded
    expect([0, 1]).toContain(testResult.exitCode);

    // 6. Save work / snapshot
    const snapshot = await workspaceOrchestrator.snapshotWork(
      connInfo.workspaceId,
      studentUser.id,
      "Completed baseline KS drift calculations"
    );
    expect(snapshot.commitSha).toBeDefined();

    // 7. Submit work and verify artifact preservation & environment decommissioning
    const submitResult = await workspaceOrchestrator.submitWork(
      connInfo.workspaceId,
      studentUser.id,
      {
        studentNotes: "Fixed KS test drift sensitivity and verified thresholds.",
        branchName: "feature/ML-101-drift-fix",
      }
    );

    expect(submitResult.submission).toBeDefined();
    expect(submitResult.submission.status).toBe("SUBMITTED");
    expect(submitResult.submission.commitSha).toBeDefined();
    expect(submitResult.submission.commitSha.length).toBeGreaterThan(10);
    expect(submitResult.artifacts.length).toBeGreaterThan(0);

    // Verify workspace is destroyed and resource released
    const finalWs = await prisma.workspace.findUnique({
      where: { id: connInfo.workspaceId },
    });
    expect(finalWs?.status).toBe("Destroyed");
    expect(finalWs?.terminationReason).toBe("SUBMISSION_COMPLETE");
    expect(finalWs?.terminatedAt).toBeDefined();
  });

  it("should enforce per-student concurrency limits", async () => {
    // Provision workspace 1
    const ws1 = await workspaceOrchestrator.provisionWorkspace(
      studentUser.id,
      mlTask.id,
      mlSimulation.id
    );

    expect(ws1.workspaceId).toBeDefined();

    // Attempting to provision a second active workspace should be blocked
    await expect(
      workspaceOrchestrator.provisionWorkspace(studentUser.id, mlTask.id, mlSimulation.id)
    ).rejects.toThrow(/Concurrency Limit Exceeded/);

    // After destroying workspace 1, provisioning another one should succeed
    await workspaceOrchestrator.destroyWorkspace(ws1.workspaceId, studentUser.id, "USER_DESTROY");

    const ws2 = await workspaceOrchestrator.provisionWorkspace(
      studentUser.id,
      mlTask.id,
      mlSimulation.id
    );
    expect(ws2.workspaceId).toBeDefined();
  });

  it("should enforce multi-tenant isolation: User A cannot access User B's workspace", async () => {
    // Student creates workspace
    const ws = await workspaceOrchestrator.provisionWorkspace(
      studentUser.id,
      mlTask.id,
      mlSimulation.id
    );

    // Reviewer (different non-admin user) attempts to access, read, execute, or destroy it
    await expect(
      workspaceOrchestrator.getValidatedWorkspace(ws.workspaceId, reviewerUser.id)
    ).rejects.toThrow(/Forbidden/);

    await expect(
      workspaceOrchestrator.readFile(ws.workspaceId, reviewerUser.id, "README.md")
    ).rejects.toThrow(/Forbidden/);

    await expect(
      workspaceOrchestrator.executeCommand(ws.workspaceId, reviewerUser.id, "whoami")
    ).rejects.toThrow(/Forbidden/);

    await expect(
      workspaceOrchestrator.destroyWorkspace(ws.workspaceId, reviewerUser.id, "UNAUTHORIZED_ATTEMPT")
    ).rejects.toThrow(/Forbidden/);
  });

  it("should automatically reap idle or expired workspaces", async () => {
    const ws = await workspaceOrchestrator.provisionWorkspace(
      studentUser.id,
      mlTask.id,
      mlSimulation.id
    );

    // Artificially simulate that this workspace has been idle past the timeout limit
    const sixtyMinutesAgo = new Date(Date.now() - 60 * 60 * 1000);
    await prisma.workspace.update({
      where: { id: ws.workspaceId },
      data: {
        lastActivityAt: sixtyMinutesAgo,
        idleTimeoutMinutes: 30, // 30 minutes threshold
      },
    });

    // Trigger reaper
    const reaped = await workspaceOrchestrator.reapExpiredWorkspaces();

    expect(reaped.some((r) => r.id === ws.workspaceId)).toBe(true);

    const checkWs = await prisma.workspace.findUnique({
      where: { id: ws.workspaceId },
    });
    expect(checkWs?.status).toBe("Destroyed");
    expect(checkWs?.terminationReason).toBe("IDLE_TIMEOUT");
  });
});
