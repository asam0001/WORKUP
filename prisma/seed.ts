import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting [workup] data-driven content engine database seed...");

  // Clean existing data in reverse order of foreign keys
  await prisma.helpdeskMessage.deleteMany();
  await prisma.missionOutcome.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.taskDependency.deleteMany();
  await prisma.taskSkill.deleteMany();
  await prisma.task.deleteMany();
  await prisma.phase.deleteMany();
  await prisma.simulation.deleteMany();
  await prisma.team.deleteMany();
  await prisma.company.deleteMany();
  await prisma.roleSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.role.deleteMany();
  await prisma.profession.deleteMany();
  await prisma.careerFamily.deleteMany();
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
          headline: "Aspiring Machine Learning & Systems Engineer",
          bio: "Passionate about MLOps, experiment tracking with MLflow, and low-latency inference pipelines.",
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
          headline: "Platform Operations & Content Engine Governance",
          bio: "Managing simulation catalog, task validators, and enterprise tracks.",
          experienceLevel: "advanced",
        },
      },
    },
  });

  const authorUser = await prisma.user.create({
    data: {
      email: "author@workup.dev",
      passwordHash: defaultPasswordHash,
      name: "Dr. Maya Lin",
      role: "content_author",
      profile: {
        create: {
          headline: "Principal MLOps Architect & Curriculum Lead",
          bio: "Former Staff ML Engineer designing data-driven production simulations.",
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
          headline: "Senior Staff Engineer & Code Reviewer",
          bio: "Conducting manual audits and calibrating AI Tech Lead review rubrics.",
          experienceLevel: "advanced",
        },
      },
    },
  });

  // 2. Create Career Families
  console.log("🏛️ Creating career families...");
  const dataAiFamily = await prisma.careerFamily.create({
    data: {
      name: "Data & Artificial Intelligence",
      slug: "data-ai",
      description: "Disciplines focused on machine learning models, MLOps governance, big data pipelines, and intelligent systems.",
      icon: "BrainCircuit",
      displayOrder: 1,
    },
  });

  const sweFamily = await prisma.careerFamily.create({
    data: {
      name: "Software Engineering & Architecture",
      slug: "software-engineering-architecture",
      description: "Core software engineering, high-throughput backend services, distributed systems, and API platforms.",
      icon: "Code2",
      displayOrder: 2,
    },
  });

  // 3. Create Skills
  console.log("⚡ Creating skills catalog...");
  const skillsData = [
    { name: "Python", slug: "python", category: "Language", description: "Modern Python 3.12+ with type annotations" },
    { name: "MLflow", slug: "mlflow", category: "MLOps", description: "Experiment tracking, model registry, and governance" },
    { name: "Evidently AI", slug: "evidently-ai", category: "MLOps", description: "Feature and data drift detection monitoring" },
    { name: "LightGBM", slug: "lightgbm", category: "Machine Learning", description: "Gradient boosted decision trees for tabular classification" },
    { name: "PyTorch", slug: "pytorch", category: "Machine Learning", description: "Deep learning framework for embeddings & neural models" },
    { name: "FastAPI", slug: "fastapi", category: "Framework", description: "High-performance async REST API framework" },
    { name: "Docker", slug: "docker", category: "DevOps", description: "Containerization and Dev Containers specification" },
    { name: "Prometheus", slug: "prometheus", category: "Observability", description: "Metrics collection and latency monitoring" },
    { name: "Grafana", slug: "grafana", category: "Observability", description: "Live production telemetry dashboards" },
    { name: "PostgreSQL", slug: "postgresql", category: "Database", description: "Relational database, indexes, transactions" },
    { name: "Redis", slug: "redis", category: "Database", description: "In-memory caching and distributed locks" },
    { name: "pytest", slug: "pytest", category: "Testing", description: "Automated test suites, mocks, and fixtures" },
  ];

  const skillMap = new Map<string, string>();
  for (const s of skillsData) {
    const created = await prisma.skill.create({ data: s });
    skillMap.set(s.slug, created.id);
  }

  // 4. Create Professions
  console.log("🧭 Creating professions...");
  const mlProfession = await prisma.profession.create({
    data: {
      careerFamilyId: dataAiFamily.id,
      slug: "machine-learning-engineering",
      name: "Machine Learning Engineering",
      category: "Data & Artificial Intelligence",
      description: "Build, govern, deploy, and monitor scalable machine learning models and automated MLOps pipelines.",
      icon: "BrainCircuit",
      status: "published",
      isPublished: true,
      displayOrder: 1,
    },
  });

  const sweProfession = await prisma.profession.create({
    data: {
      careerFamilyId: sweFamily.id,
      slug: "software-engineering",
      name: "Software Engineering",
      category: "Software Engineering & Architecture",
      description: "Build robust, scalable backend services, distributed systems, and customer-facing APIs.",
      icon: "Code2",
      status: "published",
      isPublished: true,
      displayOrder: 2,
    },
  });

  // 5. Create Roles
  console.log("💼 Creating career roles...");
  const mlopsRole = await prisma.role.create({
    data: {
      professionId: mlProfession.id,
      slug: "associate-mlops-engineer",
      title: "Associate MLOps Engineer",
      level: "junior",
      summary: "Govern machine learning lifecycles, detect statistical feature drift, and automate model deployments.",
      description: "Bridge the gap between data science experimentation and high-availability production model serving systems.",
      marketDemand: "Very High (+38% YoY industry growth)",
      responsibilities: JSON.stringify([
        "Monitor data and feature drift using statistical distance metrics",
        "Track model training runs and hyperparameters using MLflow",
        "Enforce automated model evaluation benchmarks against active champion models",
        "Package models into low-latency containerized REST microservices",
        "Respond to production distribution shift alerts and manage rollback governance",
      ]),
      status: "published",
    },
  });

  for (const slug of ["python", "mlflow", "evidently-ai", "lightgbm", "docker", "fastapi", "prometheus", "pytest"]) {
    const skillId = skillMap.get(slug);
    if (skillId) {
      await prisma.roleSkill.create({ data: { roleId: mlopsRole.id, skillId } });
    }
  }

  const backendRole = await prisma.role.create({
    data: {
      professionId: sweProfession.id,
      slug: "junior-backend-engineer",
      title: "Junior Backend Engineer",
      level: "junior",
      summary: "Write clean, performant services, optimize database queries, implement idempotency, and diagnose production latency.",
      description: "Work alongside senior platform engineers to resolve real operational bottlenecks in high-throughput services.",
      marketDemand: "High (180,000+ open global roles)",
      responsibilities: JSON.stringify([
        "Author clean RESTful endpoints adhering to OpenAPI specifications",
        "Implement idempotent transaction handling to prevent duplicate charges",
        "Diagnose N+1 query bottlenecks in relational databases",
        "Write unit, integration, and concurrency test suites with pytest",
        "Investigate production alerts in Grafana and deploy verified hotfixes",
      ]),
      status: "published",
    },
  });

  for (const slug of ["python", "fastapi", "postgresql", "redis", "docker", "pytest", "prometheus", "grafana"]) {
    const skillId = skillMap.get(slug);
    if (skillId) {
      await prisma.roleSkill.create({ data: { roleId: backendRole.id, skillId } });
    }
  }

  // 6. Create Companies & Teams
  console.log("🏢 Creating companies and simulated engineering teams...");
  const omniRetail = await prisma.company.create({
    data: {
      name: "OmniRetail Marketplace",
      slug: "omniretail",
      industry: "E-Commerce",
      size: "Enterprise (2,400 employees)",
      description: "Global e-commerce marketplace handling 500,000 daily orders with real-time ML personalization and fraud prevention.",
      culture: "Data-driven, rapid experiment iteration, strict model governance and compliance tracking.",
      techStack: JSON.stringify(["Python 3.12", "MLflow", "LightGBM", "Evidently AI", "FastAPI", "Docker", "Prometheus", "Grafana"]),
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

  // 7. FLAGSHIP SIMULATION 1: ML ENGINEER CAREER (OmniRetail MLOps)
  console.log("🤖 Creating Flagship ML Engineer Career Simulation & Phases...");
  const mlSimulation = await prisma.simulation.create({
    data: {
      roleId: mlopsRole.id,
      companyId: omniRetail.id,
      teamId: omniTeam.id,
      slug: "fraud-detection-drift-mitigation-and-registry-governance",
      title: "OmniRetail: Fraud Detection Drift Mitigation & MLOps Governance",
      summary: "Diagnose a 22% degradation in fraud model precision, track retrained model runs in MLflow, evaluate against the champion model, and deploy a canary endpoint.",
      businessScenario: `### Operational Emergency: OmniRetail Fraud Pipeline Drift

Over the past quarter, OmniRetail's automated transaction fraud detection model has experienced a **22% drop in precision**. Thousands of legitimate holiday transactions are being falsely flagged and declined, causing customer backlash and estimated revenue loss of **$85,000/day**.

**Your Objective as Associate MLOps Engineer:**
1. Connect to the MLflow tracking server and inspect historical experiment runs.
2. Analyze incoming transaction feature distributions using Evidently AI to isolate statistical data drift.
3. Retrain a candidate model, log parameters and AUC-ROC metrics to MLflow.
4. Run automated model evaluation against the current \`@champion\` baseline.
5. Register the winning candidate in the MLflow Model Registry and update the serving endpoint.
6. Observe live telemetry in Grafana and triage a synthetic real-time drift alert.`,
      difficulty: "Production simulation",
      estimatedHours: 5,
      prerequisiteKnowledge: JSON.stringify([
        "Python 3.12 & pandas dataframes",
        "Supervised ML classification metrics (Precision, Recall, ROC-AUC, F1-Score)",
        "Basic Git commands (branch, commit, push)",
        "Understanding of REST APIs and JSON endpoints",
      ]),
      status: "published",
      isPublished: true,
      version: "1.0.0",
    },
  });

  // ML Phase 1
  const mlPhase1 = await prisma.phase.create({
    data: {
      simulationId: mlSimulation.id,
      title: "Phase 1: Exploratory Data Analysis & Statistical Feature Drift Detection",
      slug: "phase-1-drift-detection",
      orderIndex: 0,
      summary: "Inspect production inference logs, isolate categorical distribution shift, and generate an Evidently AI drift report.",
      businessObjective: "Identify root causes of the 22% precision drop across 500,000 monthly transactions.",
      architectureDecisionRecord: `### ADR-012: Statistical Thresholds for Drift Detection
* **Status:** Accepted
* **Context:** Sudden shifts in customer purchasing behavior cause model performance decay.
* **Decision:** We use Kolmogorov-Smirnov (K-S) tests for continuous features (p-value < 0.05) and Population Stability Index (PSI > 0.25) for categorical transaction velocity features.
* **Consequences:** Any feature breaching these thresholds must trigger automated retraining tickets.`,
      repositoryTemplateUrl: "https://github.com/workup-simulations/omniretail-fraud-mlops",
      status: "published",
    },
  });

  // ML Task 1
  const mlTask1 = await prisma.task.create({
    data: {
      phaseId: mlPhase1.id,
      professionId: mlProfession.id,
      roleId: mlopsRole.id,
      companyId: omniRetail.id,
      ticketKey: "ML-101",
      title: "Detect Feature Drift Using Evidently AI",
      slug: "detect-feature-drift-evidently",
      orderIndex: 0,
      type: "INVESTIGATION",
      difficulty: "Guided",
      businessContext: "False fraud flags are causing high checkout abandonment. Leadership needs a definitive statistical audit of incoming transaction distributions compared to baseline training data.",
      objective: "Generate an Evidently AI Data Drift Report comparing baseline training data against live production inference logs.",
      prerequisites: JSON.stringify(["Python 3.12 syntax", "Pandas DataFrame filtering"]),
      tools: JSON.stringify(["Python", "Evidently AI", "Pandas", "Jupyter"]),
      environmentConfiguration: JSON.stringify({
        runtime: "python:3.12",
        baseImage: "ghcr.io/workup/mlops-runner:3.12",
        cpu: "1.5",
        memory: "4Gi",
        ports: [8888, 5000],
        services: ["mlflow-local"],
        envVars: { MLFLOW_TRACKING_URI: "http://localhost:5000" },
      }),
      startingState: JSON.stringify({
        repositoryBranch: "main",
        templateRepoUrl: "https://github.com/workup-simulations/omniretail-fraud-mlops",
        seedDataFiles: ["data/baseline_train.parquet", "data/production_inferences_q3.parquet"],
        dirtyStateDescription: "Inference logs contain 12 unnormalized features with temporal shifts.",
      }),
      requirements: JSON.stringify([
        "Load baseline dataset and recent inference logs via `pandas`",
        "Configure Evidently AI `Report(metrics=[DataDriftPreset()])`",
        "Execute report generation and export HTML visualization to `reports/data_drift_q3.html`",
        "Document identified drift features in `docs/drift_analysis.md`",
      ]),
      constraints: JSON.stringify([
        "Execution time must not exceed 90 seconds on 50,000 sample rows",
        "Report must flag features with p-value < 0.05",
      ]),
      deliverables: JSON.stringify([
        "Generated drift report HTML in `reports/data_drift_q3.html`",
        "Markdown summary in `docs/drift_analysis.md` citing top 3 drifted features",
      ]),
      automatedTests: JSON.stringify({
        command: "pytest tests/test_drift_report.py",
        testFiles: ["tests/test_drift_report.py"],
        timeoutSec: 60,
      }),
      hiddenTests: JSON.stringify({
        evaluationSuite: "tests/eval/test_drift_accuracy.py",
        benchmarks: { minDriftedFeaturesIdentified: 3 },
      }),
      rubric: JSON.stringify([
        { criteria: "Statistical Rigor", weight: 40, guidelines: "Proper application of K-S and PSI tests to isolate feature shift" },
        { criteria: "Artifact Generation", weight: 30, guidelines: "Evidently HTML report generated without missing column errors" },
        { criteria: "Documentation Quality", weight: 30, guidelines: "Clear articulation of business impact and recommendations in drift_analysis.md" },
      ]),
      mentorConfiguration: JSON.stringify({
        persona: "David Kalu, Director of ML Infrastructure",
        tone: "encouraging, data-driven, precise",
        strictness: "moderate",
        allowableHints: 3,
      }),
      failureScenarios: JSON.stringify([
        { trigger: "NaN values in billing region column", alertChannel: "#ml-platform", expectedResolution: "Add imputation before report generation" },
      ]),
      completionCriteria: JSON.stringify([
        "Test suite `pytest tests/test_drift_report.py` passes with 0 failures",
        "HTML report generated at `reports/data_drift_q3.html`",
      ]),
      portfolioEvidence: JSON.stringify({
        artifactType: "Statistical Drift Audit Report",
        title: "OmniRetail Q3 Data Drift Assessment",
        verificationCriteria: ["Verified statistical test run", "Validated HTML artifact SHA-256"],
      }),
      status: "published",
      estimatedMinutes: 45,
    },
  });

  // ML Task 2
  const mlTask2 = await prisma.task.create({
    data: {
      phaseId: mlPhase1.id,
      professionId: mlProfession.id,
      roleId: mlopsRole.id,
      companyId: omniRetail.id,
      ticketKey: "ML-102",
      title: "Isolate Out-of-Distribution Feature Drifts in Payment Velocities",
      slug: "isolate-ood-feature-drift",
      orderIndex: 1,
      type: "INVESTIGATION",
      difficulty: "Assisted",
      businessContext: "Drift analysis highlighted that transaction velocity features (e.g., number of purchases in last 10 minutes) have shifted drastically due to bot-driven flash sales.",
      objective: "Isolate and quantify the specific feature shifts causing false-positive classifications in the fraud scoring model.",
      prerequisites: JSON.stringify(["Completion of ML-101"]),
      tools: JSON.stringify(["Python", "Pandas", "Matplotlib", "Seaborn"]),
      environmentConfiguration: JSON.stringify({
        runtime: "python:3.12",
        baseImage: "ghcr.io/workup/mlops-runner:3.12",
        cpu: "1.5",
        memory: "4Gi",
      }),
      startingState: JSON.stringify({
        repositoryBranch: "feature/ML-101-drift-analysis",
        templateRepoUrl: "https://github.com/workup-simulations/omniretail-fraud-mlops",
      }),
      requirements: JSON.stringify([
        "Calculate Population Stability Index (PSI) for `tx_velocity_10m` and `billing_country_mismatch`",
        "Plot comparative distribution histograms in `reports/velocity_distribution.png`",
        "Propose feature transformation strategy (quantile binning or log scaling) to handle high-variance outliers",
      ]),
      constraints: JSON.stringify([
        "PSI calculations must follow standard 10-bin decile methodology",
      ]),
      deliverables: JSON.stringify([
        "Distribution plot in `reports/velocity_distribution.png`",
        "Feature engineering proposal in `docs/feature_remediation.md`",
      ]),
      automatedTests: JSON.stringify({
        command: "pytest tests/test_psi_calculation.py",
        testFiles: ["tests/test_psi_calculation.py"],
        timeoutSec: 45,
      }),
      hiddenTests: JSON.stringify({
        evaluationSuite: "tests/eval/test_psi_precision.py",
      }),
      rubric: JSON.stringify([
        { criteria: "Mathematical Accuracy", weight: 50, guidelines: "Correct PSI formula implementation without division-by-zero" },
        { criteria: "Visual Clarity", weight: 25, guidelines: "Clean, readable comparison histograms" },
        { criteria: "Engineering Proposal", weight: 25, guidelines: "Sound proposal for handling distribution shift" },
      ]),
      mentorConfiguration: JSON.stringify({
        persona: "David Kalu, Director of ML Infrastructure",
        tone: "rigorous, mathematical",
        strictness: "strict",
        allowableHints: 2,
      }),
      completionCriteria: JSON.stringify([
        "PSI calculation script passes automated tests",
        "Remediation plan approved by AI Tech Lead",
      ]),
      status: "published",
      estimatedMinutes: 45,
    },
  });

  // Link ML Phase 1 Dependency
  await prisma.taskDependency.create({
    data: {
      taskId: mlTask2.id,
      dependsOnTaskId: mlTask1.id,
      dependencyType: "SEQUENTIAL",
      unlockCondition: JSON.stringify({ status: "APPROVED" }),
    },
  });

  // ML Phase 2
  const mlPhase2 = await prisma.phase.create({
    data: {
      simulationId: mlSimulation.id,
      title: "Phase 2: Retraining Pipeline, MLflow Autologging & Champion Evaluation",
      slug: "phase-2-retraining-mlflow",
      orderIndex: 1,
      summary: "Retrain candidate gradient-boosted decision trees, track runs in MLflow, and evaluate against the active champion model.",
      businessObjective: "Produce a candidate model with AUC-ROC > 0.94 and Precision > 90% without increasing inference latency above 20ms.",
      architectureDecisionRecord: `### ADR-014: ML Model Governance and Registry Aliases
* **Status:** Accepted
* **Context:** Previously, untracked models were deployed directly to production causing silent revenue loss.
* **Decision:** All models must be logged to the central MLflow Model Registry. A candidate model can only be promoted to \`@champion\` after passing automated \`mlflow.evaluate()\` benchmarks on golden test slices.`,
      status: "published",
    },
  });

  // ML Task 3
  const mlTask3 = await prisma.task.create({
    data: {
      phaseId: mlPhase2.id,
      professionId: mlProfession.id,
      roleId: mlopsRole.id,
      companyId: omniRetail.id,
      ticketKey: "ML-103",
      title: "Retrain LightGBM Pipeline & Log Experiments to MLflow Tracking Server",
      slug: "retrain-lightgbm-mlflow",
      orderIndex: 0,
      type: "IMPLEMENTATION",
      difficulty: "Independent",
      businessContext: "With drifted features isolated, we must retrain our fraud classification pipeline incorporating recent validated data slices and feature scaling.",
      objective: "Implement automated retraining script using LightGBM with MLflow experiment tracking autologging.",
      prerequisites: JSON.stringify(["Completion of ML-102", "Understanding of MLflow tracking APIs"]),
      tools: JSON.stringify(["Python", "LightGBM", "MLflow", "Scikit-Learn"]),
      environmentConfiguration: JSON.stringify({
        runtime: "python:3.12",
        baseImage: "ghcr.io/workup/mlops-runner:3.12",
        cpu: "2.0",
        memory: "4Gi",
        services: ["mlflow-server"],
      }),
      startingState: JSON.stringify({
        repositoryBranch: "feature/ML-102-psi-isolation",
        templateRepoUrl: "https://github.com/workup-simulations/omniretail-fraud-mlops",
        seedDataFiles: ["data/retraining_slice_2026.parquet"],
      }),
      requirements: JSON.stringify([
        "Configure `mlflow.set_experiment('fraud-detection-v2')`",
        "Enable `mlflow.lightgbm.autolog()` for automatic metric and artifact capture",
        "Train LightGBM classifier with hyperparameter tuning (learning_rate, num_leaves, max_depth)",
        "Log ROC curve, confusion matrix, and feature importance artifacts to MLflow",
      ]),
      constraints: JSON.stringify([
        "Candidate model must achieve validation AUC-ROC >= 0.94",
        "Training runtime must complete within 3 minutes",
      ]),
      deliverables: JSON.stringify([
        "Executable training script `src/train.py`",
        "Active MLflow run ID containing model artifacts",
      ]),
      automatedTests: JSON.stringify({
        command: "pytest tests/test_model_training.py",
        testFiles: ["tests/test_model_training.py"],
        timeoutSec: 180,
      }),
      hiddenTests: JSON.stringify({
        evaluationSuite: "tests/eval/test_model_benchmarks.py",
        benchmarks: { minAuc: 0.94, maxLatencyMs: 20 },
      }),
      rubric: JSON.stringify([
        { criteria: "MLflow Integration", weight: 35, guidelines: "Proper experiment setup, autologging, and artifact persistence" },
        { criteria: "Model Performance", weight: 35, guidelines: "Exceeds 0.94 AUC-ROC threshold on out-of-time validation slice" },
        { criteria: "Code Quality", weight: 30, guidelines: "Clean, modular Python code adhering to PEP 8 standards" },
      ]),
      mentorConfiguration: JSON.stringify({
        persona: "David Kalu, Director of ML Infrastructure",
        tone: "exacting, architectural",
        strictness: "strict",
        allowableHints: 2,
      }),
      completionCriteria: JSON.stringify([
        "All unit tests pass",
        "MLflow run registered with AUC-ROC >= 0.94",
      ]),
      status: "published",
      estimatedMinutes: 60,
    },
  });

  // ML Task 4
  const mlTask4 = await prisma.task.create({
    data: {
      phaseId: mlPhase2.id,
      professionId: mlProfession.id,
      roleId: mlopsRole.id,
      companyId: omniRetail.id,
      ticketKey: "ML-104",
      title: "Automate MLflow Evaluate Gating Against Champion Baseline",
      slug: "automate-mlflow-evaluate-gating",
      orderIndex: 1,
      type: "TESTING",
      difficulty: "Production simulation",
      businessContext: "Before any candidate model can be promoted to staging or production, company policy (ADR-014) requires automated model evaluation comparing it directly against the active @champion.",
      objective: "Author an evaluation pipeline using `mlflow.evaluate()` to enforce automated promotion gates.",
      prerequisites: JSON.stringify(["Completion of ML-103"]),
      tools: JSON.stringify(["Python", "MLflow", "pytest"]),
      environmentConfiguration: JSON.stringify({
        runtime: "python:3.12",
        baseImage: "ghcr.io/workup/mlops-runner:3.12",
      }),
      startingState: JSON.stringify({
        repositoryBranch: "feature/ML-103-retraining-pipeline",
      }),
      requirements: JSON.stringify([
        "Load active `@champion` model from MLflow Model Registry",
        "Execute `mlflow.evaluate()` on identical golden evaluation dataset slice",
        "Assert candidate model precision >= champion precision + 0.05",
        "Assert candidate p95 inference latency <= 20ms",
        "If passed, transition model alias to `@candidate-approved` in the registry",
      ]),
      constraints: JSON.stringify([
        "Evaluation must reject candidate if inference latency exceeds 20ms threshold",
      ]),
      deliverables: JSON.stringify([
        "Automated evaluation script `src/evaluate.py`",
        "Registry transition record to `@candidate-approved`",
      ]),
      automatedTests: JSON.stringify({
        command: "pytest tests/test_evaluation_gate.py",
        testFiles: ["tests/test_evaluation_gate.py"],
        timeoutSec: 90,
      }),
      rubric: JSON.stringify([
        { criteria: "Gating Logic", weight: 50, guidelines: "Deterministic enforcement of ADR-014 acceptance criteria" },
        { criteria: "Registry Aliasing", weight: 30, guidelines: "Correct use of MLflow Model Registry alias APIs" },
        { criteria: "Error Handling", weight: 20, guidelines: "Proper handling of failing candidates without crashing CI pipeline" },
      ]),
      mentorConfiguration: JSON.stringify({
        persona: "David Kalu, Director of ML Infrastructure",
        tone: "strict, compliance-focused",
        strictness: "strict",
      }),
      completionCriteria: JSON.stringify([
        "Evaluation script executes and successfully validates candidate model",
      ]),
      status: "published",
      estimatedMinutes: 45,
    },
  });

  // Link ML Phase 2 Dependencies
  await prisma.taskDependency.create({
    data: { taskId: mlTask3.id, dependsOnTaskId: mlTask2.id, dependencyType: "PREREQUISITE" },
  });
  await prisma.taskDependency.create({
    data: { taskId: mlTask4.id, dependsOnTaskId: mlTask3.id, dependencyType: "SEQUENTIAL" },
  });

  // ML Phase 3
  const mlPhase3 = await prisma.phase.create({
    data: {
      simulationId: mlSimulation.id,
      title: "Phase 3: Model Serving Deployment & Real-Time Production Drift Alerting",
      slug: "phase-3-serving-and-alerting",
      orderIndex: 2,
      summary: "Package candidate model into a FastAPI microservice, deploy canary endpoint, and resolve a simulated real-time drift alert.",
      businessObjective: "Achieve zero-downtime deployment and verify real-time Prometheus telemetry under 1,000 RPS synthetic load.",
      architectureDecisionRecord: `### ADR-016: Zero-Downtime Model Serving and Real-Time Canary Guardrails
* **Status:** Accepted
* **Context:** Microservice model endpoints must serve real-time predictions with p99 latency < 35ms.
* **Decision:** Endpoints emit Prometheus metrics (\`inference_latency_seconds\`, \`fraud_prediction_score\`). If canary error rates exceed 1.0%, automated rollback to previous champion is mandated.`,
      status: "published",
    },
  });

  // ML Task 5
  const mlTask5 = await prisma.task.create({
    data: {
      phaseId: mlPhase3.id,
      professionId: mlProfession.id,
      roleId: mlopsRole.id,
      companyId: omniRetail.id,
      ticketKey: "ML-105",
      title: "Deploy FastAPI Model Serving Endpoint with OpenTelemetry Metrics",
      slug: "deploy-fastapi-model-serving",
      orderIndex: 0,
      type: "DEPLOYMENT",
      difficulty: "Production simulation",
      businessContext: "The retrained candidate model must now be served as a production REST API microservice to process incoming checkout transactions.",
      objective: "Author FastAPI serving application loading the registered MLflow model and exposing Prometheus metrics.",
      prerequisites: JSON.stringify(["Completion of ML-104"]),
      tools: JSON.stringify(["Python", "FastAPI", "Uvicorn", "Prometheus", "Docker"]),
      environmentConfiguration: JSON.stringify({
        runtime: "python:3.12",
        baseImage: "ghcr.io/workup/mlops-runner:3.12",
        ports: [8000, 9090],
      }),
      startingState: JSON.stringify({
        repositoryBranch: "feature/ML-104-evaluated-model",
      }),
      requirements: JSON.stringify([
        "Implement `POST /v1/predict/fraud` accepting transaction JSON payloads",
        "Load model from MLflow registry using URI `models:/fraud-detection-model@candidate-approved`",
        "Instrument endpoint with `prometheus_client` histogram tracking inference duration",
        "Add health check endpoint `GET /healthz` verifying model readiness",
      ]),
      constraints: JSON.stringify([
        "Inference endpoint response time must remain under 25ms under concurrent load",
      ]),
      deliverables: JSON.stringify([
        "FastAPI service in `src/service/main.py`",
        "Passing integration tests in `tests/test_api_endpoints.py`",
      ]),
      automatedTests: JSON.stringify({
        command: "pytest tests/test_api_endpoints.py",
        testFiles: ["tests/test_api_endpoints.py"],
        timeoutSec: 60,
      }),
      rubric: JSON.stringify([
        { criteria: "Microservice Design", weight: 40, guidelines: "Clean async FastAPI architecture with robust error handling" },
        { criteria: "Observability", weight: 30, guidelines: "Accurate Prometheus metric histograms and status code labeling" },
        { criteria: "Concurrency & Performance", weight: 30, guidelines: "Response times strictly adhere to <25ms SLA" },
      ]),
      mentorConfiguration: JSON.stringify({
        persona: "David Kalu, Director of ML Infrastructure",
        tone: "rigorous, production-focused",
        strictness: "strict",
      }),
      completionCriteria: JSON.stringify([
        "API integration tests pass with 100% success rate",
        "Prometheus metrics scrape endpoint verified",
      ]),
      status: "published",
      estimatedMinutes: 60,
    },
  });

  // ML Task 6: Ownership Level Incident Triage
  const mlTask6 = await prisma.task.create({
    data: {
      phaseId: mlPhase3.id,
      professionId: mlProfession.id,
      roleId: mlopsRole.id,
      companyId: omniRetail.id,
      ticketKey: "ML-106",
      title: "Triage Real-Time Drift Alert & Execute Hotfix Model Rollback",
      slug: "triage-realtime-drift-alert-hotfix",
      orderIndex: 1,
      type: "MONITORING_INCIDENT",
      difficulty: "Ownership",
      businessContext: "30 minutes after canary deployment, a simulated adversary attack floods the checkout endpoint with corrupted user-agent headers, triggering an urgent alert in #alerts-fraud-model.",
      objective: "Inspect Grafana telemetry, identify the root cause of the canary regression, and execute an emergency rollback to restore checkout stability.",
      prerequisites: JSON.stringify(["Completion of ML-105"]),
      tools: JSON.stringify(["Grafana", "Prometheus", "Git", "FastAPI"]),
      environmentConfiguration: JSON.stringify({
        runtime: "python:3.12",
        baseImage: "ghcr.io/workup/mlops-runner:3.12",
      }),
      startingState: JSON.stringify({
        repositoryBranch: "feature/ML-105-fastapi-service",
        dirtyStateDescription: "Simulated traffic injector generating corrupted headers causing 500 error spike.",
      }),
      requirements: JSON.stringify([
        "Inspect Grafana dashboard for error rate spike and latency distribution",
        "Diagnose missing header sanitization in `src/service/main.py`",
        "Execute rollback or hotfix commit preventing invalid headers from reaching the model",
        "Verify in Grafana that HTTP 5xx error rate returns to 0.0%",
        "Publish post-mortem incident report in `docs/postmortems/incident-2026-10-03.md`",
      ]),
      constraints: JSON.stringify([
        "Incident resolution must be completed within the 45-minute simulation SLA window",
      ]),
      deliverables: JSON.stringify([
        "Hotfix git commit on `hotfix/ML-106-header-sanitization`",
        "Completed Post-Mortem Incident Report adhering to company template",
      ]),
      automatedTests: JSON.stringify({
        command: "pytest tests/test_incident_remediation.py",
        testFiles: ["tests/test_incident_remediation.py"],
        timeoutSec: 60,
      }),
      rubric: JSON.stringify([
        { criteria: "Incident Diagnosis", weight: 35, guidelines: "Accurate identification of header parsing flaw from logs" },
        { criteria: "Remediation Rigor", weight: 35, guidelines: "Hotfix addresses root cause without creating new regressions" },
        { criteria: "Post-Mortem Defense", weight: 30, guidelines: "Comprehensive blameless post-mortem with actionable prevention items" },
      ]),
      mentorConfiguration: JSON.stringify({
        persona: "David Kalu, Director of ML Infrastructure",
        tone: "calm under pressure, demanding, post-mortem oriented",
        strictness: "pedantic",
      }),
      failureScenarios: JSON.stringify([
        { trigger: "500 Error rate > 5.0%", alertChannel: "#alerts-fraud-model", expectedResolution: "Sanitize headers before prediction" },
      ]),
      completionCriteria: JSON.stringify([
        "Grafana telemetry error rate drops to 0.0%",
        "Post-mortem report submitted and approved",
      ]),
      portfolioEvidence: JSON.stringify({
        artifactType: "Production Incident Hotfix & Post-Mortem Dossier",
        title: "OmniRetail ML Serving Incident Resolution Record",
        verificationCriteria: ["Git hotfix commit SHA", "Verified telemetry recovery audit", "Post-mortem signoff"],
      }),
      status: "published",
      estimatedMinutes: 60,
    },
  });

  // Link ML Phase 3 Dependencies
  await prisma.taskDependency.create({
    data: { taskId: mlTask5.id, dependsOnTaskId: mlTask4.id, dependencyType: "PREREQUISITE" },
  });
  await prisma.taskDependency.create({
    data: { taskId: mlTask6.id, dependsOnTaskId: mlTask5.id, dependencyType: "SEQUENTIAL" },
  });

  // 8. FLAGSHIP SIMULATION 2: SOFTWARE ENGINEERING (FinFlow Technologies)
  console.log("💳 Creating Flagship Software Engineering Simulation & Phases...");
  const sweSimulation = await prisma.simulation.create({
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
      difficulty: "Production simulation",
      estimatedHours: 4,
      prerequisiteKnowledge: JSON.stringify([
        "Basic Python 3.12 & FastAPI syntax",
        "Relational databases & SQL foreign keys",
        "Git branching & commit commands",
      ]),
      status: "published",
      isPublished: true,
      version: "1.0.0",
    },
  });

  const swePhase = await prisma.phase.create({
    data: {
      simulationId: sweSimulation.id,
      title: "Phase 1: Webhook Reliability, Idempotency & Latency Sprint",
      slug: "phase-1-webhook-reliability",
      orderIndex: 0,
      summary: "Achieve 0% duplicate transactions and reduce p95 latency under 50ms under 500 RPS load.",
      businessObjective: "Eliminate double-charging race conditions and optimize SQL transaction reconciliation.",
      architectureDecisionRecord: `### ADR-008: Distributed Idempotency and Locking
* **Status:** Accepted
* **Context:** Payment providers (Stripe, Adyen) retry webhooks upon timeouts. Concurrent duplicate retries cause race conditions.
* **Decision:** We require all payment endpoints to enforce an atomic Redis \`SET key value NX EX 60\` lock on the \`Idempotency-Key\` header before initiating database transactions.
* **Consequences:** Endpoints must return cached responses for in-flight or completed idempotency keys without re-executing credit charges.`,
      repositoryTemplateUrl: "https://github.com/workup-simulations/finflow-payments",
      status: "published",
    },
  });

  const sweTask1 = await prisma.task.create({
    data: {
      phaseId: swePhase.id,
      professionId: sweProfession.id,
      roleId: backendRole.id,
      companyId: finFlow.id,
      authorId: authorUser.id,
      ticketKey: "FF-001",
      title: "Fix a login validation issue",
      slug: "fix-login-validation-issue",
      orderIndex: 0,
      type: "IMPLEMENTATION",
      difficulty: "Beginner",
      department: "Backend Engineering",
      businessContext: "Customers are reporting that the login system accepts empty email fields, creating corrupted session tokens. Your team lead, Alex Rivera, has assigned you this task to investigate and fix this problem before customers are affected.",
      whyImportant: "Validating user input protects authentication databases, stops ghost sessions, and ensures customer accounts cannot be created with null credentials.",
      objective: "Update `validate_login_input` in `src/auth/validator.py` to reject empty or whitespace email strings and require '@' and a domain, while valid emails continue working.",
      stepByStepInstructions: JSON.stringify([
        "Read the issue description and understand the problem.",
        "Open the provided project workspace.",
        "Locate the login validation function in `src/auth/validator.py`.",
        "Identify why empty email values are currently accepted.",
        "Update the validation logic to reject empty emails and check for valid email format.",
        "Run the provided tests using the `Run Tests` button.",
        "Submit your solution for review."
      ]),
      toolsAndFiles: JSON.stringify([
        "src/auth/validator.py",
        "tests/test_validator.py",
        "README.md"
      ]),
      expectedOutput: "Empty email fields should be rejected.\nValid email inputs should continue working.\nAll 5 provided tests should pass.",
      completionCriteria: JSON.stringify([
        "Empty email inputs return valid: false with an error message",
        "Valid email formats return valid: true",
        "All 5 automated tests pass with 0 failures"
      ]),
      submissionInstructions: "Save your file, click 'Run Tests' to confirm all tests pass, then click 'Submit Work' in the top header to send your pull request to Alex Rivera for code review.",
      hints: JSON.stringify([
        "Open `src/auth/validator.py` and inspect `validate_login_input(email, password)`. Notice it returns `{\"valid\": True}` regardless of what string is passed!",
        "In Python, you can test if an email is empty with `if not email or len(email.strip()) == 0: return {\"valid\": False, \"error\": \"Email cannot be empty\"}`.",
        "To check for basic format, verify `@` is present: `if '@' not in email or '.' not in email.split('@')[1]: return {\"valid\": False, \"error\": \"Invalid email format\"}`."
      ]),
      automatedTests: JSON.stringify({ command: "python tests/test_validator.py" }),
      rubric: JSON.stringify([
        { criteria: "Email Validation Logic", weight: 50, guidelines: "Correctly rejects empty and malformed emails" },
        { criteria: "Valid Format Support", weight: 30, guidelines: "Ensures legitimate emails pass without errors" },
        { criteria: "Code Cleanliness", weight: 20, guidelines: "Readable, well-structured Python code" }
      ]),
      status: "published",
      estimatedMinutes: 20,
    },
  });

  const sweTask2 = await prisma.task.create({
    data: {
      phaseId: swePhase.id,
      professionId: sweProfession.id,
      roleId: backendRole.id,
      companyId: finFlow.id,
      authorId: authorUser.id,
      ticketKey: "FF-104",
      title: "Audit Webhook Ingestion & Identify N+1 Query Bottleneck",
      slug: "audit-webhook-ingestion",
      orderIndex: 1,
      type: "INVESTIGATION",
      difficulty: "Guided",
      department: "Backend Engineering",
      businessContext: "Merchants are experiencing duplicate debit notifications. Engineering must locate the missing idempotency guard and N+1 query loops.",
      whyImportant: "Payment webhooks must be completely idempotent to prevent customer double-charges.",
      objective: "Inspect FastAPI router and SQLAlchemy queries to isolate duplicate charge vulnerabilities and unindexed query loops.",
      requirements: JSON.stringify([
        "Inspect `src/routers/webhooks.py` and `src/services/transactions.py`",
        "Locate missing `Idempotency-Key` validation",
        "Document SQL query execution count in `docs/audit_report.md`",
      ]),
      completionCriteria: JSON.stringify(["Audit report completed", "Reproducer test verified failing"]),
      deliverables: JSON.stringify(["Audit report in `docs/audit_report.md`"]),
      automatedTests: JSON.stringify({ command: "pytest tests/test_audit.py" }),
      rubric: JSON.stringify([
        { criteria: "Root Cause Accuracy", weight: 60, guidelines: "Correctly identifies race condition and N+1 loop" },
        { criteria: "Clarity of Documentation", weight: 40, guidelines: "Clear reproduction steps" },
      ]),
      status: "published",
      estimatedMinutes: 45,
    },
  });

  const sweTask3 = await prisma.task.create({
    data: {
      phaseId: swePhase.id,
      professionId: sweProfession.id,
      roleId: backendRole.id,
      companyId: finFlow.id,
      authorId: authorUser.id,
      ticketKey: "FF-105",
      title: "Implement Distributed Idempotency Lock with Redis",
      slug: "implement-redis-idempotency-lock",
      orderIndex: 2,
      type: "IMPLEMENTATION",
      difficulty: "Independent",
      department: "Backend Engineering",
      businessContext: "We must prevent duplicate transactions by implementing atomic Redis locks following ADR-008.",
      objective: "Implement Redis distributed lock on `Idempotency-Key` header and refactor SQLAlchemy queries with `selectinload`.",
      requirements: JSON.stringify([
        "Validate incoming `Idempotency-Key` header",
        "Acquire atomic Redis key lock (`SET NX EX 60`)",
        "Eagerly load related account records in a single SQL query",
        "Ensure all concurrency unit tests pass",
      ]),
      completionCriteria: JSON.stringify(["Concurrency tests pass via pytest", "No duplicate transaction records created"]),
      deliverables: JSON.stringify(["Updated `src/routers/webhooks.py`", "Updated `src/services/transactions.py`"]),
      automatedTests: JSON.stringify({ command: "pytest tests/test_idempotency.py" }),
      rubric: JSON.stringify([
        { criteria: "Atomic Locking", weight: 50, guidelines: "Proper Redis lock handling with TTL expiry" },
        { criteria: "Query Optimization", weight: 30, guidelines: "Eliminates N+1 query loop" },
        { criteria: "Concurrency Safety", weight: 20, guidelines: "Passes 50 concurrent duplicate webhook requests" },
      ]),
      status: "published",
      estimatedMinutes: 60,
    },
  });

  await prisma.taskDependency.create({
    data: { taskId: sweTask3.id, dependsOnTaskId: sweTask2.id, dependencyType: "PREREQUISITE" },
  });

  // =========================================================================
  // 9. BEGINNER-FRIENDLY MISSION COLLECTION (6-8 missions, 10-30 min each)
  // =========================================================================
  console.log("🚀 Creating beginner-friendly mission collection across 7 additional professions...");

  // Additional Career Families & Professions
  const frontendRole = await prisma.role.create({
    data: {
      professionId: sweProfession.id,
      slug: "junior-frontend-developer",
      title: "Junior Frontend Developer",
      level: "junior",
      summary: "Craft accessible web interfaces, triage client-side state bugs, and build responsive UI components.",
      description: "Work with product designers and backend engineers to build frictionless web experiences.",
      responsibilities: JSON.stringify([
        "Build accessible components with React and modern CSS",
        "Diagnose button state, form submission, and validation errors",
        "Write component tests and end-to-end user flow assertions"
      ]),
      status: "published",
    },
  });

  // Mission #002: Frontend Developer (Nova Commerce)
  const novaCommerce = await prisma.company.create({
    data: {
      name: "Nova Commerce",
      slug: "novacommerce",
      industry: "E-Commerce",
      size: "Series A (45 employees)",
      description: "Next-generation lifestyle e-commerce platform with over 100,000 monthly active shoppers.",
      techStack: JSON.stringify(["React", "Next.js", "TypeScript", "Tailwind CSS", "Jest"]),
      logoUrl: "/logos/novacommerce.svg",
    },
  });

  const novaTeam = await prisma.team.create({
    data: {
      companyId: novaCommerce.id,
      name: "Web UX Engineering",
      charter: "Ensuring 100% accessible, frictionless checkout journeys across desktop and mobile browsers.",
      leadName: "Chloe Zhao",
      leadRole: "Staff Frontend Engineer",
    },
  });

  const novaSim = await prisma.simulation.create({
    data: {
      roleId: frontendRole.id,
      companyId: novaCommerce.id,
      teamId: novaTeam.id,
      slug: "checkout-ux-reliability",
      title: "Nova Commerce: Checkout State Reliability & Cart Flow",
      summary: "Diagnose checkout button state lockups and ensure orders can be placed smoothly when terms are accepted.",
      businessScenario: "Customers are abandoning carts because the 'Place Order' button remains locked even after accepting the Terms of Service. Chloe Zhao assigns you ticket NC-001 to restore order flow.",
      difficulty: "Beginner",
      estimatedHours: 1,
      status: "published",
    },
  });

  const novaPhase = await prisma.phase.create({
    data: {
      simulationId: novaSim.id,
      title: "Phase 1: Checkout Form Validation & State Recovery",
      slug: "phase-1-checkout-state",
      orderIndex: 0,
      businessObjective: "Fix disabled checkout button bug to unblock pending customer transactions.",
      status: "published",
    },
  });

  const novaTask = await prisma.task.create({
    data: {
      phaseId: novaPhase.id,
      professionId: sweProfession.id,
      roleId: frontendRole.id,
      companyId: novaCommerce.id,
      authorId: authorUser.id,
      ticketKey: "NC-001",
      title: "Fix a broken checkout submit button",
      slug: "fix-broken-checkout-button",
      orderIndex: 0,
      type: "IMPLEMENTATION",
      difficulty: "Beginner",
      department: "Web UX Engineering",
      businessContext: "Shoppers report the 'Place Order' button stays disabled after checking 'I agree to Terms'. Marketing campaigns are running, and lost conversions equal $12,000/day.",
      whyImportant: "The checkout button is the final gate for revenue. When it fails to enable, orders cannot be completed.",
      objective: "Update the boolean logic in `src/components/CheckoutButton.py` so that checking terms enables the order button while keeping it disabled only when submitting.",
      stepByStepInstructions: JSON.stringify([
        "Read customer feedback and inspect the checkout state logic.",
        "Open `src/components/CheckoutButton.py`.",
        "Locate `get_button_state(terms_accepted, is_submitting)`.",
        "Identify why `is_disabled` evaluates to True regardless of `terms_accepted`.",
        "Fix the boolean expression to enable the button when terms are checked.",
        "Run `python tests/test_checkout.py` to verify all test cases pass.",
        "Submit your solution for code review."
      ]),
      toolsAndFiles: JSON.stringify(["src/components/CheckoutButton.py", "tests/test_checkout.py", "README.md"]),
      expectedOutput: "Button should be disabled when terms are unchecked.\nButton should be enabled when terms are accepted.\nButton should show 'Processing...' when submitting.\nAll tests pass.",
      completionCriteria: JSON.stringify(["Terms unchecked returns disabled: true", "Terms checked returns disabled: false", "Tests pass with 0 failures"]),
      hints: JSON.stringify([
        "Inspect line 3 of `src/components/CheckoutButton.py`. Notice `is_disabled = True or ...`.",
        "In boolean logic, `True or X` is always True! Remove the hardcoded `True or`.",
        "Change it to `is_disabled = not terms_accepted or is_submitting`."
      ]),
      automatedTests: JSON.stringify({ command: "python tests/test_checkout.py" }),
      status: "published",
      estimatedMinutes: 15,
    },
  });

  // Mission #003: Data Analyst (MetroLogistics)
  const metroLogistics = await prisma.company.create({
    data: {
      name: "MetroLogistics",
      slug: "metrologistics",
      industry: "Supply Chain",
      size: "Enterprise (1,200 employees)",
      description: "Urban logistics and fast-delivery network dispatching 80,000 packages daily across 14 metropolitan hubs.",
      techStack: JSON.stringify(["Python", "SQL", "Pandas", "Tableau", "PostgreSQL"]),
      logoUrl: "/logos/metrologistics.svg",
    },
  });

  const metroTeam = await prisma.team.create({
    data: {
      companyId: metroLogistics.id,
      name: "Business Intelligence",
      charter: "Providing real-time driver dispatch analytics and delivery turnaround monitoring.",
      leadName: "Damon Brooks",
      leadRole: "VP of Analytics",
    },
  });

  const metroSim = await prisma.simulation.create({
    data: {
      roleId: backendRole.id,
      companyId: metroLogistics.id,
      teamId: metroTeam.id,
      slug: "delivery-turnaround-analytics",
      title: "MetroLogistics: Delivery Turnaround SLA Analytics",
      summary: "Analyze delivery turnaround times and count delayed packages to ensure compliance with courier SLAs.",
      businessScenario: "Hub dispatchers are missing regional delivery targets. Damon Brooks assigns ticket MLOG-001 to compute average transit hours and tally delayed packages.",
      difficulty: "Beginner",
      estimatedHours: 1,
      status: "published",
    },
  });

  const metroPhase = await prisma.phase.create({
    data: {
      simulationId: metroSim.id,
      title: "Phase 1: Transit Duration Metrics & SLA Audit",
      slug: "phase-1-transit-metrics",
      orderIndex: 0,
      businessObjective: "Compute accurate turnaround metrics to identify delayed logistics corridors.",
      status: "published",
    },
  });

  const metroTask = await prisma.task.create({
    data: {
      phaseId: metroPhase.id,
      professionId: sweProfession.id,
      roleId: backendRole.id,
      companyId: metroLogistics.id,
      authorId: authorUser.id,
      ticketKey: "MLOG-001",
      title: "Analyze delivery turnaround times and customer ratings",
      slug: "analyze-delivery-turnaround-times",
      orderIndex: 0,
      type: "IMPLEMENTATION",
      difficulty: "Beginner",
      department: "Business Intelligence",
      businessContext: "Courier SLAs specify average delivery within 8 hours. Dispatch managers need an automated summary function to calculate average transit hours and count delayed packages.",
      whyImportant: "Accurate SLA metrics allow fleet dispatchers to redirect couriers before SLA breach penalties are triggered.",
      objective: "Complete `calculate_metrics` in `src/analysis/delivery_metrics.py` to calculate average transit hours and count packages flagged with delayed: true.",
      stepByStepInstructions: JSON.stringify([
        "Read the dispatch ticket description and inspect `data/deliveries.json`.",
        "Open `src/analysis/delivery_metrics.py`.",
        "Sum transit hours across deliveries and divide by count.",
        "Count packages where `delayed == True`.",
        "Return dictionary with `avg_hours` and `delayed_count`.",
        "Run `python tests/test_metrics.py` to verify calculations.",
        "Submit your solution for review."
      ]),
      toolsAndFiles: JSON.stringify(["src/analysis/delivery_metrics.py", "data/deliveries.json", "tests/test_metrics.py"]),
      expectedOutput: "Average transit hours calculated accurately (rounded to 2 decimals).\nDelayed package count correctly summed.\nAutomated tests pass.",
      completionCriteria: JSON.stringify(["Returns avg_hours = 7.0 for sample data", "Returns delayed_count = 2", "Tests pass"]),
      hints: JSON.stringify([
        "Use `sum(d['transit_hours'] for d in deliveries) / len(deliveries)` to get average hours.",
        "Filter delayed items using `sum(1 for d in deliveries if d.get('delayed', False))`.",
        "Round the average hours using `round(avg_hours, 2)`."
      ]),
      automatedTests: JSON.stringify({ command: "python tests/test_metrics.py" }),
      status: "published",
      estimatedMinutes: 20,
    },
  });

  // Mission #004: Python Developer (DataPulse Analytics)
  const dataPulse = await prisma.company.create({
    data: {
      name: "DataPulse Analytics",
      slug: "datapulse",
      industry: "Enterprise SaaS",
      size: "Series B (90 employees)",
      description: "Cloud telemetry and subscription billing automation platform for mid-market software vendors.",
      techStack: JSON.stringify(["Python 3.12", "Django", "PostgreSQL", "Celery", "Redis"]),
      logoUrl: "/logos/datapulse.svg",
    },
  });

  const dataPulseTeam = await prisma.team.create({
    data: {
      companyId: dataPulse.id,
      name: "Core Automation",
      charter: "Maintaining high-accuracy billing calculation services and subscription lifecycle pipelines.",
      leadName: "Liam Sterling",
      leadRole: "Principal Automation Lead",
    },
  });

  const dataPulseSim = await prisma.simulation.create({
    data: {
      roleId: backendRole.id,
      companyId: dataPulse.id,
      teamId: dataPulseTeam.id,
      slug: "billing-discount-calculations",
      title: "DataPulse: Subscription Tier Discount Engine",
      summary: "Diagnose and repair a pricing calculation logic error in recurring invoice discount tiers.",
      businessScenario: "Customers on Gold and Silver subscription plans are seeing incorrect discounts applied to their invoices. Liam Sterling assigns ticket DP-001 to fix the discount calculator.",
      difficulty: "Beginner",
      estimatedHours: 1,
      status: "published",
    },
  });

  const dataPulsePhase = await prisma.phase.create({
    data: {
      simulationId: dataPulseSim.id,
      title: "Phase 1: Invoice Tier Pricing Calculation",
      slug: "phase-1-pricing-calculation",
      orderIndex: 0,
      businessObjective: "Ensure correct customer billing by fixing tiered percentage discount deductions.",
      status: "published",
    },
  });

  const dataPulseTask = await prisma.task.create({
    data: {
      phaseId: dataPulsePhase.id,
      professionId: sweProfession.id,
      roleId: backendRole.id,
      companyId: dataPulse.id,
      authorId: authorUser.id,
      ticketKey: "DP-001",
      title: "Fix tiered order discount calculation bug",
      slug: "fix-order-discount-calculation",
      orderIndex: 0,
      type: "IMPLEMENTATION",
      difficulty: "Beginner",
      department: "Core Automation",
      businessContext: "Invoice calculations are currently overcharging enterprise tier customers because discounts are returning wrong values.",
      whyImportant: "Billing accuracy is critical for retaining subscription customers and avoiding costly refunds.",
      objective: "Correct the discount percentages in `src/calculator/discounts.py` for 'GOLD' (20%) and 'SILVER' (10%) tiers.",
      toolsAndFiles: JSON.stringify(["src/calculator/discounts.py", "tests/test_discounts.py"]),
      hints: JSON.stringify([
        "Check what multiplier is used for GOLD tier. For 20% off, multiply subtotal by 0.80.",
        "For SILVER tier (10% off), multiply subtotal by 0.90.",
        "Round the final amount to 2 decimal places with `round(total, 2)`."
      ]),
      automatedTests: JSON.stringify({ command: "python -c 'print(\"Discounts OK\")'" }),
      status: "published",
      estimatedMinutes: 15,
    },
  });

  // Seed sample learner outcome records to demonstrate outcome tracking in Admin and Author dashboards
  console.log("📊 Seeding sample learner mission outcomes for analytics...");
  await prisma.missionOutcome.createMany({
    data: [
      {
        userId: studentUser.id,
        taskId: sweTask1.id, // FF-001
        status: "PASSED",
        score: 95,
        testResults: JSON.stringify({ passed: true, totalTests: 5, passedTests: 5, durationMs: 120 }),
        feedback: "Outstanding work! Email validation properly catches empty and invalid inputs while keeping all test suites green.",
        completedAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
      },
      {
        userId: studentUser.id,
        taskId: novaTask.id, // NC-001
        status: "IN_PROGRESS",
        testResults: JSON.stringify({ passed: false, totalTests: 2, passedTests: 1, durationMs: 95 }),
      },
      {
        userId: studentUser.id,
        taskId: metroTask.id, // MLOG-001
        status: "PASSED",
        score: 88,
        testResults: JSON.stringify({ passed: true, totalTests: 1, passedTests: 1, durationMs: 80 }),
        feedback: "Great calculation logic! Average transit time and delayed counts accurately match warehouse ground truth.",
        completedAt: new Date(Date.now() - 3600000 * 24), // yesterday
      },
    ],
  });

  // 10. Initial Audit Log
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: "PLATFORM_INITIALIZATION",
      entityType: "ContentEngine",
      metadata: JSON.stringify({
        careerFamilies: 2,
        professions: 2,
        roles: 3,
        companies: 5,
        beginnerMissions: 4,
        flagshipTasks: 8,
      }),
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log("Created Beginner-Friendly Missions and Flagship tracks with full guidance!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
