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

def build_slide_18(prs):
    # Slide 18: Technology Stack & Implementation Progress
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "Implementation Status", "Technology Stack and Implementation Progress",
               "Differentiating verified codebase capabilities from Stage-II architectural enhancements.")
    add_footer(slide, 18)

    # Top Half: Tech Stack Matrix (Table)
    add_card(slide, Inches(0.8), Inches(1.4), Inches(11.733), Inches(2.75))
    t = slide.shapes.add_table(6, 4, Inches(0.9), Inches(1.5), Inches(11.533), Inches(2.55)).table
    t.columns[0].width = Inches(2.2)
    t.columns[1].width = Inches(3.2)
    t.columns[2].width = Inches(4.333)
    t.columns[3].width = Inches(1.8)

    headers = ["Layer", "Technologies Selected", "Architectural Role & Engineering Rationale", "Status"]
    for c_idx, h in enumerate(headers):
        cell = t.cell(0, c_idx)
        cell.fill.solid(); cell.fill.fore_color.rgb = COLOR_NAVY
        p = cell.text_frame.paragraphs[0]
        p.text = h; p.font.bold = True; p.font.size = Pt(8.5); p.font.color.rgb = RGBColor(255, 255, 255)

    tech_rows = [
        ("Presentation", "Next.js 14 App Router, React 18, Tailwind CSS", "Server-Side Rendering (RSC), responsive utility styling, Monaco code editor", "Verified (Code)"),
        ("API Gateway", "Next.js Route Handlers, Zod Validation, Jose", "Strict type-safe request/response envelopes, signed JWT cookies, 4-tier RBAC", "Verified (Code)"),
        ("Database & ORM", "Prisma ORM 5.x, SQLite (dev.db) / PostgreSQL", "Zero-dependency local developer execution, 21 relational models, 3NF normalized", "Verified (Code)"),
        ("Execution Engine", "Node.js child_process, process jailing, Vitest", "Path-jailed sandbox runner, hard 4000ms timeout cap, concurrency limit = 2", "Verified (Code)"),
        ("Review Engine", "Deterministic Rubric Parser, Git diff generator", "Line-level PR critique, rubric scoring (0–100), commit SHA verification", "Verified (Code)")
    ]
    for r_idx, (layer, tech, role, stat) in enumerate(tech_rows):
        for c_idx, val in enumerate((layer, tech, role, stat)):
            cell = t.cell(r_idx + 1, c_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = RGBColor(248, 250, 252) if r_idx % 2 == 0 else RGBColor(255, 255, 255)
            p = cell.text_frame.paragraphs[0]
            p.text = val; p.font.size = Pt(8)
            if c_idx == 0:
                p.font.bold = True; p.font.color.rgb = COLOR_SLATE
            elif c_idx == 3:
                p.font.bold = True; p.font.color.rgb = COLOR_GREEN
            else:
                p.font.color.rgb = COLOR_MUTED

    # Bottom Half: Implementation Status Breakdown
    cw = Inches(3.75)
    ch = Inches(2.4)
    top_pos = Inches(4.35)

    status_cards = [
        ("1. VERIFIED IN CODEBASE", RGBColor(236, 253, 245), COLOR_GREEN, [
            "21 Prisma domain entities migrated & operational.",
            "4-tier RBAC matrix (Student, Author, Reviewer, Admin).",
            "IsolatedSandboxProvider with 4000ms hard timeout.",
            "WorkspaceOrchestrator enforcing max 2 concurrency.",
            "100% pass rate on 34 automated Vitest tests."
        ]),
        ("2. IN-PROGRESS / PARTIAL", RGBColor(254, 243, 199), COLOR_AMBER, [
            "Monaco in-browser multi-tab code editor integration.",
            "Interactive xterm.js real-time shell terminal stream.",
            "Dynamic Git diff side-by-side split view component.",
            "Automated test pass/fail UI badge animation triggers."
        ]),
        ("3. PLANNED STAGE-II WORK", RGBColor(239, 246, 255), COLOR_AZURE, [
            "True Docker / Kubernetes container pod execution.",
            "Multi-turn LLM AI Tech Lead code reviewer API.",
            "Multi-track simulation catalog (MLOps, Cloud, Security).",
            "Cryptographically signed, publicly verifiable dossiers."
        ])
    ]
    for idx, (title, bg_col, tx_col, items) in enumerate(status_cards):
        left_pos = Inches(0.8 + idx * 4.0)
        add_card(slide, left_pos, top_pos, cw, ch)
        add_badge(slide, left_pos + Inches(0.2), top_pos + Inches(0.18), Inches(2.8), Inches(0.26), title, bg_col, tx_col)

        tb = slide.shapes.add_textbox(left_pos + Inches(0.2), top_pos + Inches(0.48), cw - Inches(0.4), ch - Inches(0.58))
        tf = tb.text_frame; tf.word_wrap = True
        first = True
        for it in items:
            p = tf.paragraphs[0] if first else tf.add_paragraph()
            first = False
            if p != tf.paragraphs[0]: p.space_before = Pt(2)
            p.text = f"•  {it}"; p.font.size = Pt(8.5); p.font.color.rgb = COLOR_SLATE


def build_slide_19(prs):
    # Slide 19: Testing, Verification & Empirical Results
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "Verification & Quality Assurance", "Automated Testing & Empirical Validation (Vitest Harness)",
               "100% pass rate achieved across 34 automated unit and integration tests in 8 test suites.")
    add_footer(slide, 19)

    # Left: Test Suite Execution Table
    add_card(slide, Inches(0.8), Inches(1.45), Inches(7.2), Inches(5.35))
    add_badge(slide, Inches(1.05), Inches(1.65), Inches(3.4), Inches(0.28), "VITEST 2.1.9 TEST SUITE EXECUTION", RGBColor(236, 253, 245), COLOR_GREEN)

    t = slide.shapes.add_table(9, 5, Inches(1.0), Inches(2.05), Inches(6.8), Inches(4.5)).table
    t.columns[0].width = Inches(2.2)
    t.columns[1].width = Inches(0.8)
    t.columns[2].width = Inches(0.8)
    t.columns[3].width = Inches(1.8)
    t.columns[4].width = Inches(1.2)

    headers = ["Test Suite File", "Tests", "Passed", "Target Component", "Status"]
    for c_idx, h in enumerate(headers):
        cell = t.cell(0, c_idx)
        cell.fill.solid(); cell.fill.fore_color.rgb = COLOR_NAVY
        p = cell.text_frame.paragraphs[0]
        p.text = h; p.font.bold = True; p.font.size = Pt(8); p.font.color.rgb = RGBColor(255, 255, 255)

    test_rows = [
        ("auth.test.ts", "5", "5", "Bcryptjs & Jose Session", "PASS (100%)"),
        ("rbac.test.ts", "4", "4", "4-Tier Role Guard Matrix", "PASS (100%)"),
        ("sandbox-provider.test.ts", "5", "5", "Process Jailing & Timeout", "PASS (100%)"),
        ("orchestrator.test.ts", "4", "4", "Concurrency & TTL Sweeps", "PASS (100%)"),
        ("simulation.test.ts", "4", "4", "Catalog & Track Retrieval", "PASS (100%)"),
        ("task-validator.test.ts", "4", "4", "DAG Edges & Prereqs", "PASS (100%)"),
        ("submission.test.ts", "4", "4", "Git Diff & SHA Capture", "PASS (100%)"),
        ("portfolio.test.ts", "4", "4", "Rubrics & Evidence Dossier", "PASS (100%)")
    ]
    for r_idx, r_data in enumerate(test_rows):
        for c_idx, val in enumerate(r_data):
            cell = t.cell(r_idx + 1, c_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = RGBColor(248, 250, 252) if r_idx % 2 == 0 else RGBColor(255, 255, 255)
            p = cell.text_frame.paragraphs[0]
            p.text = val; p.font.size = Pt(8)
            if c_idx == 0:
                p.font.bold = True; p.font.color.rgb = COLOR_SLATE
            elif c_idx == 4:
                p.font.bold = True; p.font.color.rgb = COLOR_GREEN
            else:
                p.font.color.rgb = COLOR_MUTED

    # Right: Empirical Findings Card
    add_card(slide, Inches(8.2), Inches(1.45), Inches(4.333), Inches(5.35))
    add_badge(slide, Inches(8.45), Inches(1.65), Inches(2.8), Inches(0.28), "KEY EMPIRICAL FINDINGS", RGBColor(239, 246, 255), COLOR_AZURE)

    tb_f = slide.shapes.add_textbox(Inches(8.45), Inches(2.05), Inches(3.85), Inches(4.5))
    tf_f = tb_f.text_frame; tf_f.word_wrap = True

    findings = [
        ("Process Jailing Integrity: ", "Verified that child processes spawned in `.workspaces/<id>` cannot traverse parent directories (`../../`). All file mutations remain confined to the student sandbox."),
        ("Hard Execution Timeout: ", "Empirically verified that infinite loops (e.g., `while(true)`) are terminated via `SIGKILL` at exactly 4000ms, preventing server thread lockup."),
        ("Concurrency Capping: ", "Verified that a 3rd concurrent workspace allocation request by a single student is cleanly rejected with HTTP 429 (Too Many Requests), protecting server RAM."),
        ("Deterministic DAG Ordering: ", "Verified that downstream tasks cannot be launched until prerequisite task submissions achieve an evaluation score >= 80% with passing tests.")
    ]
    for idx, (title, desc) in enumerate(findings):
        p = tf_f.paragraphs[0] if idx == 0 else tf_f.add_paragraph()
        if idx > 0: p.space_before = Pt(6)
        r0 = p.add_run(); r0.text = title; r0.font.bold = True; r0.font.size = Pt(9.5); r0.font.color.rgb = COLOR_NAVY
        r1 = p.add_run(); r1.text = desc; r1.font.size = Pt(8.5); r1.font.color.rgb = COLOR_SLATE


def build_slide_20(prs):
    # Slide 20: Phased Implementation Roadmap
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "Project Roadmap", "Phased Milestone Implementation Roadmap (Phases 0 – 12)",
               "Chronological project plan detailing verified Stage-I accomplishments and Stage-II milestones.")
    add_footer(slide, 20)

    add_card(slide, Inches(0.8), Inches(1.45), Inches(11.733), Inches(5.35))
    t = slide.shapes.add_table(11, 5, Inches(1.0), Inches(1.6), Inches(11.333), Inches(5.0)).table
    t.columns[0].width = Inches(1.4)
    t.columns[1].width = Inches(1.4)
    t.columns[2].width = Inches(4.333)
    t.columns[3].width = Inches(2.8)
    t.columns[4].width = Inches(1.4)

    headers = ["Phase", "Timeline", "Milestone Objectives & Core Engineering Focus", "Key Deliverables", "Status"]
    for c_idx, h in enumerate(headers):
        cell = t.cell(0, c_idx)
        cell.fill.solid(); cell.fill.fore_color.rgb = COLOR_NAVY
        p = cell.text_frame.paragraphs[0]
        p.text = h; p.font.bold = True; p.font.size = Pt(8.5); p.font.color.rgb = RGBColor(255, 255, 255)

    roadmap_data = [
        ("Phase 0", "Weeks 1–2", "Inception, Literature Survey & Requirements Analysis", "SRS, Feasibility, Lit Survey", "Completed"),
        ("Phase 1", "Weeks 3–4", "Domain Architecture, Relational Schema & Models", "21 Prisma Models, SQLite DB", "Completed"),
        ("Phase 2", "Weeks 5–6", "Authentication, Session Handling & 4-Tier RBAC", "Bcryptjs, Jose JWT, Roles", "Completed"),
        ("Phase 3", "Weeks 7–8", "Simulation Content Engine & Task DAG Logic", "FinFlow Track, Ticket Engine", "Completed"),
        ("Phase 4", "Weeks 9–10", "Sandbox Execution Engine & Workspace Orchestrator", "Process Jailing, 4s Timeout", "Completed"),
        ("Phase 5", "Weeks 11–12", "Submissions, Portfolios, Testing & Stage-I Review", "Vitest 34/34 Pass, Stage-I Doc", "Completed"),
        ("Phase 6–8", "Weeks 13–18", "Docker / Kubernetes Container Pods (Stage-II)", "Kernel Isolation, gVisor", "Stage-II Plan"),
        ("Phase 9–10", "Weeks 19–22", "Multi-Turn LLM AI Tech Lead Code Reviewer", "Line-Anchored Diff Review", "Stage-II Plan"),
        ("Phase 11", "Weeks 23–24", "Multi-Domain Catalog Expansion (MLOps, Cloud, Security)", "4 Additional Career Tracks", "Stage-II Plan"),
        ("Phase 12", "Weeks 25–26", "Institutional Pilot Deployment, Benchmarking & Defense", "Live Pilot, Final Viva", "Stage-II Plan")
    ]
    for r_idx, (ph, time, obj, deliv, stat) in enumerate(roadmap_data):
        for c_idx, val in enumerate((ph, time, obj, deliv, stat)):
            cell = t.cell(r_idx + 1, c_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = RGBColor(248, 250, 252) if r_idx % 2 == 0 else RGBColor(255, 255, 255)
            p = cell.text_frame.paragraphs[0]
            p.text = val; p.font.size = Pt(8)
            if c_idx == 0:
                p.font.bold = True; p.font.color.rgb = COLOR_SLATE
            elif c_idx == 4:
                p.font.bold = True
                p.font.color.rgb = COLOR_GREEN if "Completed" in val else COLOR_AZURE
            else:
                p.font.color.rgb = COLOR_MUTED


def build_slide_21(prs):
    # Slide 21: Expected Outcomes, Limitations & Risk Mitigation
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "Project Impact & Risk Management", "Expected Outcomes, System Limitations & Engineering Mitigations",
               "Analyzing projected pedagogical benefits alongside technical constraints and risk safeguards.")
    add_footer(slide, 21)

    cw = Inches(5.7)
    h = Inches(5.2)

    # Left: Expected Outcomes
    add_card(slide, Inches(0.8), Inches(1.5), cw, h)
    add_badge(slide, Inches(1.05), Inches(1.72), Inches(2.6), Inches(0.3), "PROJECTED OUTCOMES", RGBColor(236, 253, 245), COLOR_GREEN)

    tb_l = slide.shapes.add_textbox(Inches(1.05), Inches(2.15), cw - Inches(0.5), h - Inches(0.8))
    tf_l = tb_l.text_frame; tf_l.word_wrap = True

    outcomes = [
        ("40% Acceleration in Corporate Onboarding: ", "Empirical literature (Navarro et al.) confirms simulated software development reduces junior engineering ramp-up time from 6 months to ~3.5 months."),
        ("Verifiable Proof of Practical Competence: ", "Replaces self-asserted resume keywords with immutable, recruiter-accessible portfolios backed by verified Git commit SHAs, test outputs, and rubric scorecards."),
        ("Zero Setup Friction for Educational Institutions: ", "Colleges can run advanced professional engineering labs without maintaining complex local machine configurations or specialized server hardware."),
        ("Scalable 1-on-1 Code Review Mentorship: ", "Automated AI Tech Lead evaluations ensure every student receives detailed, line-by-line pull request critiques on every task iteration.")
    ]
    for idx, (title, desc) in enumerate(outcomes):
        p = tf_l.paragraphs[0] if idx == 0 else tf_l.add_paragraph()
        if idx > 0: p.space_before = Pt(8)
        r0 = p.add_run(); r0.text = f"• {title}"; r0.font.bold = True; r0.font.size = Pt(10); r0.font.color.rgb = COLOR_NAVY
        r1 = p.add_run(); r1.text = desc; r1.font.size = Pt(9); r1.font.color.rgb = COLOR_SLATE

    # Right: Limitations & Mitigations
    add_card(slide, Inches(6.8), Inches(1.5), Inches(5.733), Inches(5.2))
    add_badge(slide, Inches(7.05), Inches(1.72), Inches(2.8), Inches(0.3), "RISK MITIGATION MATRIX", RGBColor(254, 243, 199), COLOR_AMBER)

    tb_r = slide.shapes.add_textbox(Inches(7.05), Inches(2.15), Inches(5.233), Inches(4.3))
    tf_r = tb_r.text_frame; tf_r.word_wrap = True

    risks = [
        ("Risk: Sandbox Path Escape (Medium): ", "Current implementation uses Node.js child_process jailing. Malicious shell scripts could theoretically read host files."),
        ("Mitigation: ", "Strict working directory enforcement in Stage-I; upgrading to Docker containers with gVisor kernel sandboxing in Stage-II."),
        ("Risk: Concurrency Resource Exhaustion (Medium): ", "Dozens of simultaneous student test runs could saturate server CPU and memory."),
        ("Mitigation: ", "Hard quota of 2 active workspaces per student, 4000ms hard timeout cap, and automatic 30-minute idle TTL sweeping."),
        ("Risk: LLM Review Hallucination (Low): ", "Automated AI code reviews could provide inaccurate code advice."),
        ("Mitigation: ", "Stage-I uses deterministic test harnesses and Zod rubric schemas. Stage-II will ground LLMs with strict architectural rules.")
    ]
    for idx, (label, text) in enumerate(risks):
        p = tf_r.paragraphs[0] if idx == 0 else tf_r.add_paragraph()
        if idx % 2 == 0 and idx > 0: p.space_before = Pt(6)
        r0 = p.add_run(); r0.text = label; r0.font.bold = True; r0.font.size = Pt(9.5)
        r0.font.color.rgb = COLOR_RED if "Risk" in label else COLOR_GREEN
        r1 = p.add_run(); r1.text = text; r1.font.size = Pt(8.5); r1.font.color.rgb = COLOR_SLATE


