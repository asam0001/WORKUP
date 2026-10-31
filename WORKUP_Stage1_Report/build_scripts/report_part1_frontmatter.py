# Part 1: Front Matter with Exact Verified Page Numbers
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from write_full_report import (
    doc, add_chapter_title, add_heading_1, add_heading_2, add_heading_3,
    add_p, add_bullet, add_figure, add_callout, set_cell_background,
    set_cell_margins, set_table_borders, COLOR_NAVY, COLOR_PRIMARY, COLOR_MUTED
)

def build_front_matter():
    # 1. Title Page
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_before = Pt(12)
    p_inst.paragraph_format.space_after = Pt(4)
    run_inst = p_inst.add_run("DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING\n[INSTITUTION / UNIVERSITY NAME]")
    run_inst.font.name = 'Times New Roman'
    run_inst.font.size = Pt(13)
    run_inst.font.bold = True
    run_inst.font.color.rgb = COLOR_NAVY

    p_stage = doc.add_paragraph()
    p_stage.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_stage.paragraph_format.space_before = Pt(36)
    p_stage.paragraph_format.space_after = Pt(12)
    run_stage = p_stage.add_run("A MAJOR PROJECT STAGE-I REPORT ON\n")
    run_stage.font.name = 'Times New Roman'
    run_stage.font.size = Pt(12)
    run_stage.font.bold = True
    run_stage.font.color.rgb = COLOR_MUTED

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(8)
    p_title.paragraph_format.space_after = Pt(12)
    run_title = p_title.add_run("WORKUP: VIRTUAL PROFESSIONAL EXPERIENCE PLATFORM")
    run_title.font.name = 'Times New Roman'
    run_title.font.size = Pt(18)
    run_title.font.bold = True
    run_title.font.color.rgb = COLOR_NAVY

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(4)
    p_sub.paragraph_format.space_after = Pt(36)
    run_sub = p_sub.add_run("A Containerized Simulation Environment for Situated Software Engineering Education, Authentic Team Workflows, and Cryptographically Verifiable Skill Demonstration")
    run_sub.font.name = 'Times New Roman'
    run_sub.font.size = Pt(11.5)
    run_sub.font.italic = True
    run_sub.font.color.rgb = COLOR_MUTED

    p_req = doc.add_paragraph()
    p_req.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_req.paragraph_format.space_before = Pt(16)
    p_req.paragraph_format.space_after = Pt(36)
    run_req = p_req.add_run("Submitted in partial fulfillment of the requirements for the award of the degree of\nBACHELOR OF TECHNOLOGY\nin\nCOMPUTER SCIENCE AND ENGINEERING")
    run_req.font.name = 'Times New Roman'
    run_req.font.size = Pt(11)
    run_req.font.bold = True

    # Student & Supervisor Table
    table_meta = doc.add_table(rows=2, cols=2)
    table_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_meta.columns[0].width = Inches(3.1)
    table_meta.columns[1].width = Inches(3.1)

    c_sub_by = table_meta.cell(0, 0)
    p_sb = c_sub_by.paragraphs[0]
    p_sb.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r1 = p_sb.add_run("SUBMITTED BY:\n")
    r1.font.bold = True
    r1.font.size = Pt(10.5)
    r2 = p_sb.add_run("[Student Name]\nRoll No: [Roll Number / USN]")
    r2.font.size = Pt(11)

    c_sup = table_meta.cell(0, 1)
    p_sp = c_sup.paragraphs[0]
    p_sp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r3 = p_sp.add_run("UNDER THE GUIDANCE OF:\n")
    r3.font.bold = True
    r3.font.size = Pt(10.5)
    r4 = p_sp.add_run("[Supervisor Name]\n[Supervisor Designation]\nDept. of Computer Science & Engineering")
    r4.font.size = Pt(11)

    p_year = doc.add_paragraph()
    p_year.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_year.paragraph_format.space_before = Pt(40)
    p_year.paragraph_format.space_after = Pt(0)
    run_yr = p_year.add_run("ACADEMIC YEAR 2026–2027")
    run_yr.font.name = 'Times New Roman'
    run_yr.font.size = Pt(11.5)
    run_yr.font.bold = True
    run_yr.font.color.rgb = COLOR_NAVY

    doc.add_page_break()

    # 2. Certificate Page
    add_chapter_title("CERTIFICATE")
    add_p("This is to certify that the Major Project Stage-I Report entitled \"WORKUP: Virtual Professional Experience Platform\" is a bonafide record of technical work carried out by [Student Name] (Roll Number: [Roll Number / USN]), in partial fulfillment of the requirements for the award of the degree of Bachelor of Technology in Computer Science and Engineering from [Institution / University Name] during the academic year 2026–2027.")
    add_p("The results embodied in this report have been verified through actual codebase inspection, architectural modeling, and automated test execution. The work has not been submitted to any other University or Institution for the award of any degree or diploma.")

    p_sig = doc.add_paragraph()
    p_sig.paragraph_format.space_before = Pt(70)
    p_sig.paragraph_format.space_after = Pt(0)
    
    t_sig = doc.add_table(rows=1, cols=2)
    t_sig.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_sig.columns[0].width = Inches(3.1)
    t_sig.columns[1].width = Inches(3.1)
    
    c_s1 = t_sig.cell(0, 0)
    p_s1 = c_s1.paragraphs[0]
    p_s1.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r_s1 = p_s1.add_run("_______________________________\n[Supervisor Name]\nInternal Guide & Supervisor\nDepartment of CSE")
    r_s1.font.bold = True
    r_s1.font.size = Pt(11)

    c_s2 = t_sig.cell(0, 1)
    p_s2 = c_s2.paragraphs[0]
    p_s2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_s2 = p_s2.add_run("_______________________________\n[Head of Department Name]\nHead of Department\nDepartment of CSE")
    r_s2.font.bold = True
    r_s2.font.size = Pt(11)

    doc.add_page_break()

    # 3. Student Declaration
    add_chapter_title("CANDIDATE DECLARATION")
    add_p("I, [Student Name], student of Bachelor of Technology in the Department of Computer Science and Engineering at [Institution / University Name], hereby declare that the work presented in this Major Project Stage-I Report entitled \"WORKUP: Virtual Professional Experience Platform\" is an authentic record of our own research, system design, architectural modeling, and prototype implementation.")
    add_p("I confirm that the facts, database models, testing results, and system flows described in this report strictly reflect the verified source code repository and original architectural specifications. I have adhered to all academic integrity guidelines and have fully cited all external literature, tools, and platforms consulted.")
    
    p_dec_sig = doc.add_paragraph()
    p_dec_sig.paragraph_format.space_before = Pt(60)
    p_dec_sig.paragraph_format.space_after = Pt(0)
    p_dec_sig.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_ds = p_dec_sig.add_run("_______________________________\n[Student Name]\nRoll No: [Roll Number / USN]\nB.Tech (CSE), Final Year")
    r_ds.font.bold = True
    r_ds.font.size = Pt(11)

    doc.add_page_break()

    # 4. Acknowledgements
    add_chapter_title("ACKNOWLEDGEMENTS")
    add_p("I express my profound gratitude and indebtedness to my project guide and supervisor, [Supervisor Name], for their invaluable guidance, constant motivation, insightful suggestions, and technical critiques throughout the formulation, architecture design, and initial implementation phases of this Major Project.")
    add_p("I extend my sincere thanks to [Head of Department Name], Head of the Department of Computer Science and Engineering, for providing the necessary computing facilities, laboratory resources, and academic environment conducive to advanced technical research.")
    add_p("I also convey my deep appreciation to all faculty members, technical staff, and project coordinators of the Department of Computer Science and Engineering for their continuous encouragement, timely reviews, and constructive feedback during departmental project evaluations.")
    add_p("Finally, I am profoundly grateful to my family and peers for their unfailing encouragement, patience, and support throughout the course of this engineering endeavor.")

    doc.add_page_break()

    # 5. Abstract
    add_chapter_title("ABSTRACT")
    add_p("A pronounced gap currently exists between theoretical computer science education and practical corporate software engineering. While conventional learning platforms (such as MOOCs and competitive programming websites) successfully convey isolated algorithmic concepts and syntax, they leave learners ill-prepared for corporate engineering realities. Newly graduated engineers frequently struggle when confronted with pre-existing multi-file legacy repositories, Architecture Decision Records (ADRs), non-trivial technical debt, multi-stage CI/CD pipelines, line-level pull request (PR) reviews, and live production telemetry alerts.")
    add_p("To overcome these systemic shortcomings, this project introduces WORKUP — a production-grade Virtual Professional Experience Platform. Grounded in David Kolb's Experiential Learning Theory and Situated Cognition, WORKUP transitions students from passive content consumers to active practicing engineers inside simulated corporate workplaces. Instead of solving toy programming problems, learners select engineering career tracks (spanning Software Engineering, MLOps, Cloud/DevOps, and Cybersecurity), assume specialized roles, and enter simulated tech enterprises (e.g., FinFlow Technologies, OmniRetail). They receive structured business problem tickets, open containerized cloud workspaces, inspect legacy codebases, implement features adhering to architectural constraints, execute automated test harnesses, submit pull requests, and receive automated, line-anchored feedback from an AI Tech Lead reviewer.")
    add_p("In this Major Project Stage-I phase, the platform's foundational architecture has been researched, designed, implemented, and empirically validated. The system is built upon Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Prisma ORM with a 21-entity relational domain schema, bcryptjs/jose authentication, a 4-tier Role-Based Access Control (RBAC) matrix, a Directed Acyclic Graph (DAG) task engine, and an isolated sandbox execution orchestrator. An automated test suite powered by Vitest achieves a 100% pass rate across 34 tests in 8 suites, validating process jailing, multi-tenant isolation, and schema integrity. WORKUP culminates in an immutable, cryptographically verifiable Evidence-of-Skill Dossier backed by real Git commits, providing recruiters and academic evaluators with tamper-evident proof of practical competence.")

    doc.add_page_break()

    # 6. Table of Contents (With Exact Verified Page Numbers)
    add_chapter_title("TABLE OF CONTENTS")
    
    toc_items = [
        ("Certificate", "ii"),
        ("Candidate Declaration", "iii"),
        ("Acknowledgements", "iv"),
        ("Abstract", "v"),
        ("Table of Contents", "vi"),
        ("List of Figures", "ix"),
        ("List of Tables", "x"),
        ("List of Abbreviations", "xi"),
        ("CHAPTER 1: INTRODUCTION", "13"),
        ("  1.1 Background and Motivation", "13"),
        ("  1.2 Project Overview: WORKUP Platform", "14"),
        ("  1.3 Problem Formulation and Problem Statement", "14"),
        ("  1.4 Objectives of the Project", "15"),
        ("  1.5 Scope of the Project", "16"),
        ("  1.6 Existing Systems and Approaches", "17"),
        ("  1.7 Limitations of Existing Approaches", "17"),
        ("  1.8 Proposed WORKUP System and Key Innovations", "18"),
        ("  1.9 Expected Benefits and Pedagogical Impact", "18"),
        ("  1.10 Feasibility, Assumptions, and Technical Constraints", "19"),
        ("CHAPTER 2: LITERATURE SURVEY", "20"),
        ("  2.1 Introduction to the Research Domain", "20"),
        ("  2.2 Review of Relevant Academic Research Papers", "20"),
        ("  2.3 Review of Existing Commercial and Industrial Platforms", "23"),
        ("  2.4 Comprehensive Comparative Analysis Matrix", "24"),
        ("  2.5 Identified Research and Architectural Gaps", "24"),
        ("  2.6 System Justification and Formulation", "25"),
        ("CHAPTER 3: REQUIREMENTS AND METHODOLOGY", "26"),
        ("  3.1 System Overview", "26"),
        ("  3.2 Target Users and Role Personas", "26"),
        ("  3.3 Functional Requirements Specification (FR-01 to FR-12)", "27"),
        ("  3.4 Non-Functional Requirements Specification (NFR-01 to NFR-08)", "28"),
        ("  3.5 Hardware and Software Specifications", "29"),
        ("  3.6 Technology Stack and Justification", "30"),
        ("  3.7 Software Development Methodology (Iterative Agile)", "31"),
        ("  3.8 Main Operational Workflows", "31"),
        ("  3.9 Data Management, Privacy, and Security Controls", "32"),
        ("  3.10 Feasibility Analysis and Technical Constraints", "32"),
        ("CHAPTER 4: SYSTEM DESIGN AND UML MODELING", "33"),
        ("  4.1 System Architecture & Tiered Topology", "33"),
        ("  4.2 Use Case Modeling", "34"),
        ("  4.3 Activity Modeling", "36"),
        ("  4.4 Sequence Modeling (Task Submission & Review)", "37"),
        ("  4.5 Class and Domain Object Modeling", "38"),
        ("  4.6 Entity-Relationship (ER) Modeling", "40"),
        ("  4.7 Component Modeling", "40"),
        ("  4.8 Deployment Modeling", "41"),
        ("  4.9 Universal Professional Lifecycle Pipeline", "42"),
        ("CHAPTER 5: MODULES AND FUNCTIONAL DESCRIPTION", "44"),
        ("  5.1 Authentication, Session Management, and RBAC Module", "44"),
        ("  5.2 Career, Profession, and Role Explorer Module", "44"),
        ("  5.3 Simulated Enterprise Companies, Teams, and Projects Module", "44"),
        ("  5.4 Simulation Content Engine, Task Backlog, and DAG Module", "45"),
        ("  5.5 Student Workstation, Workbench UI, and Profile Module", "45"),
        ("  5.6 Cloud Workspace Orchestration and Sandbox Provider Module", "45"),
        ("  5.7 Task Implementation, In-Sandbox Test Execution & Snapshot", "46"),
        ("  5.8 Multi-Tier Evaluation, Rubrics & AI Tech Lead Reviewer", "46"),
        ("  5.9 Cryptographically Verifiable Portfolio & Evidence-of-Skill", "46"),
        ("  5.10 Content Authoring Studio and Administrative Governance", "46"),
        ("  5.11 Platform Auditing, Telemetry, and Fleet Monitoring", "47"),
        ("CHAPTER 6: IMPLEMENTATION PLAN AND EXPECTED OUTCOMES", "48"),
        ("  6.1 Current Implementation Status (Verified Codebase Facts)", "48"),
        ("  6.2 Phased Milestone Roadmap (Phases 0 through 12)", "48"),
        ("  6.3 Testing and Validation Approach (Vitest Empirical Results)", "49"),
        ("  6.4 Expected Quantitative and Qualitative Outcomes", "50"),
        ("  6.5 Risk Management, Threat Modeling, and Mitigation", "51"),
        ("  6.6 Current System Limitations and Technical Debt", "52"),
        ("  6.7 Proposed Stage-II Enhancements", "52"),
        ("CONCLUSION AND FUTURE WORK", "53"),
        ("REFERENCES", "54"),
        ("APPENDICES", "56"),
        ("  Appendix A: Complete Database Schema Data Dictionary", "56"),
        ("  Appendix B: Core RESTful API Endpoint Specifications", "57"),
        ("  Appendix C: Sample Architectural Decision Record (ADR-001)", "57")
    ]

    t_toc = doc.add_table(rows=len(toc_items), cols=2)
    t_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_toc.columns[0].width = Inches(5.4)
    t_toc.columns[1].width = Inches(0.87)
    set_table_borders(t_toc, color="e2e8f0", sz="2")

    for idx, (item_title, page_no) in enumerate(toc_items):
        cell_t = t_toc.cell(idx, 0)
        cell_p = t_toc.cell(idx, 1)
        set_cell_margins(cell_t, top=40, bottom=40, left=60, right=60)
        set_cell_margins(cell_p, top=40, bottom=40, left=60, right=60)
        
        p_t = cell_t.paragraphs[0]
        p_t.paragraph_format.line_spacing = 1.15
        p_t.paragraph_format.space_after = Pt(0)
        r_t = p_t.add_run(item_title)
        r_t.font.name = 'Times New Roman'
        r_t.font.size = Pt(10)
        if item_title.startswith("CHAPTER") or item_title in ["CONCLUSION AND FUTURE WORK", "REFERENCES", "APPENDICES"]:
            r_t.font.bold = True
            r_t.font.color.rgb = COLOR_NAVY

        p_p = cell_p.paragraphs[0]
        p_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p_p.paragraph_format.line_spacing = 1.15
        p_p.paragraph_format.space_after = Pt(0)
        r_p = p_p.add_run(page_no)
        r_p.font.name = 'Times New Roman'
        r_p.font.size = Pt(9.5)
        r_p.font.color.rgb = COLOR_MUTED

    doc.add_page_break()

    # 7. List of Figures (With Exact Verified Page Numbers)
    add_chapter_title("LIST OF FIGURES")
    figures_list = [
        ("Figure 4.1", "WORKUP Tiered System Architecture Diagram (Client, API, Services, Execution, Storage)", "33"),
        ("Figure 4.2", "WORKUP Unified Use Case Diagram (Student, Content Author, Reviewer, Administrator)", "35"),
        ("Figure 4.3", "WORKUP Activity Workflow Diagram (Universal Lifecycle, Branching, Decision Points)", "36"),
        ("Figure 4.4", "WORKUP Sequence Diagram for Task Submission, Sandbox Testing, and AI PR Review", "37"),
        ("Figure 4.5", "WORKUP Core Domain Class Model Diagram (21 Entities, Attributes, Methods, Multiplicity)", "39"),
        ("Figure 4.6", "WORKUP Entity-Relationship (ER) Relational Schema Diagram", "40"),
        ("Figure 4.7", "WORKUP Component Architecture Diagram (App Router, API Handlers, Core Libs, Storage)", "41"),
        ("Figure 4.8", "WORKUP Deployment Topology Diagram (Browser, Next.js Server, Sandbox Host, Persistent DB)", "42"),
        ("Figure 4.9", "The Universal Professional Engineering Lifecycle Pipeline (14-Stage Connected Workflow)", "43")
    ]

    t_lof = doc.add_table(rows=len(figures_list), cols=3)
    t_lof.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_lof.columns[0].width = Inches(1.3)
    t_lof.columns[1].width = Inches(4.2)
    t_lof.columns[2].width = Inches(0.77)
    set_table_borders(t_lof, color="e2e8f0", sz="2")

    for idx, (f_num, f_desc, f_page) in enumerate(figures_list):
        c0 = t_lof.cell(idx, 0); c1 = t_lof.cell(idx, 1); c2 = t_lof.cell(idx, 2)
        set_cell_margins(c0, top=50, bottom=50, left=60, right=60)
        set_cell_margins(c1, top=50, bottom=50, left=60, right=60)
        set_cell_margins(c2, top=50, bottom=50, left=60, right=60)

        p0 = c0.paragraphs[0]; p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(f_num); r0.font.bold = True; r0.font.size = Pt(10); r0.font.color.rgb = COLOR_NAVY
        p1 = c1.paragraphs[0]; p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(f_desc); r1.font.size = Pt(10)
        p2 = c2.paragraphs[0]; p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT; p2.paragraph_format.space_after = Pt(0)
        r2 = p2.add_run(f_page); r2.font.size = Pt(9.5); r2.font.color.rgb = COLOR_MUTED

    doc.add_page_break()

    # 8. List of Tables (With Exact Verified Page Numbers)
    add_chapter_title("LIST OF TABLES")
    tables_list = [
        ("Table 2.1", "Comprehensive Comparative Analysis of Existing Platforms vs. Proposed WORKUP Platform", "24"),
        ("Table 3.1", "Detailed Functional Requirements Specification Matrix (FR-01 to FR-12)", "27"),
        ("Table 3.2", "Non-Functional Requirements and System Quality Attributes (NFR-01 to NFR-08)", "28"),
        ("Table 3.3", "Hardware and Software Environment Specifications", "29"),
        ("Table 3.4", "Technology Stack Components and Engineering Justification Matrix", "30"),
        ("Table 6.1", "Phased Milestone Implementation Roadmap (Phases 0 through 12)", "48"),
        ("Table 6.2", "Vitest Automated Test Suite Execution Summary (34 Tests, 8 Suites, 100% Passing)", "49"),
        ("Table 6.3", "Risk Matrix, Severity Classification, and Engineering Mitigation Strategies", "51"),
        ("Table A.1", "Complete Database Entity Dictionary and Relationship Mapping (21 Prisma Models)", "56")
    ]

    t_lot = doc.add_table(rows=len(tables_list), cols=3)
    t_lot.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_lot.columns[0].width = Inches(1.3)
    t_lot.columns[1].width = Inches(4.2)
    t_lot.columns[2].width = Inches(0.77)
    set_table_borders(t_lot, color="e2e8f0", sz="2")

    for idx, (t_num, t_desc, t_page) in enumerate(tables_list):
        c0 = t_lot.cell(idx, 0); c1 = t_lot.cell(idx, 1); c2 = t_lot.cell(idx, 2)
        set_cell_margins(c0, top=50, bottom=50, left=60, right=60)
        set_cell_margins(c1, top=50, bottom=50, left=60, right=60)
        set_cell_margins(c2, top=50, bottom=50, left=60, right=60)

        p0 = c0.paragraphs[0]; p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(t_num); r0.font.bold = True; r0.font.size = Pt(10); r0.font.color.rgb = COLOR_NAVY
        p1 = c1.paragraphs[0]; p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(t_desc); r1.font.size = Pt(10)
        p2 = c2.paragraphs[0]; p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT; p2.paragraph_format.space_after = Pt(0)
        r2 = p2.add_run(t_page); r2.font.size = Pt(9.5); r2.font.color.rgb = COLOR_MUTED

    doc.add_page_break()

    # 9. List of Abbreviations
    add_chapter_title("LIST OF ABBREVIATIONS")
    abbreviations = [
        ("ADR", "Architecture Decision Record"),
        ("API", "Application Programming Interface"),
        ("AST", "Abstract Syntax Tree"),
        ("CI/CD", "Continuous Integration and Continuous Deployment"),
        ("CLI", "Command Line Interface"),
        ("CPU", "Central Processing Unit"),
        ("DAG", "Directed Acyclic Graph"),
        ("DBMS", "Database Management System"),
        ("DOM", "Document Object Model"),
        ("DSA", "Data Structures and Algorithms"),
        ("ER", "Entity-Relationship"),
        ("HTML", "HyperText Markup Language"),
        ("HTTP", "HyperText Transfer Protocol"),
        ("IDE", "Integrated Development Environment"),
        ("IPC", "Inter-Process Communication"),
        ("JSON", "JavaScript Object Notation"),
        ("JWT", "JSON Web Token"),
        ("LLM", "Large Language Model"),
        ("MLOps", "Machine Learning Operations"),
        ("MOOC", "Massive Open Online Course"),
        ("MVP", "Minimum Viable Product"),
        ("NFR", "Non-Functional Requirement"),
        ("ORM", "Object-Relational Mapping"),
        ("OS", "Operating System"),
        ("PR", "Pull Request"),
        ("QA", "Quality Assurance"),
        ("RAM", "Random Access Memory"),
        ("RBAC", "Role-Based Access Control"),
        ("REST", "Representational State Transfer"),
        ("SHA", "Secure Hash Algorithm"),
        ("SSR", "Server-Side Rendering"),
        ("TLS", "Transport Layer Security"),
        ("UI", "User Interface"),
        ("UML", "Unified Modeling Language"),
        ("URL", "Uniform Resource Locator"),
        ("UX", "User Experience"),
        ("VCS", "Version Control System"),
        ("VUS", "Virtual User Sandbox"),
        ("WIL", "Work-Integrated Learning")
    ]

    t_abb = doc.add_table(rows=len(abbreviations), cols=2)
    t_abb.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_abb.columns[0].width = Inches(1.8)
    t_abb.columns[1].width = Inches(4.47)
    set_table_borders(t_abb, color="e2e8f0", sz="2")

    for idx, (abbr, expansion) in enumerate(abbreviations):
        c0 = t_abb.cell(idx, 0); c1 = t_abb.cell(idx, 1)
        set_cell_margins(c0, top=40, bottom=40, left=60, right=60)
        set_cell_margins(c1, top=40, bottom=40, left=60, right=60)

        p0 = c0.paragraphs[0]; p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(abbr); r0.font.bold = True; r0.font.size = Pt(10); r0.font.color.rgb = COLOR_NAVY
        p1 = c1.paragraphs[0]; p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(expansion); r1.font.size = Pt(10)

    doc.add_page_break()

print("Front matter builder updated with exact page numbers.")
