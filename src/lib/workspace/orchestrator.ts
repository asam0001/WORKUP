import { prisma } from "@/lib/prisma";
import { getWorkspaceProvider } from "./providers";
import { evaluationEngine } from "@/lib/evaluation/evaluator";
import {
  WorkspaceConnectionInfo,
  WorkspaceLimits,
  WorkspaceSpec,
  ExecutionResult,
  FileEntry,
} from "./types";

export class WorkspaceOrchestrator {
  private static instance: WorkspaceOrchestrator;

  private constructor() {}

  public static getInstance(): WorkspaceOrchestrator {
    if (!WorkspaceOrchestrator.instance) {
      WorkspaceOrchestrator.instance = new WorkspaceOrchestrator();
    }
    return WorkspaceOrchestrator.instance;
  }

  /**
   * 10-Step Provisioning Pipeline
   */
  public async provisionWorkspace(
    userId: string,
    taskId: string,
    simulationId: string
  ): Promise<WorkspaceConnectionInfo> {
    const provider = getWorkspaceProvider();

    // 1. Validate authorization and user existence
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("Unauthorized: User not found");
    }

    // Enforce concurrency limit: Student cannot run multiple active workspaces concurrently
    const activeWorkspaces = await prisma.workspace.findMany({
      where: {
        userId,
        status: { in: ["Requested", "Provisioning", "Ready", "Running", "Idle"] },
      },
    });

    if (activeWorkspaces.length > 0) {
      throw new Error(
        `Concurrency Limit Exceeded: You already have an active workspace (${activeWorkspaces[0].id}). Please complete or destroy it before launching a new one.`
      );
    }

