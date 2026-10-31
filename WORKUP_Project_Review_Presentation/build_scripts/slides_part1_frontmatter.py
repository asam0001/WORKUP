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

def build_slide_1(prs):
    # Slide 1: Title Slide (Full Bleed Dark Navy Theme or Clean Elegant Academic Style)
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    
    # Dark Navy Background
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = COLOR_NAVY
    bg.line.fill.background()

    # Top Institution Banner
    tb_inst = slide.shapes.add_textbox(Inches(1.0), Inches(0.5), Inches(11.333), Inches(1.1))
    tf_inst = tb_inst.text_frame
    tf_inst.word_wrap = True
    
    p0 = tf_inst.paragraphs[0]
    p0.text = "ACE ENGINEERING COLLEGE (AN AUTONOMOUS INSTITUTION)"
    p0.alignment = PP_ALIGN.CENTER
    p0.font.size = Pt(16)
    p0.font.bold = True
    p0.font.color.rgb = RGBColor(255, 255, 255)

    p1 = tf_inst.add_paragraph()
    p1.text = "Department of Computer Science & Engineering (Artificial Intelligence & Data Science)"
    p1.alignment = PP_ALIGN.CENTER
    p1.font.size = Pt(12)
    p1.font.bold = True
    p1.font.color.rgb = RGBColor(191, 219, 254) # Light ice blue

    p2 = tf_inst.add_paragraph()
    p2.text = "Accredited by NAAC with 'A' Grade  |  Approved by AICTE, New Delhi  |  Affiliated to JNTUH"
    p2.alignment = PP_ALIGN.CENTER
    p2.font.size = Pt(9.5)
    p2.font.color.rgb = RGBColor(148, 163, 184) # Muted slate

    # Review Badge
    badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.7), Inches(1.75), Inches(3.933), Inches(0.38))
    badge.fill.solid()
    badge.fill.fore_color.rgb = RGBColor(30, 58, 138) # Dark blue pill
    badge.line.color.rgb = RGBColor(96, 165, 250)
    badge.line.width = Pt(1)
    btf = badge.text_frame
    btf.vertical_anchor = MSO_ANCHOR.MIDDLE
    bp = btf.paragraphs[0]
    bp.text = "MAJOR PROJECT REVIEW — STAGE-I (PHASE 1)"
    bp.alignment = PP_ALIGN.CENTER
    bp.font.size = Pt(10)
    bp.font.bold = True
    bp.font.color.rgb = RGBColor(255, 255, 255)

    # Main Project Title Card (Central Card)
    c_main = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(2.3), Inches(10.933), Inches(1.9))
    c_main.fill.solid()
    c_main.fill.fore_color.rgb = RGBColor(24, 49, 83) # Rich Navy Blue
    c_main.line.color.rgb = RGBColor(59, 130, 246)
    c_main.line.width = Pt(1.5)

    tb_title = slide.shapes.add_textbox(Inches(1.4), Inches(2.45), Inches(10.533), Inches(1.6))
    tf_title = tb_title.text_frame
    tf_title.word_wrap = True

    pt0 = tf_title.paragraphs[0]
    pt0.text = "WORKUP: Virtual Professional Experience Platform"
    pt0.alignment = PP_ALIGN.CENTER
    pt0.font.size = Pt(25)
    pt0.font.bold = True
    pt0.font.color.rgb = RGBColor(255, 255, 255)

    pt1 = tf_title.add_paragraph()
    pt1.text = "A Containerized Simulation Environment for Situated Software Engineering Education,\nAuthentic Team Workflows, and Cryptographically Verifiable Skill Demonstration"
    pt1.alignment = PP_ALIGN.CENTER
    pt1.font.size = Pt(12)
    pt1.font.color.rgb = RGBColor(226, 232, 240)
    pt1.font.italic = True

    # 2-Column Team & Guide Info Card
    card_info = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(4.45), Inches(10.933), Inches(2.3))
    card_info.fill.solid()
    card_info.fill.fore_color.rgb = RGBColor(15, 32, 53)
    card_info.line.color.rgb = RGBColor(51, 65, 85)
    card_info.line.width = Pt(1)

    # Left Column: Team Details
    tb_team = slide.shapes.add_textbox(Inches(1.5), Inches(4.6), Inches(5.1), Inches(2.0))
    tf_team = tb_team.text_frame
    tf_team.word_wrap = True
    
    p_t_head = tf_team.paragraphs[0]
    p_t_head.text = "PRESENTED BY (BATCH NO: 05):"
    p_t_head.font.size = Pt(11)
    p_t_head.font.bold = True
    p_t_head.font.color.rgb = RGBColor(96, 165, 250)

    team_members = [
        ("Mashetty Rohith", "23AG1A7236"),
        ("Chintam Archana", "23AG1A7214"),
        ("Namasi Aravind", "24AG5A7205")
    ]
    for name, roll in team_members:
        p_mem = tf_team.add_paragraph()
        p_mem.text = f"•  {name}  ({roll})"
        p_mem.font.size = Pt(11)
        p_mem.font.color.rgb = RGBColor(241, 245, 249)

    p_deg = tf_team.add_paragraph()
    p_deg.text = "B.Tech Final Year, Dept. of CSE (AI & DS)"
    p_deg.font.size = Pt(9.5)
    p_deg.font.color.rgb = RGBColor(148, 163, 184)

    # Right Column: Guide & HoD Details
    tb_guide = slide.shapes.add_textbox(Inches(7.0), Inches(4.6), Inches(4.9), Inches(2.0))
    tf_guide = tb_guide.text_frame
    tf_guide.word_wrap = True

    p_g_head = tf_guide.paragraphs[0]
    p_g_head.text = "UNDER THE GUIDANCE OF:"
    p_g_head.font.size = Pt(11)
    p_g_head.font.bold = True
    p_g_head.font.color.rgb = RGBColor(96, 165, 250)

    p_g1 = tf_guide.add_paragraph()
    p_g1.text = "Mrs. P. Swaroopa"
    p_g1.font.size = Pt(11.5)
    p_g1.font.bold = True
    p_g1.font.color.rgb = RGBColor(255, 255, 255)
    p_g1_sub = tf_guide.add_paragraph()
    p_g1_sub.text = "Assistant Professor, Dept. of CSE (AI & DS)"
    p_g1_sub.font.size = Pt(9.5)
    p_g1_sub.font.color.rgb = RGBColor(203, 213, 225)

    p_g2 = tf_guide.add_paragraph()
    p_g2.text = "Dr. M. V. Vijaya Saradhi"
    p_g2.font.size = Pt(11.5)
    p_g2.font.bold = True
    p_g2.font.color.rgb = RGBColor(255, 255, 255)
    p_g2_sub = tf_guide.add_paragraph()
    p_g2_sub.text = "Professor & Head of Department, CSE (AI & DS)"
    p_g2_sub.font.size = Pt(9.5)
    p_g2_sub.font.color.rgb = RGBColor(203, 213, 225)

    p_date = tf_guide.add_paragraph()
    p_date.text = "Date: October 2026  |  Academic Year: 2026–2027"
    p_date.font.size = Pt(9)
    p_date.font.color.rgb = RGBColor(148, 163, 184)


