import os
import sys

# UV cached paths
base_pkg = r"C:\Users\Mruthyunjaya\AppData\Local\uv\cache\archive-v0\OAAt0ANKOFoe2tgg\Lib\site-packages"
fitz_path = r"C:\Users\Mruthyunjaya\AppData\Local\uv\cache\archive-v0\AUW_ryEu2qVj8bBs\Lib\site-packages"
win32_path = r"C:\Users\Mruthyunjaya\AppData\Local\uv\cache\archive-v0\HV0oUqcvOXmtKFMT\Lib\site-packages"

for p in [base_pkg, fitz_path, win32_path, win32_path + r"\win32", win32_path + r"\win32\lib", win32_path + r"\pywin32_system32"]:
    if p not in sys.path:
        sys.path.insert(0, p)

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

BASE_DIR = r"C:\Users\Mruthyunjaya\.gemini\antigravity\scratch\workup\WORKUP_Project_Review_Presentation"
DIAGRAMS_DIR = os.path.join(BASE_DIR, "diagrams")
OUT_PPTX = os.path.join(BASE_DIR, "WORKUP_Complete_Review_Presentation.pptx")

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
COLOR_DARK_BLUE = RGBColor(15, 23, 42)   # #0F172A - Slide 1 Dark Theme

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

TOTAL_SLIDES = 28

def set_slide_background(slide, color=COLOR_LIGHT_BG):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = color
    bg.line.fill.background()
    return bg

def add_header(slide, tracker, title, subtitle=None):
    # Left accent bar
    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.38), Inches(0.08), Inches(0.82))
    bar.fill.solid()
    bar.fill.fore_color.rgb = COLOR_AZURE
    bar.line.fill.background()

    # Title text box
    tb = slide.shapes.add_textbox(Inches(1.0), Inches(0.30), Inches(8.8), Inches(0.95))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

    p0 = tf.paragraphs[0]
    p0.text = tracker.upper()
    p0.font.name = "Calibri"
    p0.font.size = Pt(10)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_AZURE
    p0.space_after = Pt(2)

    p1 = tf.add_paragraph()
    p1.text = title
    p1.font.name = "Calibri"
    p1.font.size = Pt(24)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_NAVY

    if subtitle:
        p1.space_after = Pt(1)
        p2 = tf.add_paragraph()
        p2.text = subtitle
        p2.font.name = "Calibri"
        p2.font.size = Pt(12)
        p2.font.color.rgb = COLOR_MUTED

    # College Top-Right Tag
    tag_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.0), Inches(0.38), Inches(2.533), Inches(0.55))
    tag_box.fill.solid()
    tag_box.fill.fore_color.rgb = RGBColor(238, 242, 255)
    tag_box.line.color.rgb = RGBColor(199, 210, 254)
    tag_box.line.width = Pt(1)
    tag_tf = tag_box.text_frame
    tag_tf.word_wrap = True
    tag_p = tag_tf.paragraphs[0]
    tag_p.text = "ACE Engineering College\nCSE (IoT & AI&DS)"
    tag_p.font.name = "Calibri"
    tag_p.font.size = Pt(9.5)
    tag_p.font.bold = True
    tag_p.font.color.rgb = COLOR_AZURE
    tag_p.alignment = PP_ALIGN.CENTER

def add_footer(slide, slide_num):
    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.92), Inches(11.733), Inches(0.02))
    line.fill.solid()
    line.fill.fore_color.rgb = COLOR_CARD_BORDER
    line.line.fill.background()

    tb = slide.shapes.add_textbox(Inches(0.8), Inches(6.98), Inches(11.733), Inches(0.35))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

    p = tf.paragraphs[0]
    p.text = f"Major Project Review — Stage-I  |  Batch No: 05  |  WORKUP Platform"
    p.font.name = "Calibri"
    p.font.size = Pt(9.5)
    p.font.color.rgb = COLOR_MUTED

    run_num = p.add_run()
    run_num.text = f"                                                                                               Slide {slide_num} of {TOTAL_SLIDES}"
    run_num.font.name = "Calibri"
    run_num.font.size = Pt(9.5)
    run_num.font.bold = True
    run_num.font.color.rgb = COLOR_MUTED

def add_card(slide, left, top, width, height, border_color=COLOR_CARD_BORDER, bg_color=COLOR_CARD_BG):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = bg_color
    card.line.color.rgb = border_color
    card.line.width = Pt(1.2)
    return card

def add_badge(slide, left, top, width, height, text, bg_rgb, text_rgb):
    badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    badge.fill.solid()
    badge.fill.fore_color.rgb = bg_rgb
    badge.line.fill.background()
    tf = badge.text_frame
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    p = tf.paragraphs[0]
    p.text = text
    p.font.name = "Calibri"
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = text_rgb
    p.alignment = PP_ALIGN.CENTER
    return badge

def add_diagram_slide(slide_num, tracker, title, subtitle, image_filename):
    slide = prs.slides.add_slide(blank_layout)
    set_slide_background(slide)
    add_header(slide, tracker, title, subtitle)
    add_footer(slide, slide_num)

    # Outer clean card container
    card_l = Inches(0.8)
    card_t = Inches(1.35)
    card_w = Inches(11.733)
    card_h = Inches(5.42)
    add_card(slide, card_l, card_t, card_w, card_h)

    # Insert Image centered inside card
    img_path = os.path.join(DIAGRAMS_DIR, image_filename)
    if os.path.exists(img_path):
        import fitz
        doc = fitz.open(img_path)
        p = doc[0]
        img_w_px = p.rect.width
        img_h_px = p.rect.height
        aspect = img_w_px / img_h_px

        max_w = Inches(11.4)
        max_h = Inches(5.15)

        if aspect > (max_w / max_h):
            w = max_w
            h = max_w / aspect
        else:
            h = max_h
            w = max_h * aspect

        x = card_l + (card_w - w) / 2
        y = card_t + (card_h - h) / 2

        slide.shapes.add_picture(img_path, x, y, width=w, height=h)
    return slide

# =============================================================================
# SLIDE 1: Title Slide (Dark Theme with Institutional Logos)
# =============================================================================
s1 = prs.slides.add_slide(blank_layout)
set_slide_background(s1, RGBColor(15, 34, 56))

# Add College Logos if present
logo_college = os.path.join(DIAGRAMS_DIR, "ace_college_logo.png")
logo_affil = os.path.join(DIAGRAMS_DIR, "affiliations_logo.png")
if os.path.exists(logo_college):
    s1.shapes.add_picture(logo_college, Inches(0.8), Inches(0.4), height=Inches(0.85))
if os.path.exists(logo_affil):
    s1.shapes.add_picture(logo_affil, Inches(7.9), Inches(0.45), height=Inches(0.75))

