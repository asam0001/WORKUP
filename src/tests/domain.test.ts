import { describe, it, expect } from "vitest";
import { prisma } from "@/lib/prisma";

describe("Domain Model & Entities Integrity", () => {
  it("should contain seeded professions with roles and simulations", async () => {
    const professions = await prisma.profession.findMany({
      include: {
        roles: {
          include: {
            simulations: true,
          },
        },
      },
    });

    expect(professions.length).toBeGreaterThanOrEqual(2);

    const swe = professions.find((p) => p.slug === "software-engineering");
    expect(swe).toBeDefined();
    expect(swe?.roles.length).toBeGreaterThanOrEqual(1);

    const ml = professions.find((p) => p.slug === "machine-learning-engineering");
    expect(ml).toBeDefined();
    expect(ml?.roles.length).toBeGreaterThanOrEqual(1);
  });

  it("should have simulations with phases, tasks, and task dependencies", async () => {
    const simulation = await prisma.simulation.findFirst({
      where: { slug: "payment-webhook-idempotency-and-optimization" },
      include: {
        company: true,
        team: true,
        phases: {
          include: {
            tasks: {
              include: {
                dependencies: true,
              },
            },
          },
        },
      },
    });

    expect(simulation).toBeDefined();
    expect(simulation?.company.slug).toBe("finflow");
    expect(simulation?.team.leadName).toBe("Sarah Chen");
    expect(simulation?.phases.length).toBeGreaterThanOrEqual(1);

    const tasks = simulation?.phases[0]?.tasks || [];
    expect(tasks.length).toBeGreaterThanOrEqual(2);

    // Verify task dependency structure
    const task2 = tasks.find((t) => t.ticketKey === "FF-105");
    expect(task2?.dependencies.length).toBe(1);
  });

  it("should verify the flagship ML Engineer simulation has 3 phases and 6 tasks", async () => {
    const mlSim = await prisma.simulation.findFirst({
      where: { slug: "fraud-detection-drift-mitigation-and-registry-governance" },
      include: {
        phases: {
          include: {
            tasks: true,
          },
        },
      },
    });

    expect(mlSim).toBeDefined();
    expect(mlSim?.phases.length).toBe(3);
    const totalTasks = mlSim?.phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
    expect(totalTasks).toBeGreaterThanOrEqual(6);
  });

  it("should have seeded user accounts for all 4 supported roles", async () => {
    const roles = ["student", "administrator", "content_author", "reviewer"];

    for (const role of roles) {
      const user = await prisma.user.findFirst({
        where: { role },
      });
      expect(user).toBeDefined();
      expect(user?.role).toBe(role);
    }
  });

  it("should enforce unique email constraints on users", async () => {
    await expect(
      prisma.user.create({
        data: {
          email: "student@workup.dev",
          name: "Duplicate User",
          passwordHash: "dummyhash",
        },
      })
    ).rejects.toThrow();
  });
});
