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

def build_slide_7(prs):
    # Slide 7: Literature Survey (Part 1: SE Simulations & Skill Deficits)
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "Literature Survey | Part 1", "Educational SE Simulation & Graduate Skill Deficits",
               "Analyzing empirical foundations of software engineering simulation games and industry readiness.")
    add_footer(slide, 7)

    # 3 Column Cards
    col_w = Inches(3.64)
    h = Inches(5.2)
    top = Inches(1.5)

    papers = [
        {
            "badge": "SE SIMULATION ENVIRONMENTS",
            "b_bg": RGBColor(239, 246, 255), "b_tx": COLOR_AZURE,
            "title": "Comprehensive Evaluation of an Educational Software Engineering Simulation",
            "authors": "E. Navarro & A. van der Hoek",
            "venue": "IEEE Trans. Softw. Eng., Vol. 33, No. 6, pp. 409–425",
            "year": "2007  |  DOI: 10.1109/TSE.2007.70723",
            "desc": "Presents 'SimSE', an interactive graphical simulation environment modeling software process lifecycles (Waterfall, Agile, XP). Demonstrates that active participatory simulation enables students to discover non-obvious engineering trade-offs (e.g., technical debt, team communication latency) far more effectively than static lectures.",
            "takeaway": "Validates WORKUP's simulation engine modeling virtual companies, sprint backlogs, and multi-role engineering team dynamics."
        },
        {
            "badge": "GRADUATE SKILL GAPS",
            "b_bg": RGBColor(254, 242, 242), "b_tx": COLOR_RED,
            "title": "Gaps Between Industry Expectations & University Preparation in Software Eng.",
            "authors": "A. Radermacher & G. Walia",
            "venue": "Proc. 44th ACM Technical Symposium on CS Education (SIGCSE)",
            "year": "2013  |  DOI: 10.1145/2445196.2445353",
            "desc": "Conducted an extensive empirical survey across 50+ technology companies. Identified that new graduates face severe skill deficits in navigating large legacy codebases, writing integration tests, utilizing issue tracking tickets, and participating in peer code reviews.",
            "takeaway": "Directly guides WORKUP's pedagogical focus on legacy codebase refactoring, Jira-style task tickets, and PR code reviews."
        },
        {
            "badge": "AGILE TEAM ETHNOGRAPHY",
            "b_bg": RGBColor(254, 243, 199), "b_tx": COLOR_AMBER,
            "title": "An Ethnographic Study of Agile Software Development in Practice",
            "authors": "H. Sharp & P. Hall",
            "venue": "ACM Trans. Software Engineering & Methodology (TOSEM)",
            "year": "2009  |  DOI: 10.1145/1538942.1538944",
            "desc": "Investigates real-world Agile engineering team behavior over 24 months. Establishes that professional engineering is fundamentally ticket-driven, artifact-anchored, and social—revolving around standups, architectural constraints, and pull request critique.",
            "takeaway": "Informs WORKUP's simulation interface featuring architectural ADRs, sprint phases, and simulated senior engineering team members."
        }
    ]

    for idx, p in enumerate(papers):
        c_left = Inches(0.8 + idx * 4.04)
        add_card(slide, c_left, top, col_w, h)
        add_badge(slide, c_left + Inches(0.2), top + Inches(0.2), Inches(2.5), Inches(0.28), p["badge"], p["b_bg"], p["b_tx"])

        tb = slide.shapes.add_textbox(c_left + Inches(0.2), top + Inches(0.55), col_w - Inches(0.4), h - Inches(0.65))
        tf = tb.text_frame; tf.word_wrap = True

        p0 = tf.paragraphs[0]
        p0.text = p["title"]
        p0.font.size = Pt(10.5); p0.font.bold = True; p0.font.color.rgb = COLOR_NAVY

        p_meta = tf.add_paragraph()
        p_meta.text = f"{p['authors']} ({p['year'].split()[0]})\n{p['venue']}\n{p['year']}"
        p_meta.font.size = Pt(8); p_meta.font.color.rgb = COLOR_MUTED; p_meta.font.italic = True

        p_d_head = tf.add_paragraph(); p_d_head.space_before = Pt(6)
        p_d_head.text = "Summary & Findings:"
        p_d_head.font.size = Pt(9); p_d_head.font.bold = True; p_d_head.font.color.rgb = COLOR_SLATE

        p_desc = tf.add_paragraph()
        p_desc.text = p["desc"]
        p_desc.font.size = Pt(8.5); p_desc.font.color.rgb = COLOR_MUTED

        p_t_head = tf.add_paragraph(); p_t_head.space_before = Pt(6)
        p_t_head.text = "Purpose / Relevance to WORKUP:"
        p_t_head.font.size = Pt(9); p_t_head.font.bold = True; p_t_head.font.color.rgb = COLOR_AZURE

        p_take = tf.add_paragraph()
        p_take.text = p["takeaway"]
        p_take.font.size = Pt(8.5); p_take.font.color.rgb = COLOR_SLATE