def build_slide_2(prs):
    # Slide 2: Abstract
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "Executive Summary", "Abstract: Bridging Theory and Practical Engineering",
               "Transitioning learners from passive concept absorption to active virtual workplace apprenticeship.")
    add_footer(slide, 2)

    # 3 Column Cards
    col_w = Inches(3.64)
    h = Inches(5.2)
    top = Inches(1.5)

    # Card 1: Problem
    add_card(slide, Inches(0.8), top, col_w, h)
    add_badge(slide, Inches(1.05), top + Inches(0.25), Inches(1.8), Inches(0.32), "THE CHALLENGE", RGBColor(254, 242, 242), COLOR_RED)
    
    tb1 = slide.shapes.add_textbox(Inches(1.05), top + Inches(0.7), col_w - Inches(0.5), h - Inches(0.9))
    tf1 = tb1.text_frame; tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "The Transition Deficit"
    p.font.size = Pt(14); p.font.bold = True; p.font.color.rgb = COLOR_NAVY

    bullets1 = [
        ("Academic Disconnect: ", "Computer science curricula focus on isolated algorithmic syntax and clean-slate toy assignments."),
        ("Corporate Realities: ", "Fresh graduates face complex multi-file legacy repositories, Architecture Decision Records (ADRs), and technical debt."),
        ("Lack of Tooling: ", "Students rarely interact with Jira-style task backlogs, CI/CD pipelines, or line-level pull request (PR) reviews."),
        ("Resume Inflatability: ", "Self-reported CV skills fail to provide employers with verifiable proof of hands-on competence.")
    ]
    for title, desc in bullets1:
        pb = tf1.add_paragraph()
        pb.space_before = Pt(8)
        r0 = pb.add_run(); r0.text = f"•  {title}"; r0.font.bold = True; r0.font.size = Pt(10); r0.font.color.rgb = COLOR_SLATE
        r1 = pb.add_run(); r1.text = desc; r1.font.size = Pt(9.5); r1.font.color.rgb = COLOR_MUTED

    # Card 2: Solution
    add_card(slide, Inches(4.84), top, col_w, h)
    add_badge(slide, Inches(5.09), top + Inches(0.25), Inches(1.8), Inches(0.32), "PROPOSED SOLUTION", RGBColor(239, 246, 255), COLOR_AZURE)

    tb2 = slide.shapes.add_textbox(Inches(5.09), top + Inches(0.7), col_w - Inches(0.5), h - Inches(0.9))
    tf2 = tb2.text_frame; tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "The WORKUP Platform"
    p.font.size = Pt(14); p.font.bold = True; p.font.color.rgb = COLOR_NAVY

    bullets2 = [
        ("Simulated Enterprises: ", "Learners enter simulated tech companies (e.g., FinFlow Technologies) and take on authentic engineering roles."),
        ("DAG Simulation Engine: ", "Structured business problems with prerequisite dependencies and acceptance criteria."),
        ("Ephemeral Sandboxes: ", "Zero-setup in-browser cloud workspaces with isolated process execution and automated test runners."),
        ("AI Tech Lead Reviewer: ", "Line-anchored, rubric-based feedback on pull request diffs simulating senior code reviews."),
        ("Evidence-of-Skill Dossier: ", "Cryptographically verifiable portfolio backed by Git commit SHAs and rubric scorecards.")
    ]
    for title, desc in bullets2:
        pb = tf2.add_paragraph()
        pb.space_before = Pt(6)
        r0 = pb.add_run(); r0.text = f"•  {title}"; r0.font.bold = True; r0.font.size = Pt(10); r0.font.color.rgb = COLOR_SLATE
        r1 = pb.add_run(); r1.text = desc; r1.font.size = Pt(9.5); r1.font.color.rgb = COLOR_MUTED

    # Card 3: Validation & Tech
    add_card(slide, Inches(8.88), top, col_w, h)
    add_badge(slide, Inches(9.13), top + Inches(0.25), Inches(1.8), Inches(0.32), "STAGE-I VALIDATION", RGBColor(236, 253, 245), COLOR_GREEN)

    tb3 = slide.shapes.add_textbox(Inches(9.13), top + Inches(0.7), col_w - Inches(0.5), h - Inches(0.9))
    tf3 = tb3.text_frame; tf3.word_wrap = True
    p = tf3.paragraphs[0]
    p.text = "Verified Implementation"
    p.font.size = Pt(14); p.font.bold = True; p.font.color.rgb = COLOR_NAVY

    bullets3 = [
        ("Modern Tech Stack: ", "Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Prisma ORM 5.x, SQLite/PostgreSQL."),
        ("21 Domain Entities: ", "Complete relational schema modeling users, simulations, tasks, workspaces, and verifiable portfolios."),
        ("4-Tier Security: ", "Bcryptjs password hashing, signed jose JWT session cookies, and strict Role-Based Access Control."),
        ("100% Test Pass Rate: ", "34 automated unit & integration tests passing across 8 Vitest suites verifying process jailing and DAG logic."),
        ("Stage-II Roadmap: ", "Containerized Kubernetes pods, multi-turn LLM code reviewer, and MLOps/DevOps/Cyber tracks.")
    ]
    for title, desc in bullets3:
        pb = tf3.add_paragraph()
        pb.space_before = Pt(6)
        r0 = pb.add_run(); r0.text = f"•  {title}"; r0.font.bold = True; r0.font.size = Pt(10); r0.font.color.rgb = COLOR_SLATE
        r1 = pb.add_run(); r1.text = desc; r1.font.size = Pt(9.5); r1.font.color.rgb = COLOR_MUTED


