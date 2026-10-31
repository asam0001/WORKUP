# Part 3: Chapter 3 (Requirements and Methodology)
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from write_full_report import (
    doc, add_chapter_title, add_heading_1, add_heading_2, add_heading_3,
    add_p, add_bullet, add_figure, add_callout, set_cell_background,
    set_cell_margins, set_table_borders, COLOR_NAVY, COLOR_PRIMARY, COLOR_MUTED
)

def build_chapter_3():
    add_chapter_title("CHAPTER 3\nREQUIREMENTS AND METHODOLOGY")

    add_heading_1("3.1 System Overview")
    add_p("WORKUP is architectured as a multi-tier, full-stack web application designed to support high-fidelity enterprise software engineering simulations. The platform is decoupled into three primary subsystems: (1) the Presentation and Catalog Engine, which delivers responsive, role-based user interfaces; (2) the Core Business and DAG Orchestration Engine, which manages task dependencies, multi-tier evaluations, and audit events; and (3) the Workspace Execution Subsystem, which allocates isolated development sandboxes and manages process lifecycles.")

    add_heading_1("3.2 Target Users and Role Personas")
    add_p("To reflect authentic enterprise governance, the platform models four distinct user roles, each governed by strict Role-Based Access Control (RBAC) policies:")
    add_bullet("1. Student / Learner Persona: ", "Undergraduate engineering students, boot-camp attendees, or transitioning professionals seeking verifiable practical experience. Permissions: browse career families, launch enterprise simulations, provision cloud workspaces, execute in-sandbox tests, submit pull requests, inspect feedback, and export verifiable Evidence-of-Skill dossiers.")
    add_bullet("2. Content Author Persona: ", "Senior software engineers, educators, and curriculum architects responsible for designing simulation tracks. Permissions: author career families, professions, roles, and skills; construct simulated company scenarios and team charters; author task tickets, Acceptance Criteria, and Architectural Decision Records (ADRs); and configure automated test harnesses.")
    add_bullet("3. Technical Reviewer Persona: ", "Industry mentors, teaching assistants, or automated AI Tech Lead agents responsible for evaluating student pull requests. Permissions: inspect student code diffs, evaluate submissions against structured multi-dimensional rubrics, provide line-by-line code review comments, and approve or request changes on pull requests.")
    add_bullet("4. System Administrator Persona: ", "Institutional administrators and DevOps platform leads responsible for platform stability and governance. Permissions: inspect system-wide audit logs, monitor active workspace resource utilization, configure global concurrency limits and timeout thresholds, and manage user account statuses.")

    add_heading_1("3.3 Functional Requirements Specification")
    add_p("The functional requirements specify the exact behavioral capabilities implemented and planned for the WORKUP platform. Table 3.1 details the twelve core functional requirements (FR-01 through FR-12):")

    p_tab = doc.add_paragraph()
    p_tab.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_tab.paragraph_format.space_before = Pt(8)
    p_tab.paragraph_format.space_after = Pt(2)
    run_tc = p_tab.add_run("Table 3.1: Detailed Functional Requirements Specification Matrix (FR-01 to FR-12).")
    run_tc.font.name = 'Times New Roman'
    run_tc.font.size = Pt(10)
    run_tc.font.bold = True
    run_tc.font.italic = True
    run_tc.font.color.rgb = COLOR_NAVY

    fr_data = [
        ("FR-01", "User Authentication & Session Management", "The system shall authenticate users via bcryptjs password hashing and generate signed stateless JWT tokens stored in HTTP-only, secure, SameSite cookies. Verified in src/lib/auth.ts."),
        ("FR-02", "Role-Based Access Control (RBAC)", "The system shall enforce a strict 4-tier RBAC matrix (student, content_author, reviewer, administrator) preventing unauthorized horizontal and vertical privilege escalation. Verified in src/lib/rbac.ts."),
        ("FR-03", "Career & Role Exploration", "The system shall provide a public/student catalog displaying career families, engineering professions, specialized job titles, and mapped technical skills. Verified in src/app/careers/page.tsx."),
        ("FR-04", "Simulated Company & Scenario Engine", "The system shall maintain simulated corporate entities (FinFlow, OmniRetail), functional teams, and multi-sprint business simulation packages. Verified in prisma/schema.prisma."),
        ("FR-05", "Task Backlog & DAG Dependency Engine", "The system shall structure engineering work into discrete tickets with ticket keys (e.g. FF-104) and enforce prerequisite, sequential, and branching unlock conditions via a DAG engine."),
        ("FR-06", "Workspace Orchestration & Lifecycle", "The system shall provision, monitor, and terminate isolated development sandboxes, enforcing a limit of 2 concurrent workspaces per student and a 30-minute idle timeout. Verified in src/lib/workspace/orchestrator.ts."),
        ("FR-07", "Isolated Sandbox Process Jailing", "The execution provider shall spawn process-isolated commands within dedicated .workspaces/<id> directories, restricting filesystem escape and enforcing a hard 4000ms timeout. Verified in src/lib/workspace/providers/sandbox-provider.ts."),
        ("FR-08", "In-Sandbox Automated Test Runner", "The system shall execute local test suites (e.g. npm test / vitest) within the workspace sandbox, streaming test summary results (passed, failed, duration) to the client UI. Verified in src/app/api/workspaces/[id]/test/route.ts."),
        ("FR-09", "Git Pull Request & Diff Capture", "The system shall capture workspace file snapshots, compute Git unified diff summaries against the base template, and generate formal pull request submission records. Verified in src/app/api/workspaces/[id]/submit/route.ts."),
        ("FR-10", "Automated Rubric & AI Review Engine", "The system shall evaluate submitted pull request diffs against structured rubric criteria (e.g., idempotency, error handling, code style) and record line-by-line feedback with numerical scores (0–100)."),
        ("FR-11", "Verifiable Evidence-of-Skill Dossier", "Upon simulation completion, the system shall compile an immutable portfolio dossier containing verified Git commit SHAs, test logs, and rubric scores. Verified in prisma/schema.prisma (PortfolioItem)."),
        ("FR-12", "Immutable System Audit Logging", "The system shall record all critical user actions (registration, workspace launch, command execution, PR submission) into an append-only audit log table with IP addresses and JSON metadata. Verified in prisma/schema.prisma (AuditLog).")
    ]

    t_fr = doc.add_table(rows=len(fr_data) + 1, cols=3)
    t_fr.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_fr.autofit = False
    col_w_fr = [Inches(1.0), Inches(2.1), Inches(3.17)]
    for row in t_fr.rows:
        for idx, w in enumerate(col_w_fr):
            row.cells[idx].width = w
    set_table_borders(t_fr, color="cbd5e1", sz="4")

    # Header
    for idx, h_text in enumerate(["Req ID", "Requirement Name", "Technical Specification & Code Verification"]):
        cell = t_fr.cell(0, idx)
        set_cell_background(cell, "1e3a8a")
        set_cell_margins(cell, top=70, bottom=70, left=70, right=70)
        p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h_text); r.font.name = 'Times New Roman'; r.font.size = Pt(9.5); r.font.bold = True; r.font.color.rgb = RGBColor(255, 255, 255)

    for row_idx, (r_id, r_name, r_desc) in enumerate(fr_data):
        row = t_fr.rows[row_idx + 1]
        bg = "f8fafc" if row_idx % 2 == 1 else "ffffff"
        for col_idx, text_val in enumerate([r_id, r_name, r_desc]):
            cell = row.cells[col_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=50, bottom=50, left=60, right=60)
            p = cell.paragraphs[0]; p.paragraph_format.line_spacing = 1.15; p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text_val); r.font.name = 'Times New Roman'; r.font.size = Pt(9)
            if col_idx == 0:
                r.font.bold = True; r.font.color.rgb = COLOR_NAVY
            elif col_idx == 1:
                r.font.bold = True; r.font.color.rgb = COLOR_PRIMARY

    p_after_fr = doc.add_paragraph()
    p_after_fr.paragraph_format.space_after = Pt(6)

    add_heading_1("3.4 Non-Functional Requirements Specification")
    add_p("The non-functional requirements define the quality attributes, performance constraints, and security standards governing the system. Table 3.2 details the eight primary non-functional requirements (NFR-01 through NFR-08):")

    p_tab_nfr = doc.add_paragraph()
    p_tab_nfr.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_tab_nfr.paragraph_format.space_before = Pt(8)
    p_tab_nfr.paragraph_format.space_after = Pt(2)
    run_tcn = p_tab_nfr.add_run("Table 3.2: Non-Functional Requirements and System Quality Attributes (NFR-01 to NFR-08).")
    run_tcn.font.name = 'Times New Roman'
    run_tcn.font.size = Pt(10)
    run_tcn.font.bold = True
    run_tcn.font.italic = True
    run_tcn.font.color.rgb = COLOR_NAVY

    nfr_data = [
        ("NFR-01", "Execution Latency & Performance", "Web pages shall render in under 1.5 seconds. Workspace command execution initiation shall complete within 250 milliseconds under standard load."),
        ("NFR-02", "Multi-Tenant Process Isolation", "Processes spawned within a student's sandbox shall be strictly jailed within .workspaces/<workspaceId>. Directory traversal (e.g. ../../) and cross-workspace access shall be programmatically rejected."),
        ("NFR-03", "Resource Throttling & Quotas", "Workspaces shall be constrained to 2.0 virtual CPU cores and 4096 MB RAM. In-sandbox test execution shall terminate unconditionally if runtime exceeds 4000ms."),
        ("NFR-04", "Authentication Security", "Passwords must be hashed using bcryptjs with a minimum work factor of 12 salt rounds. JWT session tokens must be signed using 256-bit secret keys and expire in 24 hours."),
        ("NFR-05", "Data Integrity & Referential Constraints", "The database must enforce strict foreign key constraints and cascading deletions across all 21 models via Prisma ORM, preventing orphaned records."),
        ("NFR-06", "Responsive Usability & Accessibility", "The workbench UI must provide a responsive, intuitive interface adhering to WCAG 2.1 Level AA standards, supporting viewport widths from 1024px to 4K displays."),
        ("NFR-07", "Test Coverage & Maintainability", "All core services (auth, rbac, orchestrator, sandbox provider, task validator) must maintain automated unit/integration test coverage with 100% test pass rates in CI."),
        ("NFR-08", "System Auditability & Non-Repudiation", "All submission records, evaluation rubrics, and portfolio dossiers must be linked to immutable user IDs, timestamps, and Git commit SHAs to guarantee non-repudiation.")
    ]

    t_nfr = doc.add_table(rows=len(nfr_data) + 1, cols=3)
    t_nfr.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_nfr.autofit = False
    for row in t_nfr.rows:
        for idx, w in enumerate(col_w_fr):
            row.cells[idx].width = w
    set_table_borders(t_nfr, color="cbd5e1", sz="4")

    for idx, h_text in enumerate(["Req ID", "Quality Category", "Measurable Specification & Target Threshold"]):
        cell = t_nfr.cell(0, idx)
        set_cell_background(cell, "1e3a8a")
        set_cell_margins(cell, top=70, bottom=70, left=70, right=70)
        p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h_text); r.font.name = 'Times New Roman'; r.font.size = Pt(9.5); r.font.bold = True; r.font.color.rgb = RGBColor(255, 255, 255)

    for row_idx, (r_id, r_cat, r_desc) in enumerate(nfr_data):
        row = t_nfr.rows[row_idx + 1]
        bg = "f8fafc" if row_idx % 2 == 1 else "ffffff"
        for col_idx, text_val in enumerate([r_id, r_cat, r_desc]):
            cell = row.cells[col_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=50, bottom=50, left=60, right=60)
            p = cell.paragraphs[0]; p.paragraph_format.line_spacing = 1.15; p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text_val); r.font.name = 'Times New Roman'; r.font.size = Pt(9)
            if col_idx == 0:
                r.font.bold = True; r.font.color.rgb = COLOR_NAVY
            elif col_idx == 1:
                r.font.bold = True; r.font.color.rgb = COLOR_PRIMARY

    p_after_nfr = doc.add_paragraph()
    p_after_nfr.paragraph_format.space_after = Pt(6)

    add_heading_1("3.5 Hardware and Software Specifications")
    add_p("To guarantee reproducible deployment across commodity development environments and production servers, Table 3.3 outlines the minimum and recommended system requirements:")

    p_tab_hw = doc.add_paragraph()
    p_tab_hw.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_tab_hw.paragraph_format.space_before = Pt(8)
    p_tab_hw.paragraph_format.space_after = Pt(2)
    run_tch = p_tab_hw.add_run("Table 3.3: Hardware and Software Environment Specifications.")
    run_tch.font.name = 'Times New Roman'
    run_tch.font.size = Pt(10)
    run_tch.font.bold = True
    run_tch.font.italic = True
    run_tch.font.color.rgb = COLOR_NAVY

    hw_specs = [
        ("Host Processor (CPU)", "Intel Core i5 / AMD Ryzen 5 (4 cores, 2.4 GHz)", "Intel Core i7 / AMD Ryzen 7 (8 cores, 3.6 GHz)"),
        ("System Memory (RAM)", "8 GB DDR4 RAM", "16 GB or 32 GB DDR4/DDR5 RAM"),
        ("Storage Capacity", "20 GB available SSD storage", "50 GB NVMe M.2 SSD storage"),
        ("Host Operating System", "Windows 10/11 (64-bit), Ubuntu 20.04+, macOS 12+", "Ubuntu 22.04 LTS / Debian 12 (Linux Server)"),
        ("JavaScript Runtime", "Node.js v18.18.0 LTS (Active)", "Node.js v20.10.0+ LTS / v22.x"),
        ("Package Management", "npm v9.x or v10.x", "npm v10.x / pnpm / yarn"),
        ("Database Engine", "SQLite 3.x (Zero-config local file dev.db)", "PostgreSQL 15.x / 16.x (AWS RDS / Supabase)"),
        ("Target Client Browser", "Google Chrome 115+, Mozilla Firefox 115+", "Google Chrome 120+, Edge 120+, Safari 17+")
    ]

    t_hw = doc.add_table(rows=len(hw_specs) + 1, cols=3)
    t_hw.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_hw.autofit = False
    for row in t_hw.rows:
        for idx, w in enumerate(col_w_fr):
            row.cells[idx].width = w
    set_table_borders(t_hw, color="cbd5e1", sz="4")

    for idx, h_text in enumerate(["System Component", "Minimum Required Specification", "Recommended Production Specification"]):
        cell = t_hw.cell(0, idx)
        set_cell_background(cell, "1e3a8a")
        set_cell_margins(cell, top=70, bottom=70, left=70, right=70)
        p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h_text); r.font.name = 'Times New Roman'; r.font.size = Pt(9.5); r.font.bold = True; r.font.color.rgb = RGBColor(255, 255, 255)

    for row_idx, (c_name, min_s, rec_s) in enumerate(hw_specs):
        row = t_hw.rows[row_idx + 1]
        bg = "f8fafc" if row_idx % 2 == 1 else "ffffff"
        for col_idx, text_val in enumerate([c_name, min_s, rec_s]):
            cell = row.cells[col_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=50, bottom=50, left=60, right=60)
            p = cell.paragraphs[0]; p.paragraph_format.line_spacing = 1.15; p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text_val); r.font.name = 'Times New Roman'; r.font.size = Pt(9)
            if col_idx == 0:
                r.font.bold = True; r.font.color.rgb = COLOR_PRIMARY

    p_after_hw = doc.add_paragraph()
    p_after_hw.paragraph_format.space_after = Pt(6)

    add_heading_1("3.6 Technology Stack and Justification")
    add_p("The technology stack selected for WORKUP prioritizes end-to-end type safety, rapid iteration, zero-dependency local execution, and a transparent migration pathway to cloud infrastructure. Table 3.4 outlines each chosen technology alongside its architectural justification:")

    p_tab_tech = doc.add_paragraph()
    p_tab_tech.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_tab_tech.paragraph_format.space_before = Pt(8)
    p_tab_tech.paragraph_format.space_after = Pt(2)
    run_tct = p_tab_tech.add_run("Table 3.4: Technology Stack Components and Engineering Justification Matrix.")
    run_tct.font.name = 'Times New Roman'
    run_tct.font.size = Pt(10)
    run_tct.font.bold = True
    run_tct.font.italic = True
    run_tct.font.color.rgb = COLOR_NAVY

    tech_just = [
        ("Next.js 14 App Router", "Frontend & Full-Stack Server", "Provides unified Server Components (RSC) and Client Components with built-in API Route Handlers. Eliminates the complexity of maintaining separate frontend and backend repositories while delivering high-speed server rendering."),
        ("TypeScript 5.x", "Type Safety & Domain Modeling", "Guarantees end-to-end compile-time type verification across database queries, API request payloads, and UI component state. Dramatically reduces runtime type exceptions."),
        ("Tailwind CSS", "Utility-First Styling", "Enables rapid, responsive, and consistent styling without context-switching to external CSS files. Built-in purging ensures minimal production bundle sizes."),
        ("Prisma ORM 5.x", "Data Access & Schema Migration", "Delivers a single source of truth for the 21-entity domain schema with auto-generated, fully typed database client bindings. Provides declarative migrations and identical schema compatibility between SQLite and PostgreSQL."),
        ("SQLite 3 (dev.db)", "Development Database Engine", "Enables zero-dependency, zero-setup local execution for undergraduate evaluations and automated CI/CD runners without requiring external database server daemons."),
        ("bcryptjs & jose", "Authentication & Security", "Provides industry-standard password hashing with adaptive salt rounds and lightweight, standards-compliant JSON Web Token (JWT) signing using pure JavaScript runtimes."),
        ("Vitest 2.x", "Automated Testing Framework", "Modern, high-performance test runner with native TypeScript support and path aliasing. Executes test suites significantly faster than Jest while maintaining full compatibility."),
        ("GitHub Actions", "Continuous Integration (CI)", "Automates linting, database migrations, database seeding, test execution, and production build checks on every git commit and pull request.")
    ]

    t_tech = doc.add_table(rows=len(tech_just) + 1, cols=3)
    t_tech.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_tech.autofit = False
    for row in t_tech.rows:
        for idx, w in enumerate(col_w_fr):
            row.cells[idx].width = w
    set_table_borders(t_tech, color="cbd5e1", sz="4")

    for idx, h_text in enumerate(["Technology Component", "Architecture Tier", "Engineering Selection Rationale"]):
        cell = t_tech.cell(0, idx)
        set_cell_background(cell, "1e3a8a")
        set_cell_margins(cell, top=70, bottom=70, left=70, right=70)
        p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h_text); r.font.name = 'Times New Roman'; r.font.size = Pt(9.5); r.font.bold = True; r.font.color.rgb = RGBColor(255, 255, 255)

    for row_idx, (tech_name, tier, just) in enumerate(tech_just):
        row = t_tech.rows[row_idx + 1]
        bg = "f8fafc" if row_idx % 2 == 1 else "ffffff"
        for col_idx, text_val in enumerate([tech_name, tier, just]):
            cell = row.cells[col_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=50, bottom=50, left=60, right=60)
            p = cell.paragraphs[0]; p.paragraph_format.line_spacing = 1.15; p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text_val); r.font.name = 'Times New Roman'; r.font.size = Pt(9)
            if col_idx == 0:
                r.font.bold = True; r.font.color.rgb = COLOR_NAVY
            elif col_idx == 1:
                r.font.bold = True; r.font.color.rgb = COLOR_PRIMARY

    p_after_t = doc.add_paragraph()
    p_after_t.paragraph_format.space_after = Pt(6)

    add_heading_1("3.7 Software Development Methodology")
    add_p("The engineering development of WORKUP follows an Iterative Agile Methodology coupled with Phased Architectural Gateways. Recognizing the technical complexity of integrating container orchestration, multi-tenant sandboxing, and full-stack web applications, the project was structured into iterative, test-driven phases (Phases 0 through 12).")
    add_p("Each development iteration operates under strict Quality Gates: an architectural phase cannot be declared complete until its domain schema is finalized, route handlers are implemented with Zod validation, and automated unit/integration tests achieve 100% pass rates in Vitest. This disciplined methodology prevented architectural drift and ensured that foundational features (Phase 1 authentication and Phase 2 DAG engine) were thoroughly hardened prior to constructing the Phase 3 workspace orchestrator.")

    add_heading_1("3.8 Main Operational Workflows")
    add_p("The primary end-to-end operational workflow follows the fourteen stages of the Universal Professional Lifecycle: (1) A learner navigates to the Career Explorer, selecting a discipline (e.g. Software Engineering) and specialized role (e.g. Junior Backend Engineer); (2) The learner enters a simulated company track (FinFlow Technologies) and reviews the business context; (3) The learner selects an unlocked task ticket (FF-104: Payment Webhook Idempotency) from the sprint backlog; (4) The system verifies DAG prerequisite completion and triggers the Workspace Orchestrator; (5) An isolated sandbox is provisioned in .workspaces/<id> containing the legacy payment codebase; (6) The student writes an idempotency handler adhering to ADR-001; (7) The student executes in-sandbox tests via Vitest; (8) Upon passing, the student submits a Git pull request; (9) The AI Tech Lead reviewer parses the unified diff and generates line-anchored feedback; (10) Dependent tasks unlock in the simulation DAG, and verified commit SHAs are appended to the learner's Evidence-of-Skill Dossier.")

    add_heading_1("3.9 Data Management, Privacy, and Security Controls")
    add_p("WORKUP implements rigorous security and data protection mechanisms: (1) Cryptographic Hashing: all passwords are salted and hashed via bcryptjs (work factor: 12), preventing rainbow table attacks; (2) Tamper-Evident Sessions: signed stateless JWTs with 24-hour expiration stored in HTTP-only, secure, SameSite cookies prevent Cross-Site Scripting (XSS) token theft; (3) Input Sanitization: all API inputs are parsed against strict Zod runtime validation schemas, eliminating injection vulnerabilities; (4) Process Sandboxing: the IsolatedSandboxProvider validates all execution paths against directory traversal attacks, executing commands under bounded process privileges.")

    add_heading_1("3.10 Feasibility Analysis and Technical Constraints")
    add_p("Technical feasibility is verified through the successful compilation of the Next.js App Router codebase, passing Prisma migrations, and 34 passing Vitest tests. Operational feasibility is demonstrated by the system's ability to execute on commodity laptops without external cloud dependencies. Economic feasibility is ensured through zero-license open-source runtimes. System constraints include single-node process sandboxing during Stage-I, with distributed container clustering reserved for Stage-II.")

    doc.add_page_break()

print("Chapter 3 builder created.")