def build_slide_8(prs):
    # Slide 8: Literature Survey (Part 2: Cloud Workspaces & AI Code Review)
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "Literature Survey | Part 2", "Cloud Workspaces & AI-Assisted Code Review",
               "Research into isolated execution environments, generative AI in education, and testing gaps.")
    add_footer(slide, 8)

    col_w = Inches(3.64)
    h = Inches(5.2)
    top = Inches(1.5)

    papers = [
        {
            "badge": "LIGHTWEIGHT CONTAINERIZATION",
            "b_bg": RGBColor(239, 246, 255), "b_tx": COLOR_AZURE,
            "title": "Lightweight Container Isolation for Computing Education",
            "authors": "N. Kratzke",
            "venue": "IEEE Transactions on Education, Vol. 61, No. 2, pp. 127–134",
            "year": "2018  |  DOI: 10.1109/TE.2017.2768560",
            "desc": "Evaluates containerized execution architectures for computing lab assignments. Shows that browser-accessible ephemeral containers eliminate operating-system configuration friction, enforce strict CPU/RAM limits, and prevent malicious local path escapes.",
            "takeaway": "Provides the blueprint for WORKUP's `IsolatedSandboxProvider`, enforcing process jailing, 4000ms timeouts, and concurrency caps."
        },
        {
            "badge": "FORMATIVE AI CODE REVIEW",
            "b_bg": RGBColor(236, 253, 245), "b_tx": COLOR_GREEN,
            "title": "Experiences with Generative AI in Computing Education",
            "authors": "S. MacNeil et al.",
            "venue": "Proc. 2023 ACM Conf. on Innovation & Technology in CS Education (ITiCSE)",
            "year": "2023  |  DOI: 10.1145/3587102.3588797",
            "desc": "Examines LLMs providing real-time code explanations, error remediation, and code critique. Finds that line-level formative feedback anchored to specific code diffs dramatically accelerates student debugging skills compared to generic error summaries.",
            "takeaway": "Validates WORKUP's AI Tech Lead Reviewer providing structured, line-by-line pull request critique against engineering rubrics."
        },
        {
            "badge": "TESTING DEFICIT ANALYSIS",
            "b_bg": RGBColor(254, 242, 242), "b_tx": COLOR_RED,
            "title": "The Industry-Academia Testing Gap: Why Students Struggle with Verification",
            "authors": "V. Garousi, M. Felderer, & M. V. Mäntylä",
            "venue": "IEEE Software, Vol. 35, No. 5, pp. 68–73",
            "year": "2018  |  DOI: 10.1109/MS.2017.4471545",
            "desc": "Analyzes software testing instruction across 100+ universities. Reveals that curricula treat testing as an afterthought; students are rarely taught to run test suites locally, write edge assertions, or maintain CI pipeline green states.",
            "takeaway": "Directly justifies WORKUP's workbench architecture requiring in-sandbox automated test execution (Vitest) prior to PR submission."
        }
    ]

    for idx, p in enumerate(papers):
        c_left = Inches(0.8 + idx * 4.04)
        add_card(slide, c_left, top, col_w, h)
        add_badge(slide, c_left + Inches(0.2), top + Inches(0.2), Inches(2.5), Inches(0.28), p["badge"], p["b_bg"], p["b_tx"])

        tb = slide.shapes.add_textbox(c_left + Inches(0.2), top + Inches(0.55), col_w - Inches(0.4), h - Inches(0.65))
        tf = tb.text_frame; tf.word_wrap = True

        p0 = tf.paragraphs[0]
        p0.text = p["title"]
        p0.font.size = Pt(10.5); p0.font.bold = True; p0.font.color.rgb = COLOR_NAVY

        p_meta = tf.add_paragraph()
        p_meta.text = f"{p['authors']} ({p['year'].split()[0]})\n{p['venue']}\n{p['year']}"
        p_meta.font.size = Pt(8); p_meta.font.color.rgb = COLOR_MUTED; p_meta.font.italic = True

        p_d_head = tf.add_paragraph(); p_d_head.space_before = Pt(6)
        p_d_head.text = "Summary & Findings:"
        p_d_head.font.size = Pt(9); p_d_head.font.bold = True; p_d_head.font.color.rgb = COLOR_SLATE

        p_desc = tf.add_paragraph()
        p_desc.text = p["desc"]
        p_desc.font.size = Pt(8.5); p_desc.font.color.rgb = COLOR_MUTED

        p_t_head = tf.add_paragraph(); p_t_head.space_before = Pt(6)
        p_t_head.text = "Purpose / Relevance to WORKUP:"
        p_t_head.font.size = Pt(9); p_t_head.font.bold = True; p_t_head.font.color.rgb = COLOR_AZURE

        p_take = tf.add_paragraph()
        p_take.text = p["takeaway"]
        p_take.font.size = Pt(8.5); p_take.font.color.rgb = COLOR_SLATE


