import os
import sys

# Ensure python-pptx site-packages is in path
base_pkg = r"C:\Users\Mruthyunjaya\AppData\Local\uv\cache\archive-v0\OAAt0ANKOFoe2tgg\Lib\site-packages"
if base_pkg not in sys.path:
    sys.path.insert(0, base_pkg)

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# Output paths
output_dir = os.path.abspath("WORKUP_Project_Review_Presentation")
os.makedirs(output_dir, exist_ok=True)
pptx_path = os.path.join(output_dir, "WORKUP_Official_Review_Format.pptx")

# Color Palette
COLOR_NAVY = RGBColor(15, 41, 66)        # #0F2942 - Primary Header
COLOR_SLATE = RGBColor(30, 41, 59)       # #1E293B - Body Text
COLOR_BLUE = RGBColor(30, 95, 138)       # #1E5F8A - Secondary Accent
COLOR_AZURE = RGBColor(37, 99, 235)      # #2563EB - Highlights & Badges
COLOR_MUTED = RGBColor(100, 116, 139)    # #64748B - Subtitles & Footers
COLOR_LIGHT_BG = RGBColor(248, 250, 252) # #F8FAFC - Slide Background
COLOR_CARD_BG = RGBColor(255, 255, 255)  # #FFFFFF - Card Background
COLOR_CARD_BORDER = RGBColor(226, 232, 240) # #E2E8F0 - Card Border
COLOR_GREEN = RGBColor(5, 150, 105)      # #059669 - Positive
COLOR_AMBER = RGBColor(217, 119, 6)      # #D97706 - Warning / Process
COLOR_RED = RGBColor(220, 38, 38)        # #DC2626 - Problem / Deficit

TOTAL_SLIDES = 11

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

def set_slide_background(slide, color=COLOR_LIGHT_BG):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = color
    bg.line.fill.background()
    return bg

def add_header(slide, tracker, title, subtitle=None):
    # Left accent bar
    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.38), Inches(0.08), Inches(0.85))
    bar.fill.solid()
    bar.fill.fore_color.rgb = COLOR_AZURE
    bar.line.fill.background()

    # Title text box
    tb = slide.shapes.add_textbox(Inches(1.0), Inches(0.32), Inches(8.2), Inches(0.95))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

    p0 = tf.paragraphs[0]
    p0.text = tracker.upper()
    p0.font.size = Pt(9.5)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_AZURE

    p1 = tf.add_paragraph()
    p1.text = title
    p1.font.size = Pt(20)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_NAVY

    if subtitle:
        p2 = tf.add_paragraph()
        p2.text = subtitle
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = COLOR_MUTED

    # Top right pill: Institution
    pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.3), Inches(0.42), Inches(3.23), Inches(0.42))
    pill.fill.solid()
    pill.fill.fore_color.rgb = RGBColor(239, 246, 255)
    pill.line.color.rgb = RGBColor(191, 219, 254)
    pill.line.width = Pt(1)
    ptf = pill.text_frame
    ptf.vertical_anchor = MSO_ANCHOR.MIDDLE
    pp = ptf.paragraphs[0]
    pp.text = "ACE Engineering College | CSE (IoT & AI&DS)"
    pp.alignment = PP_ALIGN.CENTER
    pp.font.size = Pt(8.5)
    pp.font.bold = True
    pp.font.color.rgb = COLOR_BLUE

def add_footer(slide, current_slide):
    # Divider line
    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(7.0), Inches(11.733), Inches(0.015))
    line.fill.solid()
    line.fill.fore_color.rgb = COLOR_CARD_BORDER
    line.line.fill.background()

    tb = slide.shapes.add_textbox(Inches(0.8), Inches(7.05), Inches(11.733), Inches(0.35))
    tf = tb.text_frame
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    p = tf.paragraphs[0]
    
    r1 = p.add_run()
    r1.text = "17-09-2026  |  CSE (IoT & AI&DS)"
    r1.font.size = Pt(8.5)
    r1.font.color.rgb = COLOR_MUTED

    r_mid = p.add_run()
    r_mid.text = " " * 36 + "WORKUP: Virtual Professional Experience Platform" + " " * 36
    r_mid.font.size = Pt(8.5)
    r_mid.font.bold = True
    r_mid.font.color.rgb = COLOR_NAVY

    r2 = p.add_run()
    r2.text = f"Slide {current_slide} of {TOTAL_SLIDES}"
    r2.font.size = Pt(8.5)
    r2.font.color.rgb = COLOR_MUTED

def add_card(slide, left, top, width, height, bg_color=COLOR_CARD_BG, border_color=COLOR_CARD_BORDER):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = bg_color
    card.line.color.rgb = border_color
    card.line.width = Pt(1)
    return card

