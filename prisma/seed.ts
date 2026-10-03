import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting [workup] production foundation database seed...");

  // Clean existing data in reverse order of foreign keys
  await prisma.auditLog.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.taskDependency.deleteMany();
  await prisma.taskSkill.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.simulation.deleteMany();
  await prisma.team.deleteMany();
  await prisma.company.deleteMany();
  await prisma.roleSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.role.deleteMany();
  await prisma.profession.deleteMany();
  await prisma.session.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await bcrypt.hash("Password123", 10);

  // 1. Create Default Users for all 4 roles
  console.log("👤 Creating initial users for all roles...");
  const studentUser = await prisma.user.create({
    data: {
      email: "student@workup.dev",
      passwordHash: defaultPasswordHash,
      name: "Alex Rivera",
      role: "student",
      profile: {
        create: {
          headline: "Aspiring Backend & Systems Engineer",
          bio: "CS Senior passionate about distributed systems, API performance, and cloud infrastructure.",
          experienceLevel: "beginner",
          githubUsername: "alex-rivera-dev",
          linkedinUrl: "https://linkedin.com/in/alex-rivera-workup",
          portfolioWebsite: "https://alexrivera.dev",
        },
      },
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@workup.dev",
      passwordHash: defaultPasswordHash,
      name: "System Administrator",
      role: "administrator",
      profile: {
        create: {
          headline: "Platform Operations & Governance",
          bio: "Managing core [workup] infrastructure, audit compliance, and simulation catalog.",
          experienceLevel: "advanced",
        },
      },
    },
  });

  const authorUser = await prisma.user.create({
    data: {
      email: "author@workup.dev",
      passwordHash: defaultPasswordHash,
      name: "Elena Rostova",
      role: "content_author",
      profile: {
        create: {
          headline: "Staff Engineer & Simulation Architect",
          bio: "Former Fintech Staff Engineer authoring realistic systems challenges.",
          experienceLevel: "advanced",
        },
      },
    },
  });

  const reviewerUser = await prisma.user.create({
    data: {
      email: "reviewer@workup.dev",
      passwordHash: defaultPasswordHash,
      name: "Marcus Vance",
      role: "reviewer",
      profile: {
        create: {
          headline: "Principal Engineer & Code Reviewer",
          bio: "Conducting manual audits and tuning AI Tech Lead evaluation rubrics.",
          experienceLevel: "advanced",
        },
      },
    },
  });

  // 2. Create Skills
  console.log("⚡ Creating skills catalog...");
  const skillsData = [
    { name: "Python", slug: "python", category: "Language", description: "Modern Python 3.12+ with type annotations" },
    { name: "FastAPI", slug: "fastapi", category: "Framework", description: "High-performance async REST API framework" },
    { name: "PostgreSQL", slug: "postgresql", category: "Database", description: "Relational database, indexes, transactions" },
    { name: "Redis", slug: "redis", category: "Database", description: "In-memory caching and distributed locks" },
    { name: "Docker", slug: "docker", category: "DevOps", description: "Containerization and Dev Containers" },
    { name: "pytest", slug: "pytest", category: "Testing", description: "Unit, integration, and concurrency testing" },
    { name: "Prometheus", slug: "prometheus", category: "Observability", description: "Metrics collection and latency monitoring" },
    { name: "Grafana", slug: "grafana", category: "Observability", description: "Live production telemetry visualization" },
    { name: "MLflow", slug: "mlflow", category: "MLOps", description: "Experiment tracking and model registry governance" },
    { name: "LightGBM", slug: "lightgbm", category: "Machine Learning", description: "Gradient boosted decision trees for tabular classification" },
    { name: "Evidently AI", slug: "evidently-ai", category: "MLOps", description: "Feature and data drift detection monitoring" },
  ];

  const skillMap = new Map<string, string>();
  for (const s of skillsData) {
    const created = await prisma.skill.create({ data: s });
    skillMap.set(s.slug, created.id);
  }

  // 3. Create Professions
  console.log("🧭 Creating professions and roles...");
  const sweProfession = await prisma.profession.create({
    data: {
      slug: "software-engineering",
      name: "Software Engineering",
      category: "Software Engineering",
      description: "Build robust, scalable backend services, distributed systems, and customer-facing APIs.",
      icon: "Code2",
      displayOrder: 1,
    },
  });

  const mlProfession = await prisma.profession.create({
    data: {
      slug: "ai-machine-learning",
      name: "AI & Machine Learning",
      category: "AI & Machine Learning",
      description: "Train, evaluate, deploy, and monitor production machine learning models and pipelines.",
      icon: "BrainCircuit",
      displayOrder: 2,
    },
  });

  // 4. Create Roles
  const backendRole = await prisma.role.create({
    data: {
      professionId: sweProfession.id,
      slug: "junior-backend-engineer",
      title: "Junior Backend Engineer",
      level: "junior",
      summary: "Write clean, performant services, optimize database queries, implement idempotency, and diagnose production latency.",
      description: "As a Junior Backend Engineer, you will work alongside senior platform engineers to resolve real operational bottlenecks in high-throughput services.",
      marketDemand: "High (180,000+ open global roles)",
      responsibilities: JSON.stringify([
        "Author clean RESTful endpoints adhering to OpenAPI specifications",
        "Implement idempotent transaction handling to prevent duplicate charges",
        "Diagnose N+1 query bottlenecks in relational databases",
        "Write unit, integration, and concurrency test suites with pytest",
        "Investigate production alerts in Grafana and deploy verified hotfixes",
      ]),
    },
  });

  // Link skills to backend role
  for (const slug of ["python", "fastapi", "postgresql", "redis", "docker", "pytest", "prometheus", "grafana"]) {
    const skillId = skillMap.get(slug);
    if (skillId) {
      await prisma.roleSkill.create({
        data: { roleId: backendRole.id, skillId },
      });
    }
  }

  const mlopsRole = await prisma.role.create({
    data: {
      professionId: mlProfession.id,
      slug: "associate-mlops-engineer",
      title: "Associate MLOps Engineer",
      level: "junior",
      summary: "Govern machine learning model lifecycles, detect production feature drift, and automate model deployments.",
      description: "As an Associate MLOps Engineer, you bridge the gap between experimental notebooks and production model serving systems.",
      marketDemand: "Very High (+38% YoY industry growth)",
      responsibilities: JSON.stringify([
        "Track model training runs and hyperparameters using MLflow",
        "Analyze statistical feature drift using Evidently AI",
        "Implement automated evaluation gates against champion baseline models",
        "Package and serve models via low-latency REST microservices",
        "Monitor inference latency and distribution shift in production telemetry",
      ]),
    },
  });

  for (const slug of ["python", "mlflow", "lightgbm", "evidently-ai", "docker", "pytest", "grafana"]) {
    const skillId = skillMap.get(slug);
    if (skillId) {
      await prisma.roleSkill.create({
        data: { roleId: mlopsRole.id, skillId },
      });
    }
  }

  // 5. Create Companies & Teams
  console.log("🏢 Creating companies and simulated engineering teams...");
  const finFlow = await prisma.company.create({
    data: {
      name: "FinFlow Technologies",
      slug: "finflow",
      industry: "Fintech",
      size: "Series B (85 employees)",
      description: "A fast-growing fintech scale-up processing $15M/day in merchant transactions with strict 99.99% availability SLAs.",
      culture: "Engineering-driven, blameless post-mortems, high automated test coverage, strict code reviews.",
      techStack: JSON.stringify(["Python 3.12", "FastAPI", "PostgreSQL", "Redis", "Docker", "Prometheus", "Grafana"]),
      logoUrl: "/logos/finflow.svg",
      architectureOverview: "Microservices architecture utilizing event-driven payment webhooks, Redis distributed caching, and partitioned PostgreSQL storage.",
    },
  });

  const finFlowTeam = await prisma.team.create({
    data: {
      companyId: finFlow.id,
      name: "Core Payments Platform",
      charter: "Ensuring 100% reliable, zero-duplicate transaction processing across all merchant webhooks and settlement pipelines.",
      leadName: "Sarah Chen",
      leadRole: "Staff Platform Engineer & Tech Lead",
      slackChannels: JSON.stringify(["#payments-eng", "#alerts-production", "#standup-payments"]),
    },
  });

  const omniRetail = await prisma.company.create({
    data: {
      name: "OmniRetail Marketplace",
      slug: "omniretail",
      industry: "E-Commerce",
      size: "Enterprise (2,400 employees)",
      description: "Global e-commerce marketplace handling 500,000 daily orders with real-time ML-driven personalization and fraud detection.",
      culture: "Data-driven, rapid experiment iteration, strict model governance and compliance tracking.",
      techStack: JSON.stringify(["Python", "LightGBM", "PyTorch", "MLflow", "FastAPI", "Docker", "Evidently AI", "Grafana"]),
      logoUrl: "/logos/omniretail.svg",
      architectureOverview: "Hybrid recommendation & fraud detection architecture with offline batch training and real-time streaming inference microservices.",
    },
  });

  const omniTeam = await prisma.team.create({
    data: {
      companyId: omniRetail.id,
      name: "ML Platform & Governance",
      charter: "Providing reliable machine learning infrastructure, model registries, and drift detection pipelines for high-traffic commerce.",
      leadName: "David Kalu",
      leadRole: "Director of Machine Learning Infrastructure",
      slackChannels: JSON.stringify(["#ml-platform", "#alerts-fraud-model", "#data-eng"]),
    },
  });

  // 6. Create Simulations
  console.log("🎮 Creating flagship professional simulations...");
  const backendSimulation = await prisma.simulation.create({
    data: {
      roleId: backendRole.id,
      companyId: finFlow.id,
      teamId: finFlowTeam.id,
      slug: "payment-webhook-idempotency-and-optimization",
      title: "FinFlow: Payment Webhook Idempotency & Latency Optimization",
      summary: "Diagnose an N+1 query bottleneck, implement atomic Redis-based idempotency locks, pass automated concurrency tests, and resolve a simulated production deadlock incident.",
      businessScenario: `### Operational Background: FinFlow Checkout Failure

During peak merchant sales events, our payment webhook processing service suffers from duplicate charge attempts and a 400ms latency spike. Several key enterprise merchants have threatened to churn due to double-debiting customer accounts.

**Your Objective as Junior Backend Engineer:**
1. Clone the service repository inside your cloud workspace.
2. Investigate the webhook handler to identify why duplicate HTTP POST retries result in multiple transaction records.
3. Implement an atomic Redis-based idempotency key lock adhering to ADR-008.
4. Eliminate an N+1 SQL query bottleneck in transaction reconciliation.
5. Submit your pull request for review by Sarah Chen (AI Tech Lead).
6. Deploy the service to staging, observe synthetic live traffic, and resolve a simulated production deadlock alert.`,
      difficulty: "intermediate",
      estimatedHours: 4,
      prerequisiteKnowledge: JSON.stringify(["Basic Python & FastAPI syntax", "Understanding of SQL queries & joins", "Git branching & commit commands"]),
      isPublished: true,
      version: "1.0.0",
    },
  });

  // Create Project and Tasks for Backend Simulation
  const backendProject = await prisma.project.create({
    data: {
      simulationId: backendSimulation.id,
      title: "Webhook Ingestion Reliability Sprint",
      slug: "webhook-reliability",
      orderIndex: 0,
      businessObjective: "Achieve 0% duplicate transactions and reduce p95 webhook latency under 50ms under 500 RPS load.",
      architectureDecisionRecord: `### ADR-008: Distributed Idempotency and Locking
* **Status:** Accepted
* **Context:** Payment providers (Stripe, Adyen) retry webhooks upon timeouts. Concurrent duplicate retries cause race conditions.
* **Decision:** We require all payment endpoints to enforce an atomic Redis \`SET key value NX EX 60\` lock on the \`Idempotency-Key\` header before initiating database transactions.
* **Consequences:** Endpoints must return cached responses for in-flight or completed idempotency keys without re-executing credit charges.`,
    },
  });

  const task1 = await prisma.task.create({
    data: {
      projectId: backendProject.id,
      ticketKey: "FF-104",
      title: "Audit Webhook Ingestion & Identify N+1 Query Bottleneck",
      slug: "audit-webhook-ingestion",
      orderIndex: 0,
      type: "INVESTIGATION",
      description: "Inspect the existing FastAPI router in `src/routers/webhooks.py` and SQLAlchemy queries in `src/services/transactions.py`. Identify the lack of idempotency validation and find where the transaction lookup loops over unindexed foreign keys.",
      acceptanceCriteria: JSON.stringify([
        "Document root causes in `docs/investigation-report.md`",
        "Identify exact line numbers responsible for N+1 SQL queries",
        "Verify reproducer script `tests/reproduce_duplicate_charges.py` fails",
      ]),
      estimatedMinutes: 45,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      projectId: backendProject.id,
      ticketKey: "FF-105",
      title: "Implement Distributed Idempotency Lock with Redis",
      slug: "implement-idempotency-lock",
      orderIndex: 1,
      type: "IMPLEMENTATION",
      description: "Implement the Redis distributed lock pattern using `redis-py` according to ADR-008. Refactor database queries to use eager loading (`selectinload`) to eliminate the N+1 issue.",
      acceptanceCriteria: JSON.stringify([
        "Extract `Idempotency-Key` header and validate format (UUIDv4)",
        "Acquire atomic Redis key lock before processing",
        "Refactor SQLAlchemy query to execute in a single round-trip",
        "All local unit tests pass via `pytest tests/test_idempotency.py`",
      ]),
      estimatedMinutes: 60,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      projectId: backendProject.id,
      ticketKey: "FF-106",
      title: "Code Review & PR Submission",
      slug: "code-review-and-pr",
      orderIndex: 2,
      type: "CODE_REVIEW",
      description: "Push your feature branch and open a pull request. Review feedback from Sarah Chen (AI Tech Lead), resolve comments on error handling and TTL expiry, and obtain approval.",
      acceptanceCriteria: JSON.stringify([
        "Branch pushed: `feature/FF-105-webhook-idempotency`",
        "Zero linting errors (`ruff check .`)",
        "Pass AI Tech Lead PR evaluation with zero BLOCKER issues",
      ]),
      estimatedMinutes: 45,
    },
  });

  const task4 = await prisma.task.create({
    data: {
      projectId: backendProject.id,
      ticketKey: "FF-107",
      title: "Staging Deployment & Production Incident Hotfix",
      slug: "deployment-and-incident-hotfix",
      orderIndex: 3,
      type: "MONITORING_INCIDENT",
      description: "Deploy approved branch to staging. Observe live Grafana telemetry under synthetic traffic. Diagnose a simulated database lock alert in `#alerts-production`, push a hotfix, and verify metric recovery.",
      acceptanceCriteria: JSON.stringify([
        "Inspect Grafana dashboard for error rate spike",
        "Identify lock timeout caused by long-running transaction",
        "Deploy hotfix branch and confirm p95 latency drops below 45ms",
      ]),
      estimatedMinutes: 60,
    },
  });

  // Task dependencies
  await prisma.taskDependency.create({
    data: { taskId: task2.id, dependsOnTaskId: task1.id, dependencyType: "BLOCKS" },
  });
  await prisma.taskDependency.create({
    data: { taskId: task3.id, dependsOnTaskId: task2.id, dependencyType: "BLOCKS" },
  });
  await prisma.taskDependency.create({
    data: { taskId: task4.id, dependsOnTaskId: task3.id, dependencyType: "BLOCKS" },
  });

  // 7. Create Simulation 2: OmniRetail MLOps
  const mlSimulation = await prisma.simulation.create({
    data: {
      roleId: mlopsRole.id,
      companyId: omniRetail.id,
      teamId: omniTeam.id,
      slug: "feature-drift-detection-and-mlops-governance",
      title: "OmniRetail: Feature Drift Detection & MLOps Governance",
      summary: "Diagnose a 22% degradation in fraud model precision, track retrained model runs in MLflow, evaluate against the champion model, and deploy a canary endpoint.",
      businessScenario: `### Operational Background: OmniRetail Fraud Pipeline Drift

Over the past quarter, OmniRetail's fraud detection model has experienced a 22% drop in precision. Thousands of legitimate holiday transactions are being falsely flagged and declined.

**Your Objective as Associate MLOps Engineer:**
1. Connect to the MLflow tracking server and inspect historical experiment runs.
2. Analyze incoming transaction feature distributions using Evidently AI to isolate data drift.
3. Retrain a candidate model, log parameters and AUC-ROC metrics to MLflow.
4. Run automated model evaluation against the current \`@champion\` baseline.
5. Register the winning candidate in the MLflow Model Registry and update the serving endpoint.`,
      difficulty: "intermediate",
      estimatedHours: 4,
      prerequisiteKnowledge: JSON.stringify(["Basic Python & pandas", "Concept of ML classification (precision, recall, AUC)", "Familiarity with Git"]),
      isPublished: true,
      version: "1.0.0",
    },
  });

  const mlProject = await prisma.project.create({
    data: {
      simulationId: mlSimulation.id,
      title: "Model Governance & Drift Mitigation Sprint",
      slug: "drift-mitigation",
      orderIndex: 0,
      businessObjective: "Restore model precision above 92% and establish automated drift alerting.",
      architectureDecisionRecord: `### ADR-014: ML Model Governance and Registry Aliases
* **Status:** Accepted
* **Context:** Unmonitored model deployments previously caused silent revenue degradation.
* **Decision:** All production models must be registered in the MLflow Model Registry. Models may only be promoted to \`@champion\` after passing automated \`mlflow.evaluate()\` benchmarks exceeding the active champion's F1-score on golden test slices.`,
    },
  });

  const mlTask1 = await prisma.task.create({
    data: {
      projectId: mlProject.id,
      ticketKey: "OR-201",
      title: "Detect Feature Drift Using Evidently AI",
      slug: "detect-feature-drift",
      orderIndex: 0,
      type: "INVESTIGATION",
      description: "Load baseline training distributions and current production inference logs. Generate a drift report using Evidently AI to identify which features (e.g. transaction velocity, billing country) have drifted.",
      acceptanceCriteria: JSON.stringify([
        "Generate drift report in `reports/data_drift.html`",
        "Isolate high-drift features with p-value < 0.05",
        "Document findings in `docs/drift-analysis.md`",
      ]),
      estimatedMinutes: 45,
    },
  });

  const mlTask2 = await prisma.task.create({
    data: {
      projectId: mlProject.id,
      ticketKey: "OR-202",
      title: "Retrain & Log Experiments to MLflow Tracking Server",
      slug: "retrain-and-log-mlflow",
      orderIndex: 1,
      type: "IMPLEMENTATION",
      description: "Update the training script to ingest recent validated data slices. Train candidate LightGBM models, logging hyperparameters, confusion matrices, and ROC curves to MLflow.",
      acceptanceCriteria: JSON.stringify([
        "Execute training script with MLflow autologging enabled",
        "Log candidate run to MLflow experiment `fraud-detection-v2`",
        "Demonstrate candidate AUC-ROC improvement > 0.04 over baseline",
      ]),
      estimatedMinutes: 60,
    },
  });

  await prisma.taskDependency.create({
    data: { taskId: mlTask2.id, dependsOnTaskId: mlTask1.id, dependencyType: "BLOCKS" },
  });

  // 8. Create Audit Log for Seed Initialization
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: "PLATFORM_INITIALIZATION",
      entityType: "System",
      metadata: JSON.stringify({
        version: "0.1.0",
        seedDate: new Date().toISOString(),
        professionsCreated: 2,
        simulationsCreated: 2,
      }),
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log("Default credentials:");
  console.log("  Student:       student@workup.dev / Password123");
  console.log("  Administrator: admin@workup.dev   / Password123");
  console.log("  Author:        author@workup.dev  / Password123");
  console.log("  Reviewer:      reviewer@workup.dev / Password123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
