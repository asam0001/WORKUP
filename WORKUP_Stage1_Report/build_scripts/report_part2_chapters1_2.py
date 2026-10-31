# Part 2: Chapter 1 (Introduction) and Chapter 2 (Literature Survey)
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from write_full_report import (
    doc, add_chapter_title, add_heading_1, add_heading_2, add_heading_3,
    add_p, add_bullet, add_figure, add_callout, set_cell_background,
    set_cell_margins, set_table_borders, COLOR_NAVY, COLOR_PRIMARY, COLOR_MUTED
)

def build_chapter_1():
    add_chapter_title("CHAPTER 1\nINTRODUCTION")

    add_heading_1("1.1 Background and Motivation")
    add_p("In contemporary undergraduate computer science and software engineering education, an increasingly acute pedagogical disparity has emerged: the divergence between theoretical curriculum delivery and the pragmatic operational realities of industrial software engineering. While modern academic institutions successfully impart core foundational competencies — such as asymptotic complexity analysis, abstract data structures, relational database normalization, and formal programming syntax — the instructional paradigm remains predominantly conceptual, lecture-oriented, and centered around small, isolated programming assignments.")
    add_p("When undergraduate students complete coursework, their primary exposure to coding typically consists of writing single-file scripts or building Greenfield projects from scratch in an environment unencumbered by real-world enterprise constraints. In marked contrast, practicing corporate software engineers operate within highly structured, collaborative, and socio-technical enterprise ecosystems. An engineer entering the modern technology sector does not write code in a vacuum; they must navigate pre-existing multi-million-line legacy codebases, interpret ambiguous business requirements, adhere to Architecture Decision Records (ADRs), collaborate across cross-functional team topologies, submit pull requests (PRs) subject to rigorous line-by-line review, integrate with automated Continuous Integration/Continuous Deployment (CI/CD) pipelines, and debug live production incidents under operational Service Level Agreements (SLAs).")
    add_p("This fundamental gap produces significant friction during the transition from academia to industry. Corporate onboarding periods for entry-level developers frequently extend to six to nine months, during which employers must remediate basic workflow deficiencies. Furthermore, traditional educational assessment methodologies — such as multiple-choice questions, proctored coding exams, and unverified certificates of course completion — fail to demonstrate authentic engineering competence to recruiters. Motivated by these systemic shortcomings, this project undertakes the research, architectural design, and implementation of WORKUP — a Virtual Professional Experience Platform.")

    add_heading_1("1.2 Project Overview")
    add_p("WORKUP is a containerized, domain-agnostic web platform designed to simulate authentic corporate software engineering environments. Rather than functioning as a conventional Massive Open Online Course (MOOC) with passive video lectures or as a competitive coding platform testing synthetic algorithmic puzzles, WORKUP immerses learners directly into simulated technology enterprises.")
    add_p("Within the platform, a learner does not simply study a subject; they assume an authentic professional identity (e.g., Junior Backend Engineer, Associate MLOps Engineer, Cloud Infrastructure Associate). The learner is assigned to a specific engineering team within a simulated enterprise (such as FinFlow Technologies, a high-volume fintech platform, or OmniRetail Marketplace, a distributed e-commerce system). They receive structured business problem tickets that mirror industrial issue trackers (e.g., Jira or Linear), complete with business impact statements, historical context, technical specifications, and architectural constraints.")
    add_p("To execute their work, learners launch an isolated, cloud-orchestrated development workspace pre-configured with the enterprise's legacy repository, seed datasets, and testing harnesses. Learners implement code modifications, run multi-tier automated test suites inside the sandboxed runtime, and submit their work through a simulated Git pull request mechanism. An automated AI Tech Lead review engine inspects the code diff, assesses compliance against architectural standards, and provides line-anchored formative feedback. Upon successful completion of multi-phase simulation tracks, the platform generates a cryptographically verifiable Evidence-of-Skill Dossier backed by Git commit hashes and execution logs, providing verifiable proof of professional capability.")

    add_callout(
        "WORKUP is strictly defined by the Universal Professional Lifecycle: Career → Role → Company → Business Problem → Professional Task → Real Tools → Cloud Workspace → Implementation → Testing → Review → Deployment → Monitoring → Debugging → Evidence of Skill.",
        "CORE ARCHITECTURAL IDENTITY: "
    )

    add_heading_1("1.3 Problem Formulation and Problem Statement")
    add_p("The central problem addressed by this project can be formulated as follows:")
    add_p("Traditional computing education platforms isolate technical learning into fragmented, decontextualized tasks. Course-based learning delivers abstract theory without authentic execution; algorithmic coding platforms isolate syntax from software architecture; and existing virtual internships rely on static, non-interactive document submissions without live toolchains. Consequently, there is an absence of an integrated, scalable software platform that unifies simulated corporate context, containerized cloud development, automated testing, line-level code review, and verifiable portfolio generation.")
    add_p("Formally, the project seeks to resolve the following core technical and pedagogical questions:")
    add_bullet("Contextual Realism Deficit: ", "How can simulated corporate environments, team charters, and Architectural Decision Records (ADRs) be dynamically modeled in software to provide realistic context for engineering tasks?")
    add_bullet("Execution Environment Heterogeneity: ", "How can an educational platform eliminate local environment configuration overhead while ensuring multi-tenant process isolation, resource throttling, and reproducible test execution?")
    add_bullet("Authentic Formative Evaluation: ", "How can automated evaluation move beyond binary pass/fail test assertions to provide qualitative, line-by-line feedback on code maintainability, security, and architectural compliance?")
    add_bullet("Verifiable Competence Demonstration: ", "How can student engineering output be transformed into tamper-evident, commit-backed dossiers that credibly prove practical skills to employers?")

    add_heading_1("1.4 Objectives of the Project")
    add_p("To address the formulated problem statement, the project establishes the following specific, measurable engineering objectives for Major Project Stage-I and Stage-II:")
    add_bullet("Objective 1 (Domain Schema & Content Engine): ", "Design and implement a relational domain model comprising at least 20 interconnected entities capable of modeling careers, roles, skills, simulated companies, teams, simulations, projects, task backlogs, Directed Acyclic Graph (DAG) dependencies, and audit trails.")
    add_bullet("Objective 2 (Role-Based Access Control & Security): ", "Implement an enterprise-grade authentication and authorization infrastructure supporting four distinct platform roles (Student, Content Author, Reviewer, Administrator) using bcryptjs password hashing and signed JSON Web Tokens (JWT).")
    add_bullet("Objective 3 (Cloud Workspace Orchestration): ", "Architect and implement an automated workspace orchestration service that provisions isolated execution sandboxes, enforces per-student concurrency limits, monitors resource consumption, and handles automated process timeouts.")
    add_bullet("Objective 4 (Multi-Tier Evaluation & Review System): ", "Develop an evaluation pipeline combining deterministic automated test execution (unit and integration suites) with rubric-driven code review capabilities.")
    add_bullet("Objective 5 (Empirical Codebase Validation): ", "Construct a comprehensive automated test harness using Vitest to validate domain integrity, RBAC permissions, process jailing, and timeout enforcement with 100% test pass rate.")
    add_bullet("Objective 6 (Verifiable Evidence Dossier Generation): ", "Design a portfolio generation mechanism that records verified Git commit SHAs, test outputs, and evaluation rubrics into an immutable Evidence-of-Skill record.")

    add_heading_1("1.5 Scope of the Project")
    add_p("Defining a clear system boundary is essential for academic evaluation. The scope of WORKUP is structured across implemented Stage-I deliverables and planned Stage-II enhancements:")
    add_heading_2("Current Stage-I Implementation Scope")
    add_bullet("Full-Stack Web Foundation: ", "Complete Next.js 14 App Router platform with React 18, TypeScript, and responsive Tailwind CSS user interfaces.")
    add_bullet("Database Architecture: ", "Prisma ORM 5.x configured with a 21-entity relational schema operating on SQLite (dev.db) with seamless migration path to PostgreSQL.")
    add_bullet("RBAC Security: ", "Complete session management, HTTP-only secure cookie transport, and route-level authorization guards for all four user roles.")
    add_bullet("Simulation & DAG Engine: ", "Catalog explorer for career families, professions, roles, and company simulations with prerequisite dependency enforcement.")
    add_bullet("Workspace Orchestration Engine: ", "Process-isolated execution provider (IsolatedSandboxProvider) with directory jailing, concurrency limits, and 4000ms execution timeout enforcement.")
    add_bullet("Flagship Track Prototype: ", "Seed data provisioning the FinFlow Technologies Payment Webhook Idempotency track (FF-104) complete with simulated ADRs and test harnesses.")
    add_bullet("Automated Verification: ", "34 passing automated tests across 8 test suites validating authentication, domain constraints, input sanitization, and workspace lifecycle.")

    add_heading_2("Planned Stage-II Scope (Future Expansion)")
    add_bullet("Remote Container Fleets: ", "Transition from local process jailing to remote Kubernetes / Docker container fleets utilizing DevContainer specifications.")
    add_bullet("Multi-Turn AI Tech Lead: ", "Integration of Large Language Model (LLM) agents operating on Git unified diffs for automated line-by-line pull request code reviews.")
    add_bullet("Synthetic Telemetry & Incident Injection: ", "Simulated Grafana metrics and synthetic alert firing for real-time production incident response simulations.")
    add_bullet("Public Cryptographic Verification: ", "Public web verification endpoint serving signed SHA-256 evidence dossiers for external recruiter verification.")

    add_heading_1("1.6 Existing Systems and Approaches")
    add_p("Current approaches to technical education and workforce skill development fall into four predominant categories:")
    add_bullet("Massive Open Online Courses (MOOCs): ", "Platforms such as Coursera, edX, and Udemy deliver asynchronous video lectures accompanied by automated multiple-choice quizzes and occasional unproctored coding assignments.")
    add_bullet("Competitive Programming Platforms: ", "Platforms such as LeetCode, HackerRank, and Codeforces provide browser-based code editors evaluating short algorithmic solutions against hidden input-output test cases.")
    add_bullet("Project-Based Developer Courses: ", "Platforms such as Crio.Do offer structured, milestone-driven developer workbooks where learners build multi-file applications following sequential instructions.")
    add_bullet("Corporate Virtual Internships: ", "Platforms such as Forage (formerly InsideSherpa) offer company-branded virtual work experience programs consisting of video prompts and static assignment submissions.")

    add_heading_1("1.7 Limitations of Existing Approaches")
    add_p("While each existing approach offers specific merits, all suffer from critical limitations when evaluated against the requirements of corporate software engineering:")
    add_bullet("Passive Pedagogical Mode: ", "MOOCs foster passive content consumption; learners watch instructors code rather than engaging in hands-on problem solving, resulting in extremely high course attrition rates (typically exceeding 85%).")
    add_bullet("Decontextualized Toy Problems: ", "Competitive programming platforms test synthetic puzzles in single-file environments. They provide zero exposure to software architecture, legacy codebases, design patterns, dependency management, or software testing frameworks.")
    add_bullet("Absence of Authentic Team Workflows: ", "Existing platforms omit corporate collaborative mechanisms. Students do not read Architecture Decision Records, navigate team hierarchies, manage Git branches, submit pull requests, or receive constructive line-level peer reviews.")
    add_bullet("Static, Non-Interactive Submissions: ", "Virtual internship platforms rely on static document uploads (e.g., submitting Word documents or slide decks). They provide zero interactive cloud development environments, no automated code execution, and no live test validation.")
    add_bullet("Unverifiable Credentials: ", "Traditional digital certificate badges simply state that a student clicked through course videos. They provide no cryptographic proof, commit history, or verifiable test logs to substantiate genuine competence to prospective employers.")

    add_heading_1("1.8 Proposed WORKUP System and Key Innovations")
    add_p("WORKUP directly overcomes these limitations through four core architectural and pedagogical innovations:")
    add_bullet("Situated Workplace Simulation: ", "WORKUP grounds learning in authentic organizational context. Students enter simulated companies with defined architectures, tech stacks, and team charters, resolving realistic business problems rather than abstract puzzles.")
    add_bullet("Zero-Install Containerized Workspaces: ", "Through automated workspace orchestration, learners launch containerized environments directly from their browser, eliminating environment configuration friction while guaranteeing reproducible execution.")
    add_bullet("Integrated Lifecycle Workflow: ", "The platform unifies the complete development lifecycle: ticket inspection → legacy code investigation → workspace implementation → automated test verification → Git pull request submission → AI Tech Lead review.")
    add_bullet("Tamper-Evident Evidence of Skill: ", "Completed simulations produce an immutable Evidence-of-Skill Dossier linked to verified Git commit SHAs, automated test outputs, and rubric scores, providing recruiters with credible proof of ability.")

    add_heading_1("1.9 Expected Benefits and Pedagogical Impact")
    add_p("The deployment of WORKUP offers transformative benefits across three key stakeholder groups:")
    add_bullet("For Engineering Students: ", "Drastically shortens the transition from academia to industry by providing realistic exposure to enterprise codebases, testing practices, and PR review workflows; builds a verified, job-ready portfolio.")
    add_bullet("For Academic Institutions: ", "Equips universities with an automated, scalable experiential learning lab that bridges the gap between theoretical curricula and ABET/ACM industry accreditation standards without requiring faculty overhead.")
    add_bullet("For Industry Employers: ", "Significantly reduces entry-level onboarding time and hiring risk by replacing unverifiable resume buzzwords with commit-backed, rubric-evaluated Evidence-of-Skill dossiers.")

    add_heading_1("1.10 Feasibility, Assumptions, and Constraints")
    add_p("The feasibility of WORKUP is demonstrated across technical, operational, and economic dimensions:")
    add_bullet("Technical Feasibility: ", "The application is built on proven, production-grade technologies — Next.js 14, React 18, TypeScript, and Prisma ORM. Local process jailing has been fully implemented and verified via automated Vitest suites.")
    add_bullet("Operational Feasibility: ", "The system operates seamlessly on standard commodity hardware (Node.js 18+, local SQLite database), requiring zero costly cloud subscriptions during academic demonstration and development.")
    add_bullet("Economic Feasibility: ", "By utilizing open-source runtimes and local container sandboxing for the Stage-I prototype, development incurs zero licensing costs. Future cloud scaling utilizes container hibernation and compute quotas to ensure strict cost control.")
    add_bullet("System Constraints: ", "Stage-I is bounded to single-node server environments and local process execution; multi-tenant Kubernetes clustering and third-party LLM API integration are intentionally designated as Stage-II deliverables.")

    doc.add_page_break()

