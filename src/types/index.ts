import { z } from "zod";

// Roles enum
export const UserRoleSchema = z.enum(["student", "content_author", "reviewer", "administrator"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

// User status enum
export const UserStatusSchema = z.enum(["active", "suspended"]);
export type UserStatus = z.infer<typeof UserStatusSchema>;

// Experience level enum
export const ExperienceLevelSchema = z.enum(["beginner", "intermediate", "advanced"]);
export type ExperienceLevel = z.infer<typeof ExperienceLevelSchema>;

// Role level enum
export const RoleLevelSchema = z.enum(["junior", "mid", "senior", "lead", "principal"]);
export type RoleLevel = z.infer<typeof RoleLevelSchema>;

// Task type enum
export const TaskTypeSchema = z.enum([
  "INVESTIGATION",
  "IMPLEMENTATION",
  "TESTING",
  "CODE_REVIEW",
  "DEPLOYMENT",
  "MONITORING_INCIDENT",
]);
export type TaskType = z.infer<typeof TaskTypeSchema>;

// Difficulty scale (based on ambiguity, complexity, constraints and assistance)
export const DifficultyLevelSchema = z.enum([
  "Guided",
  "Assisted",
  "Independent",
  "Production simulation",
  "Ownership",
]);
export type DifficultyLevel = z.infer<typeof DifficultyLevelSchema>;

// Lifecycle status enum
export const LifecycleStatusSchema = z.enum([
  "draft",
  "review",
  "approved",
  "published",
  "archived",
]);
export type LifecycleStatus = z.infer<typeof LifecycleStatusSchema>;

// Task dependency types
export const DependencyTypeSchema = z.enum([
  "PREREQUISITE",
  "SEQUENTIAL",
  "BRANCHING",
  "OPTIONAL",
]);
export type DependencyType = z.infer<typeof DependencyTypeSchema>;

// Workspace status enum (Requested -> Provisioning -> Ready -> Running -> Idle -> Stopping -> Destroyed)
export const WorkspaceStatusSchema = z.enum([
  "Requested",
  "Provisioning",
  "Ready",
  "Running",
  "Idle",
  "Stopping",
  "Destroyed",
]);
export type WorkspaceStatus = z.infer<typeof WorkspaceStatusSchema>;

// Submission status enum
export const SubmissionStatusSchema = z.enum(["DRAFT", "SUBMITTED", "IN_REVIEW", "APPROVED", "REJECTED"]);
export type SubmissionStatus = z.infer<typeof SubmissionStatusSchema>;

// Evaluation status enum
export const EvaluationStatusSchema = z.enum(["PENDING", "COMPLETED"]);
export type EvaluationStatus = z.infer<typeof EvaluationStatusSchema>;

// Rich Task Validation Schema
export const TaskCreateInputSchema = z.object({
  phaseId: z.string().min(1, "Phase is required"),
  professionId: z.string().optional(),
  roleId: z.string().optional(),
  companyId: z.string().optional(),
  ticketKey: z.string().min(2, "Ticket key is required (e.g. ML-101)").max(20),
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z.string().min(3).max(200),
  orderIndex: z.number().int().default(0),
  type: TaskTypeSchema.default("IMPLEMENTATION"),
  difficulty: DifficultyLevelSchema.default("Production simulation"),
  businessContext: z.string().min(10, "Business context must be provided"),
  objective: z.string().min(10, "Objective must be provided"),
  prerequisites: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  environmentConfiguration: z
    .object({
      runtime: z.string().default("python:3.12"),
      baseImage: z.string().default("ghcr.io/workup/devcontainer-base:latest"),
      cpu: z.string().default("1.0"),
      memory: z.string().default("2Gi"),
      ports: z.array(z.number()).default([3000, 8000]),
      services: z.array(z.string()).default([]),
      envVars: z.record(z.string()).default({}),
    })
    .default({}),
  startingState: z
    .object({
      repositoryBranch: z.string().default("main"),
      templateRepoUrl: z.string().default("https://github.com/workup-simulations/template"),
      seedDataFiles: z.array(z.string()).default([]),
      dirtyStateDescription: z.string().default(""),
    })
    .default({}),
  requirements: z.array(z.string()).min(1, "At least one requirement is required"),
  constraints: z.array(z.string()).default([]),
  deliverables: z.array(z.string()).min(1, "At least one deliverable is required"),
  automatedTests: z
    .object({
      command: z.string().default("pytest tests/"),
      testFiles: z.array(z.string()).default(["tests/test_solution.py"]),
      timeoutSec: z.number().int().default(60),
    })
    .default({}),
  hiddenTests: z
    .object({
      evaluationSuite: z.string().default("tests/evaluation/test_hidden_rubric.py"),
      benchmarks: z.record(z.any()).default({}),
    })
    .default({}),
  rubric: z
    .array(
      z.object({
        criteria: z.string().min(1),
        weight: z.number().min(1).max(100),
        guidelines: z.string().min(1),
      })
    )
    .min(1, "At least one rubric criteria is required"),
  mentorConfiguration: z
    .object({
      persona: z.string().default("Staff Engineer & Tech Lead"),
      tone: z.string().default("constructive, rigorous, architectural"),
      strictness: z.enum(["lenient", "moderate", "strict", "pedantic"]).default("strict"),
      allowableHints: z.number().int().default(3),
    })
    .default({}),
  failureScenarios: z
    .array(
      z.object({
        trigger: z.string(),
        alertChannel: z.string().default("#alerts-production"),
        expectedResolution: z.string(),
      })
    )
    .default([]),
  completionCriteria: z.array(z.string()).min(1, "At least one completion criterion is required"),
  portfolioEvidence: z
    .object({
      artifactType: z.string().default("Git Pull Request + Test Evidence"),
      title: z.string().default(""),
      verificationCriteria: z.array(z.string()).default([]),
    })
    .default({}),
  status: LifecycleStatusSchema.default("draft"),
  estimatedMinutes: z.number().int().default(45),
  skillIds: z.array(z.string()).default([]),
  dependencies: z
    .array(
      z.object({
        dependsOnTaskId: z.string(),
        dependencyType: DependencyTypeSchema.default("PREREQUISITE"),
        unlockCondition: z.record(z.any()).optional(),
        completionCondition: z.record(z.any()).optional(),
      })
    )
    .default([]),
});
export type TaskCreateInput = z.infer<typeof TaskCreateInputSchema>;

// Simulation creation schema
export const SimulationCreateInputSchema = z.object({
  roleId: z.string().min(1, "Role is required"),
  companyId: z.string().min(1, "Company is required"),
  teamId: z.string().min(1, "Team is required"),
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200),
  summary: z.string().min(10),
  businessScenario: z.string().min(20),
  difficulty: DifficultyLevelSchema.default("Production simulation"),
  estimatedHours: z.number().int().default(4),
  prerequisiteKnowledge: z.array(z.string()).default([]),
  status: LifecycleStatusSchema.default("draft"),
  version: z.string().default("1.0.0"),
});
export type SimulationCreateInput = z.infer<typeof SimulationCreateInputSchema>;

// Auth request schemas
export const RegisterInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: UserRoleSchema.default("student"),
});
export type RegisterInput = z.infer<typeof RegisterInputSchema>;