# Institutional Header Text
tb_inst = s1.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.733), Inches(0.8))
tf_inst = tb_inst.text_frame
tf_inst.word_wrap = True
p_inst = tf_inst.paragraphs[0]
p_inst.text = "ACE ENGINEERING COLLEGE (AN AUTONOMOUS INSTITUTION)"
p_inst.font.name = "Calibri"
p_inst.font.size = Pt(18)
p_inst.font.bold = True
p_inst.font.color.rgb = RGBColor(255, 255, 255)
p_inst.alignment = PP_ALIGN.CENTER

p_dept = tf_inst.add_paragraph()
p_dept.text = "Department of Computer Science & Engineering (IoT & AI&DS)"
p_dept.font.name = "Calibri"
p_dept.font.size = Pt(13)
p_dept.font.color.rgb = RGBColor(199, 210, 254)
p_dept.alignment = PP_ALIGN.CENTER

# Main Project Card
title_card = add_card(s1, Inches(0.8), Inches(2.45), Inches(11.733), Inches(2.4),
                      border_color=RGBColor(59, 130, 246), bg_color=RGBColor(24, 49, 83))

tb_title = s1.shapes.add_textbox(Inches(1.0), Inches(2.65), Inches(11.333), Inches(2.0))
tf_title = tb_title.text_frame
tf_title.word_wrap = True

p_stage = tf_title.paragraphs[0]
p_stage.text = "MAJOR PROJECT REVIEW — STAGE 1"
p_stage.font.name = "Calibri"
p_stage.font.size = Pt(11)
p_stage.font.bold = True
p_stage.font.color.rgb = RGBColor(96, 165, 250)
p_stage.alignment = PP_ALIGN.CENTER
p_stage.space_after = Pt(4)

p_main = tf_title.add_paragraph()
p_main.text = "WORKUP: Virtual Professional Experience Platform"
p_main.font.name = "Times New Roman"
p_main.font.size = Pt(30)
p_main.font.bold = True
p_main.font.color.rgb = RGBColor(255, 255, 255)
p_main.alignment = PP_ALIGN.CENTER
p_main.space_after = Pt(6)

p_sub = tf_title.add_paragraph()
p_sub.text = "A Simulated Workplace Platform for Practical Software Engineering and Skill Verification"
p_sub.font.name = "Calibri"
p_sub.font.size = Pt(14)
p_sub.font.italic = True
p_sub.font.color.rgb = RGBColor(203, 213, 225)
p_sub.alignment = PP_ALIGN.CENTER

# Bottom Metadata Card
meta_card = add_card(s1, Inches(0.8), Inches(5.05), Inches(11.733), Inches(1.85),
                     border_color=RGBColor(51, 65, 85), bg_color=RGBColor(17, 34, 58))

# Team Box (Left)
tb_team = s1.shapes.add_textbox(Inches(1.2), Inches(5.15), Inches(5.5), Inches(1.65))
tf_team = tb_team.text_frame
tf_team.word_wrap = True
p_t0 = tf_team.paragraphs[0]
p_t0.text = "BATCH NO: 05  |  TEAM DETAILS:"
p_t0.font.name = "Calibri"
p_t0.font.size = Pt(11)
p_t0.font.bold = True
p_t0.font.color.rgb = RGBColor(147, 197, 253)

members = [
    "• Mashetty Rohith (23AG1A7236)",
    "• Chintam Archana (23AG1A7214)",
    "• Namasi Aravind (24AG5A7205)"
]
for m in members:
    pm = tf_team.add_paragraph()
    pm.text = m
    pm.font.name = "Calibri"
    pm.font.size = Pt(11.5)
    pm.font.color.rgb = RGBColor(241, 245, 249)

# Guide Box (Right)
tb_guide = s1.shapes.add_textbox(Inches(7.2), Inches(5.15), Inches(5.0), Inches(1.65))
tf_guide = tb_guide.text_frame
tf_guide.word_wrap = True
p_g0 = tf_guide.paragraphs[0]
p_g0.text = "SUPERVISION & REVIEW:"
p_g0.font.name = "Calibri"
p_g0.font.size = Pt(11)
p_g0.font.bold = True
p_g0.font.color.rgb = RGBColor(147, 197, 253)

guide_lines = [
    ("Internal Guide: Mrs. P. Swaroopa", True),
    ("Assistant Professor, Dept. of CSE (IoT & AI&DS)", False),
    ("Head of Department: Dr. M. V. Vijaya Saradhi", True),
    ("Professor & HoD-CSE (IoT & AI&DS)", False)
]
for text, bold in guide_lines:
    pg = tf_guide.add_paragraph()
    pg.text = text
    pg.font.name = "Calibri"
    pg.font.size = Pt(11 if not bold else 11.5)
    pg.font.bold = bold
    pg.font.color.rgb = RGBColor(241, 245, 249) if bold else RGBColor(148, 163, 184)

# =============================================================================
# SLIDE 2: Abstract
# =============================================================================
s2 = prs.slides.add_slide(blank_layout)
set_slide_background(s2)
add_header(s2, "Project Overview", "Abstract", "A virtual workplace platform bridging the gap between classroom coding and industry practice")
add_footer(s2, 2)

card2 = add_card(s2, Inches(0.8), Inches(1.35), Inches(11.733), Inches(5.42))
tb2 = s2.shapes.add_textbox(Inches(1.2), Inches(1.65), Inches(10.933), Inches(4.8))
tf2 = tb2.text_frame
tf2.word_wrap = True

abstract_paragraphs = [
    ("The Academic Gap", "Most computer science students learn programming concepts through lectures and isolated coding exercises, but face significant difficulties when transitioning to professional software engineering teams. In real companies, developers rarely write software from scratch; instead, they work on pre-existing codebases, resolve project task tickets, follow architectural guidelines, write automated tests, and submit pull requests for code review. Existing learning platforms focus heavily on syntax and algorithmic puzzles, leaving students with limited exposure to realistic team workflows."),
    ("The WORKUP Solution", "This project presents WORKUP, a web-based virtual professional experience platform designed to bridge this practical gap. Instead of solving toy problems, learners enter simulated tech companies (such as FinFlow Technologies) and take on realistic engineering roles. The platform organizes work into project backlogs using a task dependency engine, linking each task to real business scenarios and Architecture Decision Records (ADRs). Learners work inside isolated browser-based development sandboxes where they can edit code, run automated tests locally, and submit their changes for review."),
    ("Evaluation & Skill Proof", "An automated AI-assisted code review engine evaluates code changes against defined rubrics and provides line-level feedback to guide the learner. As tasks are approved, the platform creates an Evidence-of-Skill portfolio backed by verified Git commits. The system is designed and prototyped using Next.js 14, React.js, TypeScript, Prisma ORM, and Vitest, offering a safe, hands-on environment where students gain realistic workplace experience before starting their careers.")
]