def build_slide_3(prs):
    # Slide 3: Problem Identification
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "Problem Identification", "The Industry-Academia Transition Gap in Software Engineering",
               "Evaluating the fundamental structural disconnect between classroom coding and professional development.")
    add_footer(slide, 3)

    # Left Card: 4 Systemic Deficits
    add_card(slide, Inches(0.8), Inches(1.5), Inches(6.0), Inches(5.2))
    add_badge(slide, Inches(1.05), Inches(1.75), Inches(2.4), Inches(0.32), "THE 4 CORE DEFICITS", RGBColor(254, 242, 242), COLOR_RED)

    tb_left = slide.shapes.add_textbox(Inches(1.05), Inches(2.2), Inches(5.5), Inches(4.3))
    tf_l = tb_left.text_frame; tf_l.word_wrap = True

    deficits = [
        ("1. The Clean-Slate Fallacy: ", "Academic assignments invariably begin from empty scratch files (`main.py`). In contrast, 90% of corporate engineering entails navigating, debugging, and refactoring large pre-existing legacy codebases with technical debt."),
        ("2. Absence of Architectural Context: ", "Students receive artificial algorithmic prompts lacking business rationale, Architectural Decision Records (ADRs), API contracts, or real-world operational constraints."),
        ("3. Missing Collaborative PR Review Loops: ", "Conventional coursework relies on binary pass/fail autograders. Students never experience line-level code reviews, mentor critiques, or iterative pull request refactoring."),
        ("4. Resume Inflatability & Skill Obfuscation: ", "Recruiters and hiring managers cannot distinguish between genuine practical competence and memorized syntax from self-reported bullet points on student resumes.")
    ]
    for idx, (title, desc) in enumerate(deficits):
        p = tf_l.paragraphs[0] if idx == 0 else tf_l.add_paragraph()
        if idx > 0: p.space_before = Pt(8)
        r0 = p.add_run(); r0.text = title; r0.font.bold = True; r0.font.size = Pt(10.5); r0.font.color.rgb = COLOR_NAVY
        r1 = p.add_run(); r1.text = desc; r1.font.size = Pt(9.5); r1.font.color.rgb = COLOR_SLATE

    # Right Card: Academic vs Industry Comparison Table
    add_card(slide, Inches(7.1), Inches(1.5), Inches(5.433), Inches(5.2))
    add_badge(slide, Inches(7.35), Inches(1.75), Inches(2.8), Inches(0.32), "PARADIGM COMPARISON", RGBColor(239, 246, 255), COLOR_AZURE)

    tb_right = slide.shapes.add_textbox(Inches(7.35), Inches(2.2), Inches(4.933), Inches(4.3))
    tf_r = tb_right.text_frame; tf_r.word_wrap = True
    pr0 = tf_r.paragraphs[0]
    pr0.text = "Classroom vs. Corporate Reality"
    pr0.font.size = Pt(13); pr0.font.bold = True; pr0.font.color.rgb = COLOR_NAVY

    comparisons = [
        ("Project Scope", "Single isolated script", "Multi-package distributed repo"),
        ("Problem Statement", "Toy algorithmic puzzle", "Customer churn / payment deadlock ticket"),
        ("Architectural Rules", "Zero constraints", "Strict ADRs, linting, & security gates"),
        ("Testing Harness", "Hidden unit test runner", "In-sandbox Vitest suite & local edge tests"),
        ("Evaluation Gate", "Pass/Fail percentage", "Detailed line-by-line pull request review"),
        ("Outcome Artifact", "Local course grade", "Tamper-evident Git commit SHA dossier")
    ]
    
    # Table inside right card
    rows = len(comparisons) + 1
    t = slide.shapes.add_table(rows, 3, Inches(7.3), Inches(2.6), Inches(5.033), Inches(3.8)).table
    t.columns[0].width = Inches(1.4)
    t.columns[1].width = Inches(1.75)
    t.columns[2].width = Inches(1.883)

    headers = ["Dimension", "Academic Coursework", "Corporate Reality"]
    for c_idx, h in enumerate(headers):
        cell = t.cell(0, c_idx)
        cell.fill.solid(); cell.fill.fore_color.rgb = COLOR_NAVY
        p = cell.text_frame.paragraphs[0]
        p.text = h; p.font.bold = True; p.font.size = Pt(9); p.font.color.rgb = RGBColor(255, 255, 255)

    for r_idx, (dim, acad, corp) in enumerate(comparisons):
        c0 = t.cell(r_idx + 1, 0); c1 = t.cell(r_idx + 1, 1); c2 = t.cell(r_idx + 1, 2)
        row_bg = RGBColor(248, 250, 252) if r_idx % 2 == 0 else RGBColor(255, 255, 255)
        for c in (c0, c1, c2):
            c.fill.solid(); c.fill.fore_color.rgb = row_bg
        p0 = c0.text_frame.paragraphs[0]; p0.text = dim; p0.font.bold = True; p0.font.size = Pt(8.5); p0.font.color.rgb = COLOR_SLATE
        p1 = c1.text_frame.paragraphs[0]; p1.text = acad; p1.font.size = Pt(8); p1.font.color.rgb = COLOR_MUTED
        p2 = c2.text_frame.paragraphs[0]; p2.text = corp; p2.font.bold = True; p2.font.size = Pt(8); p2.font.color.rgb = COLOR_BLUE


