# WORKUP — Project Facts, Implementation Verification, and Architectural Gaps

**Project Identity:** WORKUP — Virtual Professional Experience Platform  
**Target Repository:** `https://github.com/asam0001/WORKUP` (Local Clone: `asam0001/WORKUP`)  
**Associated Original Discussions:** ChatGPT Conversation *"Idea Model Comparison"* (Share ID: `6addca9a-f718-83e8-8ed9-3d4ba829a0eb`)  
**Evaluation Stage:** Major Project Stage-I (Undergraduate Engineering Project)  
**Date of Verification:** October 2026  

---

## 1. Executive Summary & Core Identity

**WORKUP** is designed as a *Virtual Professional Experience Platform* that bridges the gap between conceptual technical learning and corporate software engineering practice. Rather than presenting learners with passive video lectures, multiple-choice quizzes, or isolated single-file algorithmic puzzles, WORKUP simulates realistic technical workplaces. 

Learners enter simulated companies, assume specific professional roles, receive business problem tickets containing architectural decision records (ADRs) and legacy codebases, develop in isolated cloud workspaces, run comprehensive test suites, submit pull requests for automated line-by-line code review, and build verifiable, commit-backed dossiers of practical competence.

The central guiding lifecycle of WORKUP is:
$$\text{Career} \longrightarrow \text{Role} \longrightarrow \text{Company} \longrightarrow \text{Business Problem} \longrightarrow \text{Professional Task} \longrightarrow \text{Real Tools} \longrightarrow \text{Cloud Workspace} \longrightarrow \text{Implementation} \longrightarrow \text{Testing} \longrightarrow \text{Review} \longrightarrow \text{Deployment} \longrightarrow \text{Monitoring} \longrightarrow \text{Debugging} \longrightarrow \text{Evidence of Skill}$$

---

## 2. Source Material Inventory

| Source Identifier | Type | Location / Reference | Verification Status | Notes & Scope |
| :--- | :--- | :--- | :--- | :--- |
| **SRC-01: Shared Discussion** | Original Design Discussion | ChatGPT Share URL: `https://chatgpt.com/share/6addca9a-f718-83e8-8ed9-3d4ba829a0eb` | **Verified & Parsed** | Contains the *"Idea Model Comparison"*, the 50-point Master Build Prompt, and the 13-phase architectural roadmap (Phases 0–12). |
| **SRC-02: Codebase Repository** | Production Codebase | GitHub: `asam0001/WORKUP`<br>Local Workspace: `c:\Users\Mruthyunjaya\.gemini\antigravity\scratch\workup` | **Verified & Executed** | Contains the implemented Next.js 14 App Router platform, Prisma ORM schema (21 models), seed scripts, workspace orchestrator, isolated sandbox provider, and Vitest suite. |
| **SRC-03: Academic Sample** | College Stage-I Reference Format | `Content to be followed for Preparing Major Project Stage-1 Document & a Sample Copy.pdf` (OneDrive Project Directory) | **Verified & Analyzed** | 70-page document from ACE Engineering College establishing structure, headings, page borders, font sizing, and formatting guidelines. |
| **SRC-04: Review Presentation** | Supplementary Slide Deck | `Major project review 2.pptx` (OneDrive Project Directory) | **Inspected & Excluded** | Slide deck for an unrelated batch (Batch 05, Low-Resource Code-Mixed Languages / Surveillance Robot). Excluded from report subject matter as per strict project isolation rules. |

---

## 3. Verified Implementation Facts (Codebase Evidence)

The following features have been verified directly in the repository source code and confirmed by executing the automated test runner:

### 3.1 Technology Stack & Architecture
* **Frontend Framework:** Next.js 14.2 (App Router architecture), React 18, TypeScript, Tailwind CSS, Lucide React icons.
* **Backend API:** RESTful Next.js Route Handlers with Zod request schema validation and structured JSON response envelope formatting (`api-response.ts`).
* **Data Access & Persistence:** Prisma ORM 5.x configured with SQLite (`file:./dev.db`) for lightweight, zero-dependency local execution, designed for clean migration to PostgreSQL in production environments.
* **Authentication Infrastructure:** Secure password hashing using `bcryptjs` (salt rounds: 12), signed stateless JSON Web Tokens using `jose`, and HTTP-only, secure, `SameSite=Lax` session cookies (`auth.ts`).
* **Role-Based Access Control (RBAC):** Hierarchical 4-role permission matrix supporting:
  1. `student`: Access to career explorer, simulations, workspace launcher, submission workflows, profile.
  2. `content_author`: Creation and authoring of professions, roles, companies, simulations, and tasks.
  3. `reviewer`: Inspection of student submissions, rubric grading, approving/rejecting pull requests.
  4. `administrator`: Platform metrics, system governance, and immutable audit log inspection.