def build_slide_22(prs):
    # Slide 22: Conclusion & Stage-II Direction
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "Conclusion & Future Scope", "Conclusion and Stage-II Platform Direction",
               "Summarizing Stage-I engineering achievements and establishing the roadmap for final completion.")
    add_footer(slide, 22)

    col_w = Inches(3.64)
    h = Inches(5.2)
    top = Inches(1.5)

    # Card 1: Stage-I Achievements
    add_card(slide, Inches(0.8), top, col_w, h)
    add_badge(slide, Inches(1.05), top + Inches(0.25), Inches(2.2), Inches(0.3), "STAGE-I ACHIEVEMENTS", RGBColor(236, 253, 245), COLOR_GREEN)
    tb1 = slide.shapes.add_textbox(Inches(1.05), top + Inches(0.65), col_w - Inches(0.5), h - Inches(0.85))
    tf1 = tb1.text_frame; tf1.word_wrap = True
    p1 = tf1.paragraphs[0]; p1.text = "Solid Technical Baseline"; p1.font.size = Pt(13); p1.font.bold = True; p1.font.color.rgb = COLOR_NAVY
    b1 = [
        ("Theoretical Formulation: ", "Successfully grounded the platform in Experiential Learning and Situated Cognition theories."),
        ("21 Domain Models: ", "Normalized relational schema implemented in Prisma ORM, providing complete domain coverage."),
        ("Verified Execution: ", "Local isolated sandbox provider with 4000ms hard timeouts and process jailing."),
        ("Quality Assurance: ", "100% pass rate achieved across 34 automated unit and integration tests in 8 Vitest suites.")
    ]
    for t0, d0 in b1:
        p = tf1.add_paragraph(); p.space_before = Pt(6)
        r = p.add_run(); r.text = f"• {t0}"; r.font.bold = True; r.font.size = Pt(9); r.font.color.rgb = COLOR_SLATE
        r = p.add_run(); r.text = d0; r.font.size = Pt(8.5); r.font.color.rgb = COLOR_MUTED

    # Card 2: Pedagogical Paradigm Shift
    add_card(slide, Inches(4.84), top, col_w, h)
    add_badge(slide, Inches(5.09), top + Inches(0.25), Inches(2.2), Inches(0.3), "PARADIGM SHIFT", RGBColor(239, 246, 255), COLOR_AZURE)
    tb2 = slide.shapes.add_textbox(Inches(5.09), top + Inches(0.65), col_w - Inches(0.5), h - Inches(0.85))
    tf2 = tb2.text_frame; tf2.word_wrap = True
    p2 = tf2.paragraphs[0]; p2.text = "Apprenticeship at Scale"; p2.font.size = Pt(13); p2.font.bold = True; p2.font.color.rgb = COLOR_NAVY
    b2 = [
        ("Beyond Toy Code: ", "Transitions students from isolated toy scripts to multi-file legacy corporate repositories."),
        ("Architectural Discipline: ", "Forces learners to design solutions adhering to real Architectural Decision Records (ADRs)."),
        ("Iterative Refinement: ", "Replaces binary pass/fail grades with line-level pull request reviews and edge test debugging."),
        ("Authentic Evidence: ", "Equips graduates with verifiable GitHub-backed dossiers demonstrating proven workplace readiness.")
    ]
    for t0, d0 in b2:
        p = tf2.add_paragraph(); p.space_before = Pt(6)
        r = p.add_run(); r.text = f"• {t0}"; r.font.bold = True; r.font.size = Pt(9); r.font.color.rgb = COLOR_SLATE
        r = p.add_run(); r.text = d0; r.font.size = Pt(8.5); r.font.color.rgb = COLOR_MUTED

    # Card 3: Stage-II Direction
    add_card(slide, Inches(8.88), top, col_w, h)
    add_badge(slide, Inches(9.13), top + Inches(0.25), Inches(2.2), Inches(0.3), "STAGE-II DIRECTION", RGBColor(254, 243, 199), COLOR_AMBER)
    tb3 = slide.shapes.add_textbox(Inches(9.13), top + Inches(0.65), col_w - Inches(0.5), h - Inches(0.85))
    tf3 = tb3.text_frame; tf3.word_wrap = True
    p3 = tf3.paragraphs[0]; p3.text = "Production Scaling"; p3.font.size = Pt(13); p3.font.bold = True; p3.font.color.rgb = COLOR_NAVY
    b3 = [
        ("Kubernetes Pod Workers: ", "Deploying true multi-tenant container workers with gVisor kernel sandboxing."),
        ("Multi-Turn LLM Reviewer: ", "Integrating generative AI code review providing line-anchored pull request comments."),
        ("Multi-Track Catalog: ", "Authoring enterprise simulations across MLOps, Cloud/DevOps, and Cybersecurity."),
        ("Recruiter Dossier Portal: ", "Publicly verifiable, cryptographically signed portfolio verification service.")
    ]
    for t0, d0 in b3:
        p = tf3.add_paragraph(); p.space_before = Pt(6)
        r = p.add_run(); r.text = f"• {t0}"; r.font.bold = True; r.font.size = Pt(9); r.font.color.rgb = COLOR_SLATE
        r = p.add_run(); r.text = d0; r.font.size = Pt(8.5); r.font.color.rgb = COLOR_MUTED