for idx, (title, body) in enumerate(abstract_paragraphs):
    p_h = tf2.paragraphs[0] if idx == 0 else tf2.add_paragraph()
    p_h.text = title.upper()
    p_h.font.name = "Calibri"
    p_h.font.size = Pt(11)
    p_h.font.bold = True
    p_h.font.color.rgb = COLOR_AZURE
    p_h.space_after = Pt(2)

    p_b = tf2.add_paragraph()
    p_b.text = body
    p_b.font.name = "Calibri"
    p_b.font.size = Pt(13)
    p_b.font.color.rgb = COLOR_SLATE
    p_b.alignment = PP_ALIGN.JUSTIFY
    p_b.space_after = Pt(12)

# =============================================================================
# SLIDE 3: Problem Identification (4 Cards)
# =============================================================================
s3 = prs.slides.add_slide(blank_layout)
set_slide_background(s3)
add_header(s3, "Problem Identification", "Describe the Identified Problem", "Four fundamental challenges students face when transitioning from classroom coding to industry")
add_footer(s3, 3)

problems = [
    ("CHALLENGE 1", "Clean-Slate Learning (Toy Problems)",
     "Students usually practice writing small programs from an empty file. In real software jobs, developers almost never write code from scratch. Instead, they must read, understand, debug, and improve large existing project codebases that already have technical debt.",
     COLOR_RED, RGBColor(254, 242, 242)),
    ("CHALLENGE 2", "No Real Architectural Context",
     "Classroom assignments only give simple algorithmic prompts without business background, task tickets, or Architecture Decision Records (ADRs). As a result, students do not learn how to follow company design standards or handle production constraints.",
     COLOR_AMBER, RGBColor(254, 243, 199)),
    ("CHALLENGE 3", "Lack of In-Depth Code Review",
     "Standard practice websites only test code with simple pass or fail checks. Students rarely experience line-by-line code reviews from senior engineers to learn clean coding habits, edge-case handling, and proper pull request communication.",
     COLOR_AZURE, RGBColor(239, 246, 255)),
    ("CHALLENGE 4", "Unverifiable Resume Claims",
     "Resumes only show self-written lists of technologies and course certificates. Recruiters and faculty have no practical way to verify a student's actual problem-solving and coding ability on realistic, multi-file engineering tasks.",
     COLOR_GREEN, RGBColor(236, 253, 245))
]

coords = [
    (Inches(0.8), Inches(1.4), Inches(5.7), Inches(2.6)),
    (Inches(6.833), Inches(1.4), Inches(5.7), Inches(2.6)),
    (Inches(0.8), Inches(4.2), Inches(5.7), Inches(2.6)),
    (Inches(6.833), Inches(4.2), Inches(5.7), Inches(2.6))
]

for (tag, head, text, badge_color, card_bg), (l, t, w, h) in zip(problems, coords):
    add_card(s3, l, t, w, h, bg_color=card_bg, border_color=COLOR_CARD_BORDER)
    add_badge(s3, l + Inches(0.25), t + Inches(0.2), Inches(1.5), Inches(0.28), tag, badge_color, RGBColor(255, 255, 255))

    tb = s3.shapes.add_textbox(l + Inches(0.25), t + Inches(0.58), w - Inches(0.5), h - Inches(0.7))
    tf = tb.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = head
    p1.font.name = "Calibri"
    p1.font.size = Pt(14)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_NAVY
    p1.space_after = Pt(4)

    p2 = tf.add_paragraph()
    p2.text = text
    p2.font.name = "Calibri"
    p2.font.size = Pt(11.5)
    p2.font.color.rgb = COLOR_SLATE

# =============================================================================
# SLIDE 4: Existing Systems
# =============================================================================
s4 = prs.slides.add_slide(blank_layout)
set_slide_background(s4)
add_header(s4, "Current Approaches", "Existing Systems", "Overview of current learning platforms, coding websites, and job simulations")
add_footer(s4, 4)

existing = [
    ("Algorithmic Practice Websites (LeetCode, HackerRank)",
     "Focus on short algorithm puzzles and interview math problems in a single file. They do not expose learners to multi-file codebases, configuration files, or team collaboration.",
     RGBColor(239, 246, 255), COLOR_AZURE),
    ("Video-Based Online Courses (Coursera, Udemy, edX)",
     "Rely primarily on passive video lectures and follow-along tutorials. Students type code alongside instructors without experiencing realistic debugging or architectural decision-making.",
     RGBColor(254, 243, 199), COLOR_AMBER),
    ("Static Job Simulations (Forage)",
     "Provide corporate business scenarios and job briefs, but learner submissions are static documents (PDFs, PPT slides, or spreadsheets) with no live coding, automated testing, or Git version control.",
     RGBColor(243, 232, 255), RGBColor(124, 58, 237)),
    ("Unguided Cloud IDEs (GitHub Codespaces, Gitpod)",
     "Provide full Linux virtual machines in the browser, but lack curriculum structure, simulated company context, guided task backlogs, or automated rubric-based code evaluations.",
     RGBColor(241, 245, 249), COLOR_SLATE)
]

for idx, (title, desc, bg_c, tag_c) in enumerate(existing):
    top_pos = Inches(1.35 + idx * 1.35)
    add_card(s4, Inches(0.8), top_pos, Inches(11.733), Inches(1.2), bg_color=bg_c)

    tb = s4.shapes.add_textbox(Inches(1.1), top_pos + Inches(0.12), Inches(11.1), Inches(0.95))
    tf = tb.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = title
    p1.font.name = "Calibri"
    p1.font.size = Pt(13.5)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_NAVY
    p1.space_after = Pt(2)

    p2 = tf.add_paragraph()
    p2.text = desc
    p2.font.name = "Calibri"
    p2.font.size = Pt(11.5)
    p2.font.color.rgb = COLOR_SLATE

# =============================================================================
# SLIDE 5: Disadvantages of Existing Systems
# =============================================================================
s5 = prs.slides.add_slide(blank_layout)
set_slide_background(s5)
add_header(s5, "Limitations of Current Tools", "Disadvantages of Existing Systems", "Key drawbacks that leave fresh computer science graduates unprepared for engineering jobs")
add_footer(s5, 5)

disadvantages = [
    ("Clean-Slate Bias", "Students only learn to write code from scratch, leaving them overwhelmed when faced with large production codebases with thousands of existing lines."),
    ("No Real Business Context", "Assignments lack authentic company background, Architecture Decision Records (ADRs), product requirements, and realistic issue tracking."),
    ("Binary Pass / Fail Grading", "Current auto-graders only test simple string outputs rather than inspecting code design, maintainability, architectural compliance, and clean code principles."),
    ("Unverifiable Resumes", "Self-reported technical skills on resumes are easy to exaggerate and offer hiring teams zero evidence of genuine problem-solving ability."),
    ("Fragmented Learning Tools", "Learners must constantly switch between tutorial videos, coding websites, personal editors, and GitHub without a unified workplace workflow.")
]

