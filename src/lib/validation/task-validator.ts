import { prisma } from "@/lib/prisma";

export interface ValidationIssue {
  field: string;
  message: string;
  severity: "ERROR" | "WARNING";
  fixSuggestion?: string;
}

export interface TaskValidationReport {
  taskId?: string;
  ticketKey?: string;
  title?: string;
  isValid: boolean;
  score: number; // 0 - 100
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  checksPassed: string[];
}

export interface TaskToValidate {
  id?: string;
  phaseId: string;
  ticketKey: string;
  title: string;
  objective: string;
  businessContext: string;
  difficulty?: string | null;
  requirements?: string[] | string | null;
  constraints?: string[] | string | null;
  deliverables?: string[] | string | null;
  tools?: string[] | string | null;
  environmentConfiguration?: any;
  startingState?: any;
  automatedTests?: any;
  hiddenTests?: any;
  rubric?: any;
  mentorConfiguration?: any;
  failureScenarios?: any;
  completionCriteria?: string[] | string | null;
  portfolioEvidence?: any;
  dependencies?: Array<{
    dependsOnTaskId: string;
    dependencyType?: string | null;
  }>;
}

/**
 * Validates a task for completeness, environment integrity, evaluation rubrics,
 * and graph dependency cycles before it can be approved or published.
 */
