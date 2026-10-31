import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { prisma } from "@/lib/prisma";
import { evaluationEngine } from "@/lib/evaluation/evaluator";

describe("AI Tech Lead Evaluation & Evidence of Skill Portfolio Engine", () => {
  let studentUser: any;
  let reviewerUser: any;
  let mlTask: any;
  let mlSimulation: any;
  let createdSubmissionId: string;

  beforeEach(async () => {
    studentUser = await prisma.user.findFirst({ where: { email: "student@workup.dev" } });
    reviewerUser = await prisma.user.findFirst({ where: { email: "reviewer@workup.dev" } });
    mlTask = await prisma.task.findFirst({
      where: { ticketKey: "ML-101" },
      include: {
        phase: { include: { simulation: true } },
      },
    });
    mlSimulation = mlTask?.phase?.simulation;

    // Create a mock submission for testing
    const sub = await prisma.submission.create({
      data: {
        taskId: mlTask.id,
        userId: studentUser.id,
        branchName: "feature/ML-101-ks-drift",
        commitSha: "a1b2c3d4e5f678901234567890abcdef12345678",
        status: "SUBMITTED",
        studentNotes: "Implemented two-sample KS distance calculation and documented drift findings in drift_report.md",
        diffSummary: JSON.stringify([
          {
            name: "detector.py",
            relativePath: "src/drift/detector.py",
            sizeBytes: 1450,
            sha256Hash: "d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592",
            persistedLocation: "",
            createdAt: new Date(),
          },
          {
            name: "drift_report.md",
            relativePath: "docs/drift_report.md",
            sizeBytes: 850,
            sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            persistedLocation: "",
            createdAt: new Date(),
          },
        ]),
      },
    });
    createdSubmissionId = sub.id;
  });

  afterEach(async () => {
    // Clean up created submission and related evaluation / portfolio items
    if (createdSubmissionId) {
      await prisma.evaluation.deleteMany({ where: { submissionId: createdSubmissionId } });
      await prisma.submission.delete({ where: { id: createdSubmissionId } }).catch(() => {});
    }
  });

  it("should evaluate a student submission against task rubrics and return structured score and feedback", async () => {
    const result = await evaluationEngine.evaluateSubmission(createdSubmissionId);

    expect(result).toBeDefined();
    expect(result.submissionId).toBe(createdSubmissionId);
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.approved).toBe(true);
    expect(result.rubricScores.length).toBeGreaterThan(0);
    expect(result.feedback).toContain("Tech Lead Review");
    expect(result.mentorPersona).toBeDefined();

    // Verify database record updated
    const dbSub = await prisma.submission.findUnique({
      where: { id: createdSubmissionId },
      include: { evaluations: true },
    });
    expect(dbSub?.status).toBe("APPROVED");
    expect(dbSub?.evaluations.length).toBe(1);
    expect(dbSub?.evaluations[0].score).toBe(result.score);
    expect(dbSub?.evaluations[0].approved).toBe(true);
  });

  it("should automatically mint a verified PortfolioItem with cryptographic audit dossier when approved", async () => {
    const result = await evaluationEngine.evaluateSubmission(createdSubmissionId);

    expect(result.portfolioItem).toBeDefined();
    expect(result.portfolioItem.slug).toBeDefined();
    expect(result.portfolioItem.title).toContain("OmniRetail");

    // Verify cryptographic dossier
    const dossier = JSON.parse(result.portfolioItem.verificationDossier);
    expect(dossier.platform).toBe("[workup] Virtual Professional Experience Authority");
    expect(dossier.studentEmail).toBe("student@workup.dev");
    expect(dossier.score).toBe(result.score);
    expect(dossier.verificationSignature).toBeDefined();
    expect(dossier.status).toBe("VERIFIED");
    expect(dossier.deliverableHashes.length).toBe(2);

    // Verify skills acquired
    const skills = JSON.parse(result.portfolioItem.skillsAcquired);
    expect(skills.length).toBeGreaterThan(0);

    // Clean up minted portfolio item
    await prisma.portfolioItem.delete({ where: { id: result.portfolioItem.id } });
  });

  it("should allow a human reviewer to evaluate and sign off on a submission", async () => {
    const result = await evaluationEngine.evaluateSubmission(
      createdSubmissionId,
      reviewerUser.id
    );

    expect(result).toBeDefined();
    const dbEval = await prisma.evaluation.findUnique({
      where: { id: result.evaluationId },
    });
    expect(dbEval?.reviewerId).toBe(reviewerUser.id);
    expect(dbEval?.isAiReview).toBe(false);

    // Clean up minted portfolio item if any
    if (result.portfolioItem) {
      await prisma.portfolioItem.delete({ where: { id: result.portfolioItem.id } });
    }
  });
});