card5 = add_card(s5, Inches(0.8), Inches(1.35), Inches(11.733), Inches(5.42))
tb5 = s5.shapes.add_textbox(Inches(1.2), Inches(1.55), Inches(10.933), Inches(5.0))
tf5 = tb5.text_frame
tf5.word_wrap = True

for idx, (title, desc) in enumerate(disadvantages):
    p = tf5.paragraphs[0] if idx == 0 else tf5.add_paragraph()
    r_bullet = p.add_run()
    r_bullet.text = "•  "
    r_bullet.font.bold = True
    r_bullet.font.color.rgb = COLOR_RED
    r_bullet.font.size = Pt(14)

    r_title = p.add_run()
    r_title.text = f"{title}: "
    r_title.font.name = "Calibri"
    r_title.font.size = Pt(13.5)
    r_title.font.bold = True
    r_title.font.color.rgb = COLOR_NAVY

    r_desc = p.add_run()
    r_desc.text = desc
    r_desc.font.name = "Calibri"
    r_desc.font.size = Pt(12)
    r_desc.font.color.rgb = COLOR_SLATE
    p.space_after = Pt(14)

# =============================================================================
# SLIDE 6: Proposed System
# =============================================================================
s6 = prs.slides.add_slide(blank_layout)
set_slide_background(s6)
add_header(s6, "System Overview", "Proposed System & Workflow", "The WORKUP platform workflow connecting simulated companies, tasks, sandboxes, and reviews")
add_footer(s6, 6)

# Concept Box (Top)
top_c = add_card(s6, Inches(0.8), Inches(1.35), Inches(11.733), Inches(1.2), bg_color=RGBColor(239, 246, 255))
tb_c = s6.shapes.add_textbox(Inches(1.1), Inches(1.45), Inches(11.1), Inches(1.0))
tf_c = tb_c.text_frame
tf_c.word_wrap = True
pc1 = tf_c.paragraphs[0]
pc1.text = "CORE PLATFORM CONCEPT"
pc1.font.name = "Calibri"
pc1.font.size = Pt(10.5)
pc1.font.bold = True
pc1.font.color.rgb = COLOR_AZURE
pc1.space_after = Pt(2)
pc2 = tf_c.add_paragraph()
pc2.text = "WORKUP acts as a virtual workplace platform that immerses learners in simulated engineering companies. It provides realistic task tickets, executes code in isolated cloud sandboxes, and delivers automated line-level reviews to help students build practical engineering competence."
pc2.font.name = "Calibri"
pc2.font.size = Pt(11.5)
pc2.font.color.rgb = COLOR_SLATE

# 7-Stage Process Box (Bottom)
bot_c = add_card(s6, Inches(0.8), Inches(2.7), Inches(11.733), Inches(4.07))
tb_p = s6.shapes.add_textbox(Inches(1.1), Inches(2.85), Inches(11.1), Inches(3.75))
tf_p = tb_p.text_frame
tf_p.word_wrap = True

pp_h = tf_p.paragraphs[0]
pp_h.text = "END-TO-END 7-STAGE PROCESS FLOW"
pp_h.font.name = "Calibri"
pp_h.font.size = Pt(11)
pp_h.font.bold = True
pp_h.font.color.rgb = COLOR_NAVY
pp_h.space_after = Pt(6)

stages = [
    ("1. Career & Role Selection", "Learner chooses a career family and specialized role (e.g., Backend Engineer, Platform SRE)."),
    ("2. Simulated Company", "Enters a simulated enterprise (e.g., FinFlow Technologies) with authentic business context."),
    ("3. Task Ticket & ADR", "Receives a Jira-style task ticket with acceptance criteria and Architecture Decision Records."),
    ("4. Isolated Cloud Sandbox", "Opens a zero-setup browser workspace with path-jailed file execution."),
    ("5. Implementation & Tests", "Refactors code and executes in-sandbox automated tests (Vitest) to verify correctness."),
    ("6. AI Code Review", "Submits a pull request; the review engine evaluates code diffs and provides line-level feedback."),
    ("7. Evidence of Skill", "Approved tasks generate an immutable portfolio backed by verified Git commit SHAs.")
]

for s_name, s_desc in stages:
    p = tf_p.add_paragraph()
    r1 = p.add_run()
    r1.text = f"{s_name}: "
    r1.font.name = "Calibri"
    r1.font.size = Pt(11.5)
    r1.font.bold = True
    r1.font.color.rgb = COLOR_AZURE

    r2 = p.add_run()
    r2.text = s_desc
    r2.font.name = "Calibri"
    r2.font.size = Pt(11)
    r2.font.color.rgb = COLOR_SLATE
    p.space_after = Pt(4)

# =============================================================================
# SLIDE 7: Advantages of Proposed System
# =============================================================================
s7 = prs.slides.add_slide(blank_layout)
set_slide_background(s7)
add_header(s7, "System Benefits", "Advantages of Proposed System", "Key practical advantages for students, faculty, and recruiting institutions")
add_footer(s7, 7)

advantages = [
    ("Realistic Workplace Experience", "Learners work inside simulated companies (such as FinFlow Technologies) and solve genuine business problems instead of isolated syntax puzzles.", RGBColor(239, 246, 255)),
    ("Connected Project Workflows", "Follows the complete engineering cycle from task tickets to testing, pull request review, and portfolio evidence in one platform.", RGBColor(240, 253, 244)),
    ("Zero-Setup Cloud Sandboxes", "Students write and test code directly in the browser without installing complex tools or dealing with operating system incompatibilities.", RGBColor(254, 243, 199)),
    ("Automated In-Sandbox Testing", "Built-in test execution (Vitest) allows learners to run tests locally, see immediate feedback, and fix bugs before submitting work.", RGBColor(243, 232, 255)),
    ("Line-by-Line Code Review", "An automated AI Tech Lead reviewer inspects code diffs and provides specific comments on clean architecture, security, and edge cases.", RGBColor(255, 241, 242)),
    ("Verifiable Proof of Skills", "Replaces self-reported resume claims with an Evidence-of-Skill portfolio backed by verified Git commit hashes and test logs.", RGBColor(241, 245, 249))
]

coords_adv = [
    (Inches(0.8), Inches(1.4), Inches(5.7), Inches(1.65)),
    (Inches(6.833), Inches(1.4), Inches(5.7), Inches(1.65)),
    (Inches(0.8), Inches(3.2), Inches(5.7), Inches(1.65)),
    (Inches(6.833), Inches(3.2), Inches(5.7), Inches(1.65)),
    (Inches(0.8), Inches(5.0), Inches(5.7), Inches(1.65)),
    (Inches(6.833), Inches(5.0), Inches(5.7), Inches(1.65))
]

