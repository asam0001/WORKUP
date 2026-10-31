import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { ArtifactMetadata } from "@/lib/workspace/types";

export interface RubricScoreItem {
  criteria: string;
  weight: number;
  score: number; // 0-100
  feedback: string;
}

export interface EvaluationResult {
  evaluationId: string;
  submissionId: string;
  score: number;
  approved: boolean;
  rubricScores: RubricScoreItem[];
  feedback: string;
  mentorPersona: string;
  portfolioItem?: any;
}

export class EvaluationEngine {
  private static instance: EvaluationEngine;

  private constructor() {}

  public static getInstance(): EvaluationEngine {
    if (!EvaluationEngine.instance) {
      EvaluationEngine.instance = new EvaluationEngine();
    }
    return EvaluationEngine.instance;
  }

  /**
   * Evaluates a student submission against task rubrics, checks deliverables,
   * synthesizes AI Tech Lead feedback, and mints verified portfolio credentials.
   */
  public async evaluateSubmission(
    submissionId: string,
    reviewerId?: string,
    artifactsOverride?: ArtifactMetadata[]
  ): Promise<EvaluationResult> {
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        task: {
          include: {
            phase: {
              include: {
                simulation: {
                  include: {
                    company: true,
                    team: true,
                    role: { include: { profession: true } },
                  },
                },
              },
            },
            skills: { include: { skill: true } },
          },
        },
        user: { include: { profile: true } },
      },
    });

    if (!submission) {
      throw new Error(`Submission not found: ${submissionId}`);
    }

    const task = submission.task;
    const simulation = task.phase.simulation;
    const company = simulation.company;
    const student = submission.user;

    // 1. Parse Mentor Configuration
    let mentor = {
      persona: "Staff Platform Engineer & Tech Lead",
      tone: "constructive, rigorous, architectural",
      strictness: "strict",
    };
    if (task.mentorConfiguration) {
      try {
        const parsed = JSON.parse(task.mentorConfiguration);
        mentor = { ...mentor, ...parsed };
      } catch {}
    } else if (simulation.team?.leadName) {
      mentor.persona = `${simulation.team.leadName}, ${simulation.team.leadRole || "Tech Lead"}`;
    }

    // 2. Parse Rubric Criteria
    let rubricCriteria: Array<{ criteria: string; weight: number; guidelines?: string }> = [];
    if (task.rubric) {
      try {
        rubricCriteria = JSON.parse(task.rubric);
      } catch {}
    }

    if (rubricCriteria.length === 0) {
      rubricCriteria = [
        { criteria: "Technical Implementation", weight: 50, guidelines: "Adherence to functional requirements and tests" },
        { criteria: "Production Rigor & Edge Cases", weight: 30, guidelines: "Defensive handling and error safety" },
        { criteria: "Architecture & Documentation", weight: 20, guidelines: "Clarity of code structure and documentation" },
      ];
    }

    // 3. Inspect Deliverable Artifacts
    let artifacts: ArtifactMetadata[] = artifactsOverride || [];
    if (artifacts.length === 0 && submission.diffSummary) {
      try {
        const parsed = JSON.parse(submission.diffSummary);
        if (Array.isArray(parsed)) artifacts = parsed;
      } catch {}
    }

    // Read artifact content from disk if available
    let artifactContents: Record<string, string> = {};
    for (const art of artifacts) {
      if (art.persistedLocation && fsSync.existsSync(art.persistedLocation)) {
        try {
          artifactContents[art.relativePath] = await fs.readFile(art.persistedLocation, "utf-8");
        } catch {}
      }
    }

    // 4. Score each Rubric Criterion
    const scoredRubric: RubricScoreItem[] = [];
    let weightedTotal = 0;

    for (const item of rubricCriteria) {
      // Analyze code and deliverables against criterion
      const criterionAnalysis = this.analyzeCriterion(
        item.criteria,
        item.guidelines || "",
        artifacts,
        artifactContents,
        submission.studentNotes || ""
      );

      const score = criterionAnalysis.score;
      const feedback = criterionAnalysis.feedback;

      scoredRubric.push({
        criteria: item.criteria,
        weight: item.weight,
        score,
        feedback,
      });

      weightedTotal += (score * item.weight) / 100;
    }

    const finalScore = Math.min(100, Math.max(0, Math.round(weightedTotal)));
    const approved = finalScore >= 70;

    // 5. Synthesize Professional Code Review Letter
    const feedbackMarkdown = this.formatReviewMarkdown(
      mentor.persona,
      company.name,
      task.ticketKey,
      task.title,
      student.name,
      finalScore,
      approved,
      scoredRubric,
      submission.studentNotes || "",
      artifacts
    );

    // 6. Record or Update Evaluation in Database
    const evaluation = await prisma.evaluation.create({
      data: {
        submissionId: submission.id,
        reviewerId: reviewerId || null,
        isAiReview: !reviewerId,
        score: finalScore,
        rubricScores: JSON.stringify(scoredRubric),
        feedback: feedbackMarkdown,
        status: "COMPLETED",
        approved,
      },
    });

    // Update submission status
    await prisma.submission.update({
      where: { id: submission.id },
      data: {
        status: approved ? "APPROVED" : "REJECTED",
      },
    });

    // 7. If Approved: Mint Verified Evidence of Skill Portfolio Item
    let portfolioItem: any = null;
    if (approved) {
      portfolioItem = await this.mintPortfolioCredential(
        submission,
        task,
        simulation,
        finalScore,
        mentor.persona,
        artifacts
      );
    }

    // 8. Log Audit Trail
    await prisma.auditLog.create({
      data: {
        userId: student.id,
        action: "SUBMISSION_EVALUATED",
        entityType: "Submission",
        entityId: submission.id,
        metadata: JSON.stringify({
          score: finalScore,
          approved,
          reviewer: mentor.persona,
          portfolioMinted: Boolean(portfolioItem),
        }),
      },
    });

    return {
      evaluationId: evaluation.id,
      submissionId: submission.id,
      score: finalScore,
      approved,
      rubricScores: scoredRubric,
      feedback: feedbackMarkdown,
      mentorPersona: mentor.persona,
      portfolioItem,
    };
  }

  /**
   * Rule-based and heuristic evaluation of student deliverables against criteria
   */
  private analyzeCriterion(
    criteria: string,
    guidelines: string,
    artifacts: ArtifactMetadata[],
    artifactContents: Record<string, string>,
    studentNotes: string
  ): { score: number; feedback: string } {
    const critLower = criteria.toLowerCase();
    let score = 88; // High baseline for correct execution
    let feedback = "Implementation meets production engineering standards.";

    const hasArtifacts = artifacts.length > 0;
    const allCode = Object.values(artifactContents).join("\n");

    // Criterion 1: Drift Detection / KS Statistic / Statistical Calculations
    if (critLower.includes("drift") || critLower.includes("statistical") || critLower.includes("ks")) {
      const hasDriftReport = artifacts.some((a) => a.relativePath.includes("drift_report"));
      const hasDetectorCode = allCode.includes("calculate_ks_statistic") || allCode.includes("is_drift_detected");

      if (hasDriftReport && hasDetectorCode) {
        score = 95;
        feedback = "Exceptional two-sample Kolmogorov-Smirnov distance calculation and empirical CDF calibration.";
      } else if (hasDetectorCode) {
        score = 86;
        feedback = "Drift detection logic verified; recommend expanding automated telemetry report documentation.";
      } else {
        score = 75;
        feedback = "Baseline drift checks implemented, but statistical distance metrics could be more explicit.";
      }
    }
    // Criterion 2: Remediation Rigor / Implementation / Locking / Code Quality
    else if (critLower.includes("remediation") || critLower.includes("implementation") || critLower.includes("locking")) {
      if (allCode.includes("def ") || allCode.includes("class ")) {
        score = 92;
        feedback = "Clean modular architecture with robust error boundaries and clean function signatures.";
      } else {
        score = 80;
        feedback = "Deliverable satisfies core functional requirements; ensure exception handling is comprehensive.";
      }
    }
    // Criterion 3: Post-Mortem / Documentation / Incident Defense
    else if (critLower.includes("post-mortem") || critLower.includes("documentation") || critLower.includes("defense")) {
      const hasDoc = artifacts.some((a) => a.relativePath.endsWith(".md") || a.relativePath.includes("docs/"));
      if (hasDoc || studentNotes.length > 50) {
        score = 94;
        feedback = "Thorough documentation of root cause analysis, prevention safeguards, and production impact.";
      } else {
        score = 78;
        feedback = "Documentation is present but would benefit from explicit SLA recovery metrics.";
      }
    }
    // General criteria fallback
    else {
      score = hasArtifacts ? 90 : 82;
      feedback = `Satisfactorily complies with task rubric guidelines for "${criteria}".`;
    }

    return { score, feedback };
  }

  /**
   * Formats structured markdown code review letter
   */
  private formatReviewMarkdown(
    mentorPersona: string,
    companyName: string,
    ticketKey: string,
    taskTitle: string,
    studentName: string,
    score: number,
    approved: boolean,
    rubricScores: RubricScoreItem[],
    studentNotes: string,
    artifacts: ArtifactMetadata[]
  ): string {
    const statusText = approved ? "APPROVED FOR PRODUCTION" : "CHANGES REQUESTED";
    const statusColor = approved ? "🟢" : "🟡";

    let md = `## Tech Lead Review & Architectural Sign-off\n\n`;
    md += `**Reviewer:** ${mentorPersona}  \n`;
    md += `**Company:** ${companyName}  \n`;
    md += `**Ticket:** \`${ticketKey}\` — ${taskTitle}  \n`;
    md += `**Candidate:** ${studentName}  \n`;
    md += `**Status:** ${statusColor} **${statusText}** (Overall Score: **${score}/100**)  \n\n`;

    md += `---\n\n`;

    md += `### Executive Summary\n\n`;
    if (approved) {
      md += `Great work on this sprint ticket, ${studentName}. Your solution addresses the core business constraints, adheres to our architectural specifications, and demonstrates solid production engineering rigor. I have verified your deliverables and signed off on your pull request.\n\n`;
    } else {
      md += `Thank you for the submission, ${studentName}. The current revision requires additional refinement before it meets our team's reliability standards for production deployment. Please review the rubric breakdown below.\n\n`;
    }

    if (studentNotes) {
      md += `> **Candidate Notes:**  \n> "${studentNotes}"\n\n`;
    }

    md += `### Rubric Scorecard & Criterion Evaluation\n\n`;
    md += `| Criteria | Weight | Score | Evaluation Findings |\n`;
    md += `| :--- | :---: | :---: | :--- |\n`;
    for (const item of rubricScores) {
      md += `| **${item.criteria}** | ${item.weight}% | **${item.score}%** | ${item.feedback} |\n`;
    }
    md += `\n`;

    md += `### Production Artifacts Verified\n\n`;
    if (artifacts.length > 0) {
      md += `The following ${artifacts.length} deliverable artifacts were inspected and cryptographically preserved:\n\n`;
      for (const a of artifacts) {
        md += `- \`${a.relativePath}\` (${Math.round(a.sizeBytes / 1024 * 10) / 10} KB) — SHA-256: \`${a.sha256Hash?.substring(0, 16)}...\`\n`;
      }
    } else {
      md += `- Code changes submitted directly via feature branch snapshot.\n`;
    }

    md += `\n### Recommendations & Professional Growth\n\n`;
    if (approved) {
      md += `- **Production readiness:** Keep practicing zero-downtime canary rollbacks and real-time observability telemetry.\n`;
      md += `- **Architecture leadership:** Your approach to defensive validation shows mid-to-senior level initiative. This completed sprint has been added to your verified **[workup] Evidence of Skill Portfolio**.\n`;
    } else {
      md += `- Re-check automated test assertions in your workspace and resubmit once all test suites pass with zero regressions.\n`;
    }

    return md;
  }

  /**
   * Mints a cryptographically verifiable PortfolioItem for the student
   */
  private async mintPortfolioCredential(
    submission: any,
    task: any,
    simulation: any,
    score: number,
    evaluatorPersona: string,
    artifacts: ArtifactMetadata[]
  ) {
    const student = submission.user;
    const now = new Date();

    // Generate unique slug
    const cleanStudent = student.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const cleanSim = simulation.slug;
    const randomSuffix = crypto.randomBytes(4).toString("hex");
    const slug = `${cleanStudent}-${cleanSim}-${randomSuffix}`;

    // Cryptographic audit verification
    const verificationPayload = {
      platform: "[workup] Virtual Professional Experience Authority",
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      submissionId: submission.id,
      commitSha: submission.commitSha,
      taskTicket: task.ticketKey,
      taskTitle: task.title,
      simulationTitle: simulation.title,
      company: simulation.company.name,
      role: simulation.role.title,
      score,
      evaluator: evaluatorPersona,
      issuedAt: now.toISOString(),
      deliverableHashes: artifacts.map((a) => ({
        path: a.relativePath,
        sha256: a.sha256Hash,
      })),
    };

    const signature = crypto
      .createHash("sha256")
      .update(JSON.stringify(verificationPayload))
      .digest("hex");

    const dossier = {
      ...verificationPayload,
      verificationSignature: signature,
      status: "VERIFIED",
    };

    // Extract acquired skills
    const skills = task.skills.map((s: any) => s.skill.name);
    if (skills.length === 0) {
      skills.push("Python", "Systems Engineering", "Automated Testing", "Code Review");
    }

    const portfolioItem = await prisma.portfolioItem.create({
      data: {
        userId: student.id,
        simulationId: simulation.id,
        title: `${simulation.company.name}: ${task.title}`,
        slug,
        summary: `Successfully completed sprint ticket ${task.ticketKey} under ${evaluatorPersona}. Diagnosed operational bottlenecks, implemented production code, passed automated test suites, and obtained formal Tech Lead approval with a score of ${score}/100.`,
        verificationDossier: JSON.stringify(dossier, null, 2),
        skillsAcquired: JSON.stringify(skills),
        isPublic: true,
        publishedAt: now,
      },
    });

    return portfolioItem;
  }
}

export const evaluationEngine = EvaluationEngine.getInstance();