def add_badge(slide, left, top, width, height, text, bg_color, text_color):
    b = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    b.fill.solid()
    b.fill.fore_color.rgb = bg_color
    b.line.fill.background()
    tf = b.text_frame
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]
    p.text = text
    p.alignment = PP_ALIGN.CENTER
    p.font.size = Pt(8.5)
    p.font.bold = True
    p.font.color.rgb = text_color
    return b

# ==========================================
# SLIDE 1: TITLE SLIDE
# ==========================================
def build_slide_1(prs):
    slide = prs.slides.add_slide(blank_layout)
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = COLOR_NAVY
    bg.line.fill.background()

    # Institution Banner
    tb_inst = slide.shapes.add_textbox(Inches(1.0), Inches(0.45), Inches(11.333), Inches(1.15))
    tf_inst = tb_inst.text_frame; tf_inst.word_wrap = True
    
    p0 = tf_inst.paragraphs[0]
    p0.text = "ACE ENGINEERING COLLEGE (AN AUTONOMOUS INSTITUTION)"
    p0.alignment = PP_ALIGN.CENTER
    p0.font.size = Pt(16); p0.font.bold = True; p0.font.color.rgb = RGBColor(255, 255, 255)

    p1 = tf_inst.add_paragraph()
    p1.text = "Department of Computer Science & Engineering (IoT & AI&DS)"
    p1.alignment = PP_ALIGN.CENTER
    p1.font.size = Pt(12); p1.font.bold = True; p1.font.color.rgb = RGBColor(191, 219, 254)

    p2 = tf_inst.add_paragraph()
    p2.text = "Accredited by NAAC with 'A' Grade  |  Approved by AICTE, New Delhi  |  Affiliated to JNTUH"
    p2.alignment = PP_ALIGN.CENTER
    p2.font.size = Pt(9.5); p2.font.color.rgb = RGBColor(148, 163, 184)

    # Review Badge
    badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.7), Inches(1.7), Inches(3.933), Inches(0.38))
    badge.fill.solid(); badge.fill.fore_color.rgb = RGBColor(30, 58, 138)
    badge.line.color.rgb = RGBColor(96, 165, 250); badge.line.width = Pt(1)
    btf = badge.text_frame; btf.vertical_anchor = MSO_ANCHOR.MIDDLE
    bp = btf.paragraphs[0]; bp.text = "MAJOR PROJECT REVIEW — PHASE 1"; bp.alignment = PP_ALIGN.CENTER
    bp.font.size = Pt(10); bp.font.bold = True; bp.font.color.rgb = RGBColor(255, 255, 255)

    # Main Project Title Box
    c_main = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(2.25), Inches(10.933), Inches(1.95))
    c_main.fill.solid(); c_main.fill.fore_color.rgb = RGBColor(24, 49, 83)
    c_main.line.color.rgb = RGBColor(59, 130, 246); c_main.line.width = Pt(1.5)

    tb_title = slide.shapes.add_textbox(Inches(1.4), Inches(2.4), Inches(10.533), Inches(1.65))
    tf_title = tb_title.text_frame; tf_title.word_wrap = True

    pt0 = tf_title.paragraphs[0]
    pt0.text = "Project Title: WORKUP: Virtual Professional Experience Platform"
    pt0.alignment = PP_ALIGN.CENTER
    pt0.font.size = Pt(23); pt0.font.bold = True; pt0.font.color.rgb = RGBColor(255, 255, 255)

    pt1 = tf_title.add_paragraph()
    pt1.text = "A Simulated Workplace Platform for Practical Software Engineering and Skill Verification"
    pt1.alignment = PP_ALIGN.CENTER
    pt1.font.size = Pt(12); pt1.font.color.rgb = RGBColor(226, 232, 240); pt1.font.italic = True

    # 2-Column Details Card
    card_info = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(4.4), Inches(10.933), Inches(2.4))
    card_info.fill.solid(); card_info.fill.fore_color.rgb = RGBColor(15, 32, 53)
    card_info.line.color.rgb = RGBColor(51, 65, 85); card_info.line.width = Pt(1)

    # Left: Team Details (Batch 12)
    tb_team = slide.shapes.add_textbox(Inches(1.5), Inches(4.55), Inches(5.1), Inches(2.1))
    tf_team = tb_team.text_frame; tf_team.word_wrap = True
    p_t_head = tf_team.paragraphs[0]
    p_t_head.text = "BATCH NO: 12  |  TEAM DETAILS:"
    p_t_head.font.size = Pt(11); p_t_head.font.bold = True; p_t_head.font.color.rgb = RGBColor(96, 165, 250)

    team_members = [
        ("Namasani Aravind", "24AG5A7205"),
        ("Nomula Sai Kiran", "23AG1A7248"),
        ("Mekala Roshan Kumar", "23AG1A7239"),
        ("T Shiva Kumar", "23AG1A7259")
    ]
    for name, roll in team_members:
        p_mem = tf_team.add_paragraph()
        p_mem.text = f"•  {name}  ({roll})"
        p_mem.font.size = Pt(10.5); p_mem.font.color.rgb = RGBColor(241, 245, 249)

    # Right: Guide & HoD Details
    tb_guide = slide.shapes.add_textbox(Inches(7.0), Inches(4.55), Inches(4.9), Inches(2.1))
    tf_guide = tb_guide.text_frame; tf_guide.word_wrap = True
    p_g_head = tf_guide.paragraphs[0]
    p_g_head.text = "SUPERVISION & REVIEW:"
    p_g_head.font.size = Pt(11); p_g_head.font.bold = True; p_g_head.font.color.rgb = RGBColor(96, 165, 250)

    p_g1 = tf_guide.add_paragraph()
    p_g1.text = "Internal Guide: Mr. V. Veeresh"
    p_g1.font.size = Pt(11); p_g1.font.bold = True; p_g1.font.color.rgb = RGBColor(255, 255, 255)
    p_g1_sub = tf_guide.add_paragraph()
    p_g1_sub.text = "Assistant Professor, Dept. of CSE (IoT & AI&DS)"
    p_g1_sub.font.size = Pt(9.5); p_g1_sub.font.color.rgb = RGBColor(203, 213, 225)

    p_g2 = tf_guide.add_paragraph()
    p_g2.text = "HoD-CSE(IoT & AI&DS): Dr. M. V. Vijaya Saradhi"
    p_g2.font.size = Pt(11); p_g2.font.bold = True; p_g2.font.color.rgb = RGBColor(255, 255, 255)

    p_date = tf_guide.add_paragraph()
    p_date.text = "Date: 17-09-2026  |  Department: AI&DS"
    p_date.font.size = Pt(9.5); p_date.font.color.rgb = RGBColor(148, 163, 184)

