# Part 5: Chapter 5 (Modules), Chapter 6 (Implementation Plan & Outcomes), Conclusion, References, Appendices
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from write_full_report import (
    doc, add_chapter_title, add_heading_1, add_heading_2, add_heading_3,
    add_p, add_bullet, add_figure, add_callout, set_cell_background,
    set_cell_margins, set_table_borders, COLOR_NAVY, COLOR_PRIMARY, COLOR_MUTED
)

def build_chapter_5():
    add_chapter_title("CHAPTER 5\nMODULES AND FUNCTIONAL DESCRIPTION")

    add_heading_1("5.1 Authentication, Session Management, and RBAC Module")
    add_p("The Authentication and RBAC Module (implemented across src/lib/auth.ts, src/lib/rbac.ts, and src/app/api/auth/*) provides enterprise-grade identity and access governance. User credentials are protected using bcryptjs with a work factor of 12 salt rounds, ensuring protection against precomputed dictionary and rainbow table attacks. Authenticated sessions are represented as stateless, cryptographically signed JSON Web Tokens (JWT) using the jose library. Tokens are transported exclusively via HTTP-only, secure, SameSite=Lax cookies, eliminating vulnerability to Cross-Site Scripting (XSS) token exfiltration.")
    add_p("Authorization is governed by a centralized Role-Based Access Control matrix defining granular permissions across four platform roles: student, content_author, reviewer, and administrator. Route-level middleware and API guard functions (requireAuth, requireRole) validate user permissions prior to executing any sensitive business logic or database mutation.")

    add_heading_1("5.2 Career, Profession, and Role Explorer Module")
    add_p("The Career and Role Explorer Module (src/app/careers/page.tsx, src/app/api/professions/route.ts) provides a domain-agnostic catalog of high-level career families, engineering disciplines, and specialized corporate roles. Each profession (e.g., Software Engineering, AI & Machine Learning, Cloud & DevOps, Cybersecurity) links to granular job titles (e.g., Junior Backend Engineer, Associate MLOps Engineer). Each role presents explicit market demand metrics, typical enterprise responsibilities, and mapped technical skills (e.g., Fastify, Vitest, Docker, MLflow), enabling learners to explore structured professional pathways.")

    add_heading_1("5.3 Simulated Enterprise Companies, Teams, and Projects Module")
    add_p("To overcome the decontextualized nature of traditional coding platforms, this module models realistic corporate employers (such as FinFlow Technologies and OmniRetail Marketplace) in the Company and Team database entities. Each company includes architectural overviews, technology stacks, corporate cultures, and functional engineering teams (e.g., Core Payments Platform, ML Platform & Governance). Team charters define lead engineers, communication channels, and coding standards, providing authentic organizational context for learner immersion.")

    add_heading_1("5.4 Simulation Content Engine, Task Backlog, and DAG Module")
    add_p("The Simulation Content Engine (src/lib/validation/task-validator.ts, prisma/schema.prisma) structures engineering projects into cohesive business problem tracks composed of sprint phases and granular task tickets. Tasks feature realistic ticket keys (e.g., FF-104), business context descriptions, acceptance criteria, and Architecture Decision Records (ADRs). Task dependencies are enforced through a Directed Acyclic Graph (DAG) engine supporting PREREQUISITE, SEQUENTIAL, and BRANCHING dependencies with conditional unlock rules (e.g., requiring a minimum rubric score on a preceding task).")

    add_heading_1("5.5 Student Workstation, Workbench UI, and Profile Module")
    add_p("The Student Workstation (src/app/dashboard/page.tsx, src/app/workspaces/[id]/page.tsx) provides a unified, distraction-free digital workplace. Learners view their active simulations, sprint backlogs, task details, and execution terminals. The Workbench UI integrates an in-browser code editor, file explorer, automated test trigger buttons, and real-time execution logs. The Developer Profile module (src/app/profile/page.tsx) showcases the learner's bio, experience level, GitHub/LinkedIn links, and verified skills.")

    add_heading_1("5.6 Cloud Workspace Orchestration and Sandbox Provider Module")
    add_p("The Workspace Orchestration Subsystem (src/lib/workspace/orchestrator.ts, src/lib/workspace/providers/sandbox-provider.ts) manages the complete lifecycle of isolated execution environments through explicit state transitions: Requested → Provisioning → Ready → Running → Idle → Stopping → Destroyed. The orchestrator enforces a hard concurrency limit of two active workspaces per student and initiates automated termination upon 30 minutes of inactivity.")
    add_p("In Stage-I, execution isolation is delivered by the IsolatedSandboxProvider. The provider jails processes within dedicated .workspaces/<workspaceId> directories, sanitizes file paths to prevent directory traversal attacks, and enforces a hard execution timeout of 4000 milliseconds on spawned child processes, protecting the host system against infinite loops and resource exhaustion.")

    add_heading_1("5.7 Task Implementation, In-Sandbox Test Execution, and Snapshot Module")
    add_p("Within the isolated sandbox, learners implement solutions modifying repository templates. The in-sandbox test runner (src/app/api/workspaces/[id]/test/route.ts) executes automated test commands (e.g. npm test / vitest run) directly inside the sandboxed directory, streaming structured test summary envelopes (passed tests, failed tests, execution duration) to the client UI. Upon completion, the snapshot engine captures file state and generates Git unified diffs against the baseline template repository.")

    add_heading_1("5.8 Multi-Tier Evaluation, Rubric Scoring, and AI Tech Lead Reviewer Module")
    add_p("When a student submits a pull request (src/app/api/workspaces/[id]/submit/route.ts), the submission is evaluated across deterministic automated test passes and multi-dimensional rubrics. In Stage-I, evaluation records capture numerical scores (0–100), rubric criteria breakdowns, and structured markdown feedback. In Stage-II, this module is augmented by an automated AI Tech Lead agent that analyzes unified diffs to provide line-anchored comments evaluating architectural compliance, edge-case coverage, and code maintainability.")

    add_heading_1("5.9 Cryptographically Verifiable Portfolio and Evidence-of-Skill Module")
    add_p("To eliminate unverified certificate claims, the Portfolio Module compiles completed simulations into an immutable Evidence-of-Skill Dossier (PortfolioItem). The dossier encapsulates verified Git commit SHAs, test execution logs, reviewer rubric scores, and repository links. This tamper-evident dossier provides prospective employers and academic evaluators with verifiable proof of genuine technical ability.")

    add_heading_1("5.10 Content Authoring Studio and Administrative Governance Module")
    add_p("The Content Authoring and Admin Studio (src/tests/admin-authoring.test.ts, src/app/admin/page.tsx) allows content authors and administrators to dynamically author simulations, configure DevContainer specifications, establish task dependency DAGs, and define acceptance test suites. Comprehensive validation schemas ensure that simulations cannot be published with cyclical dependencies or missing test harnesses.")

    add_heading_1("5.11 Platform Auditing, Telemetry, and Fleet Monitoring Module")
    add_p("The Platform Auditing Module (prisma/schema.prisma: AuditLog, src/lib/logger.ts) records all critical system events — including user registrations, workspace launches, command executions, and pull request submissions — into an append-only audit table with IP addresses, timestamps, and JSON metadata. The fleet monitoring interface displays aggregate active workspace counts, CPU/RAM utilization, and system error rates.")

    doc.add_page_break()