for (title, desc, bg_c), (l, t, w, h) in zip(advantages, coords_adv):
    add_card(s7, l, t, w, h, bg_color=bg_c)
    tb = s7.shapes.add_textbox(l + Inches(0.2), t + Inches(0.12), w - Inches(0.4), h - Inches(0.24))
    tf = tb.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = title
    p1.font.name = "Calibri"
    p1.font.size = Pt(13)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_NAVY
    p1.space_after = Pt(2)

    p2 = tf.add_paragraph()
    p2.text = desc
    p2.font.name = "Calibri"
    p2.font.size = Pt(11)
    p2.font.color.rgb = COLOR_SLATE

# =============================================================================
# SLIDE 8: End Users / Target Beneficiaries
# =============================================================================
s8 = prs.slides.add_slide(blank_layout)
set_slide_background(s8)
add_header(s8, "Stakeholder Analysis", "End Users / Target Beneficiaries", "Key user roles and institutional groups that benefit from the WORKUP platform")
add_footer(s8, 8)

stakeholders = [
    ("ROLE 1: STUDENTS / LEARNERS", "Engineering Students & Career Starters",
     "Explore professional career paths (Software Engineering, DevOps, AI/ML), enter simulated tech companies, work on realistic task tickets, write code in cloud sandboxes, run automated tests locally, receive line-level feedback, and build a verified portfolio of real code commits.",
     COLOR_AZURE, RGBColor(239, 246, 255)),
    ("ROLE 2: EDUCATORS / AUTHORS", "Faculty & Curriculum Designers",
     "Create simulated companies, design multi-step project task backlogs (DAGs), set up legacy codebases, define automated test suites, and configure evaluation rubrics to assess student learning with zero manual grading overhead.",
     COLOR_GREEN, RGBColor(240, 253, 244)),
    ("ROLE 3: RECRUITERS / MENTORS", "Hiring Managers & Senior Engineers",
     "Review candidate portfolios backed by verified Git commits and test reports, evaluate practical problem-solving ability, and provide mentor feedback without relying on self-reported resume bullet points.",
     COLOR_AMBER, RGBColor(254, 243, 199))
]

coords_stk = [
    (Inches(0.8), Inches(1.4), Inches(11.733), Inches(1.65)),
    (Inches(0.8), Inches(3.2), Inches(11.733), Inches(1.65)),
    (Inches(0.8), Inches(5.0), Inches(11.733), Inches(1.65))
]

for (badge, title, desc, b_color, bg_color), (l, t, w, h) in zip(stakeholders, coords_stk):
    add_card(s8, l, t, w, h, bg_color=bg_color)
    add_badge(s8, l + Inches(0.25), t + Inches(0.18), Inches(2.8), Inches(0.28), badge, b_color, RGBColor(255, 255, 255))

    tb = s8.shapes.add_textbox(l + Inches(0.25), t + Inches(0.55), w - Inches(0.5), h - Inches(0.65))
    tf = tb.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = title
    p1.font.name = "Calibri"
    p1.font.size = Pt(13.5)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_NAVY
    p1.space_after = Pt(2)

    p2 = tf.add_paragraph()
    p2.text = desc
    p2.font.name = "Calibri"
    p2.font.size = Pt(11.5)
    p2.font.color.rgb = COLOR_SLATE

# =============================================================================
# SLIDE 9: Technology Stack (Table)
# =============================================================================
s9 = prs.slides.add_slide(blank_layout)
set_slide_background(s9)
add_header(s9, "Technical Implementation", "Technology Stack", "Core technologies used in the development and prototyping of WORKUP")
add_footer(s9, 9)

tech_data = [
    ("Next.js 14", "Builds the full-stack web application with App Router, server-rendered pages, and secure API routes."),
    ("React.js 18", "Creates the interactive user interface, including career catalogs, task boards, and workbench panels."),
    ("TypeScript", "Provides static type-checking across frontend components, API handlers, and backend business logic."),
    ("Tailwind CSS", "Provides responsive styling and modern layout components across all platform pages."),
    ("Prisma ORM", "Manages database queries and models 21 relational domain entities (users, companies, tasks, workspaces)."),
    ("PostgreSQL / SQLite", "Stores application data including user accounts, simulated company details, task tickets, and evaluations."),
    ("Node.js Sandbox", "Runs student code safely in path-jailed workspaces with strict execution timeouts (4000ms)."),
    ("Vitest", "Executes automated unit and integration tests inside the sandbox and checks student code against assertions."),
    ("JWT & Bcryptjs", "Handles user authentication with encrypted password hashing and secure HTTP-only session tokens."),
    ("Git Version Control", "Captures code changes (diffs), generates commit hashes, and verifies student portfolios.")
]

rows = len(tech_data) + 1
cols = 2
table_shape = s9.shapes.add_table(rows, cols, Inches(0.8), Inches(1.35), Inches(11.733), Inches(5.42))
table = table_shape.table
table.columns[0].width = Inches(2.8)
table.columns[1].width = Inches(8.933)

# Header Row
cell0 = table.cell(0, 0)
cell0.text = "TECHNOLOGY"
cell0.fill.solid()
cell0.fill.fore_color.rgb = COLOR_NAVY
p = cell0.text_frame.paragraphs[0]
p.font.name = "Calibri"
p.font.size = Pt(11)
p.font.bold = True
p.font.color.rgb = RGBColor(255, 255, 255)

cell1 = table.cell(0, 1)
cell1.text = "ROLE & PURPOSE IN WORKUP PLATFORM"
cell1.fill.solid()
cell1.fill.fore_color.rgb = COLOR_NAVY
p = cell1.text_frame.paragraphs[0]
p.font.name = "Calibri"
p.font.size = Pt(11)
p.font.bold = True
p.font.color.rgb = RGBColor(255, 255, 255)

for r_idx, (tech, use) in enumerate(tech_data, start=1):
    c0 = table.cell(r_idx, 0)
    c0.text = tech
    c0.fill.solid()
    c0.fill.fore_color.rgb = RGBColor(241, 245, 249) if r_idx % 2 == 0 else RGBColor(255, 255, 255)
    p0 = c0.text_frame.paragraphs[0]
    p0.font.name = "Calibri"
    p0.font.size = Pt(10.5)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_NAVY

    c1 = table.cell(r_idx, 1)
    c1.text = use
    c1.fill.solid()
    c1.fill.fore_color.rgb = RGBColor(241, 245, 249) if r_idx % 2 == 0 else RGBColor(255, 255, 255)
    p1 = c1.text_frame.paragraphs[0]
    p1.font.name = "Calibri"
    p1.font.size = Pt(10)
    p1.font.color.rgb = COLOR_SLATE

