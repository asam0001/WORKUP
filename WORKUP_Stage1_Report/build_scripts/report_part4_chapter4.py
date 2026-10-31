# Part 4: Chapter 4 (System Design and UML Modeling)
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from write_full_report import (
    doc, add_chapter_title, add_heading_1, add_heading_2, add_heading_3,
    add_p, add_bullet, add_figure, add_callout, COLOR_NAVY, COLOR_PRIMARY, COLOR_MUTED
)

def build_chapter_4():
    add_chapter_title("CHAPTER 4\nSYSTEM DESIGN AND UML MODELING")

    add_heading_1("4.1 System Architecture & Tiered Topology")
    add_p("The system architecture of WORKUP is designed around a multi-tiered, service-oriented topology that cleanly decouples client presentation, API routing, business domain logic, sandbox execution, and persistent storage. Figure 4.1 illustrates the comprehensive tiered system architecture:")

    add_figure("fig_1_system_architecture.png", "Figure 4.1: WORKUP Tiered System Architecture Diagram.", width_in=6.1)

    add_p("The architecture comprises five distinct functional tiers:")
    add_bullet("1. Client Presentation Tier: ", "Constructed using Next.js 14 App Router, React 18, and Tailwind CSS. Delivers high-performance Server Components (RSC) and responsive Client Components for the Landing Page, Career Explorer, Student Workstation, Cloud Workbench, and Public Portfolio Dossier.")
    add_bullet("2. API Gateway & Security Tier: ", "Implemented via Next.js Route Handlers. Serves as the single entry point for all client requests, enforcing runtime payload validation via Zod schemas, managing JWT session verification, and executing Role-Based Access Control (RBAC) authorization guards.")
    add_bullet("3. Core Domain & Business Services Tier: ", "Contains the domain business logic, including the Simulation Content Engine, the Directed Acyclic Graph (DAG) task engine, the Workspace Orchestrator (managing timeouts and concurrency quotas), the Multi-Tier Evaluation Engine, and the append-only Audit Logging Service.")
    add_bullet("4. Workspace & Execution Tier: ", "Manages isolated development environments. In Stage-I, this tier is powered by the IsolatedSandboxProvider, which spawns jailed child processes within dedicated .workspaces/<workspaceId> directories with execution timeouts. In Stage-II, this will scale to containerized Docker/Kubernetes worker pods.")
    add_bullet("5. Persistence & Storage Tier: ", "Utilizes Prisma ORM 5.x as a type-safe database abstraction layer connecting to a relational database (SQLite dev.db in development, PostgreSQL in production), alongside POSIX filesystem storage (.artifacts/) for snapshots and Git diffs.")

    add_heading_1("4.2 Use Case Modeling")
    add_p("The Use Case model formally captures the interactions between external actors and the WORKUP platform boundary. Figure 4.2 presents the unified use case diagram:")

    add_figure("fig_2_use_case.png", "Figure 4.2: WORKUP Unified Use Case Diagram.", width_in=6.1)

    add_p("The system defines interactions for four primary actors:")
    add_bullet("Student / Learner Actor: ", "Interacts with use cases UC-01 (Explore Careers & Roles), UC-02 (Launch Simulation Track), UC-03 (Inspect Ticket & ADR), UC-04 (Provision Cloud Workspace), UC-05 (Run Tests in Sandbox), UC-06 (Submit Pull Request), and UC-07 (View Evidence Dossier).")
    add_bullet("Technical Reviewer Actor: ", "Engages with UC-08 (Inspect PR Diff & Notes), UC-09 (Score Rubric Criteria), and UC-10 (Conduct Line-by-Line Code Review). In Stage-II, this actor is augmented by an automated AI Tech Lead agent.")
    add_bullet("Content Author Actor: ", "Executes UC-11 (Author Company & Teams), UC-12 (Configure Task DAG), and UC-13 (Set Acceptance Benchmarks and Test Harnesses).")
    add_bullet("Administrator Actor: ", "Responsible for platform governance through UC-14 (Audit Log Governance), UC-15 (Fleet Concurrency Limits), and UC-16 (User Role Management).")

    add_heading_1("4.3 Activity Modeling")
    add_p("The Activity Diagram models the dynamic operational workflow of a student progressing through a simulation track, highlighting key decision gates, automated loops, and state transitions. Figure 4.3 depicts this workflow:")

    add_figure("fig_3_activity_workflow.png", "Figure 4.3: WORKUP Activity Workflow Diagram.", width_in=5.9)

    add_p("The activity sequence proceeds through several critical phases and decision points:")
    add_bullet("DAG Prerequisite Verification Gate: ", "When a student selects a task ticket, the system evaluates the task's prerequisite dependencies. If dependencies are unsatisfied, the task remains locked; if satisfied, the workspace provisioning sequence begins.")
    add_bullet("In-Sandbox Test Execution Loop: ", "Within the provisioned sandbox, the student implements their code solution and executes automated tests. If test assertions fail, the learner inspects execution error traces and iterates locally without penalty.")
    add_bullet("Pull Request Evaluation Gate: ", "Once local tests pass, the student submits a pull request. The review engine evaluates the unified diff against architectural rubrics. If changes are requested, the student refactors their solution; if approved, the simulation DAG unlocks subsequent tasks, and verified commit SHAs are appended to the student's Evidence-of-Skill Dossier.")

    add_heading_1("4.4 Sequence Modeling (Task Submission & Review)")
    add_p("The Sequence Diagram details the exact chronological message exchanges and method invocations occurring across system boundaries during test execution and pull request submission. Figure 4.4 illustrates this sequence:")

    add_figure("fig_4_sequence_submission.png", "Figure 4.4: WORKUP Sequence Diagram for Task Submission and Review.", width_in=6.1)

    add_p("The sequence trace is divided into two distinct operational phases:")
    add_bullet("Phase 1: In-Sandbox Test Execution (Messages 1–8): ", "The student clicks \"Run Automated Tests\" in the Workbench UI, triggering a POST request to /api/workspaces/[id]/test. The route handler delegates to the Workspace Orchestrator, which calls IsolatedSandboxProvider.spawnProcess() with the test command (e.g. npm test) and a strict 4000ms timeout cap. The sandbox captures stdout/stderr and exit codes, returning a structured test summary JSON envelope (passed, failed, duration) to render passing badges in the UI.")
    add_bullet("Phase 2: PR Submission & AI Tech Lead Review (Messages 9–19): ", "The student clicks \"Submit Pull Request\", initiating a POST to /api/workspaces/[id]/submit. The orchestrator captures a Git unified diff and commit SHA from the sandbox, persisting a new record in the Submission table with status 'SUBMITTED'. The evaluation engine assesses the diff against the task's rubric and ADR specifications, persisting an Evaluation record (numerical score, structured markdown feedback, approval status) and updating the simulation DAG state to unlock dependent tasks.")

    add_heading_1("4.5 Class and Domain Object Modeling")
    add_p("The Class Diagram formalizes the structural domain model, defining entity attributes, method signatures, and relationship multiplicities. Figure 4.5 illustrates the complete domain class model:")

    add_figure("fig_5_class_domain_model.png", "Figure 4.5: WORKUP Core Domain Class Model Diagram.", width_in=6.1)

    add_p("The class diagram establishes the structural integrity of the 21 domain entities:")
    add_bullet("User and Profile: ", "A 1-to-1 relationship linking identity, hashed credentials, and role permissions to developer portfolio metadata.")
    add_bullet("Career Hierarchy (Profession, Role, Skill): ", "A 1-to-N hierarchy where professions define specific industry roles, and roles map to normalized technical skills via the RoleSkill associative class.")
    add_bullet("Company, Team, and Simulation: ", "Companies organize functional teams (1-to-N) and sponsor multi-sprint simulations (1-to-N). Each simulation contains ordered sprint phases and granular engineering tasks.")
    add_bullet("Task, Workspace, and Submission: ", "Tasks contextualize execution workspaces (1-to-N) and receive student pull request submissions (1-to-N). Each submission receives exactly one evaluation record containing rubric scores and line-by-line feedback.")

    add_heading_1("4.6 Entity-Relationship (ER) Modeling")
    add_p("The Entity-Relationship (ER) Diagram models the relational database schema, depicting primary keys (PK), foreign keys (FK), unique constraints (UQ), and cardinalities. Figure 4.6 presents the ER schema:")

    add_figure("fig_6_er_diagram.png", "Figure 4.6: WORKUP Entity-Relationship (ER) Diagram.", width_in=6.1)

    add_p("The ER model strictly reflects the schema defined in prisma/schema.prisma. All foreign key relationships enforce referential integrity with cascading deletions on dependent child records (e.g., deleting a simulation cascades to its phases and tasks). Join tables (RoleSkill, TaskSkill, TaskDependency) ensure complete relational normalization (3NF) without data redundancy.")

    add_heading_1("4.7 Component Modeling")
    add_p("The Component Diagram illustrates the structural organization of software components, source modules, and interface dependencies across the codebase. Figure 4.7 presents this architecture:")

    add_figure("fig_7_component_diagram.png", "Figure 4.7: WORKUP Component Architecture Diagram.", width_in=6.1)

    add_p("The codebase is structured into cohesive, decoupled components:")
    add_bullet("Presentation Layer (src/components): ", "Contains modular React components including navbar.tsx, role-badge.tsx, profession-card.tsx, and simulation-card.tsx.")
    add_bullet("API Route Handlers (src/app/api): ", "Implements RESTful controllers with typed request/response validation envelopes (src/lib/api-response.ts).")
    add_bullet("Core Services (src/lib): ", "Contains singleton infrastructure services: auth.ts, rbac.ts, task-validator.ts, logger.ts, and orchestrator.ts.")
    add_bullet("Execution Engine (src/lib/workspace): ", "Contains the workspace provider interface and the concrete IsolatedSandboxProvider implementation.")

    add_heading_1("4.8 Deployment Modeling")
    add_p("The Deployment Diagram depicts the physical and virtual runtime execution nodes, container hosts, and network communication protocols. Figure 4.8 presents the deployment topology:")

    add_figure("fig_8_deployment_diagram.png", "Figure 4.8: WORKUP Deployment Topology Diagram.", width_in=6.1)

    add_p("The deployment model details node interactions: Client browsers communicate with the Next.js server via HTTPS (Port 443). The Next.js server spawns sandboxed execution processes locally via IPC/child_process in Stage-I, while persisting state to SQLite (dev.db) through the Prisma query engine.")

    add_heading_1("4.9 Universal Professional Lifecycle Pipeline")
    add_p("Figure 4.9 visualizes the complete fourteen-stage Universal Professional Lifecycle, showing how a student progresses from career selection to verifiable evidence:")

    add_figure("fig_9_universal_lifecycle.png", "Figure 4.9: The Universal Professional Engineering Lifecycle Pipeline.", width_in=6.2)

    doc.add_page_break()

print("Chapter 4 builder created.")