def build_slide_4(prs):
    # Slide 4: Motivation and Need
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "Motivation & Need", "Why Tutorials and Toy Coding Fail to Produce Engineers",
               "Grounding WORKUP in educational learning theories and real-world apprenticeship models.")
    add_footer(slide, 4)

    col_w = Inches(3.64)
    h = Inches(5.2)
    top = Inches(1.5)

    # Card 1: Kolb's Learning Cycle
    add_card(slide, Inches(0.8), top, col_w, h)
    add_badge(slide, Inches(1.05), top + Inches(0.25), Inches(2.2), Inches(0.32), "LEARNING THEORY", RGBColor(239, 246, 255), COLOR_AZURE)
    
    tb1 = slide.shapes.add_textbox(Inches(1.05), top + Inches(0.7), col_w - Inches(0.5), h - Inches(0.9))
    tf1 = tb1.text_frame; tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.text = "David Kolb's Model (1984)"
    p1.font.size = Pt(13.5); p1.font.bold = True; p1.font.color.rgb = COLOR_NAVY

    bullets1 = [
        ("Concrete Experience: ", "Learners enter a live codebase to encounter authentic bugs and system bottlenecks."),
        ("Reflective Observation: ", "Examining test failures, execution traces, and architectural ADR guidelines."),
        ("Abstract Conceptualization: ", "Synthesizing design patterns (e.g., idempotency keys, mutex locks) to solve problems."),
        ("Active Experimentation: ", "Implementing code changes and testing in isolated sandboxes to observe live results."),
        ("Pedagogical Implication: ", "Theoretical lectures satisfy only 25% of Kolb's cycle. WORKUP fulfills the entire 4-stage experiential loop.")
    ]
    for title, desc in bullets1:
        pb = tf1.add_paragraph(); pb.space_before = Pt(6)
        r0 = pb.add_run(); r0.text = f"•  {title}"; r0.font.bold = True; r0.font.size = Pt(9.5); r0.font.color.rgb = COLOR_SLATE
        r1 = pb.add_run(); r1.text = desc; r1.font.size = Pt(9); r1.font.color.rgb = COLOR_MUTED

    # Card 2: Situated Cognition
    add_card(slide, Inches(4.84), top, col_w, h)
    add_badge(slide, Inches(5.09), top + Inches(0.25), Inches(2.2), Inches(0.32), "SITUATED COGNITION", RGBColor(236, 253, 245), COLOR_GREEN)

    tb2 = slide.shapes.add_textbox(Inches(5.09), top + Inches(0.7), col_w - Inches(0.5), h - Inches(0.9))
    tf2 = tb2.text_frame; tf2.word_wrap = True
    p2 = tf2.paragraphs[0]
    p2.text = "Lave & Wenger (1991)"
    p2.font.size = Pt(13.5); p2.font.bold = True; p2.font.color.rgb = COLOR_NAVY

    bullets2 = [
        ("Communities of Practice: ", "Professional competence is acquired by participating in authentic cultural practices of an engineering discipline."),
        ("Legitimate Peripheral Participation: ", "Beginners start with bounded, low-risk engineering tasks (e.g., bug hotfixes, refactoring) before tackling system architecture."),
        ("Professional Tool Adoption: ", "Working with actual terminal CLIs, Git commit trees, linter configs, and test harnesses."),
        ("Overcoming MOOC Isolation: ", "Video-based learning isolates the student; WORKUP embeds the student within a simulated enterprise engineering team.")
    ]
    for title, desc in bullets2:
        pb = tf2.add_paragraph(); pb.space_before = Pt(7)
        r0 = pb.add_run(); r0.text = f"•  {title}"; r0.font.bold = True; r0.font.size = Pt(9.5); r0.font.color.rgb = COLOR_SLATE
        r1 = pb.add_run(); r1.text = desc; r1.font.size = Pt(9); r1.font.color.rgb = COLOR_MUTED

    # Card 3: Mentorship Deficit
    add_card(slide, Inches(8.88), top, col_w, h)
    add_badge(slide, Inches(9.13), top + Inches(0.25), Inches(2.2), Inches(0.32), "SCALABLE MENTORSHIP", RGBColor(254, 243, 199), COLOR_AMBER)

    tb3 = slide.shapes.add_textbox(Inches(9.13), top + Inches(0.7), col_w - Inches(0.5), h - Inches(0.9))
    tf3 = tb3.text_frame; tf3.word_wrap = True
    p3 = tf3.paragraphs[0]
    p3.text = "The Scale Dilemma"
    p3.font.size = Pt(13.5); p3.font.bold = True; p3.font.color.rgb = COLOR_NAVY

    bullets3 = [
        ("High Student-Faculty Ratios: ", "Colleges face 60:1 or 100:1 ratios, making individual code reviews and personalized mentoring impossible."),
        ("Corporate Internship Shortage: ", "Less than 15% of engineering graduates secure meaningful corporate internships with senior mentorship."),
        ("The AI Tech Lead Solution: ", "WORKUP bridges this scalability gap by automating senior code reviews using deterministic test harnesses and AI PR reviewers."),
        ("Continuous Deliberate Practice: ", "Students receive instant, iterative, non-judgmental critique at any hour without burning human mentor capacity.")
    ]
    for title, desc in bullets3:
        pb = tf3.add_paragraph(); pb.space_before = Pt(7)
        r0 = pb.add_run(); r0.text = f"•  {title}"; r0.font.bold = True; r0.font.size = Pt(9.5); r0.font.color.rgb = COLOR_SLATE
        r1 = pb.add_run(); r1.text = desc; r1.font.size = Pt(9); r1.font.color.rgb = COLOR_MUTED


