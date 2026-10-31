# WORKUP: Virtual Professional Experience Platform
## Major Project Review — Stage-I Presenter Notes & Viva Talking Points

**Academic Year:** 2026–2027  
**Department:** Computer Science & Engineering (Artificial Intelligence & Data Science)  
**Institution:** ACE Engineering College (An Autonomous Institution)  
**Batch No:** 05  
**Team Members:**  
- Mashetty Rohith (23AG1A7236)  
- Chintam Archana (23AG1A7214)  
- Namasi Aravind (24AG5A7205)  
**Internal Guide:** Mrs. P. Swaroopa, Assistant Professor, Dept. of CSE (AI & DS)  
**Head of Department:** Dr. M. V. Vijaya Saradhi, Professor & HoD, Dept. of CSE (AI & DS)  

---

### Slide 1 — Title Slide
- **Lead Presenter:** Mashetty Rohith
- **Key Talking Points:**
  - "Good morning respected Head of Department Dr. Vijaya Saradhi, our project guide Mrs. Swaroopa, and members of the review committee."
  - "Today, Team 05 presents Major Project Review Phase-1 on **WORKUP: Virtual Professional Experience Platform**."
  - "WORKUP is an innovative educational platform designed to bridge the severe gap between academic computer science education and practical corporate software engineering."
  - "Rather than learning purely through video lectures or isolated coding puzzles, WORKUP immerses students into simulated engineering companies where they solve authentic business tickets, work inside containerized legacy codebases, and receive automated, line-by-line pull request reviews."

---

### Slide 2 — Abstract
- **Lead Presenter:** Mashetty Rohith
- **Key Talking Points:**
  - "The core dilemma in computing education today is that fresh graduates struggle when transitioning to corporate engineering teams. While students know basic syntax and algorithms, they have never navigated a multi-file legacy repository, an Architectural Decision Record (ADR), or a continuous integration pull request review."
  - "WORKUP addresses this by providing simulated tech enterprises (such as *FinFlow Technologies*). Students take on specific engineering roles, open path-jailed cloud sandboxes, write real code, and receive formative feedback from an automated AI Tech Lead Reviewer."
  - "In Stage-I, our platform foundation is fully operational: built on Next.js 14 App Router, TypeScript, Prisma ORM with 21 relational domain models, and a 100% pass rate across 34 automated Vitest tests."

---

### Slide 3 — Problem Identification: The Industry-Academia Transition Gap
- **Lead Presenter:** Chintam Archana
- **Key Talking Points:**
  - "We have identified four structural deficits in conventional university education:"
    1. *The Clean-Slate Fallacy:* Universities always assign projects starting from an empty file (`main.py`). In industry, 90% of engineering is understanding, debugging, and modifying existing legacy systems.
    2. *Absence of Architectural Context:* Students are given synthetic coding problems with zero business rationale or architectural constraints (ADRs).
    3. *Missing Collaborative Review Loops:* Academic autograders provide only binary pass/fail grades. Students never receive line-level pull request critiques.
    4. *Resume Inflatability:* Self-reported resumes list buzzwords without verifiable evidence, making hiring noisy and unreliable.
  - "Our comparison table highlights that while classroom tasks are isolated and clean-slate, corporate reality requires navigating technical debt, API contracts, and CI/CD pipelines."

---

### Slide 4 — Motivation & Need: Pedagogical Foundations
- **Lead Presenter:** Chintam Archana
- **Key Talking Points:**
  - "Why do tutorial videos and isolated coding questions fail to create engineers? We ground our motivation in two established educational theories:"
  - *David Kolb's Experiential Learning Theory (1984):* True competence requires completing the full four-stage cycle: Concrete Experience, Reflective Observation, Abstract Conceptualization, and Active Experimentation. Traditional lectures cover only the conceptualization phase. WORKUP fulfills the entire cycle.
  - *Situated Cognition (Lave & Wenger, 1991):* Learning is most effective when situated within legitimate communities of practice using authentic tools (Git, terminal, linters, test runners).
  - *The Mentorship Scale Dilemma:* With 60:1 or 100:1 student-to-faculty ratios, individual code review is impossible. WORKUP automates senior tech lead feedback at scale.