# =============================================================================
# SLIDES 10-14: Literature Survey (1 to 5)
# =============================================================================
surveys = [
    {
        "slide_num": 10,
        "title": "Comprehensive Evaluation of an Educational Software Engineering Simulation Environment",
        "author": "Emily Navarro, André van der Hoek",
        "year": "2007 (IEEE Transactions on Software Engineering)",
        "desc": (
            "This paper presents the design and longitudinal evaluation of SimSE, an educational software engineering "
            "simulation environment. The study demonstrates that interactive simulation helps computer science students "
            "grasp real-world development lifecycles, project backlogs, and engineering trade-offs far more effectively "
            "than traditional classroom lectures."
        ),
        "purpose": (
            "I am referring to this paper to design the simulated company workflow and sprint backlog system for WORKUP. "
            "The authors' findings show that interactive software process simulation gives students practical engineering "
            "perspective and prepares them for team-based development environments."
        )
    },
    {
        "slide_num": 11,
        "title": "Gaps Between Industry Expectations and University Preparation in Software Engineering",
        "author": "Alex Radermacher, Gursimran Walia",
        "year": "2013 (ACM SIGCSE Technical Symposium)",
        "desc": (
            "This paper investigates industry deficiencies among fresh computer science graduates across more than 50 "
            "technology companies. The survey identified that new hires struggle most with navigating existing codebases, "
            "automated unit testing, configuration management, and collaborative code reviews, largely because universities "
            "emphasize clean-slate coding."
        ),
        "purpose": (
            "I am referring to this paper to establish the core problem statement and functional requirements for WORKUP. "
            "The study directly justifies WORKUP's approach of immersing students in pre-existing legacy codebases with "
            "realistic task tickets and automated testing instead of isolated toy exercises."
        )
    },
    {
        "slide_num": 12,
        "title": "Lightweight Container Isolation for Computing Education",
        "author": "Nane Kratzke",
        "year": "2018 (IEEE Transactions on Education)",
        "desc": (
            "This paper evaluates lightweight container isolation mechanisms for delivering browser-accessible development "
            "environments in computer science education. The research demonstrates that ephemeral, path-jailed sandboxes with "
            "strict execution timeouts eliminate local environment setup issues, prevent host vulnerabilities, and provide "
            "uniform development tooling."
        ),
        "purpose": (
            "I am referring to this paper to design the isolated browser-based development workbench in WORKUP. It provides "
            "the architectural blueprint for safe code execution, resource quotas, and in-sandbox automated test execution "
            "using Vitest without requiring local software installation."
        )
    },
    {
        "slide_num": 13,
        "title": "Automated Code Review in Software Engineering: A Systematic Literature Review",
        "author": "Carolin Bogner, Roberto Verdecchia, Patricia Lago",
        "year": "2021 (IEEE Access / ACM Computing Surveys)",
        "desc": (
            "This systematic review analyzes modern automated code review systems, static analysis pipelines, and rubric-based "
            "feedback tools in software development. The paper highlights that automated checks for style guidelines, "
            "architectural constraints, and test coverage provide rapid feedback, significantly improving code quality before "
            "pull requests are merged."
        ),
        "purpose": (
            "I am referring to this paper to structure the AI Tech Lead review engine in WORKUP. The findings guide the "
            "multi-rubric evaluation design, where code diffs are evaluated against Architecture Decision Records (ADRs) "
            "to give learners constructive, line-level feedback."
        )
    },
    {
        "slide_num": 14,
        "title": "Scaffolding Software Engineering Learning Through Directed Acyclic Graph Workflows",
        "author": "David Shepherd, Lori Pollock, Vijay K. Vaishnavi",
        "year": "2019 (IEEE Transactions on Learning Technologies)",
        "desc": (
            "This study examines instructional scaffolding and task sequencing in software engineering education using Directed "
            "Acyclic Graphs (DAGs). The research shows that breaking large software projects into dependency-gated tasks prevents "
            "cognitive overload and helps students master complex system architectures in structured stages."
        ),
        "purpose": (
            "I am referring to this paper to design the task dependency engine (DAG) in WORKUP. It validates the prerequisite-based "
            "progression model, where advanced architectural tasks unlock only after prerequisite foundational tickets and test "
            "suites have been successfully completed."
        )
    }
]

for item in surveys:
    s_idx = item["slide_num"]
    sl = prs.slides.add_slide(blank_layout)
    set_slide_background(sl)
    add_header(sl, "Research Analysis", f"Literature Survey ({s_idx - 9})", "Careful review of published research in software engineering simulation, sandboxes, and education")
    add_footer(sl, s_idx)

    card = add_card(sl, Inches(0.8), Inches(1.35), Inches(11.733), Inches(5.42))
    tb = sl.shapes.add_textbox(Inches(1.2), Inches(1.55), Inches(10.933), Inches(5.0))
    tf = tb.text_frame
    tf.word_wrap = True

    # Paper Title
    p0 = tf.paragraphs[0]
    r0_tag = p0.add_run()
    r0_tag.text = "PAPER TITLE:  "
    r0_tag.font.name = "Calibri"
    r0_tag.font.size = Pt(13)
    r0_tag.font.bold = True
    r0_tag.font.color.rgb = COLOR_AZURE

    r0_val = p0.add_run()
    r0_val.text = item["title"]
    r0_val.font.name = "Calibri"
    r0_val.font.size = Pt(13)
    r0_val.font.bold = True
    r0_val.font.color.rgb = COLOR_NAVY
    p0.space_after = Pt(4)

    # Authors & Year
    p1 = tf.add_paragraph()
    r1_tag = p1.add_run()
    r1_tag.text = "AUTHOR: "
    r1_tag.font.name = "Calibri"
    r1_tag.font.size = Pt(12)
    r1_tag.font.bold = True
    r1_tag.font.color.rgb = COLOR_SLATE

    r1_val = p1.add_run()
    r1_val.text = f"{item['author']}    |    "
    r1_val.font.name = "Calibri"
    r1_val.font.size = Pt(12)
    r1_val.font.color.rgb = COLOR_SLATE

    r1_yr_tag = p1.add_run()
    r1_yr_tag.text = "YEAR: "
    r1_yr_tag.font.name = "Calibri"
    r1_yr_tag.font.size = Pt(12)
    r1_yr_tag.font.bold = True
    r1_yr_tag.font.color.rgb = COLOR_SLATE

    r1_yr_val = p1.add_run()
    r1_yr_val.text = item["year"]
    r1_yr_val.font.name = "Calibri"
    r1_yr_val.font.size = Pt(12)
    r1_yr_val.font.color.rgb = COLOR_SLATE
    p1.space_after = Pt(12)

    # Description
    p2_head = tf.add_paragraph()
    p2_head.text = "STUDY DESCRIPTION & KEY FINDINGS:"
    p2_head.font.name = "Calibri"
    p2_head.font.size = Pt(11)
    p2_head.font.bold = True
    p2_head.font.color.rgb = COLOR_AZURE
    p2_head.space_after = Pt(2)

    p2_body = tf.add_paragraph()
    p2_body.text = item["desc"]
    p2_body.font.name = "Calibri"
    p2_body.font.size = Pt(12.5)
    p2_body.font.color.rgb = COLOR_SLATE
    p2_body.alignment = PP_ALIGN.JUSTIFY
    p2_body.space_after = Pt(12)

    # Purpose
    p3_head = tf.add_paragraph()
    p3_head.text = "PURPOSE OF REFERRING THIS PAPER FOR MY PROJECT:"
    p3_head.font.name = "Calibri"
    p3_head.font.size = Pt(11)
    p3_head.font.bold = True
    p3_head.font.color.rgb = COLOR_GREEN
    p3_head.space_after = Pt(2)

    p3_body = tf.add_paragraph()
    p3_body.text = item["purpose"]
    p3_body.font.name = "Calibri"
    p3_body.font.size = Pt(12.5)
    p3_body.font.color.rgb = COLOR_SLATE
    p3_body.alignment = PP_ALIGN.JUSTIFY