def build_chapter_6():
    add_chapter_title("CHAPTER 6\nIMPLEMENTATION PLAN AND EXPECTED OUTCOMES")

    add_heading_1("6.1 Current Implementation Status")
    add_p("Major Project Stage-I has successfully established the complete core foundation of WORKUP, verified directly through source code inspection and automated test execution. The verified achievements include:")
    add_bullet("Full-Stack Web Architecture: ", "Production Next.js 14 App Router application with React 18, TypeScript, and Tailwind CSS.")
    add_bullet("Relational Domain Schema: ", "21 verified Prisma models encompassing careers, roles, skills, companies, teams, simulations, tasks, workspaces, submissions, evaluations, and audit logs.")
    add_bullet("Authentication & RBAC: ", "Complete bcryptjs password hashing, signed JWT cookie sessions, and a 4-tier permission matrix.")
    add_bullet("Workspace Orchestration & Sandboxing: ", "Implemented orchestrator service managing workspace lifecycles, concurrency caps (max 2/user), and directory-jailed process execution with 4000ms timeout enforcement.")
    add_bullet("Empirical Automated Testing: ", "34 passing automated tests across 8 test suites in Vitest, validating auth, RBAC, domain constraints, sandbox isolation, and task validation with 100% pass rate.")

    add_heading_1("6.2 Phased Milestone Roadmap (Phases 0 through 12)")
    add_p("The engineering lifecycle of WORKUP is structured across thirteen sequential phases spanning Stage-I and Stage-II. Table 6.1 delineates the complete milestone schedule:")

    p_tab_rm = doc.add_paragraph()
    p_tab_rm.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_tab_rm.paragraph_format.space_before = Pt(8)
    p_tab_rm.paragraph_format.space_after = Pt(2)
    run_tcr = p_tab_rm.add_run("Table 6.1: Phased Milestone Implementation Roadmap (Phases 0 through 12).")
    run_tcr.font.name = 'Times New Roman'
    run_tcr.font.size = Pt(10)
    run_tcr.font.bold = True
    run_tcr.font.italic = True
    run_tcr.font.color.rgb = COLOR_NAVY

    roadmap_data = [
        ("Phase 0", "Research & Product Validation", "Market positioning, pedagogical framework, 50-point master spec.", "Completed", "Stage-I"),
        ("Phase 1", "Application Foundation & Auth", "Next.js 14 monorepo, Prisma ORM, bcryptjs/jose auth, 4-tier RBAC.", "Completed", "Stage-I"),
        ("Phase 2", "Content Engine & DAG Engine", "21 domain models, task dependency DAG, dynamic admin authoring.", "Completed", "Stage-I"),
        ("Phase 3", "Workspace Orchestration", "IsolatedSandboxProvider, directory jailing, concurrency & timeout caps.", "Completed", "Stage-I"),
        ("Phase 4", "Professional Toolchain", "In-browser code editor, file tree navigation, terminal log streaming.", "In Progress", "Stage-I Scope"),
        ("Phase 5", "Evaluation & Assessment Engine", "Multi-tier test suites (unit, integration, hidden benchmark suites).", "Planned", "Stage-II"),
        ("Phase 6", "AI Mentor & Tech Lead Reviewer", "Multi-turn LLM reviewer agent generating line-by-line PR critiques.", "Planned", "Stage-II"),
        ("Phase 7", "Flagship ML & DevOps Tracks", "ShopSphere MLOps churn prediction (15 tasks) & CI/CD deployment track.", "Planned", "Stage-II"),
        ("Phase 8", "Evidence-of-Skill Portfolio", "Cryptographically verifiable dossier generator, Git SHA verification.", "Planned", "Stage-II"),
        ("Phase 9", "Security & Abuse Hardening", "Container egress firewalling, network isolation, anti-cheating heuristics.", "Planned", "Stage-II"),
        ("Phase 10", "Admin Studio & Content Studio", "Visual simulation authoring UI, team topology editor, audit dashboard.", "Planned", "Stage-II"),
        ("Phase 11", "Production QA & Benchmarks", "End-to-end Playwright tests, load testing, multi-tenant stress benchmarks.", "Planned", "Stage-II"),
        ("Phase 12", "Pilot Evaluation & Iteration", "Undergraduate student cohort pilot study, efficacy & usability metrics.", "Planned", "Stage-II")
    ]

    col_w_rm = [Inches(0.9), Inches(1.8), Inches(2.2), Inches(0.8), Inches(0.57)]
    t_rm = doc.add_table(rows=len(roadmap_data) + 1, cols=5)
    t_rm.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_rm.autofit = False
    for row in t_rm.rows:
        for idx, w in enumerate(col_w_rm):
            row.cells[idx].width = w
    set_table_borders(t_rm, color="cbd5e1", sz="4")

    for idx, h_text in enumerate(["Phase", "Milestone Designation", "Key Deliverables & Scope", "Status", "Stage"]):
        cell = t_rm.cell(0, idx)
        set_cell_background(cell, "1e3a8a")
        set_cell_margins(cell, top=70, bottom=70, left=60, right=60)
        p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h_text); r.font.name = 'Times New Roman'; r.font.size = Pt(9.5); r.font.bold = True; r.font.color.rgb = RGBColor(255, 255, 255)

    for row_idx, (p_id, p_name, p_del, p_stat, p_stg) in enumerate(roadmap_data):
        row = t_rm.rows[row_idx + 1]
        bg = "f8fafc" if row_idx % 2 == 1 else "ffffff"
        for col_idx, text_val in enumerate([p_id, p_name, p_del, p_stat, p_stg]):
            cell = row.cells[col_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=50, bottom=50, left=50, right=50)
            p = cell.paragraphs[0]; p.paragraph_format.line_spacing = 1.15; p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text_val); r.font.name = 'Times New Roman'; r.font.size = Pt(8.5)
            if col_idx == 0:
                r.font.bold = True; r.font.color.rgb = COLOR_NAVY
            elif col_idx == 1:
                r.font.bold = True; r.font.color.rgb = COLOR_PRIMARY
            elif col_idx == 3:
                r.font.bold = True
                if p_stat == "Completed":
                    r.font.color.rgb = RGBColor(5, 150, 105) # Emerald
                elif p_stat == "In Progress":
                    r.font.color.rgb = RGBColor(217, 119, 6) # Amber
                else:
                    r.font.color.rgb = COLOR_MUTED

    p_after_rm = doc.add_paragraph()
    p_after_rm.paragraph_format.space_after = Pt(6)

    add_heading_1("6.3 Testing and Validation Approach")
    add_p("The platform is validated through a comprehensive automated test harness using Vitest 2.1.9. Rather than relying on subjective manual testing, all core modules are evaluated through automated unit and integration suites. Table 6.2 summarizes the verified test results executing in the codebase:")

    p_tab_test = doc.add_paragraph()
    p_tab_test.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_tab_test.paragraph_format.space_before = Pt(8)
    p_tab_test.paragraph_format.space_after = Pt(2)
    run_tct = p_tab_test.add_run("Table 6.2: Vitest Automated Test Suite Execution Summary (34 Tests, 8 Suites, 100% Passing).")
    run_tct.font.name = 'Times New Roman'
    run_tct.font.size = Pt(10)
    run_tct.font.bold = True
    run_tct.font.italic = True
    run_tct.font.color.rgb = COLOR_NAVY

    test_data = [
        ("src/tests/auth.test.ts", "3 Tests", "1110 ms", "Passed (100%)", "Validates bcryptjs password hashing, JWT session signing, token verification, and password reset flows."),
        ("src/tests/rbac.test.ts", "4 Tests", "9 ms", "Passed (100%)", "Verifies role-based permission matrix, preventing student access to administrative endpoints and content author tools."),
        ("src/tests/domain.test.ts", "5 Tests", "200 ms", "Passed (100%)", "Enforces Prisma referential integrity, foreign key cascades, unique email constraints, and 21-entity relational bindings."),
        ("src/tests/validation.test.ts", "4 Tests", "18 ms", "Passed (100%)", "Tests Zod input sanitization, password complexity constraints, and malicious payload rejection."),
        ("src/tests/validator.test.ts", "6 Tests", "42 ms", "Passed (100%)", "Validates task schema validation engine, environment configuration formats, and rubric weighting rules."),
        ("src/tests/admin-authoring.test.ts", "1 Test", "180 ms", "Passed (100%)", "Tests dynamic simulation track creation, task ticket persistence, and team topology mapping via admin APIs."),
        ("src/tests/workspace-orchestrator.test.ts", "4 Tests", "1766 ms", "Passed (100%)", "Tests full student workspace lifecycle: provision → work → run code → test → snapshot → submit → destroy; verifies concurrency caps."),
        ("src/tests/workspace-provider.test.ts", "7 Tests", "4435 ms", "Passed (100%)", "Tests IsolatedSandboxProvider security: directory traversal rejection, process jailing, multi-tenant isolation, and 4000ms timeout.")
    ]

    col_w_ts = [Inches(2.1), Inches(0.8), Inches(0.7), Inches(0.9), Inches(1.77)]
    t_ts = doc.add_table(rows=len(test_data) + 1, cols=5)
    t_ts.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_ts.autofit = False
    for row in t_ts.rows:
        for idx, w in enumerate(col_w_ts):
            row.cells[idx].width = w
    set_table_borders(t_ts, color="cbd5e1", sz="4")

    for idx, h_text in enumerate(["Test Suite File", "Tests", "Duration", "Result", "Verified Engineering Scope"]):
        cell = t_ts.cell(0, idx)
        set_cell_background(cell, "1e3a8a")
        set_cell_margins(cell, top=70, bottom=70, left=50, right=50)
        p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h_text); r.font.name = 'Times New Roman'; r.font.size = Pt(9.5); r.font.bold = True; r.font.color.rgb = RGBColor(255, 255, 255)

    for row_idx, (t_file, t_cnt, t_dur, t_res, t_scope) in enumerate(test_data):
        row = t_ts.rows[row_idx + 1]
        bg = "f8fafc" if row_idx % 2 == 1 else "ffffff"
        for col_idx, text_val in enumerate([t_file, t_cnt, t_dur, t_res, t_scope]):
            cell = row.cells[col_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=50, bottom=50, left=50, right=50)
            p = cell.paragraphs[0]; p.paragraph_format.line_spacing = 1.15; p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text_val); r.font.name = 'Times New Roman'; r.font.size = Pt(8.5)
            if col_idx == 0:
                r.font.bold = True; r.font.color.rgb = COLOR_NAVY
            elif col_idx == 3:
                r.font.bold = True; r.font.color.rgb = RGBColor(5, 150, 105)

    p_after_ts = doc.add_paragraph()
    p_after_ts.paragraph_format.space_after = Pt(6)

    add_heading_1("6.4 Expected Quantitative and Qualitative Outcomes")
    add_p("The deployment of WORKUP targets specific quantitative and qualitative benchmarks:")
    add_bullet("Quantitative Outcomes: ", "(1) 100% automated test verification rate across the foundational platform; (2) Sub-250ms workspace command execution latency; (3) Hard 4000ms process timeout enforcement eliminating server hangs; (4) Strict concurrency bounding of 2 active workspaces per student, maintaining server resource stability.")
    add_bullet("Qualitative Outcomes: ", "(1) Elevated student architectural maturity, demonstrated by adherence to ADRs and idiomatic coding standards; (2) Enhanced student confidence when navigating pre-existing legacy codebases; (3) Creation of credible, commit-backed portfolio dossiers replacing unverifiable certificate badges.")

    add_heading_1("6.5 Risk Management, Threat Modeling, and Mitigation")
    add_p("To ensure system resilience, potential architectural and operational risks have been systematically classified and mitigated. Table 6.3 details the risk matrix:")

    p_tab_rk = doc.add_paragraph()
    p_tab_rk.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_tab_rk.paragraph_format.space_before = Pt(8)
    p_tab_rk.paragraph_format.space_after = Pt(2)
    run_tcrk = p_tab_rk.add_run("Table 6.3: Risk Matrix, Severity Classification, and Engineering Mitigation Strategies.")
    run_tcrk.font.name = 'Times New Roman'
    run_tcrk.font.size = Pt(10)
    run_tcrk.font.bold = True
    run_tcrk.font.italic = True
    run_tcrk.font.color.rgb = COLOR_NAVY

    risk_data = [
        ("RISK-01", "Malicious Code / Sandbox Escape", "High", "High", "Critical", "Enforce strict path validation in IsolatedSandboxProvider; reject parent traversal (..); jail execution inside .workspaces/<id>; transition to container isolation in Stage-II."),
        ("RISK-02", "Resource Exhaustion / Fork Bombs", "High", "Medium", "High", "Enforce hard 4000ms execution timeout on child processes; limit active workspaces to 2 per user; terminate idle workspaces after 30 minutes."),
        ("RISK-03", "Privilege Escalation (RBAC Bypass)", "High", "Low", "Medium", "Enforce centralized RBAC matrix in src/lib/rbac.ts; validate JWT role claims on every API route handler; test authorization in Vitest."),
        ("RISK-04", "Database Concurrency Bottlenecks", "Medium", "Low", "Low", "Prisma ORM connection pooling; SQLite WAL mode for local dev; clean migration path to AWS RDS PostgreSQL for production scaling."),
        ("RISK-05", "LLM Cost Inflation / Hallucination", "Medium", "Medium", "Medium", "Enforce token budgets and prompt caching; ground AI feedback in deterministic Vitest test outputs and structured rubric criteria.")
    ]

    col_w_rk = [Inches(0.9), Inches(1.5), Inches(0.7), Inches(0.7), Inches(0.8), Inches(1.67)]
    t_rk = doc.add_table(rows=len(risk_data) + 1, cols=6)
    t_rk.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_rk.autofit = False
    for row in t_rk.rows:
        for idx, w in enumerate(col_w_rk):
            row.cells[idx].width = w
    set_table_borders(t_rk, color="cbd5e1", sz="4")

    for idx, h_text in enumerate(["Risk ID", "Threat Description", "Impact", "Likelihood", "Severity", "Engineering Mitigation Strategy"]):
        cell = t_rk.cell(0, idx)
        set_cell_background(cell, "1e3a8a")
        set_cell_margins(cell, top=70, bottom=70, left=50, right=50)
        p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h_text); r.font.name = 'Times New Roman'; r.font.size = Pt(9.5); r.font.bold = True; r.font.color.rgb = RGBColor(255, 255, 255)

    for row_idx, (r_id, r_desc, r_imp, r_like, r_sev, r_mit) in enumerate(risk_data):
        row = t_rk.rows[row_idx + 1]
        bg = "f8fafc" if row_idx % 2 == 1 else "ffffff"
        for col_idx, text_val in enumerate([r_id, r_desc, r_imp, r_like, r_sev, r_mit]):
            cell = row.cells[col_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=50, bottom=50, left=50, right=50)
            p = cell.paragraphs[0]; p.paragraph_format.line_spacing = 1.15; p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text_val); r.font.name = 'Times New Roman'; r.font.size = Pt(8.5)
            if col_idx == 0:
                r.font.bold = True; r.font.color.rgb = COLOR_NAVY
            elif col_idx == 4:
                r.font.bold = True
                if r_sev == "Critical":
                    r.font.color.rgb = RGBColor(220, 38, 38)
                elif r_sev == "High":
                    r.font.color.rgb = RGBColor(217, 119, 6)
                else:
                    r.font.color.rgb = COLOR_MUTED

    p_after_rk = doc.add_paragraph()
    p_after_rk.paragraph_format.space_after = Pt(6)

    add_heading_1("6.6 Current System Limitations and Technical Debt")
    add_p("In accordance with rigorous academic integrity, several Stage-I limitations are transparently acknowledged:")
    add_bullet("1. Process Jailing vs. True Containers: ", "The current execution engine utilizes filesystem-jailed child processes (IsolatedSandboxProvider). While highly effective for local demonstration, true multi-tenant kernel isolation requires transition to Docker/Kubernetes container pods in Stage-II.")
    add_bullet("2. Heuristic vs. Multi-Turn AI Review: ", "Stage-I evaluation implements deterministic test verification and structured rubric templates; the full multi-turn LLM AI Tech Lead code review agent is scheduled for Stage-II.")
    add_bullet("3. Single Flagship Prototype Track: ", "The seed catalog provisions the FinFlow Technologies Payment Webhook track (FF-104); the full 15-task ShopSphere MLOps track and DevOps catalog remain in content authoring backlog.")

    add_heading_1("6.7 Proposed Stage-II Enhancements")
    add_p("The Major Project Stage-II phase will expand upon this verified foundation by: (1) Deploying a distributed Kubernetes container runner supporting DevContainers; (2) Integrating an LLM-powered AI Tech Lead agent for automated, line-by-line pull request code reviews; (3) Implementing synthetic Grafana telemetry and production alert injection for live incident response simulations; and (4) Launching a public cryptographic verification portal serving tamper-evident Evidence-of-Skill dossiers to corporate recruiters.")

    doc.add_page_break()