# ==========================================
# SLIDE 2: DESCRIBE THE IDENTIFIED PROBLEM
# ==========================================
def build_slide_2(prs):
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "Problem Identification", "Describe the Identified Problem",
               "Major challenges students face when moving from academic coding to corporate engineering.")
    add_footer(slide, 2)

    # 4 Problem Cards (2x2 Grid matching the template)
    cw = Inches(5.7)
    ch = Inches(2.45)
    left1 = Inches(0.8); left2 = Inches(6.8)
    top1 = Inches(1.5); top2 = Inches(4.2)

    problems = [
        {
            "left": left1, "top": top1,
            "badge": "CHALLENGE 1", "b_bg": RGBColor(254, 242, 242), "b_tx": COLOR_RED,
            "title": "Clean-Slate Learning (Toy Problems)",
            "desc": "Students usually practice writing small code snippets from an empty file. In real software jobs, developers almost never write code from scratch. Instead, they must read, understand, debug, and improve large existing project codebases with existing technical debt."
        },
        {
            "left": left2, "top": top1,
            "badge": "CHALLENGE 2", "b_bg": RGBColor(254, 243, 199), "b_tx": COLOR_AMBER,
            "title": "No Real Architectural Context",
            "desc": "Classroom assignments only give algorithmic prompts. They lack real business background, task tickets, and Architecture Decision Records (ADRs). As a result, students do not learn how to follow company design standards or handle production constraints."
        },
        {
            "left": left1, "top": top2,
            "badge": "CHALLENGE 3", "b_bg": RGBColor(239, 246, 255), "b_tx": COLOR_AZURE,
            "title": "Lack of In-Depth Code Review",
            "desc": "Standard learning websites only use simple pass or fail checks on test cases. Students rarely experience line-by-line code reviews from senior engineers to learn clean coding habits, edge-case handling, and proper pull request communication."
        },
        {
            "left": left2, "top": top2,
            "badge": "CHALLENGE 4", "b_bg": RGBColor(236, 253, 245), "b_tx": COLOR_GREEN,
            "title": "Unverifiable Resume Claims",
            "desc": "Resumes only show self-written lists of technologies and course names. Recruiters and faculty members have no practical way to verify a student's actual problem-solving and coding ability on realistic engineering tasks."
        }
    ]

    for p in problems:
        add_card(slide, p["left"], p["top"], cw, ch)
        add_badge(slide, p["left"] + Inches(0.25), p["top"] + Inches(0.2), Inches(2.0), Inches(0.28), p["badge"], p["b_bg"], p["b_tx"])

        tb = slide.shapes.add_textbox(p["left"] + Inches(0.25), p["top"] + Inches(0.55), cw - Inches(0.5), ch - Inches(0.65))
        tf = tb.text_frame; tf.word_wrap = True
        
        p0 = tf.paragraphs[0]
        p0.text = p["title"]
        p0.font.size = Pt(13); p0.font.bold = True; p0.font.color.rgb = COLOR_NAVY

        p1 = tf.add_paragraph()
        p1.space_before = Pt(6)
        p1.text = p["desc"]
        p1.font.size = Pt(10); p1.font.color.rgb = COLOR_SLATE