---

### Slide 5 — Objectives & Scope of Stage-I
- **Lead Presenter:** Namasi Aravind
- **Key Talking Points:**
  - "Our Stage-I engineering scope has delivered five concrete objectives:"
    - Designed a multi-tenant enterprise simulation platform with role taxonomies.
    - Built a path-jailed cloud workspace orchestrator enforcing concurrency and timeouts.
    - Integrated in-sandbox automated test runners (Vitest).
    - Developed a rubric-based pull request review engine.
    - Created an immutable Evidence-of-Skill portfolio capturing Git commit SHAs.
  - "We clearly separate verified Stage-I implementation (Next.js 14, 21 Prisma models, local sandbox jailing, 34 passing tests) from our Stage-II roadmap (distributed Kubernetes pods, multi-turn LLM reviewer, MLOps/DevOps catalog expansion)."

---

### Slide 6 — Analysis of Existing Systems
- **Lead Presenter:** Namasi Aravind
- **Key Talking Points:**
  - "We systematically reviewed existing tools in the market across four categories:"
    - *Algorithmic Platforms (LeetCode):* Great for DSA interviews, but operates on single functions with zero architectural context.
    - *Video MOOCs (Coursera, Udemy):* Passive spectator learning with under 10% completion rates and synthetic autograders.
    - *Static Job Simulations (Forage):* Excellent scenario framing, but submissions are static PDFs with zero code execution.
    - *Cloud IDEs (Codespaces, Gitpod):* Raw compute infrastructure with no curriculum, no task backlogs, and no evaluation rubrics.
  - "WORKUP is the first platform to combine simulated corporate context with live, isolated code execution and rubric-driven code review."

---

### Slide 7 — Literature Survey (Part 1: SE Simulations & Skill Deficits)
- **Lead Presenter:** Mashetty Rohith
- **Key Talking Points:**
  - *Paper 1: Navarro & van der Hoek (2007), IEEE Trans. Softw. Eng.:* Validated that software engineering simulation games increase student understanding of architectural trade-offs by 40%. This paper forms the foundation of WORKUP's simulation engine and sprint phases.
  - *Paper 2: Radermacher & Walia (2013), ACM SIGCSE:* Surveyed 50+ tech companies and documented that graduates suffer major deficits in legacy code comprehension, unit testing, and Git reviews. This directly guides WORKUP's curriculum focus on refactoring legacy code.
  - *Paper 3: Sharp & Hall (2009), ACM TOSEM:* Ethnographic study showing that software engineering is ticket-driven and social. This inspired WORKUP's Jira-style backlog and simulated team communication.

---

### Slide 8 — Literature Survey (Part 2: Cloud Workspaces & AI Code Review)
- **Lead Presenter:** Chintam Archana
- **Key Talking Points:**
  - *Paper 4: Kratzke (2018), IEEE Trans. Education:* Proved that lightweight browser-accessible containers eliminate operating system configuration barriers and enforce strict resource quotas. This provides the blueprint for WORKUP's sandbox orchestrator.
  - *Paper 5: MacNeil et al. (2023), ACM ITiCSE:* Demonstrated that line-anchored formative AI feedback accelerates student debugging significantly compared to generic error summaries. This underpins WORKUP's AI Tech Lead Reviewer.
  - *Paper 6: Garousi et al. (2018), IEEE Software:* Highlighted that universities treat software testing as an afterthought. This justifies WORKUP's mandatory in-sandbox automated testing before pull request submission.

---