export async function validateTask(task: TaskToValidate): Promise<TaskValidationReport> {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const checksPassed: string[] = [];

  // Helper to parse JSON if string
  const parseJson = (val: any, fallback: any) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return fallback;
      }
    }
    return val ?? fallback;
  };

  const requirements = parseJson(task.requirements, []);
  const completionCriteria = parseJson(task.completionCriteria, []);
  const deliverables = parseJson(task.deliverables, []);
  const tools = parseJson(task.tools, []);
  const rubric = parseJson(task.rubric, []);
  const envConfig = parseJson(task.environmentConfiguration, {});
  const startingState = parseJson(task.startingState, {});
  const automatedTests = parseJson(task.automatedTests, {});

  // 1. Required Core Fields Check
  if (!task.title || task.title.trim().length < 5) {
    errors.push({
      field: "title",
      message: "Task title must be at least 5 characters long.",
      severity: "ERROR",
      fixSuggestion: "Provide a clear, professional action-oriented title.",
    });
  } else {
    checksPassed.push("Title satisfies length requirements");
  }

  if (!task.ticketKey || !/^[A-Z0-9]{2,8}-\d{1,5}$/.test(task.ticketKey.trim())) {
    warnings.push({
      field: "ticketKey",
      message: `Ticket key "${task.ticketKey}" does not match standard pattern (e.g. ML-101, FF-104).`,
      severity: "WARNING",
      fixSuggestion: "Use a standard ticket prefix followed by a hyphen and number.",
    });
  } else {
    checksPassed.push("Ticket key format is valid");
  }

  if (!task.objective || task.objective.trim().length < 15) {
    errors.push({
      field: "objective",
      message: "Task objective must clearly state the engineering goal (min 15 chars).",
      severity: "ERROR",
      fixSuggestion: "Describe what the engineer is expected to accomplish in this ticket.",
    });
  } else {
    checksPassed.push("Objective clearly defined");
  }

  if (!task.businessContext || task.businessContext.trim().length < 30) {
    errors.push({
      field: "businessContext",
      message: "Business context must explain the company impact and rationale (min 30 chars).",
      severity: "ERROR",
      fixSuggestion: "Include business background, user impact, or financial implications.",
    });
  } else {
    checksPassed.push("Business context thoroughly documented");
  }

  if (!Array.isArray(requirements) || requirements.length === 0) {
    errors.push({
      field: "requirements",
      message: "At least one technical requirement is required.",
      severity: "ERROR",
      fixSuggestion: "List bullet points detailing specifications and functional requirements.",
    });
  } else {
    checksPassed.push(`Requirements specified (${requirements.length} items)`);
  }

  if (!Array.isArray(completionCriteria) || completionCriteria.length === 0) {
    errors.push({
      field: "completionCriteria",
      message: "Completion criteria must be defined so the student knows when the task is done.",
      severity: "ERROR",
      fixSuggestion: "Add test pass conditions, metric targets, or PR status requirements.",
    });
  } else {
    checksPassed.push(`Completion criteria defined (${completionCriteria.length} items)`);
  }

  if (!Array.isArray(deliverables) || deliverables.length === 0) {
    errors.push({
      field: "deliverables",
      message: "At least one deliverable must be specified.",
      severity: "ERROR",
      fixSuggestion: "e.g., 'Git feature branch', 'MLflow experiment run', 'Post-mortem doc'.",
    });
  } else {
    checksPassed.push(`Deliverables defined (${deliverables.length} items)`);
  }

  // 2. Evaluation & Rubric Configuration Check
  if (!Array.isArray(rubric) || rubric.length === 0) {
    errors.push({
      field: "rubric",
      message: "Task must contain an evaluation rubric for the AI Tech Lead and human reviewers.",
      severity: "ERROR",
      fixSuggestion: "Define rubric criteria with weights that sum to 100%.",
    });
  } else {
    const totalWeight = rubric.reduce((sum: number, item: any) => sum + (Number(item.weight) || 0), 0);
    if (totalWeight !== 100) {
      warnings.push({
        field: "rubric.weight",
        message: `Rubric weights sum to ${totalWeight}%, but should ideally equal exactly 100%.`,
        severity: "WARNING",
        fixSuggestion: "Adjust individual criteria weights so the sum equals 100%.",
      });
    } else {
      checksPassed.push("Rubric weights total 100%");
    }
    checksPassed.push(`Evaluation rubric configured with ${rubric.length} criteria`);
  }

  if (!automatedTests || !automatedTests.command || automatedTests.command.trim().length === 0) {
    warnings.push({
      field: "automatedTests.command",
      message: "No automated test command specified.",
      severity: "WARNING",
      fixSuggestion: "Add an automated test command like 'pytest tests/' or 'npm test'.",
    });
  } else {
    checksPassed.push(`Automated test command configured: "${automatedTests.command}"`);
  }

  // 3. Environment Configuration Check
  if (!envConfig || !envConfig.runtime) {
    warnings.push({
      field: "environmentConfiguration.runtime",
      message: "No runtime specified in environment configuration.",
      severity: "WARNING",
      fixSuggestion: "Specify a runtime like 'python:3.12' or 'node:20'.",
    });
  } else {
    checksPassed.push(`Runtime environment: ${envConfig.runtime}`);
  }

  if (envConfig && envConfig.memory && !/^\d+(Mi|Gi)$/.test(envConfig.memory)) {
    warnings.push({
      field: "environmentConfiguration.memory",
      message: "Memory format should use standard Kubernetes units (e.g. '2Gi', '4Gi').",
      severity: "WARNING",
      fixSuggestion: "Change memory setting to '2Gi' or similar.",
    });
  } else if (envConfig?.memory) {
    checksPassed.push(`Resource limits valid (${envConfig.memory} RAM)`);
  }

  // 4. Missing Assets Check
  if (Array.isArray(tools) && tools.length === 0) {
    warnings.push({
      field: "tools",
      message: "No professional tools tagged for this task.",
      severity: "WARNING",
      fixSuggestion: "Tag tools like 'MLflow', 'Docker', 'FastAPI', 'Redis', 'pytest'.",
    });
  } else if (Array.isArray(tools)) {
    checksPassed.push(`Tools tagged: ${tools.join(", ")}`);
  }

  if (!startingState || !startingState.templateRepoUrl) {
    warnings.push({
      field: "startingState.templateRepoUrl",
      message: "No starting template repository URL defined.",
      severity: "WARNING",
      fixSuggestion: "Provide the GitHub or internal repository template link.",
    });
  } else {
    checksPassed.push("Template repository URL configured");
  }

  // 5. Dependency Cycle Detection & Graph Validity
  if (task.dependencies && Array.isArray(task.dependencies) && task.dependencies.length > 0) {
    // Check for self-reference
    for (const dep of task.dependencies) {
      if (task.id && dep.dependsOnTaskId === task.id) {
        errors.push({
          field: "dependencies",
          message: "Task cannot depend on itself (self-referencing cycle).",
          severity: "ERROR",
          fixSuggestion: "Remove the dependency pointing to this task's own ID.",
        });
      }
    }

    // If task exists in DB, perform full DFS cycle detection across the graph
    if (task.id) {
      try {
        const hasCycle = await detectDependencyCycle(task.id, task.dependencies.map((d) => d.dependsOnTaskId));
        if (hasCycle) {
          errors.push({
            field: "dependencies.cycle",
            message: "Circular dependency cycle detected in the task graph.",
            severity: "ERROR",
            fixSuggestion: "Break the cycle by removing recursive prerequisites.",
          });
        } else {
          checksPassed.push("Dependency graph is a valid Directed Acyclic Graph (no cycles)");
        }
      } catch (err) {
        // Fallback if DB check fails
      }
    }
  } else {
    checksPassed.push("No dependency blocking issues");
  }

  const isValid = errors.length === 0;
  // Calculate score out of 100
  const totalChecks = checksPassed.length + errors.length + warnings.length;
  const score = totalChecks > 0 ? Math.round((checksPassed.length / totalChecks) * 100) : 100;

  return {
    taskId: task.id,
    ticketKey: task.ticketKey,
    title: task.title,
    isValid,
    score,
    errors,
    warnings,
    checksPassed,
  };
}

/**
 * Depth-First Search (DFS) to detect circular dependencies in task relationships
 */
async function detectDependencyCycle(
  currentTaskId: string,
  newDependencies: string[],
  visited = new Set<string>()
): Promise<boolean> {
  const queue = [...newDependencies];
  const seen = new Set<string>([currentTaskId]);

  while (queue.length > 0) {
    const nextId = queue.shift()!;
    if (nextId === currentTaskId) {
      return true; // Cycle detected: path leads back to current task
    }

    if (!seen.has(nextId)) {
      seen.add(nextId);
      const upstreamDeps = await prisma.taskDependency.findMany({
        where: { taskId: nextId },
        select: { dependsOnTaskId: true },
      });
      for (const u of upstreamDeps) {
        if (u.dependsOnTaskId === currentTaskId) {
          return true; // Cycle
        }
        if (!seen.has(u.dependsOnTaskId)) {
          queue.push(u.dependsOnTaskId);
        }
      }
    }
  }

  return false;
}