def build_slide_5(prs):
    # Slide 5: Objectives & Scope
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "Objectives & Scope", "Project Objectives and Stage-I Engineering Scope",
               "Clear demarcation of verified Stage-I deliverables versus planned Stage-II platform expansion.")
    add_footer(slide, 5)

    # Left: 4 Primary Objectives
    add_card(slide, Inches(0.8), Inches(1.5), Inches(5.7), Inches(5.2))
    add_badge(slide, Inches(1.05), Inches(1.75), Inches(2.2), Inches(0.32), "CORE OBJECTIVES", RGBColor(239, 246, 255), COLOR_AZURE)

    tb_obj = slide.shapes.add_textbox(Inches(1.05), Inches(2.2), Inches(5.2), Inches(4.3))
    tf_o = tb_obj.text_frame; tf_o.word_wrap = True

    objs = [
        ("Obj 1: Multi-Tenant Enterprise Simulator: ", "Architect and implement an authentic simulation engine modeling tech companies, role tracks, sprint phases, and DAG-ordered task tickets."),
        ("Obj 2: Ephemeral Sandbox Orchestrator: ", "Develop a path-jailed, isolated execution environment with strict resource limits (max 2 workspaces/user, 4000ms command timeout, 30m idle sweep)."),
        ("Obj 3: Automated In-Situ Test Harness: ", "Integrate automated test runners (Vitest) allowing learners to run unit and integration tests locally inside their sandbox before submission."),
        ("Obj 4: Rubric Evaluation & Code Review: ", "Build a multi-tier evaluation system providing line-level diff analysis, rubric scoring (0–100), and automated PR feedback."),
        ("Obj 5: Verifiable Evidence Dossier: ", "Generate an immutable portfolio record capturing exact Git commit SHAs, test outputs, and rubric scores for recruiter verification.")
    ]
    for idx, (title, desc) in enumerate(objs):
        p = tf_o.paragraphs[0] if idx == 0 else tf_o.add_paragraph()
        if idx > 0: p.space_before = Pt(6)
        r0 = p.add_run(); r0.text = title; r0.font.bold = True; r0.font.size = Pt(10); r0.font.color.rgb = COLOR_NAVY
        r1 = p.add_run(); r1.text = desc; r1.font.size = Pt(9); r1.font.color.rgb = COLOR_SLATE

    # Right: Scope Card (Stage-I vs Stage-II)
    add_card(slide, Inches(6.8), Inches(1.5), Inches(5.733), Inches(5.2))
    add_badge(slide, Inches(7.05), Inches(1.75), Inches(2.4), Inches(0.32), "SCOPE BOUNDARIES", RGBColor(236, 253, 245), COLOR_GREEN)

    tb_scope = slide.shapes.add_textbox(Inches(7.05), Inches(2.2), Inches(5.233), Inches(4.3))
    tf_s = tb_scope.text_frame; tf_s.word_wrap = True

    # In-Scope Header
    p_in = tf_s.paragraphs[0]
    p_in.text = "In-Scope: Verified Stage-I Deliverables"
    p_in.font.size = Pt(12); p_in.font.bold = True; p_in.font.color.rgb = COLOR_GREEN

    in_items = [
        "Full-stack Next.js 14 App Router, React 18, TypeScript, Tailwind CSS.",
        "Prisma ORM 5.x with 21 relational domain models on SQLite.",
        "4-Tier RBAC (Student, Content Author, Reviewer, Administrator).",
        "Flagship Software Engineering Track (FinFlow Tech: Payment Webhooks & Idempotency).",
        "Local Isolated Sandbox Provider with hard timeouts & process jailing.",
        "Comprehensive Vitest test suite with 34 tests across 8 suites (100% passing)."
    ]
    for it in in_items:
        p = tf_s.add_paragraph()
        p.text = f"✔  {it}"; p.font.size = Pt(8.5); p.font.color.rgb = COLOR_SLATE

    # Out-of-Scope Header
    p_out = tf_s.add_paragraph()
    p_out.space_before = Pt(10)
    p_out.text = "Planned Scope: Stage-II Platform Enhancements"
    p_out.font.size = Pt(12); p_out.font.bold = True; p_out.font.color.rgb = COLOR_AMBER

    out_items = [
        "Distributed Kubernetes container pods with gVisor kernel sandboxing.",
        "Multi-turn LLM AI Tech Lead Reviewer with line-anchored PR comments.",
        "Multi-domain catalog expansion (MLOps, Cloud/DevOps, Cybersecurity, Data Eng).",
        "Multi-player simulated teams & live incident response simulations.",
        "Cryptographically signed, publicly verifiable recruiter dossiers."
    ]
    for it in out_items:
        p = tf_s.add_paragraph()
        p.text = f"➜  {it}"; p.font.size = Pt(8.5); p.font.color.rgb = COLOR_MUTED