* **Automated Testing Suite:** Vitest 2.1.9 with TypeScript path aliasing (`@/*`). Currently executes **34 passing tests across 8 test suites** (100% pass rate).

### 3.2 Core Domain Schema (21 Verified Prisma Entities)
The database schema (`prisma/schema.prisma`) defines 21 interconnected models:
1. `User`: Account identity, credentials, status, role assignment.
2. `Profile`: Developer bio, experience level, portfolio URLs, preferences.
3. `Session`: Active authenticated token tracking with expiration and revocation.
4. `PasswordResetToken`: Single-use secure password recovery tokens.
5. `CareerFamily`: Top-level industry groupings (e.g., Software Engineering, AI & Data).
6. `Profession`: Engineering disciplines (e.g., Software Engineering, ML Engineering).
7. `Role`: Specific job titles (e.g., Junior Backend Engineer, Associate MLOps Engineer).
8. `Skill`: Normalized competencies (e.g., Python, Docker, Fastify, Vitest, MLflow).
9. `RoleSkill`: Join table mapping required and recommended skills to roles.
10. `Company`: Simulated enterprise employers (e.g., *FinFlow Technologies*, *OmniRetail Marketplace*).
11. `Team`: Functional departments within companies with charters, tech leads, and communication channels.
12. `Simulation`: Cohesive business problem packages with estimated hours and difficulty levels.
13. `Phase`: Distinct sprint milestones within a simulation incorporating ADRs.
14. `Task`: Granular engineering work tickets with ticket keys (e.g., `FF-104`, `ML-101`), type, deliverables, acceptance criteria, and JSON-encoded test definitions.
15. `TaskSkill`: Join table linking technical competencies exercised by specific tasks.
16. `TaskDependency`: Directed Acyclic Graph (DAG) enforcing prerequisite, sequential, and branching workflows with unlock conditions.
17. `Workspace`: Container lifecycle state (`Requested`, `Provisioning`, `Ready`, `Running`, `Idle`, `Stopping`, `Destroyed`), resource caps, ports, connection tokens, and telemetry metrics.
18. `Submission`: Pull request metadata, branch names, commit SHAs, diff summaries, and student reflection notes.
19. `Evaluation`: Automated AI and human reviewer rubrics, numerical scores (0–100), and structured markdown feedback.
20. `PortfolioItem`: Cryptographically verifiable Evidence-of-Skill dossiers showcasing completed simulations.
21. `AuditLog`: Immutable audit trail recording user actions, entity types, IP addresses, and JSON metadata.

### 3.3 Workspace Orchestration & Execution Engine
* **Orchestrator Service (`src/lib/workspace/orchestrator.ts`):** Manages workspace lifecycle transitions, allocates execution sandboxes, enforces per-user concurrency limits (maximum 2 active workspaces per student), and handles automated idle timeouts.
* **Isolated Sandbox Provider (`src/lib/workspace/providers/sandbox-provider.ts`):** Implements an isolated, directory-jailed process execution provider (`IsolatedSandboxProvider`) that spawns node/shell tasks within `.workspaces/<workspace-id>`, monitors CPU/memory thresholds, enforces hard command execution timeouts (e.g., 4000ms), and captures stdout/stderr.
* **Task Validation Engine (`src/lib/validation/task-validator.ts`):** Validates task specifications, environment configurations, and rubric criteria before publication.

---

## 4. Features Described in Discussions but Not Yet Implemented

The original design discussions and Master Build Prompt outline several advanced components planned for subsequent engineering phases (Phases 4–12):