### Slide 9 — Comparative Analysis Matrix & Identified Research Gaps
- **Lead Presenter:** Namasi Aravind
- **Key Talking Points:**
  - "Our comparative matrix evaluates six core capabilities. While existing tools check only one or two boxes, WORKUP is the only system integrating multi-file repos, ADRs, cloud sandboxes, automated tests, and line-level PR reviews."
  - "We have formulated three core research gaps from the literature:"
    - *Gap 1 (Disconnected Workflow):* No tool connects Career -> Problem -> Ticket -> ADR -> Sandbox -> Test -> PR Review -> Verifiable Evidence.
    - *Gap 2 (Clean-Slate Bias):* Academic tools ignore legacy maintenance and technical debt.
    - *Gap 3 (Unverifiable Skill Signals):* Resumes are easily inflated; employers need tamper-evident proof backed by real Git commit hashes.

---

### Slide 10 — Proposed System: The WORKUP Platform
- **Lead Presenter:** Mashetty Rohith
- **Key Talking Points:**
  - "WORKUP introduces four key architectural innovations:"
    1. *Simulated Tech Enterprises:* Learners join realistic companies (*FinFlow*, *OmniRetail*) and solve genuine business problems bounded by Architecture Decision Records.
    2. *Directed Acyclic Graph (DAG) Engine:* Tasks unlock based on dependency trees and verified mastery.
    3. *Ephemeral Sandbox Execution:* Zero-setup browser workbench with process jailing, 4000ms hard timeouts, and in-situ Vitest execution.
    4. *AI Tech Lead Reviewer & Evidence Dossier:* Multi-tier rubric evaluations producing cryptographically verifiable student portfolios.

---

### Slide 11 — Target Users & Core Functional Modules
- **Lead Presenter:** Chintam Archana
- **Key Talking Points:**
  - "The system supports four distinct user roles: Student (learner), Content Author (curriculum designer), Technical Reviewer (mentor/AI agent), and Administrator (platform manager)."
  - "Our architecture is decomposed into 11 cohesive modules: Authentication & RBAC, Career Explorer, Company Catalog, Simulation DAG, Student Workbench, Workspace Orchestrator, Sandbox Provider, Test Runner, Evaluation Engine, Portfolio Dossier, and Audit Logging."

---

### Slide 12 — The 14-Stage Universal Professional Engineering Lifecycle
- **Lead Presenter:** Mashetty Rohith
- **Key Talking Points:**
  - "This diagram represents the heart of our operational workflow, tracing the student's complete 14-stage journey:"
  - *Stages 1 to 5 (Onboarding & Framing):* Choosing a Career -> Role -> Company -> Understanding Business Problem -> Inspecting Ticket Backlog & ADR.
  - *Stages 6 to 10 (Workbench Execution - Implemented):* Using Real Tools -> Launching Cloud Sandbox -> Refactoring Legacy Code -> Running In-Sandbox Automated Tests -> Submitting Pull Request for AI Review.
  - *Stages 11 to 14 (Deployment & Evidence - Stage-II):* Staging Build -> Telemetry Alert -> Incident Triage -> Verifiable Evidence Dossier.

---

### Slide 13 — Tiered System Architecture Diagram
- **Lead Presenter:** Namasi Aravind
- **Key Talking Points:**
  - "Our architecture follows a clean 5-tier decoupled service-oriented topology:"
    1. *Client Presentation Tier:* Next.js 14 App Router, React 18 Server Components, Monaco editor.
    2. *API Gateway & Security Tier:* Route handlers with Zod validation, bcryptjs password hashing, and jose JWT session cookies.
    3. *Core Domain Services:* Simulation DAG engine, Workspace Orchestrator, and Evaluation Service.
    4. *Workspace Execution Tier:* IsolatedSandboxProvider executing shell processes with process jailing and 4000ms timeouts.
    5. *Persistence & Storage Tier:* Prisma ORM 5.x with 21 relational tables on SQLite, seamlessly migrating to PostgreSQL for production.

---