def build_slide_6(prs):
    # Slide 6: Existing Systems
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "State of the Art", "Analysis of Existing Learning & Training Systems",
               "Evaluating current educational paradigms, developer tools, and job simulation platforms.")
    add_footer(slide, 6)

    # 4 Cards in 2x2 Grid
    cw = Inches(5.7)
    ch = Inches(2.45)
    left1 = Inches(0.8); left2 = Inches(6.8)
    top1 = Inches(1.5); top2 = Inches(4.2)

    # Card 1: Algorithmic Platforms
    add_card(slide, left1, top1, cw, ch)
    add_badge(slide, left1 + Inches(0.25), top1 + Inches(0.2), Inches(2.2), Inches(0.3), "ALGORITHMIC PRACTICE", RGBColor(239, 246, 255), COLOR_AZURE)
    tb = slide.shapes.add_textbox(left1 + Inches(0.25), top1 + Inches(0.55), cw - Inches(0.5), ch - Inches(0.65))
    tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "LeetCode, HackerRank, Codeforces"; p.font.size = Pt(12); p.font.bold = True; p.font.color.rgb = COLOR_NAVY
    b = [
        ("Strengths: ", "Outstanding for data structures, algorithm efficiency, and syntax mastery."),
        ("Limitations: ", "Operates on single isolated functions; zero exposure to architecture, legacy codebases, ADRs, Git workflows, or team pull request reviews."),
        ("Impact: ", "Produces graduates who can invert a binary tree but cannot resolve a merge conflict or debug an API webhook.")
    ]
    for t0, d0 in b:
        p = tf.add_paragraph(); p.space_before = Pt(3)
        r = p.add_run(); r.text = t0; r.font.bold = True; r.font.size = Pt(8.5); r.font.color.rgb = COLOR_SLATE
        r = p.add_run(); r.text = d0; r.font.size = Pt(8.5); r.font.color.rgb = COLOR_MUTED

    # Card 2: Video MOOCs
    add_card(slide, left2, top1, cw, ch)
    add_badge(slide, left2 + Inches(0.25), top1 + Inches(0.2), Inches(2.2), Inches(0.3), "VIDEO-BASED MOOCS", RGBColor(254, 243, 199), COLOR_AMBER)
    tb = slide.shapes.add_textbox(left2 + Inches(0.25), top1 + Inches(0.55), cw - Inches(0.5), ch - Inches(0.65))
    tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "Coursera, Udemy, edX"; p.font.size = Pt(12); p.font.bold = True; p.font.color.rgb = COLOR_NAVY
    b = [
        ("Strengths: ", "High accessibility, broad conceptual coverage, and scalable broadcast lectures."),
        ("Limitations: ", "Passive spectator learning with <10% completion rate. Exercises are synthetic clean-slate toys graded by trivial string matchers."),
        ("Impact: ", "Creates the illusion of competence ('tutorial hell') without imparting real troubleshooting resilience.")
    ]
    for t0, d0 in b:
        p = tf.add_paragraph(); p.space_before = Pt(3)
        r = p.add_run(); r.text = t0; r.font.bold = True; r.font.size = Pt(8.5); r.font.color.rgb = COLOR_SLATE
        r = p.add_run(); r.text = d0; r.font.size = Pt(8.5); r.font.color.rgb = COLOR_MUTED

    # Card 3: Static Job Simulations
    add_card(slide, left1, top2, cw, ch)
    add_badge(slide, left1 + Inches(0.25), top2 + Inches(0.2), Inches(2.2), Inches(0.3), "VIRTUAL JOB SIMULATIONS", RGBColor(236, 253, 245), COLOR_GREEN)
    tb = slide.shapes.add_textbox(left1 + Inches(0.25), top2 + Inches(0.55), cw - Inches(0.5), ch - Inches(0.65))
    tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "Forage (formerly InsideSherpa)"; p.font.size = Pt(12); p.font.bold = True; p.font.color.rgb = COLOR_NAVY
    b = [
        ("Strengths: ", "Excellent enterprise branding and high-level corporate scenario framing."),
        ("Limitations: ", "Submissions are static file uploads (PDFs, PPTs). Completely lacks live code execution, cloud sandboxes, automated testing, and line-level code reviews."),
        ("Impact: ", "Serves as an exploratory marketing/overview tool rather than a technical software engineering workbench.")
    ]
    for t0, d0 in b:
        p = tf.add_paragraph(); p.space_before = Pt(3)
        r = p.add_run(); r.text = t0; r.font.bold = True; r.font.size = Pt(8.5); r.font.color.rgb = COLOR_SLATE
        r = p.add_run(); r.text = d0; r.font.size = Pt(8.5); r.font.color.rgb = COLOR_MUTED

    # Card 4: Cloud Development Environments
    add_card(slide, left2, top2, cw, ch)
    add_badge(slide, left2 + Inches(0.25), top2 + Inches(0.2), Inches(2.2), Inches(0.3), "CLOUD WORKSPACES", RGBColor(254, 242, 242), COLOR_RED)
    tb = slide.shapes.add_textbox(left2 + Inches(0.25), top2 + Inches(0.55), cw - Inches(0.5), ch - Inches(0.65))
    tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "GitHub Codespaces, Gitpod, Replit"; p.font.size = Pt(12); p.font.bold = True; p.font.color.rgb = COLOR_NAVY
    b = [
        ("Strengths: ", "Full browser IDEs with containers, terminals, port forwarding, and pre-configured extensions."),
        ("Limitations: ", "Pure compute infrastructure with zero pedagogical layer. No simulated enterprise context, no task DAGs, no business ADRs, and no review rubrics."),
        ("Impact: ", "Requires the learner or educator to assemble, design, and manage the entire curriculum independently.")
    ]
    for t0, d0 in b:
        p = tf.add_paragraph(); p.space_before = Pt(3)
        r = p.add_run(); r.text = t0; r.font.bold = True; r.font.size = Pt(8.5); r.font.color.rgb = COLOR_SLATE
        r = p.add_run(); r.text = d0; r.font.size = Pt(8.5); r.font.color.rgb = COLOR_MUTED

print("Slide part 1 builder loaded.")