# ==========================================
# SLIDE 3: ABSTRACT
# ==========================================
def build_slide_3(prs):
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "Project Overview", "Abstract",
               "A virtual workplace platform bridging the gap between classroom learning and industry practice.")
    add_footer(slide, 3)

    add_card(slide, Inches(0.8), Inches(1.45), Inches(11.733), Inches(5.35))

    tb = slide.shapes.add_textbox(Inches(1.15), Inches(1.75), Inches(11.033), Inches(4.8))
    tf = tb.text_frame; tf.word_wrap = True

    abstract_text_p1 = (
        "Most computer science students learn programming concepts through lectures and isolated coding exercises, "
        "but they often face difficulties when transitioning to professional software companies. In real engineering teams, "
        "developers rarely write software from scratch. Instead, they work on pre-existing codebases, resolve project task tickets, "
        "follow architectural guidelines, write automated tests, and submit pull requests for code review. Existing learning "
        "platforms focus heavily on syntax and algorithmic puzzles, leaving students with limited exposure to realistic team workflows."
    )
    abstract_text_p2 = (
        "This project presents WORKUP, a web-based virtual professional experience platform designed to bridge this practical gap. "
        "Instead of solving toy problems, learners enter simulated tech companies (such as FinFlow Technologies) and take on realistic "
        "engineering roles. The platform organizes work into project backlogs using a task dependency engine, linking each task to real "
        "business scenarios and Architecture Decision Records (ADRs). Learners work inside isolated browser-based development sandboxes "
        "where they can edit code, run automated tests locally, and submit their changes for review."
    )
    abstract_text_p3 = (
        "An automated AI-assisted code review engine evaluates code changes against defined rubrics and provides line-level feedback "
        "to guide the learner. As tasks are approved, the platform creates an Evidence-of-Skill portfolio backed by verified Git commits. "
        "The system is designed and prototyped using Next.js 14, React.js, TypeScript, Prisma ORM, and Vitest, offering a safe, "
        "hands-on environment where students gain realistic workplace experience before starting their careers."
    )

    p0 = tf.paragraphs[0]
    p0.text = abstract_text_p1
    p0.font.size = Pt(11); p0.font.color.rgb = COLOR_SLATE; p0.line_spacing = 1.25

    p1 = tf.add_paragraph()
    p1.space_before = Pt(12)
    p1.text = abstract_text_p2
    p1.font.size = Pt(11); p1.font.color.rgb = COLOR_SLATE; p1.line_spacing = 1.25

    p2 = tf.add_paragraph()
    p2.space_before = Pt(12)
    p2.text = abstract_text_p3
    p2.font.size = Pt(11); p2.font.color.rgb = COLOR_SLATE; p2.line_spacing = 1.25