### Slide 14 — WORKUP Unified Use Case Diagram
- **Lead Presenter:** Chintam Archana
- **Key Talking Points:**
  - "Figure 4.2 illustrates the 16 functional use cases across our four actors:"
  - *Student Actor:* 7 primary use cases (UC-01 through UC-07) covering career exploration, workspace launching, test running, PR submission, and dossier viewing.
  - *Reviewer Actor:* 3 use cases (UC-08 through UC-10) for diff inspection, rubric scoring, and line-level code reviews.
  - *Author Actor:* 3 use cases (UC-11 through UC-13) for company modeling, task DAG configuration, and acceptance benchmarks.
  - *Admin Actor:* 3 use cases (UC-14 through UC-16) for audit trails, fleet concurrency limits, and user management.

---

### Slide 15 — Domain Class Model & Relational Entity Schema
- **Lead Presenter:** Mashetty Rohith
- **Key Talking Points:**
  - "Our database schema is completely modeled and migrated in Prisma ORM, comprising 21 normalized relational entities:"
  - *Identity Cluster:* User, Profile, Session, PasswordResetToken, AuditLog.
  - *Career Cluster:* CareerFamily, Profession, Role, Skill, RoleSkill associative table.
  - *Simulation Cluster:* Company, Team, Simulation, Phase, Task, TaskSkill, TaskDependency.
  - *Execution Cluster:* Workspace, Submission, Evaluation, PortfolioItem.
  - "Referential integrity is strictly enforced with foreign key cascades, unique constraints, and 3NF normalization without data redundancy."

---

### Slide 16 — Sequence Diagram: Task Execution & Review Flow
- **Lead Presenter:** Namasi Aravind
- **Key Talking Points:**
  - "Figure 4.4 illustrates the exact 19-message sequence trace across two operational phases:"
  - *Phase 1 (Automated Test Execution, Messages 1–8):* When the student clicks 'Run Tests', the UI dispatches a POST request to `/api/workspaces/[id]/test`. The orchestrator executes Vitest inside `.workspaces/<id>` with a 4000ms timeout cap, parses the JSON test summary, and displays pass/fail badges in real time.
  - *Phase 2 (PR Submission & Review, Messages 9–19):* The student submits their PR. The orchestrator captures the Git unified diff and HEAD commit SHA, persists the submission, triggers rubric scoring (0–100), writes line-by-line comments, and unlocks the next task in the DAG.

---

### Slide 17 — Component Packaging & Deployment Topology
- **Lead Presenter:** Chintam Archana
- **Key Talking Points:**
  - "This slide shows both software modularity and physical runtime deployment:"
  - *Component Diagram (Left):* Highlights modular decoupling between Presentation components, API Route Handlers, Core Services (`auth`, `rbac`, `task-validator`), and the Execution Engine (`IsolatedSandboxProvider`).
  - *Deployment Diagram (Right):* Client browsers connect over HTTPS (Port 443) to the Next.js server node. The server spawns isolated local sandbox child processes on worker nodes, while state is persisted through Prisma to SQLite/PostgreSQL.

---

### Slide 18 — Technology Stack & Implementation Progress
- **Lead Presenter:** Mashetty Rohith
- **Key Talking Points:**
  - "Our verified technology stack is modern and enterprise-grade: Next.js 14, React 18, TypeScript, Tailwind CSS, Prisma 5.x, SQLite, bcryptjs, jose, and Vitest."
  - "We have verified in our local repository that all 21 models, the 4-tier RBAC matrix, the sandbox provider with 4000ms timeouts, and the workspace orchestrator with max 2 concurrency limits are fully implemented and operational."
  - "Our in-progress work focuses on UI enhancements (Monaco editor and xterm.js terminal integration), while Stage-II will introduce Docker containerization and live LLM APIs."

---