def build_slide_9(prs):
    # Slide 9: Comparative Analysis & Research Gaps
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "Comparative Analysis", "Platform Comparison Matrix & Identified Research Gaps",
               "Evaluating WORKUP against commercial platforms and crystallizing the unresolved literature gaps.")
    add_footer(slide, 9)

    # Top Half: Comparative Matrix Table
    add_card(slide, Inches(0.8), Inches(1.4), Inches(11.733), Inches(2.7))
    t = slide.shapes.add_table(6, 6, Inches(0.9), Inches(1.5), Inches(11.533), Inches(2.5)).table
    t.columns[0].width = Inches(2.533)
    t.columns[1].width = Inches(1.8)
    t.columns[2].width = Inches(1.8)
    t.columns[3].width = Inches(1.8)
    t.columns[4].width = Inches(1.8)
    t.columns[5].width = Inches(1.8)

    matrix_headers = ["Key Capability Dimension", "LeetCode", "Coursera", "Forage", "Codespaces", "WORKUP (Ours)"]
    for c_idx, h in enumerate(matrix_headers):
        cell = t.cell(0, c_idx)
        cell.fill.solid(); cell.fill.fore_color.rgb = COLOR_NAVY if c_idx < 5 else COLOR_BLUE
        p = cell.text_frame.paragraphs[0]
        p.text = h; p.font.bold = True; p.font.size = Pt(8.5); p.font.color.rgb = RGBColor(255, 255, 255)

    matrix_rows = [
        ("Multi-File Legacy Repositories", "No (Single Func)", "No (Clean Scratch)", "Partial (Unlinked)", "Yes (Full Repo)", "Yes (Simulated Legacy)"),
        ("Architectural Context (ADRs/Tickets)", "No (Toy Prompt)", "No (Static Prompt)", "Yes (PDF Scenario)", "No (Raw VM)", "Yes (Jira/ADR Engine)"),
        ("Ephemeral Cloud Sandbox", "Isolated Runner", "No (Local/Jupyter)", "No (Static Upload)", "Yes (Full Linux)", "Yes (Path-Jailed Node)"),
        ("In-Situ Automated Test Execution", "Hidden Runner", "Basic Autograder", "No Execution", "Manual Terminal", "Yes (Vitest Harness)"),
        ("Line-Level Pull Request Review", "No (Binary Grade)", "No (Peer/Auto)", "No Review", "Manual Peer PR", "Yes (AI Tech Lead PR)"),
    ]
    for r_idx, r_data in enumerate(matrix_rows):
        for c_idx, val in enumerate(r_data):
            cell = t.cell(r_idx + 1, c_idx)
            cell.fill.solid()
            if c_idx == 5:
                cell.fill.fore_color.rgb = RGBColor(239, 246, 255) # Light blue highlight for WORKUP
            else:
                cell.fill.fore_color.rgb = RGBColor(248, 250, 252) if r_idx % 2 == 0 else RGBColor(255, 255, 255)
            p = cell.text_frame.paragraphs[0]
            p.text = val; p.font.size = Pt(8)
            if c_idx == 0:
                p.font.bold = True; p.font.color.rgb = COLOR_SLATE
            elif c_idx == 5:
                p.font.bold = True; p.font.color.rgb = COLOR_BLUE
            else:
                p.font.color.rgb = COLOR_MUTED

    # Bottom Half: 3 Core Research Gaps
    gap_top = Inches(4.25)
    gap_h = Inches(2.45)
    gw = Inches(3.75)

    gaps = [
        ("GAP 1: THE DISCONNECTED WORKFLOW", RGBColor(254, 242, 242), COLOR_RED,
         "Existing platforms fragment the software development lifecycle. Students solve isolated algorithmic questions in one tool, watch video tutorials in another, and push unreviewed repos to GitHub. No platform connects: Career → Business Problem → Task Ticket → ADR → Sandbox → Test → PR Review → Verifiable Evidence."),
        ("GAP 2: CLEAN-SLATE VS LEGACY BIAS", RGBColor(254, 243, 199), COLOR_AMBER,
         "Educational benchmarks overwhelmingly promote building small apps from scratch. In industry, 85%+ of engineering effort is invested in understanding, debugging, and modifying existing legacy systems with non-trivial technical debt. Existing platforms fail to simulate pre-existing codebases."),
        ("GAP 3: UNVERIFIABLE SKILL SIGNALS", RGBColor(236, 253, 245), COLOR_GREEN,
         "Standard certifications prove video completion or multiple-choice test scores, while resumes feature self-claimed buzzwords. Employers lack tamper-evident, cryptographically verifiable proof of a candidate's actual ability to navigate tickets and implement correct code solutions.")
    ]

    for idx, (title, bg_col, tx_col, desc) in enumerate(gaps):
        left_pos = Inches(0.8 + idx * 4.0)
        add_card(slide, left_pos, gap_top, gw, gap_h)
        add_badge(slide, left_pos + Inches(0.2), gap_top + Inches(0.18), Inches(2.8), Inches(0.26), title, bg_col, tx_col)
        
        tb = slide.shapes.add_textbox(left_pos + Inches(0.2), gap_top + Inches(0.5), gw - Inches(0.4), gap_h - Inches(0.6))
        tf = tb.text_frame; tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = desc
        p.font.size = Pt(8.5); p.font.color.rgb = COLOR_SLATE