export const LoginInputSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof LoginInputSchema>;

export const ForgotPasswordInputSchema = z.object({
  email: z.string().email("Invalid email address"),
});
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordInputSchema>;

export const ResetPasswordInputSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});
export type ResetPasswordInput = z.infer<typeof ResetPasswordInputSchema>;

export const UpdateProfileInputSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  headline: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  experienceLevel: ExperienceLevelSchema.optional(),
  githubUsername: z.string().max(100).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  portfolioWebsite: z.string().url().optional().or(z.literal("")),
});
export type UpdateProfileInput = z.infer<typeof UpdateProfileInputSchema>;

// Session token payload
export interface SessionPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
  sessionId: string;
}

// Workspace lifecycle and orchestration schemas
export const WorkspaceProvisionInputSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  simulationId: z.string().min(1, "Simulation ID is required"),
});
export type WorkspaceProvisionInput = z.infer<typeof WorkspaceProvisionInputSchema>;

export const WorkspaceExecuteInputSchema = z.object({
  command: z.string().min(1, "Command is required"),
  args: z.array(z.string()).default([]),
  env: z.record(z.string()).default({}),
});
export type WorkspaceExecuteInput = z.infer<typeof WorkspaceExecuteInputSchema>;

export const WorkspaceFileInputSchema = z.object({
  path: z.string().min(1, "Path is required"),
  content: z.string(),
});
export type WorkspaceFileInput = z.infer<typeof WorkspaceFileInputSchema>;

export const WorkspaceSubmitInputSchema = z.object({
  studentNotes: z.string().default(""),
  branchName: z.string().default("feature/solution"),
});
export type WorkspaceSubmitInput = z.infer<typeof WorkspaceSubmitInputSchema>;