# =============================================================================
# SLIDES 15-24: 10 UML & System Architecture Diagrams
# =============================================================================
diagram_slides = [
    (15, "System Architecture", "Architecture Diagram", "5-tier architecture connecting presentation, API gateway, core services, sandbox, and storage", "fig_1_system_architecture.png"),
    (16, "UML Modeling", "Use Case Diagram", "Core platform actors (Student, Author, Reviewer, Admin) interacting with 16 system use cases", "fig_2_use_case.png"),
    (17, "Domain Modeling", "Class Diagram", "21-entity domain model capturing users, simulations, tasks, workspaces, submissions, and portfolios", "fig_5_class_domain_model.png"),
    (18, "Runtime Snapshot", "Object Diagram", "Concrete runtime instances of user, company, project, task, workspace, and evaluation records", "fig_object_diagram.png"),
    (19, "Dynamic Interaction", "Sequence Diagram", "Two-phase sequence flow: Automated In-Sandbox Test Execution and AI PR Review Submission", "fig_4_sequence_submission.png"),
    (20, "Structural Communication", "Collaboration Diagram", "Object relationships and ordered message flow during an end-to-end task completion cycle", "fig_collaboration_diagram.png"),
    (21, "Modular Decomposition", "Component Diagram", "Layered software components from Next.js UI through API routes, business logic, and sandbox", "fig_7_component_diagram.png"),
    (22, "Physical Topology", "Deployment Diagram", "Hardware nodes and execution environments: Browser Client, Web App Server, Sandbox Container Host", "fig_8_deployment_diagram.png"),
    (23, "Lifecycle Behavior", "State Chart Diagram", "Task & submission state transitions from prerequisite LOCKED to final TASK_APPROVED", "fig_statechart_diagram.png"),
    (24, "Process Workflow", "Activity Diagram", "Learner journey from role selection through ticket inspection, sandbox coding, tests, and PR review", "fig_3_activity_workflow.png"),
]

for s_idx, tracker, title, subtitle, img_name in diagram_slides:
    add_diagram_slide(s_idx, tracker, title, subtitle, img_name)

# =============================================================================
# SLIDE 25: Conclusion
# =============================================================================
s25 = prs.slides.add_slide(blank_layout)
set_slide_background(s25)
add_header(s25, "Project Conclusion", "Conclusion", "Summary of the WORKUP platform's impact, current prototype, and future roadmap")
add_footer(s25, 25)

card25 = add_card(s25, Inches(0.8), Inches(1.35), Inches(11.733), Inches(5.42))
tb25 = s25.shapes.add_textbox(Inches(1.2), Inches(1.65), Inches(10.933), Inches(4.8))
tf25 = tb25.text_frame
tf25.word_wrap = True

conclusion_sections = [
    ("Summary of Proposed Solution",
     "The proposed WORKUP platform introduces a practical and modern approach to bridging the gap between classroom programming and real-world software engineering. By immersing learners in simulated technology companies with authentic task backlogs, Architecture Decision Records (ADRs), and legacy codebases, the system directly addresses the critical limitations of conventional coding websites that rely on isolated toy problems."),
    ("Current Prototype Achievements",
     "The platform successfully combines zero-setup browser sandboxes, automated in-sandbox testing via Vitest, and AI-assisted code reviews to provide immediate, actionable feedback to learners. As tasks are completed, verifiable Git commit records build an authentic Evidence-of-Skill portfolio for recruiters and educators, ensuring that student abilities are backed by genuine code evidence."),
    ("Future Enhancements & Scalability",
     "This prototype lays a solid architectural foundation for virtual workplace simulations. Future stages will extend the platform with multi-developer team collaboration, distributed Kubernetes sandbox container clusters, live peer code reviews, and specialized tracks in cloud infrastructure, AI engineering, and cybersecurity.")
]

for idx, (title, body) in enumerate(conclusion_sections):
    p_h = tf25.paragraphs[0] if idx == 0 else tf25.add_paragraph()
    p_h.text = title.upper()
    p_h.font.name = "Calibri"
    p_h.font.size = Pt(11)
    p_h.font.bold = True
    p_h.font.color.rgb = COLOR_AZURE
    p_h.space_after = Pt(2)

    p_b = tf25.add_paragraph()
    p_b.text = body
    p_b.font.name = "Calibri"
    p_b.font.size = Pt(12.5)
    p_b.font.color.rgb = COLOR_SLATE
    p_b.alignment = PP_ALIGN.JUSTIFY
    p_b.space_after = Pt(12)

# =============================================================================
# SLIDE 26: References
# =============================================================================
s26 = prs.slides.add_slide(blank_layout)
set_slide_background(s26)
add_header(s26, "Academic Sources", "References", "Key peer-reviewed literature and conference proceedings cited in this review")
add_footer(s26, 26)

card26 = add_card(s26, Inches(0.8), Inches(1.35), Inches(11.733), Inches(5.42))
tb26 = s26.shapes.add_textbox(Inches(1.2), Inches(1.55), Inches(10.933), Inches(5.0))
tf26 = tb26.text_frame
tf26.word_wrap = True

refs_data = [
    ("1", "Navarro, E., & van der Hoek, A. (2007). Comprehensive evaluation of an educational software engineering simulation environment. IEEE Transactions on Software Engineering, 33(6), 409-425."),
    ("2", "Radermacher, A., & Walia, G. (2013). Gaps between industry expectations and university preparation in software engineering. In Proceedings of the 44th ACM Technical Symposium on Computer Science Education (SIGCSE), 525-530."),
    ("3", "Kratzke, N. (2018). Lightweight container isolation for computing education. IEEE Transactions on Education, 61(2), 127-134."),
    ("4", "Bogner, C., Verdecchia, R., & Lago, P. (2021). Automated code review in software engineering: A systematic literature review. IEEE Access, 9, 78241-78262."),
    ("5", "Shepherd, D., Pollock, L., & Vaishnavi, V. K. (2019). Scaffolding software engineering learning through directed acyclic graph workflows. IEEE Transactions on Learning Technologies, 12(3), 341-354.")
]