def build_chapter_2():
    add_chapter_title("CHAPTER 2\nLITERATURE SURVEY")

    add_heading_1("2.1 Introduction to the Research Area")
    add_p("The theoretical foundation of this project is situated at the intersection of three major computing and educational research domains: Experiential and Work-Integrated Learning (WIL), Project-Based Software Engineering Education, and Cloud Development Environments. Over the past three decades, educational researchers and computing pedagogues have continuously highlighted the inadequacy of static lectures for imparting software development competence. To establish a rigorous scholarly basis for WORKUP, this chapter conducts a comprehensive literature survey of foundational learning theories, empirical software engineering education studies, and modern cloud/AI evaluation platforms.")

    add_heading_1("2.2 Review of Relevant Academic Research Papers")

    add_heading_2("2.2.1 Simulation in Software Engineering Education")
    add_p("A landmark contribution to simulation-based computing pedagogy was established by Navarro and van der Hoek [1] in their seminal work on SimSE. The authors recognized that traditional software engineering courses suffer from severe time constraints: within a single academic semester, students cannot realistically experience the multi-month consequences of poor architectural decisions, scope creep, personnel turnover, or inadequate testing.")
    add_p("To address this, the authors created SimSE, an interactive graphical educational simulation game where students assume the role of a software project manager. Learners allocate budgets, assign developers to lifecycle phases (Waterfall, Prototyping, Agile), and manage process trade-offs. While empirical multi-site evaluations proved that SimSE dramatically enhanced student understanding of software process dynamics, the authors acknowledged a fundamental limitation: SimSE is strictly a high-level managerial simulation. Students manipulate abstract UI controls rather than writing, debugging, testing, or committing actual source code. WORKUP directly builds upon SimSE's process simulation concept but bridges the critical gap by integrating real code repositories, cloud IDE workspaces, and automated test runners.")
    add_p("Similarly, Sharp and Hall [2] introduced the concept of an \"Interactive Software House Simulation\" for graduate computing students. The authors created \"RunCo,\" a simulated multimedia enterprise where students assumed specific corporate roles (systems analyst, programmer, quality assurance engineer) and responded to stakeholder memos, customer complaints, and design constraints. Their empirical findings showed that role-based organizational immersion drastically heightened student appreciation for software quality and inter-team communication. However, developed during the multimedia CD-ROM era, the system lacked integrated cloud compilers, automated pull request workflows, and live execution sandboxes — capabilities that WORKUP realizes through modern web technologies.")

    add_heading_2("2.2.2 Industry-Academia Skill Deficits")
    add_p("The necessity for realistic workplace platforms is underscored by the systematic literature review conducted by Radermacher and Walia [3]. Analyzing dozens of empirical studies across industry and academia, the authors categorized the primary skill deficits observed in newly graduated computer science students upon entering the software industry. Their findings revealed that while graduates possess acceptable theoretical knowledge of algorithms and syntax, they demonstrate profound deficiencies in: (1) navigating large, pre-existing legacy codebases; (2) writing comprehensive unit and integration tests; (3) participating in code reviews and version control branching strategies; and (4) translating ambiguous business problems into technical architectures. The authors concluded that academic curricula must incorporate authentic industry tools and workflows. Radermacher and Walia's findings provide empirical validation for the specific feature set engineered into WORKUP.")
    add_p("Reinforcing these conclusions, Garousi et al. [6] evaluated an industry-academia collaborative model designed to close the graduate skill gap. By embedding industrial issue tracking, Architectural Decision Records (ADRs), and mandatory pull request code reviews into university capstone courses, the authors observed a 40% reduction in corporate onboarding time and a marked improvement in student architectural maturity. However, the authors noted that manual industry-academia partnerships are notoriously difficult to scale across large student cohorts due to sponsor availability constraints. WORKUP addresses this scalability bottleneck by automating the simulated company, task backlogs, and code review processes in software.")

    add_heading_2("2.2.3 Lightweight Containerization and Cloud Workspaces")
    add_p("A core technical challenge in hands-on computing education is environment configuration friction. Kratzke [4] conducted a rigorous empirical evaluation on the suitability of lightweight containerization (Docker) for programming education. The author documented that computer science instructors frequently spend over 25% of laboratory time troubleshooting heterogeneous student operating system issues (\"it works on my machine\" syndrome). Furthermore, executing untrusted student code on centralized grading servers presents severe security risks.")
    add_p("Kratzke demonstrated that containerized microservice architectures provide near-native execution speed, complete multi-tenant filesystem isolation, bounded CPU/RAM resource quotas, and 100% reproducible execution pipelines across diverse host environments. Kratzke's research serves as the architectural foundation for WORKUP's workspace orchestration engine, justifying the implementation of directory-jailed process sandboxes with strict execution timeouts and resource caps.")

    add_heading_2("2.2.4 Formative Code Review via Large Language Models")
    add_p("Traditional automated grading systems rely exclusively on unit test assertions (pass/fail), providing zero qualitative guidance regarding code style, architectural anti-patterns, or maintainability. MacNeil et al. [5] investigated the generation of automated formative code feedback using Large Language Models (LLMs). The authors integrated an LLM pipeline to analyze student code submissions against reference solutions and test traces, generating natural language, line-anchored explanations.")
    add_p("Their empirical evaluations revealed that LLM-generated formative feedback significantly accelerated student debugging and encouraged self-regulated refactoring without prematurely revealing solutions. However, the authors highlighted critical risks: LLMs frequently hallucinate or generate overly generic suggestions when unconstrained. To maintain feedback accuracy, the authors emphasized the necessity of grounding LLM reviews in deterministic test outputs and strict rubric constraints. This insight directly informs WORKUP's AI Tech Lead architecture, which combines deterministic Vitest execution results with structured rubric scoring.")

    add_heading_2("2.2.5 Foundational Learning Theories")
    add_p("WORKUP's educational design is anchored in two foundational learning theories: David Kolb's Experiential Learning Theory [7] and Jean Lave and Etienne Wenger's Theory of Situated Cognition [8].")
    add_p("Kolb's Experiential Learning Cycle posits that authentic learning occurs through a continuous four-stage spiral: (1) Concrete Experience; (2) Reflective Observation; (3) Abstract Conceptualization; and (4) Active Experimentation. WORKUP maps directly onto Kolb's cycle: learners engage in Concrete Experience by writing code inside containerized workspaces; engage in Reflective Observation by analyzing test failure traces and line-level PR reviews; undergo Abstract Conceptualization by studying Architecture Decision Records (ADRs) and business problem specifications; and practice Active Experimentation by refactoring implementations and resolving simulated production incidents.")
    add_p("Similarly, Lave and Wenger's Situated Cognition theory demonstrates that learning is inherently situated within cultural and social contexts. Knowledge acquired in decontextualized environments (such as solving synthetic algorithmic puzzles on LeetCode) does not transfer effectively to complex social practice. By embedding learners within simulated engineering teams with distinct cultures, tech leads, and architectural debt, WORKUP operationalizes situated learning for the digital computing era.")

    add_heading_1("2.3 Review of Existing Commercial and Industrial Platforms")
    add_p("In addition to academic literature, current commercial and open-source platforms were investigated to establish state-of-the-art benchmarks:")
    add_bullet("Crio.Do: ", "A developer-focused applied learning platform where students build real-world software applications (e.g., QBox, QMoney, QEats) through structured milestone workbooks. While Crio.Do successfully transitions students to multi-file projects, it lacks simulated enterprise company context, has no team topologies, omits Architectural Decision Records (ADRs), does not simulate pull request reviews, and provides no synthetic production telemetry.")
    add_bullet("Forage (formerly InsideSherpa): ", "A platform offering free virtual work experience programs co-branded with multinational enterprises (e.g., JPMorgan Chase, Accenture). While Forage provides excellent corporate problem descriptions, it is completely non-interactive: students submit static documents (PowerPoints or ZIP files) without a live development workspace, automated test execution, or line-by-line feedback.")
    add_bullet("LeetCode and HackerRank: ", "Competitive programming platforms focused strictly on Data Structures and Algorithms (DSA). Solutions are evaluated against hidden test cases in single-file browser editors. While highly scalable, they are entirely detached from real-world software engineering practices.")
    add_bullet("GitHub Codespaces and Gitpod: ", "Cloud-hosted development environments providing browser-based VS Code running inside Docker containers. While offering exceptional developer tooling, they are pure infrastructure platforms devoid of pedagogical scaffolding, task dependencies, or automated evaluation rubrics.")

    add_heading_1("2.4 Comprehensive Comparative Analysis Matrix")
    add_p("To clearly distinguish WORKUP from existing platforms and highlight its multi-faceted architectural synthesis, Table 2.1 presents a comprehensive comparative analysis across eight key educational and technical dimensions:")

    p_tab = doc.add_paragraph()
    p_tab.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_tab.paragraph_format.space_before = Pt(8)
    p_tab.paragraph_format.space_after = Pt(2)
    run_tc = p_tab.add_run("Table 2.1: Comprehensive Comparative Analysis of Existing Platforms vs. Proposed WORKUP Platform.")
    run_tc.font.name = 'Times New Roman'
    run_tc.font.size = Pt(10)
    run_tc.font.bold = True
    run_tc.font.italic = True
    run_tc.font.color.rgb = COLOR_NAVY

    table_comp = doc.add_table(rows=7, cols=6)
    table_comp.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_comp.autofit = False
    
    col_widths = [Inches(1.2), Inches(1.0), Inches(1.0), Inches(1.0), Inches(1.0), Inches(1.07)]
    for row in table_comp.rows:
        for idx, width in enumerate(col_widths):
            row.cells[idx].width = width

    set_table_borders(table_comp, color="cbd5e1", sz="4")

    headers = ["Dimension / Feature", "MOOCs (Coursera)", "Coding (LeetCode)", "Projects (Crio.Do)", "Sims (Forage)", "Proposed WORKUP"]
    for idx, h_text in enumerate(headers):
        cell = table_comp.cell(0, idx)
        set_cell_background(cell, "1e3a8a")
        set_cell_margins(cell, top=80, bottom=80, left=80, right=80)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h_text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(9.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    matrix_data = [
        ("Learning Mode", "Passive video lectures & quizzes", "Isolated single-file puzzles", "Sequential project workbooks", "Static case study uploads", "Simulated enterprise tasks"),
        ("Corporate Context", "None / Generic examples", "None (Synthetic math/DSA)", "Generic app domains", "High (Executive videos)", "High (Companies, teams, ADRs)"),
        ("Development Runtime", "Local install required", "Browser sandbox (single-file)", "Local or web terminal", "None (Static file upload)", "Isolated cloud workspace"),
        ("Task Flow & DAG", "Linear video chapters", "Independent tagged problems", "Sequential sprints", "Linear task lists", "Directed Acyclic Graph (DAG)"),
        ("Evaluation Engine", "Multiple choice / Peer review", "Automated I/O unit tests", "Automated test scripts", "Self-comparison model answer", "Multi-tier tests + AI PR review"),
        ("Skill Evidence", "Unverified PDF certificate", "Contest rating score", "Portfolio summary", "Completion certificate", "Verified Git Commit Dossier")
    ]

    for row_idx, row_data in enumerate(matrix_data):
        row = table_comp.rows[row_idx + 1]
        bg_color = "f8fafc" if row_idx % 2 == 1 else "ffffff"
        for col_idx, cell_value in enumerate(row_data):
            cell = row.cells[col_idx]
            set_cell_background(cell, bg_color)
            set_cell_margins(cell, top=60, bottom=60, left=60, right=60)
            p = cell.paragraphs[0]
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(cell_value)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(9)
            if col_idx == 0:
                r.font.bold = True
                r.font.color.rgb = COLOR_PRIMARY
            elif col_idx == 5:
                r.font.bold = True
                r.font.color.rgb = COLOR_NAVY

    p_after_t = doc.add_paragraph()
    p_after_t.paragraph_format.space_after = Pt(8)

    add_heading_1("2.5 Identified Research and Architectural Gaps")
    add_p("Synthesizing the academic literature and industrial landscape reveals three major unaddressed research and architectural gaps:")
    add_bullet("Gap 1: The Workflow Synthesis Gap. ", "Existing platforms isolate technical education into fragmented silos: LeetCode isolates algorithmic syntax, Coursera isolates conceptual knowledge, Crio.Do isolates project implementation, and Codespaces isolates raw cloud infrastructure. No existing platform synthesizes the entire connected lifecycle: reading an ADR → investigating legacy code → opening an isolated cloud workspace → writing code against acceptance criteria → executing local test suites → submitting a Git pull request → undergoing an AI Tech Lead code review → deploying to staging → responding to production telemetry alerts.")
    add_bullet("Gap 2: The Authentic Assessment Gap. ", "Current automated evaluation is predominantly binary (pass/fail assertions on function outputs). In enterprise engineering, however, software quality encompasses code maintainability, security standards, adherence to architectural constraints, and clear PR documentation. There is an absence of automated educational systems that evaluate full pull requests through multi-dimensional rubrics with line-by-line feedback.")
    add_bullet("Gap 3: The Verifiable Competence Gap. ", "Traditional educational credentials (such as course completion certificates) fail to provide recruiters with verifiable evidence of practical ability. There is an acute need for a platform that generates tamper-evident, commit-backed dossiers linking verified competencies directly to real Git commit SHAs, test logs, and reviewer rubric scores.")

    add_heading_1("2.6 Justification and Formulation of the Proposed System")
    add_p("The formulation of WORKUP is directly justified as a comprehensive solution to these identified gaps. By engineering an integrated system that combines a 21-entity relational domain model, a Directed Acyclic Graph (DAG) task engine, containerized cloud workspace orchestration, multi-tier automated test harnesses, AI-assisted PR reviews, and cryptographically verifiable portfolios, WORKUP creates a controlled, realistic environment where students can experience, practice, fail at, fix, and demonstrate professional engineering work before entering the software industry.")

    doc.add_page_break()

print("Chapter 1 and Chapter 2 builder created.")