def build_slide_10(prs):
    # Slide 10: Proposed System
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "Proposed System", "The WORKUP Platform Architecture & Key Innovations",
               "A simulation-first virtual workplace immersing learners in authentic corporate engineering workflows.")
    add_footer(slide, 10)

    # 4 Cards (Grid 2x2)
    cw = Inches(5.7)
    ch = Inches(2.45)
    left1 = Inches(0.8); left2 = Inches(6.8)
    top1 = Inches(1.5); top2 = Inches(4.2)

    features = [
        {
            "left": left1, "top": top1,
            "badge": "1. SIMULATED TECH ENTERPRISES",
            "b_bg": RGBColor(239, 246, 255), "b_tx": COLOR_AZURE,
            "title": "Authentic Business Context & Team Roles",
            "bullets": [
                ("Virtual Company Topology: ", "Learners enter realistic simulated enterprises (e.g., FinFlow Tech, OmniRetail) with domain-specific architecture."),
                ("Cross-Functional Teams: ", "Assigned to simulated engineering teams (Payments, Core Platform, Infra) with realistic role titles and senior mentors."),
                ("Architectural Decision Records (ADRs): ", "Tasks are constrained by formal ADRs (e.g., ADR-001 on webhook idempotency) enforcing real engineering standards.")
            ]
        },
        {
            "left": left2, "top": top1,
            "badge": "2. TASK BACKLOG & SIMULATION DAG",
            "b_bg": RGBColor(236, 253, 245), "b_tx": COLOR_GREEN,
            "title": "Directed Acyclic Graph (DAG) Task Engine",
            "bullets": [
                ("Sprint Task Backlogs: ", "Jira-style task tickets complete with user stories, technical context, acceptance criteria, and reproduction steps."),
                ("Prerequisite Dependency Graphs: ", "Tasks unlock only after foundational tasks pass verification, preventing cognitive overload and ensuring logical progression."),
                ("Non-Linear Pathways: ", "Supports branching simulation tracks based on student career specializations (Backend, DevOps, MLOps, Security).")
            ]
        },
        {
            "left": left1, "top": top2,
            "badge": "3. EPHEMERAL SANDBOX EXECUTION",
            "b_bg": RGBColor(254, 243, 199), "b_tx": COLOR_AMBER,
            "title": "Zero-Setup Isolated In-Browser Workbench",
            "bullets": [
                ("Process Jailing: ", "Workspaces execute inside isolated directories (`.workspaces/<id>`) preventing path traversal and protecting the host."),
                ("Resource Limits: ", "Strict execution governance: max 2 workspaces per student, 4000ms hard execution timeout, and 30-minute idle TTL sweeping."),
                ("In-Situ Test Harness: ", "Vitest automated test execution embedded directly in the workbench, giving real-time pass/fail feedback.")
            ]
        },
        {
            "left": left2, "top": top2,
            "badge": "4. AI TECH LEAD & EVIDENCE DOSSIER",
            "b_bg": RGBColor(254, 242, 242), "b_tx": COLOR_RED,
            "title": "Automated Code Review & Verifiable Proof",
            "bullets": [
                ("Pull Request Review Engine: ", "Simulates senior engineer code review by analyzing unified Git diffs against strict architectural rubrics."),
                ("Line-Anchored Critique: ", "Delivers formative feedback directly highlighting specific line numbers that violate ADRs or edge cases."),
                ("Tamper-Evident Dossier: ", "Student success generates an immutable portfolio backed by real Git commit SHAs, test logs, and rubric scores.")
            ]
        }
    ]

    for f in features:
        add_card(slide, f["left"], f["top"], cw, ch)
        add_badge(slide, f["left"] + Inches(0.25), f["top"] + Inches(0.18), Inches(2.8), Inches(0.26), f["badge"], f["b_bg"], f["b_tx"])

        tb = slide.shapes.add_textbox(f["left"] + Inches(0.25), f["top"] + Inches(0.5), cw - Inches(0.5), ch - Inches(0.6))
        tf = tb.text_frame; tf.word_wrap = True
        p0 = tf.paragraphs[0]; p0.text = f["title"]; p0.font.size = Pt(11.5); p0.font.bold = True; p0.font.color.rgb = COLOR_NAVY

        for title, desc in f["bullets"]:
            p = tf.add_paragraph(); p.space_before = Pt(3)
            r0 = p.add_run(); r0.text = f"•  {title}"; r0.font.bold = True; r0.font.size = Pt(8.5); r0.font.color.rgb = COLOR_SLATE
            r1 = p.add_run(); r1.text = desc; r1.font.size = Pt(8.5); r1.font.color.rgb = COLOR_MUTED