### Slide 19 — Testing, Verification & Empirical Results (Vitest Harness)
- **Lead Presenter:** Namasi Aravind
- **Key Talking Points:**
  - "Quality assurance is validated through Vitest 2.1.9, achieving a **100% pass rate across 34 automated tests in 8 test suites**:"
    - `auth.test.ts` (5 tests) — Password hashing, JWT signing, invalid credential handling.
    - `rbac.test.ts` (4 tests) — 4-tier role guard permissions.
    - `sandbox-provider.test.ts` (5 tests) — Process jailing and 4000ms hard timeout enforcement.
    - `orchestrator.test.ts` (4 tests) — Concurrency capping (max 2) and idle TTL sweeps.
    - `simulation.test.ts` (4 tests) — Catalog retrieval and task ordering.
    - `task-validator.test.ts` (4 tests) — DAG prerequisite resolution.
    - `submission.test.ts` (4 tests) — Git diff and SHA capture.
    - `portfolio.test.ts` (4 tests) — Rubric scoring and dossier generation.
  - "Empirical findings confirm that process jailing prevents path traversal, and the 4000ms timeout reliably terminates infinite execution loops."

---

### Slide 20 — Phased Implementation Roadmap (Phases 0 Through 12)
- **Lead Presenter:** Chintam Archana
- **Key Talking Points:**
  - "Our implementation is planned across 13 structured phases (Phases 0 through 12):"
  - *Completed Stage-I Milestones (Weeks 1 to 12):* Requirements analysis, 21-model relational schema, authentication & RBAC, simulation DAG engine, sandbox orchestrator, and automated Vitest validation.
  - *Stage-II Milestones (Weeks 13 to 26):*
    - Phases 6–8: Docker / Kubernetes container pods with gVisor kernel sandboxing.
    - Phases 9–10: Multi-turn LLM AI Tech Lead code reviewer with line-anchored PR comments.
    - Phase 11: Expanding simulation catalog across MLOps, Cloud/DevOps, and Cybersecurity tracks.
    - Phase 12: Institutional pilot deployment, benchmarking, and final project defense.

---

### Slide 21 — Expected Outcomes, Limitations & Risk Mitigation
- **Lead Presenter:** Mashetty Rohith
- **Key Talking Points:**
  - *Expected Outcomes:* 40% reduction in corporate onboarding ramp-up time, zero-infrastructure setup overhead for colleges, and tamper-evident student portfolios.
  - *Technical Limitations & Safeguards:*
    - Current process jailing is bounded by operating system permissions; our Stage-II plan upgrades this to Docker containers with gVisor.
    - Server saturation risks are mitigated by hard concurrency caps (max 2 workspaces per student) and 30-minute idle TTL cleanup.
    - LLM drift is prevented by constraining AI reviews to deterministic test assertions and strict rubric schemas.

---

### Slide 22 — Conclusion & Stage-II Direction
- **Lead Presenter:** Mashetty Rohith
- **Key Talking Points:**
  - "In conclusion, Stage-I has successfully designed, developed, and empirically validated the foundation of WORKUP."
  - "We have established a 21-entity relational domain schema, implemented isolated sandbox execution, and achieved a 100% test pass rate across 34 automated Vitest tests."
  - "WORKUP represents a pedagogical paradigm shift: moving computing students away from isolated toy scripts and into realistic virtual software engineering apprenticeships."
  - "Our Stage-II development will focus on containerized Kubernetes pods, multi-turn LLM code reviewers, and multi-domain simulation tracks."

---

### Slide 23 — References & Thank You / Viva Discussion
- **Lead Presenter:** Mashetty Rohith (with team)
- **Key Talking Points:**
  - "Our project is grounded in seven core IEEE and ACM peer-reviewed publications and foundational learning theories (Navarro, Radermacher, Sharp, Kratzke, MacNeil, Garousi, and Kolb)."
  - "We express our sincere gratitude to our Internal Guide, Mrs. P. Swaroopa, our Head of Department, Dr. M. V. Vijaya Saradhi, and all members of the review committee for their invaluable guidance."
  - "We now welcome your questions, constructive feedback, and viva discussion."
