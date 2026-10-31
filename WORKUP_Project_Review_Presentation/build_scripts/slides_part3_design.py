import os
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from slides_common import (
    COLOR_NAVY, COLOR_SLATE, COLOR_BLUE, COLOR_AZURE, COLOR_MUTED,
    COLOR_LIGHT_BG, COLOR_CARD_BG, COLOR_CARD_BORDER, COLOR_GREEN,
    COLOR_AMBER, COLOR_RED, set_slide_background, add_header, add_footer,
    add_card, add_badge
)

DIAGRAMS_DIR = os.path.join("WORKUP_Project_Review_Presentation", "diagrams")

def build_slide_13(prs):
    # Slide 13: System Architecture
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "System Design | Architecture", "Tiered System Architecture Diagram",
               "5-tier decoupled topology separating presentation, routing, domain logic, sandboxes, and persistence.")
    add_footer(slide, 13)

    # Left: Diagram Image
    diag_path = os.path.join(DIAGRAMS_DIR, "fig_1_system_architecture.png")
    if os.path.exists(diag_path):
        slide.shapes.add_picture(diag_path, Inches(0.8), Inches(1.45), width=Inches(6.4))

    # Right: Architectural Breakdown Card
    add_card(slide, Inches(7.4), Inches(1.45), Inches(5.133), Inches(5.35))
    add_badge(slide, Inches(7.65), Inches(1.65), Inches(2.8), Inches(0.28), "5 DECOUPLED TIERS", RGBColor(239, 246, 255), COLOR_AZURE)

    tb = slide.shapes.add_textbox(Inches(7.65), Inches(2.0), Inches(4.65), Inches(4.65))
    tf = tb.text_frame; tf.word_wrap = True

    tiers = [
        ("1. Presentation Tier (Next.js 14 / React 18): ", "Responsive UI with Server Components (RSC), career exploration catalogs, Monaco code editor, terminal runner, and real-time pass/fail badges."),
        ("2. API Gateway & Security Tier: ", "Next.js Route Handlers with Zod request validation, bcryptjs password hashing, signed jose JWT session cookies, and 4-tier RBAC guards."),
        ("3. Core Domain & Business Services: ", "Simulation DAG engine enforcing task dependencies, Workspace Orchestrator managing lifecycle, and rubric-driven evaluation service."),
        ("4. Workspace & Execution Tier: ", "`IsolatedSandboxProvider` enforcing process jailing, hard 4000ms execution timeout cap, and Vitest CLI automated test runner."),
        ("5. Persistence & Storage Tier: ", "Prisma ORM 5.x with type-safe query engine, 21 relational tables on SQLite (`dev.db`), and seamless migration target for PostgreSQL (AWS RDS).")
    ]
    for idx, (title, desc) in enumerate(tiers):
        p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
        if idx > 0: p.space_before = Pt(5)
        r0 = p.add_run(); r0.text = title; r0.font.bold = True; r0.font.size = Pt(9.5); r0.font.color.rgb = COLOR_NAVY
        r1 = p.add_run(); r1.text = desc; r1.font.size = Pt(8.5); r1.font.color.rgb = COLOR_SLATE


def build_slide_14(prs):
    # Slide 14: Use Case Diagram
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "System Design | Use Case Modeling", "WORKUP Unified Use Case Diagram",
               "16 discrete system use cases categorized across four core actor personas.")
    add_footer(slide, 14)

    # Left: Diagram Image
    diag_path = os.path.join(DIAGRAMS_DIR, "fig_2_use_case.png")
    if os.path.exists(diag_path):
        slide.shapes.add_picture(diag_path, Inches(0.8), Inches(1.45), width=Inches(6.4))

    # Right: Actors & Use Cases Card
    add_card(slide, Inches(7.4), Inches(1.45), Inches(5.133), Inches(5.35))
    add_badge(slide, Inches(7.65), Inches(1.65), Inches(2.8), Inches(0.28), "ACTORS & CAPABILITIES", RGBColor(236, 253, 245), COLOR_GREEN)

    tb = slide.shapes.add_textbox(Inches(7.65), Inches(2.0), Inches(4.65), Inches(4.65))
    tf = tb.text_frame; tf.word_wrap = True

    actors = [
        ("Student / Learner Actor (Primary): ", [
            "UC-01: Explore Careers & Roles",
            "UC-02: Launch Simulation Track",
            "UC-03: Inspect Ticket & Architecture ADR",
            "UC-04: Provision Isolated Cloud Workspace",
            "UC-05: Run In-Sandbox Automated Tests",
            "UC-06: Submit Pull Request & Commit",
            "UC-07: View Verifiable Evidence Dossier"
        ]),
        ("Technical Reviewer / AI Lead Actor: ", [
            "UC-08: Inspect PR Diff & Code Notes",
            "UC-09: Score Rubric Criteria (0–100)",
            "UC-10: Provide Line-by-Line Code Review"
        ]),
        ("Content Author Actor: ", [
            "UC-11: Author Company & Engineering Teams",
            "UC-12: Configure Task DAG & Prerequisites",
            "UC-13: Set Acceptance Benchmarks & Tests"
        ]),
        ("System Administrator Actor: ", [
            "UC-14: Review Platform Audit Log Trails",
            "UC-15: Manage Fleet Concurrency Quotas",
            "UC-16: User Role & Organization Management"
        ])
    ]
    first = True
    for a_title, uc_list in actors:
        p0 = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        if p0 != tf.paragraphs[0]: p0.space_before = Pt(5)
        r0 = p0.add_run(); r0.text = a_title; r0.font.bold = True; r0.font.size = Pt(9.5); r0.font.color.rgb = COLOR_NAVY
        
        for uc in uc_list:
            p = tf.add_paragraph()
            r = p.add_run(); r.text = f"• {uc}"; r.font.size = Pt(8.5); r.font.color.rgb = COLOR_SLATE