def build_slide_11(prs):
    # Slide 11: Target Users & Modules
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "System Decomposition", "Target User Personas and Core Functional Modules",
               "Architectural mapping between user roles, access privileges, and the 11 functional system modules.")
    add_footer(slide, 11)

    # Left: 4 User Roles
    add_card(slide, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.2))
    add_badge(slide, Inches(1.05), Inches(1.72), Inches(2.2), Inches(0.3), "USER PERSONAS", RGBColor(239, 246, 255), COLOR_AZURE)

    tb_u = slide.shapes.add_textbox(Inches(1.05), Inches(2.15), Inches(5.1), Inches(4.3))
    tf_u = tb_u.text_frame; tf_u.word_wrap = True

    users = [
        ("1. Student / Learner Persona", "Undergraduate CS students and early-career engineers. Explores career roles, launches simulations, inspects tickets/ADRs, implements code in sandboxes, runs automated tests, submits pull requests, and views their verifiable portfolio."),
        ("2. Content Author Persona", "Senior software engineers, corporate educators, and academic curriculum designers. Authors simulated enterprises, legacy code repositories, task tickets, acceptance test suites, and multi-tier evaluation rubrics."),
        ("3. Technical Reviewer Persona", "Industry mentors, teaching assistants, and the automated AI Tech Lead Agent. Inspects submitted pull request diffs, executes rubric scoring (0–100), provides line-level feedback, and approves/rejects submissions."),
        ("4. System Administrator Persona", "Institutional platform managers and DevOps engineers. Configures global RBAC roles, provisions multi-tenant company accounts, manages fleet sandbox concurrency caps, and inspects immutable audit logs.")
    ]
    for idx, (title, desc) in enumerate(users):
        p0 = tf_u.paragraphs[0] if idx == 0 else tf_u.add_paragraph()
        if idx > 0: p0.space_before = Pt(6)
        r0 = p0.add_run(); r0.text = f"{title}\n"; r0.font.bold = True; r0.font.size = Pt(10.5); r0.font.color.rgb = COLOR_NAVY
        r1 = p0.add_run(); r1.text = desc; r1.font.size = Pt(8.5); r1.font.color.rgb = COLOR_SLATE

    # Right: 11 Functional Modules
    add_card(slide, Inches(6.7), Inches(1.5), Inches(5.833), Inches(5.2))
    add_badge(slide, Inches(6.95), Inches(1.72), Inches(2.6), Inches(0.3), "11 SYSTEM MODULES", RGBColor(236, 253, 245), COLOR_GREEN)

    tb_m = slide.shapes.add_textbox(Inches(6.95), Inches(2.15), Inches(5.333), Inches(4.3))
    tf_m = tb_m.text_frame; tf_m.word_wrap = True

    modules = [
        ("M1: Authentication & RBAC", "Bcryptjs password hashing, signed jose JWT session cookies, 4-tier permission matrix."),
        ("M2: Career & Role Explorer", "Taxonomy navigation across Software Eng, DevOps, MLOps, and Cybersecurity tracks."),
        ("M3: Enterprise Company Catalog", "Simulated corporate workspaces with business models and organizational topologies."),
        ("M4: Simulation DAG Engine", "Task dependency resolution, prerequisite locking, and milestone progression."),
        ("M5: Student Workbench UI", "Integrated file explorer, code editor, test execution button, and ticket panel."),
        ("M6: Workspace Orchestrator", "Concurrency management (max 2/user), idle sweeps (30m TTL), and process lifecycle."),
        ("M7: Isolated Sandbox Provider", "Path-jailed child_process execution with 4000ms hard timeout protection."),
        ("M8: In-Situ Test Runner", "Vitest CLI executor parsing structured test results and assertion traces."),
        ("M9: Multi-Tier Evaluation Engine", "Unified Git diff capture, rubric scorecard evaluation, and PR commenting."),
        ("M10: Evidence-of-Skill Dossier", "Tamper-evident portfolio storing verified commit SHAs and rubric benchmarks."),
        ("M11: Audit & Telemetry Logging", "Security event logging, system telemetry, and administrative trace analysis.")
    ]
    for idx, (m_title, m_desc) in enumerate(modules):
        p = tf_m.paragraphs[0] if idx == 0 else tf_m.add_paragraph()
        if idx > 0: p.space_before = Pt(2)
        r0 = p.add_run(); r0.text = f"•  {m_title}: "; r0.font.bold = True; r0.font.size = Pt(8.5); r0.font.color.rgb = COLOR_NAVY
        r1 = p.add_run(); r1.text = m_desc; r1.font.size = Pt(8); r1.font.color.rgb = COLOR_MUTED


def build_slide_12(prs):
    # Slide 12: End-to-End Workflow (The 14-Stage Connected Lifecycle)
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "Operational Workflow", "The 14-Stage Universal Professional Engineering Lifecycle",
               "Tracing the complete interconnected journey from career selection to cryptographically verifiable proof.")
    add_footer(slide, 12)

    # Clean background card container for the lifecycle diagram
    add_card(slide, Inches(0.8), Inches(1.45), Inches(11.733), Inches(5.35))

    # Embed the high-res 14-stage lifecycle diagram across the slide cleanly centered!
    diagram_path = os.path.join("WORKUP_Project_Review_Presentation", "diagrams", "fig_9_universal_lifecycle.png")
    if os.path.exists(diagram_path):
        slide.shapes.add_picture(diagram_path, Inches(0.95), Inches(1.6), width=Inches(11.433))


print("Slide part 2 builder loaded.")