# ==========================================
# SLIDE 4: LITERATURE SURVEY
# ==========================================
def build_slide_4(prs):
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "Research Analysis", "Literature Survey",
               "Careful review of published research in software engineering simulation, graduate skills, and cloud sandboxes.")
    add_footer(slide, 4)

    add_card(slide, Inches(0.8), Inches(1.4), Inches(11.733), Inches(5.4))
    t = slide.shapes.add_table(4, 3, Inches(0.95), Inches(1.55), Inches(11.433), Inches(5.1)).table
    t.columns[0].width = Inches(3.2)
    t.columns[1].width = Inches(4.3)
    t.columns[2].width = Inches(3.933)

    headers = ["Title / year", "Main Findings:", "Remarks"]
    for c_idx, h in enumerate(headers):
        cell = t.cell(0, c_idx)
        cell.fill.solid(); cell.fill.fore_color.rgb = COLOR_NAVY
        p = cell.text_frame.paragraphs[0]
        p.text = h; p.font.bold = True; p.font.size = Pt(9.5); p.font.color.rgb = RGBColor(255, 255, 255)

    lit_data = [
        (
            "Title: Comprehensive Evaluation of an Educational Software Engineering Simulation Environment\nYear: 2007 (IEEE TSE)\nAuthors: E. Navarro & A. van der Hoek",
            "• Active simulation helps students understand software engineering trade-offs much better than lectures alone.\n• Simulated roles and sprint backlogs allow students to see how their decisions affect code quality and project progress.",
            "• Confirms that simulated workplaces are effective for teaching practical software workflows.\n• WORKUP adopts this concept to simulate realistic company environments and task backlogs."
        ),
        (
            "Title: Gaps Between Industry Expectations and University Preparation in Software Engineering\nYear: 2013 (ACM SIGCSE)\nAuthors: A. Radermacher & G. Walia",
            "• Industry survey across 50+ tech companies identified that graduates struggle most with legacy code, testing, and Git reviews.\n• Universities focus heavily on individual clean-slate coding rather than team-based code maintenance.",
            "• Directly supports WORKUP's focus on legacy codebase tasks rather than simple clean-slate coding.\n• Shows the need for task tickets with automated testing and pull request reviews."
        ),
        (
            "Title: Lightweight Container Isolation for Computing Education\nYear: 2018 (IEEE Trans. Education)\nAuthors: N. Kratzke",
            "• Browser-accessible isolated sandboxes remove local setup friction and prevent student code from escaping to the host server.\n• Ephemeral execution sandboxes provide a cost-effective way to host programming labs.",
            "• Informs WORKUP's sandbox design, using path-jailed execution environments with strict execution timeouts.\n• Ensures safe and isolated in-browser code execution for learners."
        )
    ]

    for r_idx, (t_y, findings, remarks) in enumerate(lit_data):
        c0 = t.cell(r_idx + 1, 0); c1 = t.cell(r_idx + 1, 1); c2 = t.cell(r_idx + 1, 2)
        row_bg = RGBColor(248, 250, 252) if r_idx % 2 == 0 else RGBColor(255, 255, 255)
        for c in (c0, c1, c2):
            c.fill.solid(); c.fill.fore_color.rgb = row_bg
        
        p0 = c0.text_frame.paragraphs[0]; p0.text = t_y; p0.font.bold = True; p0.font.size = Pt(8.5); p0.font.color.rgb = COLOR_SLATE
        p1 = c1.text_frame.paragraphs[0]; p1.text = findings; p1.font.size = Pt(8.5); p1.font.color.rgb = COLOR_SLATE
        p2 = c2.text_frame.paragraphs[0]; p2.text = remarks; p2.font.size = Pt(8.5); p2.font.color.rgb = COLOR_BLUE

# ==========================================
# SLIDE 5: END USERS / TARGET BENEFICIARIES
# ==========================================
def build_slide_5(prs):
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "Stakeholder Analysis", "End Users / Target Beneficiaries",
               "Key roles and user groups that interact with the WORKUP platform.")
    add_footer(slide, 5)

    # 3 Category Cards
    col_w = Inches(11.733)
    card_h = Inches(1.55)
    left_pos = Inches(0.8)

    users = [
        {
            "top": Inches(1.5),
            "badge": "STUDENTS / LEARNERS",
            "b_bg": RGBColor(239, 246, 255), "b_tx": COLOR_AZURE,
            "title": "Engineering Students & Career Starters",
            "desc": "Explore professional career paths (Software Engineering, DevOps, AI/ML), enter simulated tech companies, work on realistic task tickets, write code in cloud sandboxes, run automated tests locally, receive line-level feedback, and build a verified portfolio of real code commits."
        },
        {
            "top": Inches(3.3),
            "badge": "EDUCATORS / CONTENT AUTHORS",
            "b_bg": RGBColor(236, 253, 245), "b_tx": COLOR_GREEN,
            "title": "Faculty & Curriculum Designers",
            "desc": "Create simulated companies, design multi-step project task backlogs (DAGs), set up legacy codebases, define automated test suites, and configure evaluation rubrics to assess student learning with zero manual grading overhead."
        },
        {
            "top": Inches(5.1),
            "badge": "RECRUITERS / INDUSTRY MENTORS",
            "b_bg": RGBColor(254, 243, 199), "b_tx": COLOR_AMBER,
            "title": "Hiring Managers & Senior Engineers",
            "desc": "Review candidate portfolios backed by verified Git commits and test reports, evaluate practical problem-solving ability, and provide mentor feedback without relying on self-reported resume bullet points."
        }
    ]

    for u in users:
        add_card(slide, left_pos, u["top"], col_w, card_h)
        add_badge(slide, left_pos + Inches(0.25), u["top"] + Inches(0.2), Inches(3.0), Inches(0.28), u["badge"], u["b_bg"], u["b_tx"])

        tb = slide.shapes.add_textbox(left_pos + Inches(0.25), u["top"] + Inches(0.55), col_w - Inches(0.5), card_h - Inches(0.65))
        tf = tb.text_frame; tf.word_wrap = True
        
        p0 = tf.paragraphs[0]
        p0.text = u["title"]
        p0.font.size = Pt(12); p0.font.bold = True; p0.font.color.rgb = COLOR_NAVY

        p1 = tf.add_paragraph()
        p1.space_before = Pt(4)
        p1.text = u["desc"]
        p1.font.size = Pt(9.5); p1.font.color.rgb = COLOR_SLATE