1. **Production Container Orchestrator (Docker / Kubernetes):** The current workspace engine uses a filesystem-isolated process provider (`IsolatedSandboxProvider`) for local MVP execution. Full Docker/containerd/K8s remote container provisioning with network firewalls and DevContainer specifications is planned for Stage-II.
2. **AI Tech Lead LLM PR Reviewer:** An automated multi-turn LLM reviewer that parses Git unified diffs, checks code against corporate style guides and ADR constraints, injects line-by-line PR comments, and determines merge approval.
3. **Multi-Discipline Flagship Catalog:** Currently, the seed data contains the *FinFlow Technologies* Payment Webhook Idempotency track (`FF-104`) and baseline entities. The full 15-task *ShopSphere ML Customer Churn* simulation and DevOps/Cybersecurity tracks are designed but remain in content authoring backlog.
4. **Synthetic Production Telemetry & Observability:** Simulated Grafana dashboards, Prometheus metrics, and synthetic alert firing for incident response tasks (e.g., simulating 502 bad gateway spikes or model prediction drift).
5. **Cryptographic Portfolio Verification:** Public verification portal that serves signed JSON dossiers with SHA-256 commit hashes, enabling recruiters to verify that code was tested and reviewed without tampering.

---

## 5. Architectural Roadmap (Phases 0 through 12)

| Phase | Designation | Primary Focus & Deliverables | Current Status |
| :---: | :--- | :--- | :---: |
| **Phase 0** | Research & Validation | Product positioning, domain requirements, 50-point specification. | **Completed** |
| **Phase 1** | Application Foundation | Monorepo setup, Next.js App Router, Prisma ORM, Auth, RBAC, Vitest. | **Completed (Verified)** |
| **Phase 2** | Content Engine & DAG | 21-entity domain schema, task dependency DAG, validation engine, admin seed. | **Completed (Verified)** |
| **Phase 3** | Cloud Workspace Engine | Workspace orchestrator, isolated sandbox provider, workbench UI, execution tests. | **Completed (Verified)** |
| **Phase 4** | Professional Toolchain | Browser-based IDE integration, Git branch/commit simulation, staging previews. | *In Progress (Stage-I Scope)* |
| **Phase 5** | Evaluation Engine | Multi-tier test runner (unit, integration, hidden benchmark suites), rubric scoring. | *Planned (Stage-II)* |
| **Phase 6** | AI Mentor & Tech Lead | Context-aware AI Senior Engineer agent, Socratic debugging hints, PR review agent. | *Planned (Stage-II)* |
| **Phase 7** | Flagship ML Simulation | Complete *ShopSphere* MLOps churn prediction pipeline (15 tasks). | *Planned (Stage-II)* |
| **Phase 8** | Verifiable Portfolio | Evidence-of-Skill dossier generator, Git commit verification, public viewer. | *Planned (Stage-II)* |
| **Phase 9** | Security & Cost Hardening | Container jailing, egress network filtering, compute quota limits, anti-abuse. | *Planned (Stage-II)* |
| **Phase 10** | Content Studio & Admin | Visual simulation editor, team topology manager, audit log dashboard. | *Planned (Stage-II)* |
| **Phase 11** | Production QA & Benchmarks | End-to-end integration tests, load testing, multi-tenant benchmark validation. | *Planned (Stage-II)* |
| **Phase 12** | Pilot & Evaluation | Cohort pilot evaluation with undergraduate students, efficacy metrics. | *Planned (Stage-II)* |

---

## 6. Assumptions, Constraints, and Unresolved Technical Questions

### 6.1 Academic Institutional Context
* **Placeholders Required:** Since the project is being prepared for Stage-I academic evaluation and specific supervisor/department assignments must follow institutional privacy standards, the report utilizes formal placeholders:
  * Student Name: `[Student Name]`
  * Roll Number / USN: `[Roll Number / USN]`
  * Department: `Department of Computer Science and Engineering`
  * Institution: `[Institution / University Name]`
  * Academic Year: `2026–2027`
  * Internal Guide / Supervisor: `[Supervisor Name, Designation]`

### 6.2 Technical Infrastructure Assumptions
* **Local vs. Cloud Execution:** For Major Project Stage-I demonstrations, the platform is designed to execute locally on standard development hardware (Node.js 18+, SQLite, local sandbox processes) without requiring thousands of dollars in cloud infrastructure credits.
* **Database Transition:** The local SQLite database (`dev.db`) shares a 100% compatible Prisma schema with PostgreSQL, ensuring that transition to AWS RDS / Supabase in Stage-II requires only changing the datasource provider string.
* **LLM API Economy:** The AI Tech Lead reviewer will operate with prompt caching, token budgets, and deterministic rubric fallbacks to prevent cost inflation during academic demonstration.