def build_slide_15(prs):
    # Slide 15: Class & Domain Entity Model
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "System Design | Domain & Data Modeling", "Domain Class Model & Relational Entity Schema",
               "Object-oriented domain modeling of the 21 normalized relational models defined in prisma/schema.prisma.")
    add_footer(slide, 15)

    # Left: Diagram Image
    diag_path = os.path.join(DIAGRAMS_DIR, "fig_5_class_domain_model.png")
    if os.path.exists(diag_path):
        slide.shapes.add_picture(diag_path, Inches(0.8), Inches(1.45), width=Inches(6.2))

    # Right: Domain Clusters Card
    add_card(slide, Inches(7.2), Inches(1.45), Inches(5.333), Inches(5.35))
    add_badge(slide, Inches(7.45), Inches(1.65), Inches(3.2), Inches(0.28), "21 PRISMA DOMAIN ENTITIES", RGBColor(239, 246, 255), COLOR_AZURE)

    tb = slide.shapes.add_textbox(Inches(7.45), Inches(2.0), Inches(4.85), Inches(4.65))
    tf = tb.text_frame; tf.word_wrap = True

    clusters = [
        ("Identity & Access Cluster: ", "User (credentials, roleEnum: STUDENT, AUTHOR, REVIEWER, ADMIN), Profile (headline, experienceLevel, githubUsername), Session (jose JWT), PasswordResetToken, AuditLog."),
        ("Career Taxonomy Cluster: ", "CareerFamily (SE, AI/ML, Cloud), Profession (slug, category), Role (responsibilities JSON), Skill (category), RoleSkill (associative N:M mapping with required proficiency)."),
        ("Simulation & Enterprise Cluster: ", "Company (industry, size, techStack JSON), Team (topology, engineering focus), Simulation (difficulty, estimatedHours), Phase (ordered sprint phases)."),
        ("Task DAG & Dependency Cluster: ", "Task (ticketKey, acceptanceRubric, automatedTests JSON), TaskSkill (skills evaluated), TaskDependency (DAG edges enforcing prerequisite unlocking)."),
        ("Execution & Portfolio Cluster: ", "Workspace (jailed directory, status: STARTING, READY, RUNNING, STOPPED, FAILED, cpu/memory limits), Submission (commitSha, diffSummary), Evaluation (rubricScores JSON, lineComments), PortfolioItem (verifiable dossier).")
    ]
    for idx, (title, desc) in enumerate(clusters):
        p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
        if idx > 0: p.space_before = Pt(5)
        r0 = p.add_run(); r0.text = title; r0.font.bold = True; r0.font.size = Pt(9.5); r0.font.color.rgb = COLOR_NAVY
        r1 = p.add_run(); r1.text = desc; r1.font.size = Pt(8.5); r1.font.color.rgb = COLOR_SLATE