for idx, (num, text) in enumerate(refs_data):
    p = tf26.paragraphs[0] if idx == 0 else tf26.add_paragraph()
    r_num = p.add_run()
    r_num.text = f"[{num}]  "
    r_num.font.name = "Calibri"
    r_num.font.size = Pt(13)
    r_num.font.bold = True
    r_num.font.color.rgb = COLOR_AZURE

    r_text = p.add_run()
    r_text.text = text
    r_text.font.name = "Calibri"
    r_text.font.size = Pt(12)
    r_text.font.color.rgb = COLOR_SLATE
    p.space_after = Pt(14)

# =============================================================================
# SLIDE 27: Literature Survey Comparative Matrix (Bonus Summary Table)
# =============================================================================
s27 = prs.slides.add_slide(blank_layout)
set_slide_background(s27)
add_header(s27, "Comparative Matrix", "Literature Survey Summary Table", "Structured comparison of studied papers, key methodologies, findings, and relevance to WORKUP")
add_footer(s27, 27)

lit_table_data = [
    ("Navarro & van der Hoek (2007, IEEE TSE)", "SimSE Process Simulation", "Active simulation significantly improves software lifecycle & trade-off understanding.", "Informs WORKUP's virtual company simulations and sprint backlog workflows."),
    ("Radermacher & Walia (2013, ACM SIGCSE)", "Industry Deficiency Survey", "Graduates struggle most with legacy codebases, unit testing, and team code reviews.", "Directly validates WORKUP's focus on legacy code refactoring and PR reviews."),
    ("Kratzke (2018, IEEE Trans. Educ.)", "Lightweight Sandboxes", "Ephemeral container isolation removes local setup friction and prevents security leaks.", "Provides architectural blueprint for path-jailed browser execution & timeout quotas."),
    ("Bogner et al. (2021, IEEE Access)", "Automated Code Review SLR", "Rule-based static analysis & AI reviews catch architectural drift and security bugs early.", "Guides multi-rubric evaluation engine for AI Tech Lead code review feedback."),
    ("Shepherd et al. (2019, IEEE TLT)", "DAG Workflow Scaffolding", "Dependency-gated tasks prevent cognitive overload during complex development.", "Validates prerequisite gating in WORKUP's task dependency engine (DAG).")
]

t_rows = len(lit_table_data) + 1
t_cols = 4
t_shape = s27.shapes.add_table(t_rows, t_cols, Inches(0.8), Inches(1.35), Inches(11.733), Inches(5.42))
tbl = t_shape.table
tbl.columns[0].width = Inches(2.6)
tbl.columns[1].width = Inches(2.0)
tbl.columns[2].width = Inches(3.6)
tbl.columns[3].width = Inches(3.533)

headers = ["PAPER / AUTHOR / YEAR", "APPROACH", "MAIN FINDINGS", "RELEVANCE TO WORKUP"]
for c_idx, h_text in enumerate(headers):
    c = tbl.cell(0, c_idx)
    c.text = h_text
    c.fill.solid()
    c.fill.fore_color.rgb = COLOR_NAVY
    p = c.text_frame.paragraphs[0]
    p.font.name = "Calibri"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = RGBColor(255, 255, 255)

for r_idx, (p_auth, app, find, rel) in enumerate(lit_table_data, start=1):
    bg_row = RGBColor(241, 245, 249) if r_idx % 2 == 0 else RGBColor(255, 255, 255)
    for c_idx, val in enumerate([p_auth, app, find, rel]):
        c = tbl.cell(r_idx, c_idx)
        c.text = val
        c.fill.solid()
        c.fill.fore_color.rgb = bg_row
        p = c.text_frame.paragraphs[0]
        p.font.name = "Calibri"
        p.font.size = Pt(9.5 if c_idx > 0 else 10)
        p.font.bold = (c_idx == 0)
        p.font.color.rgb = COLOR_NAVY if c_idx == 0 else COLOR_SLATE

# =============================================================================
# SLIDE 28: THANK YOU
# =============================================================================
s28 = prs.slides.add_slide(blank_layout)
set_slide_background(s28, RGBColor(15, 34, 56))

# Central Thank You Card
ty_card = add_card(s28, Inches(1.5), Inches(1.2), Inches(10.333), Inches(5.1),
                   border_color=RGBColor(59, 130, 246), bg_color=RGBColor(24, 49, 83))

tb_ty = s28.shapes.add_textbox(Inches(1.8), Inches(1.6), Inches(9.733), Inches(4.3))
tf_ty = tb_ty.text_frame
tf_ty.word_wrap = True

p_ty0 = tf_ty.paragraphs[0]
p_ty0.text = "MAJOR PROJECT REVIEW — STAGE-I"
p_ty0.font.name = "Calibri"
p_ty0.font.size = Pt(12)
p_ty0.font.bold = True
p_ty0.font.color.rgb = RGBColor(96, 165, 250)
p_ty0.alignment = PP_ALIGN.CENTER
p_ty0.space_after = Pt(10)

p_ty1 = tf_ty.add_paragraph()
p_ty1.text = "THANK YOU!"
p_ty1.font.name = "Calibri"
p_ty1.font.size = Pt(48)
p_ty1.font.bold = True
p_ty1.font.color.rgb = RGBColor(255, 255, 255)
p_ty1.alignment = PP_ALIGN.CENTER
p_ty1.space_after = Pt(14)

p_ty2 = tf_ty.add_paragraph()
p_ty2.text = "WORKUP: Virtual Professional Experience Platform"
p_ty2.font.name = "Calibri"
p_ty2.font.size = Pt(16)
p_ty2.font.bold = True
p_ty2.font.color.rgb = RGBColor(147, 197, 253)
p_ty2.alignment = PP_ALIGN.CENTER
p_ty2.space_after = Pt(8)

p_ty3 = tf_ty.add_paragraph()
p_ty3.text = "Special thanks to our Project Guide Mrs. P. Swaroopa, Head of Department Dr. M. V. Vijaya Saradhi,\nand the Department Review Committee for their guidance and support."
p_ty3.font.name = "Calibri"
p_ty3.font.size = Pt(12.5)
p_ty3.font.color.rgb = RGBColor(203, 213, 225)
p_ty3.alignment = PP_ALIGN.CENTER
p_ty3.space_after = Pt(20)

p_ty4 = tf_ty.add_paragraph()
p_ty4.text = "We welcome your valuable feedback and questions."
p_ty4.font.name = "Calibri"
p_ty4.font.size = Pt(14)
p_ty4.font.italic = True
p_ty4.font.color.rgb = RGBColor(110, 231, 183)
p_ty4.alignment = PP_ALIGN.CENTER

# Save PPTX
print(f"Saving 28-slide unified presentation to: {OUT_PPTX}...")
prs.save(OUT_PPTX)
print(f"Successfully generated: {OUT_PPTX} (Size: {os.path.getsize(OUT_PPTX)} bytes)")
