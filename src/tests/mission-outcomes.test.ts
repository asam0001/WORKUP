import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";

describe("Mission Outcome Tracking & Author Analytics", () => {
  let testUser: any;
  let testAuthor: any;
  let testTask: any;

  beforeAll(async () => {
    testUser = await prisma.user.create({
      data: {
        email: `student-outcome-${Date.now()}@test.dev`,
        name: "Test Outcome Student",
        passwordHash: "hash123",
        role: "student",
      },
    });

    testAuthor = await prisma.user.create({
      data: {
        email: `author-outcome-${Date.now()}@test.dev`,
        name: "Dr. Test Author",
        passwordHash: "hash123",
        role: "content_author",
      },
    });

    const profession = await prisma.profession.findFirst();
    const phase = await prisma.phase.findFirst();

    testTask = await prisma.task.create({
      data: {
        phaseId: phase!.id,
        professionId: profession!.id,
        authorId: testAuthor.id,
        ticketKey: "TEST-001",
        title: "Test Author Task",
        slug: `test-author-task-${Date.now()}`,
        type: "IMPLEMENTATION",
        difficulty: "Beginner",
        businessContext: "Testing mission outcomes.",
        objective: "Verify outcome persistence.",
      },
    });
  });

  afterAll(async () => {
    try {
      await prisma.missionOutcome.deleteMany({ where: { userId: testUser.id } });
      await prisma.task.delete({ where: { id: testTask.id } });
      await prisma.user.delete({ where: { id: testUser.id } });
      await prisma.user.delete({ where: { id: testAuthor.id } });
    } catch {}
  });

  it("should create and track a mission outcome record in IN_PROGRESS state", async () => {
    const outcome = await prisma.missionOutcome.create({
      data: {
        userId: testUser.id,
        taskId: testTask.id,
        status: "IN_PROGRESS",
      },
      include: {
        user: true,
        task: true,
      },
    });

    expect(outcome.userId).toBe(testUser.id);
    expect(outcome.taskId).toBe(testTask.id);
    expect(outcome.status).toBe("IN_PROGRESS");
    expect(outcome.task.ticketKey).toBe("TEST-001");
  });

  it("should update outcome status to PASSED with score and test results upon completion", async () => {
    const updated = await prisma.missionOutcome.update({
      where: {
        userId_taskId: {
          userId: testUser.id,
          taskId: testTask.id,
        },
      },
      data: {
        status: "PASSED",
        score: 92,
        testResults: JSON.stringify({ passed: true, total: 5, passedTests: 5 }),
        feedback: "Great job! All criteria satisfied.",
        completedAt: new Date(),
      },
    });

    expect(updated.status).toBe("PASSED");
    expect(updated.score).toBe(92);
    expect(updated.completedAt).not.toBeNull();
    expect(updated.feedback).toContain("Great job");
  });

  it("should allow authors to query outcomes strictly for tasks they authored", async () => {
    // Querying outcomes as testAuthor (should find 1 outcome)
    const authorOutcomes = await prisma.missionOutcome.findMany({
      where: {
        task: {
          authorId: testAuthor.id,
        },
      },
    });

    expect(authorOutcomes.length).toBe(1);
    expect(authorOutcomes[0].taskId).toBe(testTask.id);

    // Querying outcomes for a non-author ID (should return 0)
    const otherAuthorOutcomes = await prisma.missionOutcome.findMany({
      where: {
        task: {
          authorId: "non-existent-author-id",
        },
      },
    });

    expect(otherAuthorOutcomes.length).toBe(0);
  });
});