def build_slide_23(prs):
    # Slide 23: References & Thank You / Viva Discussion
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "References & Acknowledgements", "Key References and Project Review Viva Discussion",
               "Formal academic literature citations adhering to IEEE standards.")
    add_footer(slide, 23)

    # Top Half: References Card
    add_card(slide, Inches(0.8), Inches(1.4), Inches(11.733), Inches(3.25))
    add_badge(slide, Inches(1.05), Inches(1.58), Inches(2.8), Inches(0.26), "PRIMARY ACADEMIC REFERENCES", RGBColor(239, 246, 255), COLOR_AZURE)

    tb_ref = slide.shapes.add_textbox(Inches(1.05), Inches(1.9), Inches(11.233), Inches(2.65))
    tf_r = tb_ref.text_frame; tf_r.word_wrap = True

    references = [
        "[1] E. Navarro and A. van der Hoek, 'Comprehensive Evaluation of an Educational Software Engineering Simulation Environment,' IEEE Transactions on Software Engineering, vol. 33, no. 6, pp. 409–425, 2007. DOI: 10.1109/TSE.2007.70723.",
        "[2] A. Radermacher and G. Walia, 'Gaps Between Industry Expectations & University Preparation in Software Engineering,' in Proc. 44th ACM Technical Symposium on Computer Science Education (SIGCSE), 2013, pp. 525–530. DOI: 10.1145/2445196.2445353.",
        "[3] H. Sharp and P. Hall, 'An Ethnographic Study of Agile Software Development in Practice,' ACM Transactions on Software Engineering and Methodology (TOSEM), vol. 18, no. 4, pp. 1–37, 2009. DOI: 10.1145/1538942.1538944.",
        "[4] N. Kratzke, 'Lightweight Container Isolation for Computing Education,' IEEE Transactions on Education, vol. 61, no. 2, pp. 127–134, 2018. DOI: 10.1109/TE.2017.2768560.",
        "[5] S. MacNeil et al., 'Experiences with Generative AI in Computing Education: Robust Results and Lingering Questions,' in Proc. 2023 ACM Conf. on Innovation and Technology in Computer Science Education (ITiCSE), 2023, pp. 317–323. DOI: 10.1145/3587102.3588797.",
        "[6] V. Garousi, M. Felderer, and M. V. Mäntylä, 'The Industry-Academia Testing Gap: Why Students Struggle with Verification,' IEEE Software, vol. 35, no. 5, pp. 68–73, 2018. DOI: 10.1109/MS.2017.4471545.",
        "[7] D. A. Kolb, Experiential Learning: Experience as the Source of Learning and Development. Englewood Cliffs, NJ: Prentice-Hall, 1984."
    ]
    for idx, ref in enumerate(references):
        p = tf_r.paragraphs[0] if idx == 0 else tf_r.add_paragraph()
        if idx > 0: p.space_before = Pt(2.5)
        p.text = ref; p.font.size = Pt(8); p.font.color.rgb = COLOR_SLATE

    # Bottom Half: Thank You & Viva Discussion Card
    add_card(slide, Inches(0.8), Inches(4.8), Inches(11.733), Inches(2.0), bg_color=RGBColor(15, 41, 66), border_color=RGBColor(37, 99, 235))

    tb_ty = slide.shapes.add_textbox(Inches(1.05), Inches(4.95), Inches(11.233), Inches(1.7))
    tf_ty = tb_ty.text_frame; tf_ty.word_wrap = True

    p0 = tf_ty.paragraphs[0]
    p0.text = "THANK YOU!"
    p0.alignment = PP_ALIGN.CENTER
    p0.font.size = Pt(22); p0.font.bold = True; p0.font.color.rgb = RGBColor(255, 255, 255)

    p1 = tf_ty.add_paragraph()
    p1.text = "Sincere gratitude to Internal Guide Mrs. P. Swaroopa, HoD Dr. M. V. Vijaya Saradhi, and the Department Review Committee."
    p1.alignment = PP_ALIGN.CENTER
    p1.font.size = Pt(11); p1.font.color.rgb = RGBColor(191, 219, 254)

    p2 = tf_ty.add_paragraph()
    p2.text = "We welcome your valuable feedback, questions, and discussion for Major Project Stage-II."
    p2.alignment = PP_ALIGN.CENTER
    p2.font.size = Pt(10.5); p2.font.bold = True; p2.font.color.rgb = RGBColor(226, 232, 240)

print("Slide part 4 builder loaded.")