# ==========================================
# SLIDE 6: EXISTING SYSTEM
# ==========================================
def build_slide_6(prs):
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "Current Approaches", "Existing System",
               "Overview of current learning platforms, coding websites, and job simulations.")
    add_footer(slide, 6)

    add_card(slide, Inches(0.8), Inches(1.45), Inches(11.733), Inches(5.35))
    tb = slide.shapes.add_textbox(Inches(1.15), Inches(1.75), Inches(11.033), Inches(4.8))
    tf = tb.text_frame; tf.word_wrap = True

    points = [
        ("Algorithmic Practice Websites: ", "Platforms like LeetCode and HackerRank focus mainly on isolated algorithmic puzzles and syntax questions, without exposing learners to multi-file projects."),
        ("Video-Based Online Courses: ", "MOOC platforms like Coursera and Udemy rely on passive video watching, where students follow tutorials without hands-on workplace troubleshooting."),
        ("Static Job Simulations: ", "Platforms like Forage provide corporate business scenarios, but submissions are static files (PDFs/PPTs) with no live code execution or automated testing."),
        ("Unguided Cloud IDEs: ", "Cloud development environments like GitHub Codespaces offer raw computing machines, but lack curriculum, simulated company context, and guided task backlogs."),
        ("Binary Auto-Graders: ", "Existing assessment tools test code on simple pass/fail string matches rather than providing in-depth, line-by-line code reviews on pull requests.")
    ]

    for idx, (title, desc) in enumerate(points):
        p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
        if idx > 0: p.space_before = Pt(14)
        r0 = p.add_run(); r0.text = f"•  {title}"; r0.font.bold = True; r0.font.size = Pt(11); r0.font.color.rgb = COLOR_NAVY
        r1 = p.add_run(); r1.text = desc; r1.font.size = Pt(10.5); r1.font.color.rgb = COLOR_SLATE

# ==========================================
# SLIDE 7: DISADVANTAGES
# ==========================================
def build_slide_7(prs):
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "Limitations of Current Tools", "Disadvantages",
               "Key drawbacks and limitations found in existing educational platforms.")
    add_footer(slide, 7)

    add_card(slide, Inches(0.8), Inches(1.45), Inches(11.733), Inches(5.35))
    tb = slide.shapes.add_textbox(Inches(1.15), Inches(1.75), Inches(11.033), Inches(4.8))
    tf = tb.text_frame; tf.word_wrap = True

    disadvantages = [
        ("Clean-Slate Bias: ", "Students only practice writing small programs from scratch, leaving them unprepared for understanding and fixing large existing codebases with technical debt."),
        ("No Real Business Context: ", "Assignments lack realistic business problems, Jira-style task tickets, and Architecture Decision Records (ADRs) used by engineering teams in companies."),
        ("Limited Review & Feedback: ", "Existing tools provide only simple pass/fail test results without line-by-line feedback on code quality, security rules, and clean coding standards."),
        ("Unverifiable Resumes: ", "Self-reported skills on resumes are easy to exaggerate and do not give recruiters proof of practical ability or problem-solving capability."),
        ("Fragmented Learning Tools: ", "Learners must switch between videos, coding websites, and GitHub without a single connected workplace workflow.")
    ]

    for idx, (title, desc) in enumerate(disadvantages):
        p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
        if idx > 0: p.space_before = Pt(14)
        r0 = p.add_run(); r0.text = f"•  {title}"; r0.font.bold = True; r0.font.size = Pt(11); r0.font.color.rgb = COLOR_RED
        r1 = p.add_run(); r1.text = desc; r1.font.size = Pt(10.5); r1.font.color.rgb = COLOR_SLATE