def build_slide_16(prs):
    # Slide 16: Sequence Diagram: Task Execution & Review Flow
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "System Design | Sequence Modeling", "Task Execution & Automated Code Review Sequence Trace",
               "19-message chronological interaction between Student, UI, Orchestrator, Sandbox, and AI Reviewer.")
    add_footer(slide, 16)

    # Left: Diagram Image
    diag_path = os.path.join(DIAGRAMS_DIR, "fig_4_sequence_submission.png")
    if os.path.exists(diag_path):
        slide.shapes.add_picture(diag_path, Inches(0.8), Inches(1.45), width=Inches(6.4))

    # Right: Sequence Trace Breakdown Card
    add_card(slide, Inches(7.4), Inches(1.45), Inches(5.133), Inches(5.35))
    add_badge(slide, Inches(7.65), Inches(1.65), Inches(3.0), Inches(0.28), "TWO-PHASE EXECUTION TRACE", RGBColor(254, 243, 199), COLOR_AMBER)

    tb = slide.shapes.add_textbox(Inches(7.65), Inches(2.0), Inches(4.65), Inches(4.65))
    tf = tb.text_frame; tf.word_wrap = True

    phases = [
        ("Phase 1: In-Sandbox Test Execution (Msgs 1–8):", [
            "1. Student initiates 'Run Automated Tests' in Workbench.",
            "2. POST request dispatched to /api/workspaces/[id]/test.",
            "3. Route handler delegates to WorkspaceOrchestrator.",
            "4. IsolatedSandboxProvider spawns process with hard 4000ms cap.",
            "5. Process executes Vitest harness inside .workspaces/<id>.",
            "6. Standard output parsed into structured TestSummary JSON.",
            "7. Exit code & JSON returned to Workbench UI via HTTP 200.",
            "8. UI renders green passing badges or red stack trace diffs."
        ]),
        ("Phase 2: Pull Request Submission & Review (Msgs 9–19):", [
            "9. Student clicks 'Submit Pull Request' upon test success.",
            "10. POST request dispatched to /api/workspaces/[id]/submit.",
            "11. Orchestrator captures Git unified diff and HEAD commit SHA.",
            "12. Submission record persisted with status 'SUBMITTED'.",
            "13. EvaluationEngine triggers AI Tech Lead review service.",
            "14. Unified diff scored against ADR rubrics (0–100 score).",
            "15. Line-by-line feedback written; DAG unlocks next task node."
        ])
    ]
    first = True
    for p_title, step_list in phases:
        p0 = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        if p0 != tf.paragraphs[0]: p0.space_before = Pt(6)
        r0 = p0.add_run(); r0.text = p_title; r0.font.bold = True; r0.font.size = Pt(9.5); r0.font.color.rgb = COLOR_NAVY
        
        for st in step_list:
            p = tf.add_paragraph()
            r = p.add_run(); r.text = f"• {st}"; r.font.size = Pt(8); r.font.color.rgb = COLOR_SLATE


def build_slide_17(prs):
    # Slide 17: Component & Deployment Topology (Dual Diagram Layout!)
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "System Design | Architecture", "Component Packaging and Deployment Topology",
               "Visualizing internal software component decoupling alongside physical/virtual runtime infrastructure.")
    add_footer(slide, 17)

    # Left: Component Diagram (Figure 4.7)
    add_card(slide, Inches(0.8), Inches(1.45), Inches(5.7), Inches(5.35))
    add_badge(slide, Inches(1.05), Inches(1.65), Inches(2.8), Inches(0.28), "COMPONENT PACKAGING", RGBColor(239, 246, 255), COLOR_AZURE)
    
    diag_c = os.path.join(DIAGRAMS_DIR, "fig_7_component_diagram.png")
    if os.path.exists(diag_c):
        slide.shapes.add_picture(diag_c, Inches(1.2), Inches(1.95), width=Inches(4.9))

    tb_c = slide.shapes.add_textbox(Inches(1.05), Inches(5.95), Inches(5.2), Inches(0.75))
    tfc = tb_c.text_frame; tfc.word_wrap = True
    pc = tfc.paragraphs[0]
    pc.text = "Decoupled Architecture: Presentation components (React 18), API Route Handlers (Zod validation), Core Services (Auth, DAG, Orchestrator), and Execution Engine (Sandbox Provider)."
    pc.font.size = Pt(8); pc.font.color.rgb = COLOR_SLATE

    # Right: Deployment Diagram (Figure 4.8)
    add_card(slide, Inches(6.8), Inches(1.45), Inches(5.733), Inches(5.35))
    add_badge(slide, Inches(7.05), Inches(1.65), Inches(2.8), Inches(0.28), "DEPLOYMENT TOPOLOGY", RGBColor(236, 253, 245), COLOR_GREEN)

    diag_d = os.path.join(DIAGRAMS_DIR, "fig_8_deployment_diagram.png")
    if os.path.exists(diag_d):
        slide.shapes.add_picture(diag_d, Inches(7.2), Inches(1.95), width=Inches(4.933))

    tb_d = slide.shapes.add_textbox(Inches(7.05), Inches(5.95), Inches(5.233), Inches(0.75))
    tfd = tb_d.text_frame; tfd.word_wrap = True
    pd = tfd.paragraphs[0]
    pd.text = "Runtime Infrastructure: Modern Web Browser -> HTTPS (Port 443) -> Next.js Application Server Node -> Local Jailed Sandbox Processes (Worker Node) -> Persistent SQLite/PostgreSQL Database."
    pd.font.size = Pt(8); pd.font.color.rgb = COLOR_SLATE


print("Slide part 3 builder loaded.")