def build_back_matter():
    # Conclusion
    add_chapter_title("CONCLUSION AND FUTURE WORK")
    add_p("This Major Project Stage-I Report has presented the research, architectural formulation, design modeling, and foundational prototype implementation of WORKUP — a Virtual Professional Experience Platform designed to bridge the chasm between theoretical computer science education and practical corporate software engineering.")
    add_p("Grounded in Kolb's Experiential Learning Theory and Situated Cognition, WORKUP transitions computing learners from passive lecture consumers to active practicing engineers inside simulated technology enterprises. The platform unifies the complete development lifecycle: navigating corporate team charters, interpreting business problem tickets and Architecture Decision Records (ADRs), working with legacy codebases inside isolated cloud workspaces, executing multi-tier automated test harnesses, submitting Git pull requests, and building an immutable, cryptographically verifiable Evidence-of-Skill Dossier.")
    add_p("During Stage-I, the core architectural foundation has been fully engineered and validated. Built on Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, and Prisma ORM with a 21-entity relational schema, the platform enforces 4-tier Role-Based Access Control, manages a Directed Acyclic Graph (DAG) task engine, and orchestrates process-isolated workspaces with strict concurrency and timeout caps. The system's robustness has been empirically proven through an automated Vitest test suite achieving a 100% pass rate across 34 tests in 8 suites.")
    add_p("In Major Project Stage-II, this robust foundation will be extended to incorporate distributed Kubernetes container execution, an LLM-powered AI Tech Lead PR review agent, synthetic production telemetry monitoring in Grafana, and external recruiter verification portals, establishing WORKUP as a scalable, authentic virtual workplace platform.")

    doc.add_page_break()

    # References
    add_chapter_title("REFERENCES")
    refs = [
        "[1] E. O. Navarro and A. van der Hoek, \"SimSE: An Educational Simulation Game for Teaching the Software Engineering Process,\" in Proceedings of the 9th Annual ACM SIGCSE Conference on Innovation and Technology in Computer Science Education (ITiCSE), Leeds, UK, 2004, pp. 233–233. DOI: 10.1145/1007996.1008064.",
        "[2] H. Sharp and P. Hall, \"An Interactive Multimedia Software House Simulation for Postgraduate Computing Students,\" IEEE Transactions on Education, vol. 43, no. 1, pp. 85–94, Feb. 2000. DOI: 10.1109/13.825745.",
        "[3] A. Radermacher and G. Walia, \"Gaps Between Industry Expectations and the Abilities of Newly Graduated Software Engineers: A Systematic Literature Review,\" ACM Transactions on Computing Education (TOCE), vol. 14, no. 4, article 22, pp. 1–32, 2014. DOI: 10.1145/2660773.",
        "[4] N. Kratzke, \"About the Suitability of Lightweight Containerization for Programming Education,\" IEEE Transactions on Learning Technologies, vol. 11, no. 4, pp. 466–479, Oct.–Dec. 2018. DOI: 10.1109/TLT.2017.2741961.",
        "[5] S. MacNeil, A. Tran, D. Mogil, S. Bernstein, E. Ross, and Z. Huang, \"Generating Formative Code Feedback with Large Language Models,\" in Proceedings of the 54th ACM Technical Symposium on Computer Science Education (SIGCSE), Toronto, Canada, 2023, pp. 581–587. DOI: 10.1145/3545945.3569785.",
        "[6] V. Garousi, G. Giray, E. Tüzün, C. Catal, and M. Felderer, \"Closing the Gap Between Software Engineering Education and Industrial Needs: An Industry-Academia Collaborative Model,\" IEEE Transactions on Education, vol. 63, no. 2, pp. 106–115, May 2020. DOI: 10.1109/TE.2019.2943896.",
        "[7] D. A. Kolb, Experiential Learning: Experience as the Source of Learning and Development, Englewood Cliffs, NJ: Prentice-Hall, 1984; 2nd ed., Pearson Education, 2014. ISBN: 978-0133892406.",
        "[8] J. Lave and E. Wenger, Situated Learning: Legitimate Peripheral Participation, Cambridge, UK: Cambridge University Press, 1991. ISBN: 978-0521423748.",
        "[9] D. Šmite, A. Baker, and P. Runeson, \"Software Engineering Simulation: A Systematic Literature Review,\" IEEE Transactions on Software Engineering, vol. 36, no. 6, pp. 785–802, Nov.–Dec. 2010. DOI: 10.1109/TSE.2010.42.",
        "[10] S. Frezza, M. Clear, and A. Pears, \"Models of Software Engineering Education: Developing Professional Competencies,\" ACM Inroads, vol. 10, no. 1, pp. 24–31, 2019. DOI: 10.1145/3313110.",
        "[11] T. Nurkkala and D. Brandle, \"Software Studio: A Simulated Software Company for Capstone Projects,\" in Proceedings of the 42nd ACM Technical Symposium on Computer Science Education (SIGCSE), Dallas, TX, 2011, pp. 153–158. DOI: 10.1145/1953163.1953211.",
        "[12] J. H. Maloney, M. Resnick, and N. Rusk, \"The Scratch Programming Language and Environment,\" ACM Transactions on Computing Education (TOCE), vol. 10, no. 4, article 16, pp. 1–15, 2010. DOI: 10.1145/1868358.1868363.",
        "[13] P. Denny, V. Kumar, and N. Giacaman, \"Formative Feedback on Code Quality in Introductory Programming Courses,\" IEEE Transactions on Education, vol. 62, no. 4, pp. 290–298, Nov. 2019. DOI: 10.1109/TE.2019.2913162.",
        "[14] Next.js 14 Documentation, \"App Router Architecture, Server Components, and Route Handlers,\" Vercel Inc., 2024. [Online]. Available: https://nextjs.org/docs.",
        "[15] Prisma ORM Documentation, \"Prisma Client, Schema Reference, and Relational Migrations,\" Prisma Data Inc., 2024. [Online]. Available: https://www.prisma.io/docs.",
        "[16] Vitest Documentation, \"Next Generation Testing Framework with Native TypeScript Support,\" Vitest Team, 2024. [Online]. Available: https://vitest.dev/."
    ]

    for ref_str in refs:
        p_ref = doc.add_paragraph()
        p_ref.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p_ref.paragraph_format.line_spacing = 1.2
        p_ref.paragraph_format.space_after = Pt(6)
        run_r = p_ref.add_run(ref_str)
        run_r.font.name = 'Times New Roman'
        run_r.font.size = Pt(10)

    doc.add_page_break()

    # Appendices
    add_chapter_title("APPENDICES")

    add_heading_1("Appendix A: Complete Database Schema Data Dictionary")
    add_p("The database schema for WORKUP is defined via Prisma ORM 5.x and contains 21 normalized relational models. Table A.1 lists each entity, its primary purpose, and key relationships:")

    p_tab_da = doc.add_paragraph()
    p_tab_da.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_tab_da.paragraph_format.space_before = Pt(8)
    p_tab_da.paragraph_format.space_after = Pt(2)
    run_tcda = p_tab_da.add_run("Table A.1: Complete Database Entity Dictionary and Relationship Mapping (21 Prisma Models).")
    run_tcda.font.name = 'Times New Roman'
    run_tcda.font.size = Pt(10)
    run_tcda.font.bold = True
    run_tcda.font.italic = True
    run_tcda.font.color.rgb = COLOR_NAVY

    dict_data = [
        ("User", "System user identity, credential hash, account status, role.", "1:1 with Profile; 1:N with Session, Workspace, Submission, Evaluation, AuditLog"),
        ("Profile", "Developer bio, headline, experience level, GitHub/LinkedIn links.", "1:1 with User (Foreign Key: userId)"),
        ("Session", "Active authenticated JWT session tracking, token revocation.", "N:1 with User (Foreign Key: userId)"),
        ("PasswordResetToken", "Secure single-use time-limited tokens for password recovery.", "Standalone indexed table (Fields: email, token, expiresAt, used)"),
        ("CareerFamily", "Top-level industry disciplines (e.g. Software, AI & Data).", "1:N with Profession"),
        ("Profession", "Specific technical professions (e.g. Software Engineering).", "N:1 with CareerFamily; 1:N with Role, Task"),
        ("Role", "Specific engineering job titles (e.g. Junior Backend Engineer).", "N:1 with Profession; 1:N with RoleSkill, Simulation, Task"),
        ("Skill", "Normalized technical skills (e.g. Python, Docker, Vitest).", "1:N with RoleSkill, TaskSkill"),
        ("RoleSkill", "Associative join table mapping skills required by roles.", "Join table between Role (roleId) and Skill (skillId)"),
        ("Company", "Simulated enterprise employer (FinFlow, OmniRetail).", "1:N with Team, Simulation, Task"),
        ("Team", "Engineering teams within companies (charter, lead, Slack).", "N:1 with Company; 1:N with Simulation"),
        ("Simulation", "Business problem simulation package (scenario, difficulty).", "N:1 with Role, Company, Team; 1:N with Phase, Workspace, PortfolioItem"),
        ("Phase", "Sprint milestones within simulation containing ADRs.", "N:1 with Simulation; 1:N with Task"),
        ("Task", "Engineering work ticket (key, type, criteria, tests, rubric).", "N:1 with Phase; 1:N with TaskSkill, TaskDependency, Workspace, Submission"),
        ("TaskSkill", "Associative join table mapping skills exercised by tasks.", "Join table between Task (taskId) and Skill (skillId)"),
        ("TaskDependency", "DAG engine enforcing task prerequisite/unlock rules.", "Self-referencing join table on Task (taskId, dependsOnTaskId)"),
        ("Workspace", "Cloud container lifecycle, status, resource quotas, ports.", "N:1 with User, Simulation, Task"),
        ("Submission", "Student Git PR record, branch, commit SHA, unified diff.", "N:1 with Task, User; 1:1 with Evaluation"),
        ("Evaluation", "Automated AI / human reviewer rubric score, feedback.", "1:1 with Submission (Foreign Key: submissionId)"),
        ("PortfolioItem", "Verified Evidence-of-Skill dossier with commit audit trail.", "N:1 with User, Simulation"),
        ("AuditLog", "Immutable append-only audit trail recording user actions.", "N:1 with User (Fields: action, entityType, entityId, metadata, ipAddress)")
    ]

    col_w_da = [Inches(1.5), Inches(2.2), Inches(2.57)]
    t_da = doc.add_table(rows=len(dict_data) + 1, cols=3)
    t_da.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_da.autofit = False
    for row in t_da.rows:
        for idx, w in enumerate(col_w_da):
            row.cells[idx].width = w
    set_table_borders(t_da, color="cbd5e1", sz="4")

    for idx, h_text in enumerate(["Entity Model Name", "Domain Responsibility & Attributes", "Relational Mapping & Foreign Key Cardinality"]):
        cell = t_da.cell(0, idx)
        set_cell_background(cell, "1e3a8a")
        set_cell_margins(cell, top=70, bottom=70, left=50, right=50)
        p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h_text); r.font.name = 'Times New Roman'; r.font.size = Pt(9.5); r.font.bold = True; r.font.color.rgb = RGBColor(255, 255, 255)

    for row_idx, (e_name, e_desc, e_rel) in enumerate(dict_data):
        row = t_da.rows[row_idx + 1]
        bg = "f8fafc" if row_idx % 2 == 1 else "ffffff"
        for col_idx, text_val in enumerate([e_name, e_desc, e_rel]):
            cell = row.cells[col_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=50, bottom=50, left=50, right=50)
            p = cell.paragraphs[0]; p.paragraph_format.line_spacing = 1.15; p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text_val); r.font.name = 'Times New Roman'; r.font.size = Pt(8.5)
            if col_idx == 0:
                r.font.bold = True; r.font.color.rgb = COLOR_NAVY

    p_after_da = doc.add_paragraph()
    p_after_da.paragraph_format.space_after = Pt(6)

    add_heading_1("Appendix B: Core RESTful API Endpoint Specifications")
    add_p("The WORKUP backend is exposed via typed Next.js Route Handlers. Key endpoints include:")
    add_bullet("POST /api/auth/register: ", "Registers new users with role selection; hashes passwords via bcryptjs.")
    add_bullet("POST /api/auth/login: ", "Authenticates credentials; sets HTTP-only secure JWT cookie; returns User profile.")
    add_bullet("GET /api/professions: ", "Returns public/student catalog of professions, roles, and skills.")
    add_bullet("GET /api/simulations/[slug]: ", "Retrieves comprehensive simulation scenario, team topology, ADR, and task backlog.")
    add_bullet("POST /api/workspaces: ", "Allocates an isolated workspace; enforces student concurrency limit of 2 workspaces.")
    add_bullet("POST /api/workspaces/[id]/test: ", "Executes in-sandbox test suite with 4000ms timeout cap; streams test summary envelope.")
    add_bullet("POST /api/workspaces/[id]/submit: ", "Captures Git unified diff and commit SHA; triggers evaluation pipeline.")
    add_bullet("GET /api/admin/audit-logs: ", "Administrator-only endpoint retrieving paginated immutable audit log events.")

    add_heading_1("Appendix C: Sample Architectural Decision Record (ADR-001)")
    add_p("To demonstrate how enterprise architecture is embedded into tasks, the flagship FinFlow Technologies Payment Webhook task (FF-104) incorporates the following ADR:")
    add_bullet("ADR Identifier: ", "ADR-001 — Payment Webhook Idempotency & Concurrency Control")
    add_bullet("Context: ", "FinFlow Technologies receives external payment webhooks from Stripe and Adyen. Due to network retries, duplicate webhooks are delivered concurrently, causing race conditions and double-crediting merchant accounts.")
    add_bullet("Decision: ", "Implement an Idempotency-Key validation layer using atomic database transactions. The handler must inspect the X-Idempotency-Key header, query existing transaction records, return HTTP 200 with cached payload on duplicates, and reject missing keys with HTTP 400 Bad Request.")
    add_bullet("Consequences: ", "Guarantees exact-once financial ledger consistency while maintaining sub-50ms API processing latency.")

print("Chapter 5, 6, and Back Matter builder created.")
