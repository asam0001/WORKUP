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
export const RoleLevelSchema = z.enum(["junior", "mid", "senior", "lead"]);
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

// Task dependency type
export const DependencyTypeSchema = z.enum(["BLOCKS", "OPTIONAL"]);
export type DependencyType = z.infer<typeof DependencyTypeSchema>;

// Workspace status enum
export const WorkspaceStatusSchema = z.enum(["PENDING", "RUNNING", "PAUSED", "TERMINATED"]);
export type WorkspaceStatus = z.infer<typeof WorkspaceStatusSchema>;

// Submission status enum
export const SubmissionStatusSchema = z.enum(["DRAFT", "SUBMITTED", "IN_REVIEW", "APPROVED", "REJECTED"]);
export type SubmissionStatus = z.infer<typeof SubmissionStatusSchema>;

// Evaluation status enum
export const EvaluationStatusSchema = z.enum(["PENDING", "COMPLETED"]);
export type EvaluationStatus = z.infer<typeof EvaluationStatusSchema>;

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