    // 2. Validate Task and Simulation
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { phase: { include: { simulation: true } } },
    });

    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    if (task.phase.simulationId !== simulationId) {
      throw new Error(`Task does not belong to the specified simulation: ${simulationId}`);
    }

    // Parse task environment configuration
    let envConfig: any = {};
    if (task.environmentConfiguration) {
      try {
        envConfig = JSON.parse(task.environmentConfiguration);
      } catch {
        envConfig = {};
      }
    }

    // Parse automated tests command
    let testCmd = "pytest tests/";
    if (task.automatedTests) {
      try {
        const parsed = JSON.parse(task.automatedTests);
        if (parsed.command) testCmd = parsed.command;
      } catch {}
    }

    // 3. Create Workspace in DB with initial state "Requested"
    const defaultLimits: WorkspaceLimits = {
      cpuLimit: envConfig.cpu ? Number(envConfig.cpu) : 2.0,
      memoryLimitMb: envConfig.memory ? parseInt(envConfig.memory) * 1024 || 4096 : 4096,
      diskLimitMb: 10240, // 10 GB
      maxRuntimeMinutes: 120, // 2 hours hard cap
      idleTimeoutMinutes: 30, // 30 mins idle
      networkPolicy: "RESTRICTED",
    };

    const workspaceRecord = await prisma.workspace.create({
      data: {
        userId,
        simulationId,
        taskId,
        status: "Requested",
        cpuLimit: defaultLimits.cpuLimit,
        memoryLimitMb: defaultLimits.memoryLimitMb,
        diskLimitMb: defaultLimits.diskLimitMb,
        maxRuntimeMinutes: defaultLimits.maxRuntimeMinutes,
        idleTimeoutMinutes: defaultLimits.idleTimeoutMinutes,
        networkPolicy: defaultLimits.networkPolicy,
      },
    });

    try {
      // 4. Update status to "Provisioning"
      await prisma.workspace.update({
        where: { id: workspaceRecord.id },
        data: { status: "Provisioning" },
      });

      // 5-8. Create isolated sandbox, clone scenario repo, configure environment, attach datasets
      const spec: WorkspaceSpec = {
        workspaceId: workspaceRecord.id,
        userId,
        taskId: task.id,
        ticketKey: task.ticketKey,
        simulationId,
        simulationSlug: task.phase.simulation.slug,
        runtime: envConfig.runtime || "python:3.12",
        baseImage: envConfig.baseImage,
        limits: defaultLimits,
        automatedTestCommand: testCmd,
      };

      const { containerId } = await provider.createWorkspace(spec);

      // 9. Start workspace
      const { connectionUrl, token } = await provider.startWorkspace(containerId);

      const now = new Date();
      const expiresAt = new Date(now.getTime() + defaultLimits.maxRuntimeMinutes * 60 * 1000);

      // 10. Update DB record to "Ready" and return connection information
      const updatedWorkspace = await prisma.workspace.update({
        where: { id: workspaceRecord.id },
        data: {
          status: "Ready",
          containerId,
          connectionUrl,
          connectionToken: token,
          startedAt: now,
          expiresAt,
          lastActivityAt: now,
        },
      });

      // Audit Log
      await prisma.auditLog.create({
        data: {
          userId,
          action: "WORKSPACE_PROVISIONED",
          entityType: "Workspace",
          entityId: updatedWorkspace.id,
          metadata: JSON.stringify({
            taskId: task.id,
            ticketKey: task.ticketKey,
            containerId,
            limits: defaultLimits,
          }),
        },
      });

      // Record initial Mission Outcome as IN_PROGRESS
      try {
        await prisma.missionOutcome.upsert({
          where: {
            userId_taskId: {
              userId,
              taskId: task.id,
            },
          },
          update: {
            status: "IN_PROGRESS",
          },
          create: {
            userId,
            taskId: task.id,
            status: "IN_PROGRESS",
          },
        });
      } catch (outcomeErr) {
        console.error("Failed to update initial mission outcome:", outcomeErr);
      }

      const metrics = await provider.getMetrics(containerId, defaultLimits, now);

      return {
        workspaceId: updatedWorkspace.id,
        status: "Ready",
        connectionUrl,
        connectionToken: token,
        containerId,
        startedAt: now,
        expiresAt,
        limits: defaultLimits,
        metrics,
      };
    } catch (err: any) {
      // If provisioning failed, mark Destroyed with failure reason
      await prisma.workspace.update({
        where: { id: workspaceRecord.id },
        data: {
          status: "Destroyed",
          failureReason: err.message,
          terminatedAt: new Date(),
          terminationReason: "PROVISIONING_FAILED",
        },
      });
      throw err;
    }
  }

  /**
   * Validates that the user owns the workspace or is an administrator
   */
  public async getValidatedWorkspace(workspaceId: string, userId: string, requireActive = true) {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        task: true,
        simulation: true,
        user: { select: { id: true, email: true, name: true, role: true } },
      },
    });

    if (!workspace) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    const isOwner = workspace.userId === userId;
    const isAdmin = workspace.user.role === "administrator";

    if (!isOwner && !isAdmin) {
      throw new Error("Forbidden: You do not have permission to access this workspace");
    }

    if (requireActive && (workspace.status === "Destroyed" || workspace.status === "Stopping")) {
      throw new Error(`Workspace is inactive (${workspace.status}) and cannot be accessed.`);
    }

    return workspace;
  }

  /**
   * Code & Terminal Command Execution
   */
  public async executeCommand(
    workspaceId: string,
    userId: string,
    command: string,
    args: string[] = [],
    customEnv: Record<string, string> = {}
  ): Promise<ExecutionResult> {
    const workspace = await this.getValidatedWorkspace(workspaceId, userId, true);
    const provider = getWorkspaceProvider();
    const containerId = workspace.containerId || workspace.id;

    // Transition status to Running if Ready or Idle
    if (workspace.status === "Ready" || workspace.status === "Idle") {
      await prisma.workspace.update({
        where: { id: workspaceId },
        data: { status: "Running", lastActivityAt: new Date() },
      });
    } else {
      await prisma.workspace.update({
        where: { id: workspaceId },
        data: { lastActivityAt: new Date() },
      });
    }

    const result = await provider.executeCommand(containerId, command, args, customEnv);

    // Update telemetry metrics
    const limits: WorkspaceLimits = {
      cpuLimit: workspace.cpuLimit,
      memoryLimitMb: workspace.memoryLimitMb,
      diskLimitMb: workspace.diskLimitMb,
      maxRuntimeMinutes: workspace.maxRuntimeMinutes,
      idleTimeoutMinutes: workspace.idleTimeoutMinutes,
      networkPolicy: workspace.networkPolicy as any,
    };
    const metrics = await provider.getMetrics(containerId, limits, workspace.startedAt || undefined);

    await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        currentCpuPercent: metrics.cpuPercent,
        currentMemoryMb: metrics.memoryMb,
        currentDiskMb: metrics.diskMb,
        estimatedCost: metrics.estimatedCost,
      },
    });

    return result;
  }

  /**
   * File Tree & Contents
   */
  public async listFiles(workspaceId: string, userId: string, subPath = ""): Promise<FileEntry[]> {
    const workspace = await this.getValidatedWorkspace(workspaceId, userId, true);
    const provider = getWorkspaceProvider();
    const containerId = workspace.containerId || workspace.id;

    return provider.listFiles(containerId, subPath);
  }

  public async readFile(workspaceId: string, userId: string, relativePath: string): Promise<string> {
    const workspace = await this.getValidatedWorkspace(workspaceId, userId, true);
    const provider = getWorkspaceProvider();
    const containerId = workspace.containerId || workspace.id;

    return provider.readFile(containerId, relativePath);
  }

  public async writeFile(
    workspaceId: string,
    userId: string,
    relativePath: string,
    content: string
  ): Promise<void> {
    const workspace = await this.getValidatedWorkspace(workspaceId, userId, true);
    const provider = getWorkspaceProvider();
    const containerId = workspace.containerId || workspace.id;

    await provider.writeFile(containerId, relativePath, content);
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: { lastActivityAt: new Date() },
    });
  }

  /**
   * Run Task Automated Test Suite
   */
  public async runTests(workspaceId: string, userId: string): Promise<ExecutionResult & { passed: boolean }> {
    const workspace = await this.getValidatedWorkspace(workspaceId, userId, true);

    let testCommand = "pytest tests/";
    if (workspace.task?.automatedTests) {
      try {
        const parsed = JSON.parse(workspace.task.automatedTests);
        if (parsed.command) testCommand = parsed.command;
      } catch {}
    }

    const [cmd, ...args] = testCommand.split(" ");
    const result = await this.executeCommand(workspaceId, userId, cmd, args);

    const passed = result.exitCode === 0 && !result.timedOut;

    // Record test results to MissionOutcome
    if (workspace.taskId) {
      try {
        await prisma.missionOutcome.upsert({
          where: {
            userId_taskId: {
              userId,
              taskId: workspace.taskId,
            },
          },
          update: {
            testResults: JSON.stringify({
              passed,
              exitCode: result.exitCode,
              stdout: result.stdout?.substring(0, 500),
              stderr: result.stderr?.substring(0, 500),
              durationMs: result.durationMs,
            }),
          },
          create: {
            userId,
            taskId: workspace.taskId,
            status: "IN_PROGRESS",
            testResults: JSON.stringify({
              passed,
              exitCode: result.exitCode,
              stdout: result.stdout?.substring(0, 500),
              stderr: result.stderr?.substring(0, 500),
              durationMs: result.durationMs,
            }),
          },
        });
      } catch (err) {
        console.error("Failed to record test results to mission outcome:", err);
      }
    }

    return { ...result, passed };
  }

  /**
   * Save / Snapshot Work
   */
  public async snapshotWork(
    workspaceId: string,
    userId: string,
    message: string
  ): Promise<{ commitSha: string; timestamp: Date }> {
    const workspace = await this.getValidatedWorkspace(workspaceId, userId, true);
    const provider = getWorkspaceProvider();
    const containerId = workspace.containerId || workspace.id;

    const snapshot = await provider.snapshotWorkspace(containerId, message);
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: { lastActivityAt: new Date() },
    });

    return snapshot;
  }

  /**
   * Submit Work & Preserve Deliverables
   */
  public async submitWork(
    workspaceId: string,
    userId: string,
    submissionData: { studentNotes?: string; branchName?: string }
  ) {
    const workspace = await this.getValidatedWorkspace(workspaceId, userId, true);
    const provider = getWorkspaceProvider();
    const containerId = workspace.containerId || workspace.id;

    if (!workspace.taskId) {
      throw new Error("Cannot submit workspace without an associated Task");
    }

    // 1. Preserve deliverables
    const artifacts = await provider.preserveArtifacts(containerId);

    // 2. Snapshot commit
    const snapshot = await provider.snapshotWorkspace(containerId, "Final Submission");

    // 3. Create Submission record
    const submission = await prisma.submission.create({
      data: {
        taskId: workspace.taskId,
        userId,
        branchName: submissionData.branchName || "feature/solution",
        commitSha: snapshot.commitSha,
        status: "SUBMITTED",
        studentNotes: submissionData.studentNotes || "",
        diffSummary: JSON.stringify(artifacts),
      },
    });

    // 4. Trigger Automated AI Tech Lead Evaluation
    let evaluation = null;
    try {
      evaluation = await evaluationEngine.evaluateSubmission(submission.id, undefined, artifacts);
    } catch (evalErr) {
      console.error("Evaluation error during submitWork:", evalErr);
    }

    // 5. Update MissionOutcome with final outcome and score
    if (workspace.taskId) {
      try {
        const finalScore = evaluation?.score || (submission.status === "APPROVED" ? 90 : 65);
        const finalOutcome = finalScore >= 70 ? "PASSED" : finalScore >= 50 ? "NEEDS_IMPROVEMENT" : "FAILED";

        await prisma.missionOutcome.upsert({
          where: {
            userId_taskId: {
              userId,
              taskId: workspace.taskId,
            },
          },
          update: {
            status: finalOutcome,
            score: finalScore,
            feedback: evaluation?.feedback?.substring(0, 500) || "Completed and evaluated.",
            submissionId: submission.id,
            completedAt: new Date(),
          },
          create: {
            userId,
            taskId: workspace.taskId,
            status: finalOutcome,
            score: finalScore,
            feedback: evaluation?.feedback?.substring(0, 500) || "Completed and evaluated.",
            submissionId: submission.id,
            completedAt: new Date(),
          },
        });
      } catch (outcomeErr) {
        console.error("Failed to update final mission outcome:", outcomeErr);
      }
    }

    // 6. Terminate workspace gracefully
    await this.destroyWorkspace(workspaceId, userId, "SUBMISSION_COMPLETE");

    return {
      submission,
      evaluation,
      artifacts,
    };
  }

  /**
   * Destroy Environment & Release Resources
   */
  public async destroyWorkspace(
    workspaceId: string,
    userId: string,
    reason = "USER_DESTROY"
  ): Promise<{ artifactsPreserved: number }> {
    const workspace = await this.getValidatedWorkspace(workspaceId, userId, false);
    const provider = getWorkspaceProvider();
    const containerId = workspace.containerId || workspace.id;

    if (workspace.status === "Destroyed") {
      return { artifactsPreserved: 0 };
    }

    // Transition status to Stopping
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: { status: "Stopping" },
    });

    // Preserve artifacts prior to destruction
    const artifacts = await provider.preserveArtifacts(containerId);

    // Destroy container / isolated sandbox
    await provider.destroyWorkspace(containerId);

    // Finalize workspace record
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        status: "Destroyed",
        terminatedAt: new Date(),
        terminationReason: reason,
        artifactsStored: JSON.stringify(artifacts),
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: "WORKSPACE_DESTROYED",
        entityType: "Workspace",
        entityId: workspaceId,
        metadata: JSON.stringify({
          reason,
          artifactsCount: artifacts.length,
        }),
      },
    });

    return { artifactsPreserved: artifacts.length };
  }

  /**
   * Automated Idle & Expiry Reaper
   * Destroys inactive or expired workspaces automatically
   */
  public async reapExpiredWorkspaces(): Promise<Array<{ id: string; reason: string }>> {
    const now = new Date();
    const activeWorkspaces = await prisma.workspace.findMany({
      where: {
        status: { in: ["Requested", "Provisioning", "Ready", "Running", "Idle"] },
      },
    });

    const reaped: Array<{ id: string; reason: string }> = [];

    for (const ws of activeWorkspaces) {
      let shouldReap = false;
      let reason = "";

      // Check max runtime
      if (ws.expiresAt && ws.expiresAt < now) {
        shouldReap = true;
        reason = "MAX_RUNTIME_EXCEEDED";
      }

      // Check idle timeout
      const idleMillis = now.getTime() - ws.lastActivityAt.getTime();
      const maxIdleMillis = ws.idleTimeoutMinutes * 60 * 1000;
      if (idleMillis > maxIdleMillis) {
        shouldReap = true;
        reason = "IDLE_TIMEOUT";
      }

      if (shouldReap) {
        try {
          await this.destroyWorkspace(ws.id, ws.userId, reason);
          reaped.push({ id: ws.id, reason });
        } catch (err) {
          // Log and continue
        }
      }
    }

    return reaped;
  }
}

export const workspaceOrchestrator = WorkspaceOrchestrator.getInstance();