# ==========================================
# SLIDE 8: PROPOSED SYSTEM
# ==========================================
def build_slide_8(prs):
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "System Architecture", "Proposed System",
               "The WORKUP platform workflow connecting simulated companies, tasks, sandboxes, and reviews.")
    add_footer(slide, 8)

    # Top Card: Description
    add_card(slide, Inches(0.8), Inches(1.45), Inches(11.733), Inches(1.7))
    add_badge(slide, Inches(1.05), Inches(1.65), Inches(2.5), Inches(0.28), "SYSTEM DESCRIPTION", RGBColor(239, 246, 255), COLOR_AZURE)

    tb_desc = slide.shapes.add_textbox(Inches(1.05), Inches(2.0), Inches(11.233), Inches(1.0))
    tf_d = tb_desc.text_frame; tf_d.word_wrap = True
    pd = tf_d.paragraphs[0]
    pd.text = (
        "WORKUP acts as a virtual workplace platform that immerses learners in simulated engineering companies. "
        "It provides realistic task tickets, executes code in isolated cloud sandboxes, and delivers automated "
        "line-level reviews to help students build practical engineering competence."
    )
    pd.font.size = Pt(10.5); pd.font.color.rgb = COLOR_SLATE; pd.line_spacing = 1.25

    # Bottom Card: Process Flow
    add_card(slide, Inches(0.8), Inches(3.3), Inches(11.733), Inches(3.5))
    add_badge(slide, Inches(1.05), Inches(3.5), Inches(2.0), Inches(0.28), "PROCESS FLOW", RGBColor(236, 253, 245), COLOR_GREEN)

    tb_flow = slide.shapes.add_textbox(Inches(1.05), Inches(3.85), Inches(11.233), Inches(2.8))
    tf_f = tb_flow.text_frame; tf_f.word_wrap = True

    steps = [
        ("1. Career & Role Selection: ", "Learner chooses a career family and specialized role (e.g., Backend Engineer, Platform SRE)."),
        ("2. Simulated Company: ", "Enters a simulated enterprise (e.g., FinFlow Technologies) with authentic business context."),
        ("3. Task Ticket & ADR: ", "Receives a Jira-style task ticket with acceptance criteria and Architecture Decision Records."),
        ("4. Isolated Cloud Sandbox: ", "Opens a zero-setup browser workspace with path-jailed file execution."),
        ("5. Implementation & Tests: ", "Refactors code and executes in-sandbox automated tests (Vitest) to verify correctness."),
        ("6. AI Code Review: ", "Submits a pull request; the review engine evaluates code diffs and provides line-level feedback."),
        ("7. Evidence of Skill: ", "Approved tasks generate an immutable portfolio backed by verified Git commit SHAs.")
    ]

    for idx, (step_title, step_desc) in enumerate(steps):
        p = tf_f.paragraphs[0] if idx == 0 else tf_f.add_paragraph()
        if idx > 0: p.space_before = Pt(4)
        r0 = p.add_run(); r0.text = step_title; r0.font.bold = True; r0.font.size = Pt(9.5); r0.font.color.rgb = COLOR_NAVY
        r1 = p.add_run(); r1.text = step_desc; r1.font.size = Pt(9); r1.font.color.rgb = COLOR_SLATE

# ==========================================
# SLIDE 9: ADVANTAGES
# ==========================================
def build_slide_9(prs):
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "System Benefits", "Advantages",
               "Key advantages of the proposed WORKUP platform for learners and institutions.")
    add_footer(slide, 9)

    add_card(slide, Inches(0.8), Inches(1.45), Inches(11.733), Inches(5.35))
    tb = slide.shapes.add_textbox(Inches(1.15), Inches(1.7), Inches(11.033), Inches(4.9))
    tf = tb.text_frame; tf.word_wrap = True

    advantages = [
        ("Realistic Workplace Experience: ", "Learners work inside simulated companies (such as FinFlow Technologies) and solve genuine business problems."),
        ("Connected Project Workflows: ", "Follows the complete engineering cycle from task tickets to testing, pull request review, and portfolio evidence."),
        ("Zero-Setup Cloud Sandboxes: ", "Students write and test code directly in the browser without installing complex software on their personal computers."),
        ("Automated In-Sandbox Testing: ", "Built-in test execution (Vitest) allows learners to verify their code locally before submitting their work."),
        ("Line-by-Line Code Review: ", "An automated AI Tech Lead reviewer inspects code diffs and provides specific comments on code quality and architecture."),
        ("Verifiable Proof of Skills: ", "Replaces self-reported resume claims with an Evidence-of-Skill portfolio backed by verified Git commits and test logs.")
    ]

    for idx, (title, desc) in enumerate(advantages):
        p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
        if idx > 0: p.space_before = Pt(12)
        r0 = p.add_run(); r0.text = f"•  {title}"; r0.font.bold = True; r0.font.size = Pt(11); r0.font.color.rgb = COLOR_GREEN
        r1 = p.add_run(); r1.text = desc; r1.font.size = Pt(10.5); r1.font.color.rgb = COLOR_SLATE

