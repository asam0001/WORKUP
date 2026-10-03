import { describe, it, expect } from "vitest";
import { prisma } from "@/lib/prisma";
import { validateTask } from "@/lib/validation/task-validator";

describe("Admin Content Authoring & Acceptance Criteria", () => {
  it("allows an administrator to create a complete simulation entirely through the database/admin system without code modifications", async () => {
    // 1. Get or Create Career Family
    const careerFamily = await prisma.careerFamily.upsert({
      where: { slug: "cloud-infrastructure-devops" },
      update: {},
      create: {
        name: "Cloud Infrastructure & Site Reliability",
        slug: "cloud-infrastructure-devops",
        description: "High-reliability cloud infrastructure, container orchestration, and automated CI/CD pipelines.",
        icon: "Cloud",
        displayOrder: 3,
      },
    });
    expect(careerFamily.id).toBeDefined();

    // 2. Create Profession
    const profession = await prisma.profession.create({
      data: {
        careerFamilyId: careerFamily.id,
        slug: "site-reliability-engineering-" + Date.now(),
        name: "Site Reliability Engineering",
        category: "Cloud Infrastructure",
        description: "Design fault-tolerant distributed systems and automate incident remediation.",
        icon: "ShieldAlert",
        status: "published",
        isPublished: true,
      },
    });
    expect(profession.id).toBeDefined();

    // 3. Create Role
    const role = await prisma.role.create({
      data: {
        professionId: profession.id,
        slug: "incident-commander-" + Date.now(),
        title: "Site Reliability Engineer / Incident Commander",
        level: "mid",
        summary: "Mitigate production outages, manage SLI/SLO burn rates, and conduct blameless post-mortems.",
        description: "Safeguard 99.999% uptime SLAs across distributed multi-region Kubernetes clusters.",
        marketDemand: "High",
        responsibilities: JSON.stringify([
          "Triage high-severity alerts",
          "Automate chaos engineering experiments",
          "Conduct root cause analysis",
        ]),
        status: "published",
      },
    });
    expect(role.id).toBeDefined();

    // 4. Create Company & Team
    const company = await prisma.company.create({
      data: {
        name: "CloudScale Networks",
        slug: "cloudscale-" + Date.now(),
        industry: "Cloud Infrastructure",
        size: "Series C (180 employees)",
        description: "Global edge CDN and multi-cloud load balancing network.",
        culture: "High ownership, asynchronous incident reviews, automation first.",
        techStack: JSON.stringify(["Go", "Kubernetes", "Prometheus", "Envoy", "Terraform"]),
      },
    });

    const team = await prisma.team.create({
      data: {
        companyId: company.id,
        name: "Core SRE & Resiliency",
        charter: "Protecting global edge proxy latency and zero-downtime traffic failover.",
        leadName: "Elena Rostova",
        leadRole: "Principal SRE Architect",
        slackChannels: JSON.stringify(["#sre-war-room", "#prod-incidents"]),
      },
    });

    // 5. Create Simulation (Lifecycle starts in draft)
    const simulation = await prisma.simulation.create({
      data: {
        roleId: role.id,
        companyId: company.id,
        teamId: team.id,
        slug: "global-edge-outage-failover-" + Date.now(),
        title: "CloudScale: Multi-Region Edge DNS Cascading Outage",
        summary: "Diagnose a BGP route flap triggering cascaded proxy thread pool exhaustion, isolate the unhealthy datacenter, and implement dynamic rate limiting.",
        businessScenario: "Edge traffic from EU-West is failing with 504 Gateway Timeout. Customers are experiencing service degradation.",
        difficulty: "Production simulation",
        estimatedHours: 5,
        prerequisiteKnowledge: JSON.stringify(["HTTP/2", "Envoy Proxy", "Prometheus Metrics"]),
        status: "draft",
        isPublished: false,
        version: "1.0.0",
      },
    });
    expect(simulation.id).toBeDefined();
    expect(simulation.status).toBe("draft");

    // 6. Create Phase
    const phase = await prisma.phase.create({
      data: {
        simulationId: simulation.id,
        title: "Phase 1: Real-Time Incident Containment",
        slug: "phase-1-incident-containment",
        orderIndex: 0,
        summary: "Contain the edge proxy memory leak and reroute traffic to the standby cluster.",
        businessObjective: "Restore edge availability to 99.9% within the 30-minute SLA window.",
        architectureDecisionRecord: "ADR-042: Automated Traffic Drainage via BGP Community Tags",
        status: "draft",
      },
    });
    expect(phase.id).toBeDefined();

    // 7. Create Task 1 (Investigation)
    const task1 = await prisma.task.create({
      data: {
        phaseId: phase.id,
        professionId: profession.id,
        roleId: role.id,
        companyId: company.id,
        ticketKey: "SRE-201",
        title: "Triage Alert & Locate Corrupted Upstream Envoy Route",
        slug: "triage-alert-envoy-route",
        orderIndex: 0,
        type: "INVESTIGATION",
        difficulty: "Guided",
        businessContext: "A surge in 504 errors in the Frankfurt PoP is causing customer logins to fail across Europe. Immediate containment is mandatory.",
        objective: "Inspect Prometheus error spikes, review Envoy access logs, and identify the misconfigured upstream healthcheck route.",
        requirements: JSON.stringify([
          "Query Prometheus for http_requests_total{status=~'5..'}",
          "Inspect Envoy route configuration in `/etc/envoy/envoy.yaml`",
          "Confirm failing healthcheck endpoint in `docs/containment_plan.md`",
        ]),
        constraints: JSON.stringify(["Do not restart the entire proxy cluster without draining"]),
        deliverables: JSON.stringify(["Containment plan in `docs/containment_plan.md`"]),
        tools: JSON.stringify(["Prometheus", "Envoy", "curl", "Grafana"]),
        environmentConfiguration: JSON.stringify({
          runtime: "docker",
          memory: "4Gi",
        }),
        startingState: JSON.stringify({
          templateRepoUrl: "https://github.com/workup-simulations/sre-envoy-outage",
        }),
        automatedTests: JSON.stringify({
          command: "pytest tests/test_containment.py",
        }),
        rubric: JSON.stringify([
          { criteria: "Root Cause Precision", weight: 60, guidelines: "Accurately identifies misconfigured healthcheck route" },
          { criteria: "Containment Speed", weight: 40, guidelines: "Documented within simulated SLA" },
        ]),
        mentorConfiguration: JSON.stringify({
          persona: "Elena Rostova",
          tone: "direct, rigorous, uptime-focused",
        }),
        failureScenarios: JSON.stringify([
          { trigger: "Cluster restart without drain", expectedResolution: "Drop rate increases; failover required" },
        ]),
        completionCriteria: JSON.stringify([
          "Failing route identified and documented",
          "Automated verification test passes",
        ]),
        portfolioEvidence: JSON.stringify({
          artifactType: "Incident Triage & Mitigation Brief",
          title: "SRE-201 Production Incident Triage Dossier",
        }),
        status: "draft",
        estimatedMinutes: 30,
      },
    });

    // 8. Create Task 2 (Remediation) with Dependency on Task 1
    const task2 = await prisma.task.create({
      data: {
        phaseId: phase.id,
        professionId: profession.id,
        roleId: role.id,
        companyId: company.id,
        ticketKey: "SRE-202",
        title: "Deploy Automated Circuit Breaker & Traffic Drain",
        slug: "deploy-circuit-breaker-traffic-drain",
        orderIndex: 1,
        type: "IMPLEMENTATION",
        difficulty: "Independent",
        businessContext: "Prevent future cascading upstream failures by introducing dynamic circuit breaking with 50ms consecutive error thresholds.",
        objective: "Configure Envoy circuit breakers and deploy automated traffic drainage script adhering to ADR-042.",
        requirements: JSON.stringify([
          "Add circuit breaker configuration to `envoy.yaml`",
          "Implement connection pool limits for upstream clusters",
          "Verify failover with automated integration test",
        ]),
        constraints: JSON.stringify(["Zero dropped packets during drain"]),
        deliverables: JSON.stringify(["Updated `envoy.yaml`", "Verification test logs"]),
        tools: JSON.stringify(["Envoy", "Docker", "pytest"]),
        environmentConfiguration: JSON.stringify({ runtime: "docker", memory: "4Gi" }),
        startingState: JSON.stringify({ templateRepoUrl: "https://github.com/workup-simulations/sre-envoy-outage" }),
        automatedTests: JSON.stringify({ command: "pytest tests/test_circuit_breaker.py" }),
        rubric: JSON.stringify([
          { criteria: "Circuit Breaker Spec", weight: 50, guidelines: "Correct consecutive error thresholds" },
          { criteria: "Drain Execution", weight: 50, guidelines: "Zero downtime traffic transfer" },
        ]),
        completionCriteria: JSON.stringify(["All circuit breaker tests pass"]),
        status: "draft",
        estimatedMinutes: 45,
      },
    });

    // Link dependency: Task 2 depends on Task 1
    const dependency = await prisma.taskDependency.create({
      data: {
        taskId: task2.id,
        dependsOnTaskId: task1.id,
        dependencyType: "PREREQUISITE",
        unlockCondition: "completion",
      },
    });
    expect(dependency.id).toBeDefined();

    // 9. Run the Content Engine Task Validator
    const validationReport1 = await validateTask({
      id: task1.id,
      phaseId: phase.id,
      ticketKey: task1.ticketKey,
      title: task1.title,
      objective: task1.objective,
      businessContext: task1.businessContext,
      requirements: task1.requirements,
      constraints: task1.constraints,
      deliverables: task1.deliverables,
      tools: task1.tools,
      environmentConfiguration: task1.environmentConfiguration,
      startingState: task1.startingState,
      automatedTests: task1.automatedTests,
      rubric: task1.rubric,
      completionCriteria: task1.completionCriteria,
    });

    expect(validationReport1.isValid).toBe(true);
    expect(validationReport1.errors.length).toBe(0);

    const validationReport2 = await validateTask({
      id: task2.id,
      phaseId: phase.id,
      ticketKey: task2.ticketKey,
      title: task2.title,
      objective: task2.objective,
      businessContext: task2.businessContext,
      requirements: task2.requirements,
      constraints: task2.constraints,
      deliverables: task2.deliverables,
      tools: task2.tools,
      environmentConfiguration: task2.environmentConfiguration,
      startingState: task2.startingState,
      automatedTests: task2.automatedTests,
      rubric: task2.rubric,
      completionCriteria: task2.completionCriteria,
      dependencies: [{ dependsOnTaskId: task1.id }],
    });

    expect(validationReport2.isValid).toBe(true);
    expect(validationReport2.errors.length).toBe(0);

    // 10. Execute Lifecycle Transitions: draft -> review -> approved -> published
    // Transition Task 1
    const approvedTask1 = await prisma.task.update({
      where: { id: task1.id },
      data: { status: "approved" },
    });
    expect(approvedTask1.status).toBe("approved");

    const publishedTask1 = await prisma.task.update({
      where: { id: task1.id },
      data: { status: "published" },
    });
    expect(publishedTask1.status).toBe("published");

    // Transition Simulation to published
    const publishedSim = await prisma.simulation.update({
      where: { id: simulation.id },
      data: {
        status: "published",
        isPublished: true,
      },
    });
    expect(publishedSim.status).toBe("published");
    expect(publishedSim.isPublished).toBe(true);

    // 11. Verify Acceptance Criteria:
    // The newly created simulation is now live, discoverable, and complete with all
    // phases, tasks, rubrics, and dependencies without modifying any application code.
    const retrievedSim = await prisma.simulation.findUnique({
      where: { id: simulation.id },
      include: {
        company: true,
        team: true,
        role: {
          include: { profession: true },
        },
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

    expect(retrievedSim).toBeDefined();
    expect(retrievedSim?.title).toBe("CloudScale: Multi-Region Edge DNS Cascading Outage");
    expect(retrievedSim?.company.name).toBe("CloudScale Networks");
    expect(retrievedSim?.team.leadName).toBe("Elena Rostova");
    expect(retrievedSim?.role.profession.name).toBe("Site Reliability Engineering");
    expect(retrievedSim?.phases.length).toBe(1);
    expect(retrievedSim?.phases[0].tasks.length).toBe(2);

    const retrievedTask2 = retrievedSim?.phases[0].tasks.find((t) => t.ticketKey === "SRE-202");
    expect(retrievedTask2?.dependencies.length).toBe(1);
    expect(retrievedTask2?.dependencies[0].dependsOnTaskId).toBe(task1.id);
  });
});
