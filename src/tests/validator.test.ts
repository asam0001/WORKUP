import { describe, it, expect } from "vitest";
import { validateTask } from "@/lib/validation/task-validator";
import { prisma } from "@/lib/prisma";

describe("Content Engine Task Validator", () => {
  it("should validate a complete and properly formed task", async () => {
    const validTask = {
      phaseId: "test-phase-id",
      ticketKey: "TEST-101",
      title: "Implement Model Registry Governance Webhook",
      objective: "Build and deploy an automated webhook verifying MLflow artifact signatures prior to production registry promotion.",
      businessContext: "OmniRetail requires strict automated governance to ensure unvalidated models do not inadvertently serve live checkout traffic.",
      requirements: [
        "Create FastAPI webhook listening to MLflow transition events",
        "Verify model test accuracy threshold exceeds 0.94",
        "Reject model transition if signature is missing",
      ],
      completionCriteria: [
        "Automated pytest test suite passes with 100% coverage",
        "MLflow model transition responds with HTTP 200",
      ],
      deliverables: [
        "FastAPI router implementation in src/governance/webhook.py",
        "Integration test suite in tests/test_governance.py",
      ],
      rubric: [
        { criteria: "Signature Verification", weight: 50, guidelines: "Ensures cryptographic or artifact hash integrity" },
        { criteria: "Test Suite Rigor", weight: 50, guidelines: "Covers both approved and rejected model transitions" },
      ],
      tools: ["MLflow", "FastAPI", "pytest", "Docker"],
      environmentConfiguration: {
        runtime: "python:3.12",
        memory: "4Gi",
      },
      startingState: {
        templateRepoUrl: "https://github.com/workup-simulations/mlflow-governance",
      },
      automatedTests: {
        command: "pytest tests/test_governance.py",
      },
    };

    const report = await validateTask(validTask);

    expect(report.isValid).toBe(true);
    expect(report.errors.length).toBe(0);
    expect(report.score).toBeGreaterThanOrEqual(80);
    expect(report.checksPassed).toContain("Rubric weights total 100%");
  });

  it("should flag missing required core fields", async () => {
    const incompleteTask = {
      phaseId: "test-phase-id",
      ticketKey: "BAD", // invalid format
      title: "Bad",     // too short (< 5 chars)
      objective: "Short", // too short (< 15 chars)
      businessContext: "Too short", // too short (< 30 chars)
      requirements: [], // empty
      completionCriteria: [], // empty
      deliverables: [], // empty
    };

    const report = await validateTask(incompleteTask);

    expect(report.isValid).toBe(false);
    expect(report.errors.some((e) => e.field === "title")).toBe(true);
    expect(report.errors.some((e) => e.field === "objective")).toBe(true);
    expect(report.errors.some((e) => e.field === "businessContext")).toBe(true);
    expect(report.errors.some((e) => e.field === "requirements")).toBe(true);
    expect(report.errors.some((e) => e.field === "completionCriteria")).toBe(true);
    expect(report.errors.some((e) => e.field === "deliverables")).toBe(true);
    expect(report.warnings.some((w) => w.field === "ticketKey")).toBe(true);
  });

  it("should warn when rubric weights do not equal 100%", async () => {
    const taskWithBadRubric = {
      phaseId: "test-phase-id",
      ticketKey: "RUB-101",
      title: "Evaluate Drift Detector Sensitivity",
      objective: "Tune the Kolmogorov-Smirnov p-value threshold for continuous feature drift monitoring.",
      businessContext: "Reducing false positive drift alerts prevents unnecessary model retrain pipelines and reduces cloud GPU compute costs.",
      requirements: ["Set threshold to 0.05", "Validate on test dataset"],
      completionCriteria: ["All test cases pass"],
      deliverables: ["drift_config.yaml"],
      rubric: [
        { criteria: "Statistical Calibration", weight: 40 },
        { criteria: "Documentation", weight: 30 },
        // Sum is 70% instead of 100%
      ],
    };

    const report = await validateTask(taskWithBadRubric);

    expect(report.warnings.some((w) => w.field === "rubric.weight")).toBe(true);
  });

  it("should warn when environment memory unit does not use Kubernetes format", async () => {
    const taskWithBadMemory = {
      phaseId: "test-phase-id",
      ticketKey: "ENV-101",
      title: "Containerize Ingestion Microservice",
      objective: "Package the data ingestion pipeline into an OCI container image with minimal layer size.",
      businessContext: "Standardizing our runner environments ensures consistent simulation reproducibility across all cloud labs.",
      requirements: ["Create Dockerfile", "Minimize layer cache"],
      completionCriteria: ["Container builds successfully"],
      deliverables: ["Dockerfile"],
      rubric: [{ criteria: "Dockerfile Quality", weight: 100 }],
      environmentConfiguration: {
        runtime: "python:3.12",
        memory: "2048MB", // Invalid format (should be 2Gi)
      },
    };

    const report = await validateTask(taskWithBadMemory);

    expect(report.warnings.some((w) => w.field === "environmentConfiguration.memory")).toBe(true);
  });

  it("should catch self-referencing dependency cycles", async () => {
    const selfCycleTask = {
      id: "task-uuid-1234",
      phaseId: "test-phase-id",
      ticketKey: "CYC-101",
      title: "Self-Referencing Task Simulation",
      objective: "Demonstrate that the validator catches self-referencing dependency cycles.",
      businessContext: "Tasks cannot depend on their own completion as that creates an impossible resolution loop.",
      requirements: ["Ensure acyclic DAG"],
      completionCriteria: ["DAG is validated"],
      deliverables: ["DAG graph"],
      rubric: [{ criteria: "Graph Integrity", weight: 100 }],
      dependencies: [
        { dependsOnTaskId: "task-uuid-1234" }, // Self reference
      ],
    };

    const report = await validateTask(selfCycleTask);

    expect(report.isValid).toBe(false);
    expect(report.errors.some((e) => e.field === "dependencies" && e.message.includes("self-referencing"))).toBe(true);
  });

  it("should detect circular dependency cycles in existing database graph", async () => {
    // Look up an existing task from seed (e.g., ML-101 and ML-102)
    const task1 = await prisma.task.findFirst({ where: { ticketKey: "ML-101" } });
    const task2 = await prisma.task.findFirst({ where: { ticketKey: "ML-102" } });

    expect(task1).toBeDefined();
    expect(task2).toBeDefined();

    // In seed, ML-102 depends on ML-101 (ML-102 -> ML-101)
    // If we test validating ML-101 with a dependency on ML-102, it would create a cycle (ML-101 -> ML-102 -> ML-101)
    const cyclicTask = {
      id: task1!.id,
      phaseId: task1!.phaseId,
      ticketKey: task1!.ticketKey,
      title: task1!.title,
      objective: task1!.objective,
      businessContext: task1!.businessContext,
      requirements: ["Test cycle"],
      completionCriteria: ["Test cycle"],
      deliverables: ["Test deliverable"],
      rubric: [{ criteria: "Cycle Check", weight: 100 }],
      dependencies: [
        { dependsOnTaskId: task2!.id }, // Causes cycle because ML-102 already depends on ML-101!
      ],
    };

    const report = await validateTask(cyclicTask);

    expect(report.isValid).toBe(false);
    expect(report.errors.some((e) => e.field === "dependencies.cycle")).toBe(true);
  });
});