# ==========================================
# SLIDE 10: TECHNOLOGY
# ==========================================
def build_slide_10(prs):
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "Technical Implementation", "TECNNOLOGY",
               "Core technologies used in the development of the WORKUP platform.")
    add_footer(slide, 10)

    add_card(slide, Inches(0.8), Inches(1.4), Inches(11.733), Inches(5.4))
    t = slide.shapes.add_table(11, 2, Inches(0.95), Inches(1.5), Inches(11.433), Inches(5.2)).table
    t.columns[0].width = Inches(3.2)
    t.columns[1].width = Inches(8.233)

    headers = ["TECNNOLOGY", "USE"]
    for c_idx, h in enumerate(headers):
        cell = t.cell(0, c_idx)
        cell.fill.solid(); cell.fill.fore_color.rgb = COLOR_NAVY
        p = cell.text_frame.paragraphs[0]
        p.text = h; p.font.bold = True; p.font.size = Pt(9.5); p.font.color.rgb = RGBColor(255, 255, 255)

    tech_rows = [
        ("Next.js 14", "Builds the full-stack web application with App Router, server-rendered pages, and secure API routes."),
        ("React.js", "Creates the interactive user interface, including career catalogs, task boards, and workbench panels."),
        ("TypeScript", "Provides static type-checking across frontend components, API handlers, and backend business logic."),
        ("Tailwind CSS", "Provides responsive styling and modern layout components across all platform pages."),
        ("Prisma ORM", "Manages database queries and models 21 relational domain entities (users, companies, tasks, workspaces, portfolios)."),
        ("PostgreSQL / SQLite", "Stores application data including user accounts, simulated company details, task tickets, and evaluation records."),
        ("Node.js Sandbox", "Runs student code safely in path-jailed workspaces with strict execution timeouts (4000ms) to protect the server."),
        ("Vitest", "Executes automated unit and integration tests inside the sandbox and checks student code against test assertions."),
        ("JWT (jose) & Bcryptjs", "Handles user authentication with encrypted password hashing and secure HTTP-only session tokens."),
        ("Git Version Control", "Captures code changes (diffs), generates commit hashes, and tracks student progress.")
    ]

    for r_idx, (tech, role) in enumerate(tech_rows):
        c0 = t.cell(r_idx + 1, 0); c1 = t.cell(r_idx + 1, 1)
        row_bg = RGBColor(248, 250, 252) if r_idx % 2 == 0 else RGBColor(255, 255, 255)
        c0.fill.solid(); c0.fill.fore_color.rgb = row_bg
        c1.fill.solid(); c1.fill.fore_color.rgb = row_bg
        
        p0 = c0.text_frame.paragraphs[0]; p0.text = tech; p0.font.bold = True; p0.font.size = Pt(8.5); p0.font.color.rgb = COLOR_SLATE
        p1 = c1.text_frame.paragraphs[0]; p1.text = role; p1.font.size = Pt(8.5); p1.font.color.rgb = COLOR_MUTED

# ==========================================
# SLIDE 11: THANK YOU
# ==========================================
def build_slide_11(prs):
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, "Conclusion & Review", "THANK YOU",
               "Major Project Review — Stage-I | Questions & Discussion.")
    add_footer(slide, 11)

    add_card(slide, Inches(0.8), Inches(1.45), Inches(11.733), Inches(5.35), bg_color=COLOR_NAVY, border_color=COLOR_AZURE)

    tb = slide.shapes.add_textbox(Inches(1.5), Inches(2.2), Inches(10.333), Inches(3.8))
    tf = tb.text_frame; tf.word_wrap = True

    p0 = tf.paragraphs[0]
    p0.text = "THANK YOU!"
    p0.alignment = PP_ALIGN.CENTER
    p0.font.size = Pt(32); p0.font.bold = True; p0.font.color.rgb = RGBColor(255, 255, 255)

    p1 = tf.add_paragraph()
    p1.space_before = Pt(16)
    p1.text = "Special thanks to our Project Guide Mr. V. Veeresh, Head of Department Dr. M. V. Vijaya Saradhi, and the Department Review Committee."
    p1.alignment = PP_ALIGN.CENTER
    p1.font.size = Pt(13); p1.font.color.rgb = RGBColor(191, 219, 254)

    p2 = tf.add_paragraph()
    p2.space_before = Pt(8)
    p2.text = "Department of Computer Science & Engineering (IoT & AI&DS), ACE Engineering College."
    p2.alignment = PP_ALIGN.CENTER
    p2.font.size = Pt(11); p2.font.color.rgb = RGBColor(148, 163, 184)

    p3 = tf.add_paragraph()
    p3.space_before = Pt(24)
    p3.text = "We welcome your valuable feedback and questions."
    p3.alignment = PP_ALIGN.CENTER
    p3.font.size = Pt(14); p3.font.bold = True; p3.font.color.rgb = RGBColor(226, 232, 240)

# Build all 11 slides
print("Building 11 slides in official college review format...")
build_slide_1(prs)
build_slide_2(prs)
build_slide_3(prs)
build_slide_4(prs)
build_slide_5(prs)
build_slide_6(prs)
build_slide_7(prs)
build_slide_8(prs)
build_slide_9(prs)
build_slide_10(prs)
build_slide_11(prs)

print(f"Total slides generated: {len(prs.slides)}")
print(f"Saving to {pptx_path}...")
prs.save(pptx_path)
print(f"Successfully saved: {pptx_path} (Size: {os.path.getsize(pptx_path)} bytes)")
