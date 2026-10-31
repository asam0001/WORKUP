import os
import fitz

diagrams_dir = r"WORKUP_Stage1_Report\diagrams"
os.makedirs(diagrams_dir, exist_ok=True)

def save_and_render(name, svg_content, mmd_content=""):
    svg_path = os.path.join(diagrams_dir, f"{name}.svg")
    png_path = os.path.join(diagrams_dir, f"{name}.png")
    mmd_path = os.path.join(diagrams_dir, f"{name}.mmd")
    
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg_content)
        
    if mmd_content:
        with open(mmd_path, "w", encoding="utf-8") as f:
            f.write(mmd_content)
            
    doc = fitz.open(svg_path)
    page = doc[0]
    pix = page.get_pixmap(dpi=220)
    pix.save(png_path)
    print(f"Generated perfect: {name} ({pix.width}x{pix.height})")

# ==============================================================================
# 1. System Architecture Diagram (Fig 4.1)
# ==============================================================================
mmd_arch = """flowchart TD
    subgraph Tier1["1. CLIENT PRESENTATION TIER (Next.js 14 App Router, React 18, Tailwind CSS)"]
        UI1["Landing Page & Career Explorer"]
        UI2["Student Workstation & Dashboard"]
        UI3["Interactive Cloud Workbench"]
        UI4["Verifiable Evidence Dossier"]
    end

    subgraph Tier2["2. API GATEWAY & SECURITY TIER (Next.js Route Handlers, Zod Validation)"]
        API1["Auth & Session API (bcryptjs, jose)"]
        API2["RBAC Guard API (4 Roles)"]
        API3["Simulations & DAG Content API"]
        API4["Workspace Lifecycle API"]
        API5["Submission & Evaluation API"]
    end

    subgraph Tier3["3. CORE DOMAIN & APPLICATION SERVICES TIER"]
        SVC1["Simulation Content Engine & DAG Engine"]
        SVC2["Workspace Orchestrator (Concurrency & Timeouts)"]
        SVC3["Multi-Tier Evaluation & Rubric Engine"]
        SVC4["AI Tech Lead PR Review Agent"]
    end

    subgraph Tier4["4. WORKSPACE & EXECUTION TIER"]
        EX1["Isolated Sandbox Provider (Directory Jailing)"]
        EX2["Container Workspaces (.workspaces/<id>)"]
        EX3["Test Runner Harness (Vitest / pytest)"]
        EX4["Git VCS (Branches, Diffs, Commit SHAs)"]
    end

    subgraph Tier5["5. PERSISTENCE & STORAGE TIER"]
        DB1["Prisma ORM 5.x Client (Type-Safe)"]
        DB2["Relational Database (SQLite dev.db / PostgreSQL)"]
        DB3["Snapshot & Diff Store (.artifacts/)"]
        DB4["Immutable Audit Event Store"]
    end

    Tier1 --> Tier2
    Tier2 --> Tier3
    Tier3 --> Tier4
    Tier3 --> Tier5
    Tier4 --> Tier5
"""

svg_arch = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 790" width="920" height="790">
  <!-- Background -->
  <rect width="920" height="790" fill="#f8fafc" rx="8" />

  <!-- TIER 1 -->
  <rect x="25" y="20" width="870" height="118" rx="8" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.5" />
  <text x="45" y="44" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#1e3a8a">1. CLIENT PRESENTATION TIER (Next.js 14 App Router, React 18, Tailwind CSS)</text>

  <rect x="45" y="58" width="195" height="64" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="142" y="85" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Landing &amp; Career Explorer</text>
  <text x="142" y="103" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">Role tracks, skills, catalog</text>

  <rect x="260" y="58" width="195" height="64" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="357" y="85" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Student Workstation</text>
  <text x="357" y="103" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">Task tickets, ADRs, backlog</text>

  <rect x="475" y="58" width="195" height="64" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="572" y="85" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Interactive Cloud Workbench</text>
  <text x="572" y="103" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">Editor, test runner, terminal</text>

  <rect x="690" y="58" width="185" height="64" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="782" y="85" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Evidence-of-Skill Dossier</text>
  <text x="782" y="103" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">Verified commits, rubrics</text>

  <!-- Down Arrow 1 -> 2 -->
  <line x1="460" y1="138" x2="460" y2="168" stroke="#3b82f6" stroke-width="2"/>
  <polygon points="455,165 460,172 465,165" fill="#3b82f6"/>

  <!-- TIER 2 -->
  <rect x="25" y="174" width="870" height="118" rx="8" fill="#f0fdf4" stroke="#86efac" stroke-width="1.5" />
  <text x="45" y="198" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#14532d">2. API GATEWAY &amp; SECURITY TIER (Next.js Route Handlers, Zod Validation)</text>

  <rect x="45" y="212" width="155" height="64" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="122" y="239" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Auth &amp; Session API</text>
  <text x="122" y="256" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">bcryptjs, jose, cookies</text>

  <rect x="220" y="212" width="155" height="64" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="297" y="239" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a" text-anchor="middle">RBAC Guard API</text>
  <text x="297" y="256" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">4-tier role permission matrix</text>

  <rect x="395" y="212" width="155" height="64" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="472" y="239" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Simulations API</text>
  <text x="472" y="256" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">DAG nodes &amp; dependencies</text>

  <rect x="570" y="212" width="155" height="64" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="647" y="239" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Workspace API</text>
  <text x="647" y="256" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Execute, files, snapshots</text>

  <rect x="745" y="212" width="135" height="64" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="812" y="239" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Submission API</text>
  <text x="812" y="256" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">PRs, test logs, evaluations</text>

  <!-- Down Arrow 2 -> 3 -->
  <line x1="460" y1="292" x2="460" y2="322" stroke="#3b82f6" stroke-width="2"/>
  <polygon points="455,319 460,326 465,319" fill="#3b82f6"/>

  <!-- TIER 3 -->
  <rect x="25" y="328" width="870" height="118" rx="8" fill="#fdf4ff" stroke="#f0abfc" stroke-width="1.5" />
  <text x="45" y="352" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#701a75">3. CORE DOMAIN &amp; APPLICATION SERVICES TIER</text>

  <rect x="45" y="366" width="195" height="64" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="142" y="393" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Content Engine &amp; DAG</text>
  <text x="142" y="410" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Prerequisites, unlock rules</text>

  <rect x="260" y="366" width="195" height="64" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="357" y="393" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Workspace Orchestrator</text>
  <text x="357" y="410" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Concurrency &amp; timeout quotas</text>

  <rect x="475" y="366" width="195" height="64" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="572" y="393" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Evaluation Engine</text>
  <text x="572" y="410" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Multi-tier test suites &amp; rubrics</text>

  <rect x="690" y="366" width="185" height="64" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="782" y="393" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a" text-anchor="middle">AI Tech Lead Agent</text>
  <text x="782" y="410" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Line-level PR reviews</text>

  <!-- Down Arrows 3 -> 4 & 5 -->
  <line x1="260" y1="446" x2="260" y2="476" stroke="#3b82f6" stroke-width="2"/>
  <polygon points="255,473 260,480 265,473" fill="#3b82f6"/>

  <line x1="660" y1="446" x2="660" y2="476" stroke="#3b82f6" stroke-width="2"/>
  <polygon points="655,473 660,480 665,473" fill="#3b82f6"/>

  <!-- TIER 4 -->
  <rect x="25" y="482" width="420" height="180" rx="8" fill="#fffbeb" stroke="#fcd34d" stroke-width="1.5" />
  <text x="45" y="506" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#78350f">4. WORKSPACE &amp; EXECUTION TIER</text>

  <rect x="45" y="520" width="180" height="58" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="135" y="546" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#0f172a" text-anchor="middle">Isolated Sandbox Provider</text>
  <text x="135" y="562" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Process jailing &amp; 4000ms timeout</text>

  <rect x="245" y="520" width="180" height="58" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="335" y="546" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#0f172a" text-anchor="middle">Container Workspaces</text>
  <text x="335" y="562" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">.workspaces/&lt;workspaceId&gt;</text>

  <rect x="45" y="590" width="180" height="58" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="135" y="616" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#0f172a" text-anchor="middle">Test Runner Harness</text>
  <text x="135" y="632" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Vitest / pytest automated runner</text>

  <rect x="245" y="590" width="180" height="58" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="335" y="616" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#0f172a" text-anchor="middle">Git VCS Integration</text>
  <text x="335" y="632" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Branches, diffs, commit SHAs</text>

  <!-- TIER 5 -->
  <rect x="465" y="482" width="430" height="180" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
  <text x="485" y="506" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">5. PERSISTENCE &amp; STORAGE TIER</text>

  <rect x="485" y="520" width="185" height="58" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="577" y="546" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#0f172a" text-anchor="middle">Prisma ORM 5.x Client</text>
  <text x="577" y="562" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Type-safe queries &amp; relations</text>

  <rect x="690" y="520" width="185" height="58" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="782" y="546" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#0f172a" text-anchor="middle">Relational Database</text>
  <text x="782" y="562" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">SQLite (dev) / Postgres (prod)</text>

  <rect x="485" y="590" width="185" height="58" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="577" y="616" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#0f172a" text-anchor="middle">Snapshot &amp; Diff Store</text>
  <text x="577" y="632" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">.artifacts/ directory store</text>

  <rect x="690" y="590" width="185" height="58" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="782" y="616" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#0f172a" text-anchor="middle">Immutable Audit Store</text>
  <text x="782" y="632" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Tamper-evident event logs</text>

  <!-- Status Box -->
  <rect x="25" y="680" width="870" height="85" rx="6" fill="#ffffff" stroke="#e2e8f0" />
  <text x="45" y="705" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#1e293b">Architectural Verification Status:</text>
  <text x="45" y="725" font-family="Arial, sans-serif" font-size="9.5" fill="#334155">• Verified in Source Code: Next.js 14 App Router, 21-entity Prisma SQLite DB, Workspace Orchestrator, IsolatedSandboxProvider, Vitest.</text>
  <text x="45" y="743" font-family="Arial, sans-serif" font-size="9.5" fill="#334155">• Planned for Stage-II: Distributed Kubernetes container cluster, live AI Tech Lead multi-turn LLM reviewer, public cryptographic verification.</text>
</svg>
"""

save_and_render("fig_1_system_architecture", svg_arch, mmd_arch)

# ==============================================================================
# 2. Use Case Diagram (Fig 4.2)
# ==============================================================================
mmd_uc = """flowchart LR
    Student(["Student / Learner"])
    Author(["Content Author"])
    Reviewer(["Technical Reviewer"])
    Admin(["System Administrator"])

    subgraph Boundary["WORKUP Platform Boundary"]
        UC1["UC-01: Explore Careers & Roles"]
        UC2["UC-02: Launch Simulation Track"]
        UC3["UC-03: Inspect Ticket & ADR"]
        UC4["UC-04: Provision Cloud Workspace"]
        UC5["UC-05: Run In-Sandbox Tests"]
        UC6["UC-06: Submit Pull Request"]
        UC7["UC-07: View Evidence Dossier"]

        UC8["UC-08: Inspect PR Diff & Notes"]
        UC9["UC-09: Score Rubric Criteria"]
        UC10["UC-10: Line-by-Line Code Review"]

        UC11["UC-11: Author Company & Teams"]
        UC12["UC-12: Configure Task DAG"]
        UC13["UC-13: Set Acceptance Benchmarks"]

        UC14["UC-14: Audit Log Governance"]
        UC15["UC-15: Fleet Concurrency Limits"]
        UC16["UC-16: User Role Management"]
    end

    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    Student --> UC6
    Student --> UC7

    Reviewer --> UC8
    Reviewer --> UC9
    Reviewer --> UC10

    Author --> UC11
    Author --> UC12
    Author --> UC13

    Admin --> UC14
    Admin --> UC15
    Admin --> UC16
"""

svg_uc = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 760" width="920" height="760">
  <rect width="920" height="760" fill="#f8fafc" rx="8"/>

  <!-- Boundary -->
  <rect x="200" y="25" width="520" height="710" rx="10" fill="#ffffff" stroke="#3b82f6" stroke-width="2" stroke-dasharray="6,4"/>
  <text x="460" y="50" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#2563eb" text-anchor="middle">WORKUP PLATFORM BOUNDARY</text>

  <!-- Actors -->
  <!-- Student (Left Top) -->
  <circle cx="90" cy="140" r="16" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
  <line x1="90" y1="156" x2="90" y2="195" stroke="#0284c7" stroke-width="2"/>
  <line x1="68" y1="170" x2="112" y2="170" stroke="#0284c7" stroke-width="2"/>
  <line x1="90" y1="195" x2="72" y2="230" stroke="#0284c7" stroke-width="2"/>
  <line x1="90" y1="195" x2="108" y2="230" stroke="#0284c7" stroke-width="2"/>
  <text x="90" y="250" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Student / Learner</text>

  <!-- Content Author (Left Bottom) -->
  <circle cx="90" cy="480" r="16" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <line x1="90" y1="496" x2="90" y2="535" stroke="#d97706" stroke-width="2"/>
  <line x1="68" y1="510" x2="112" y2="510" stroke="#d97706" stroke-width="2"/>
  <line x1="90" y1="535" x2="72" y2="570" stroke="#d97706" stroke-width="2"/>
  <line x1="90" y1="535" x2="108" y2="570" stroke="#d97706" stroke-width="2"/>
  <text x="90" y="590" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Content Author</text>

  <!-- Reviewer (Right Top) -->
  <circle cx="830" cy="170" r="16" fill="#f3e8ff" stroke="#9333ea" stroke-width="2"/>
  <line x1="830" y1="186" x2="830" y2="225" stroke="#9333ea" stroke-width="2"/>
  <line x1="808" y1="200" x2="852" y2="200" stroke="#9333ea" stroke-width="2"/>
  <line x1="830" y1="225" x2="812" y2="260" stroke="#9333ea" stroke-width="2"/>
  <line x1="830" y1="225" x2="848" y2="260" stroke="#9333ea" stroke-width="2"/>
  <text x="830" y="280" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Reviewer / AI Lead</text>

  <!-- Administrator (Right Bottom) -->
  <circle cx="830" cy="510" r="16" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
  <line x1="830" y1="526" x2="830" y2="565" stroke="#dc2626" stroke-width="2"/>
  <line x1="808" y1="540" x2="852" y2="540" stroke="#dc2626" stroke-width="2"/>
  <line x1="830" y1="565" x2="812" y2="600" stroke="#dc2626" stroke-width="2"/>
  <line x1="830" y1="565" x2="848" y2="600" stroke="#dc2626" stroke-width="2"/>
  <text x="830" y="620" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Administrator</text>

  <!-- Connectors from Student -->
  <line x1="120" y1="170" x2="225" y2="85" stroke="#64748b" stroke-width="1.2"/>
  <line x1="120" y1="175" x2="475" y2="85" stroke="#64748b" stroke-width="1.2"/>
  <line x1="120" y1="180" x2="225" y2="145" stroke="#64748b" stroke-width="1.2"/>
  <line x1="120" y1="185" x2="475" y2="145" stroke="#64748b" stroke-width="1.2"/>
  <line x1="120" y1="190" x2="225" y2="205" stroke="#64748b" stroke-width="1.2"/>
  <line x1="120" y1="195" x2="475" y2="205" stroke="#64748b" stroke-width="1.2"/>
  <line x1="120" y1="200" x2="330" y2="265" stroke="#64748b" stroke-width="1.2"/>

  <!-- Connectors from Reviewer -->
  <line x1="800" y1="200" x2="590" y2="325" stroke="#64748b" stroke-width="1.2"/>
  <line x1="800" y1="205" x2="445" y2="385" stroke="#64748b" stroke-width="1.2"/>
  <line x1="800" y1="210" x2="695" y2="385" stroke="#64748b" stroke-width="1.2"/>

  <!-- Connectors from Content Author -->
  <line x1="120" y1="520" x2="225" y2="455" stroke="#64748b" stroke-width="1.2"/>
  <line x1="120" y1="525" x2="475" y2="455" stroke="#64748b" stroke-width="1.2"/>
  <line x1="120" y1="530" x2="330" y2="515" stroke="#64748b" stroke-width="1.2"/>

  <!-- Connectors from Admin -->
  <line x1="800" y1="540" x2="445" y2="585" stroke="#64748b" stroke-width="1.2"/>
  <line x1="800" y1="545" x2="695" y2="585" stroke="#64748b" stroke-width="1.2"/>
  <line x1="800" y1="550" x2="590" y2="645" stroke="#64748b" stroke-width="1.2"/>

  <!-- Use Cases: Student (Blue) -->
  <rect x="225" y="65" width="220" height="38" rx="19" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.3"/>
  <text x="335" y="89" font-family="Arial, sans-serif" font-size="10.5" font-weight="600" fill="#0369a1" text-anchor="middle">UC-01: Explore Careers &amp; Roles</text>

  <rect x="475" y="65" width="220" height="38" rx="19" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.3"/>
  <text x="585" y="89" font-family="Arial, sans-serif" font-size="10.5" font-weight="600" fill="#0369a1" text-anchor="middle">UC-02: Launch Simulation Track</text>

  <rect x="225" y="125" width="220" height="38" rx="19" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.3"/>
  <text x="335" y="149" font-family="Arial, sans-serif" font-size="10.5" font-weight="600" fill="#0369a1" text-anchor="middle">UC-03: Inspect Ticket &amp; ADR</text>

  <rect x="475" y="125" width="220" height="38" rx="19" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.3"/>
  <text x="585" y="149" font-family="Arial, sans-serif" font-size="10.5" font-weight="600" fill="#0369a1" text-anchor="middle">UC-04: Provision Cloud Workspace</text>

  <rect x="225" y="185" width="220" height="38" rx="19" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.3"/>
  <text x="335" y="209" font-family="Arial, sans-serif" font-size="10.5" font-weight="600" fill="#0369a1" text-anchor="middle">UC-05: Run In-Sandbox Tests</text>

  <rect x="475" y="185" width="220" height="38" rx="19" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.3"/>
  <text x="585" y="209" font-family="Arial, sans-serif" font-size="10.5" font-weight="600" fill="#0369a1" text-anchor="middle">UC-06: Submit Pull Request</text>

  <rect x="330" y="245" width="260" height="38" rx="19" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.3"/>
  <text x="460" y="269" font-family="Arial, sans-serif" font-size="10.5" font-weight="600" fill="#0369a1" text-anchor="middle">UC-07: View Evidence Dossier</text>

  <!-- Use Cases: Reviewer (Purple) -->
  <rect x="330" y="305" width="260" height="38" rx="19" fill="#faf5ff" stroke="#9333ea" stroke-width="1.3"/>
  <text x="460" y="329" font-family="Arial, sans-serif" font-size="10.5" font-weight="600" fill="#7e22ce" text-anchor="middle">UC-08: Inspect PR Diff &amp; Notes</text>

  <rect x="225" y="365" width="220" height="38" rx="19" fill="#faf5ff" stroke="#9333ea" stroke-width="1.3"/>
  <text x="335" y="389" font-family="Arial, sans-serif" font-size="10.5" font-weight="600" fill="#7e22ce" text-anchor="middle">UC-09: Score Rubric Criteria</text>

  <rect x="475" y="365" width="220" height="38" rx="19" fill="#faf5ff" stroke="#9333ea" stroke-width="1.3"/>
  <text x="585" y="389" font-family="Arial, sans-serif" font-size="10.5" font-weight="600" fill="#7e22ce" text-anchor="middle">UC-10: Line-by-Line Code Review</text>

  <!-- Use Cases: Content Author (Amber) -->
  <rect x="225" y="435" width="220" height="38" rx="19" fill="#fffbeb" stroke="#d97706" stroke-width="1.3"/>
  <text x="335" y="459" font-family="Arial, sans-serif" font-size="10.5" font-weight="600" fill="#b45309" text-anchor="middle">UC-11: Author Company &amp; Teams</text>

  <rect x="475" y="435" width="220" height="38" rx="19" fill="#fffbeb" stroke="#d97706" stroke-width="1.3"/>
  <text x="585" y="459" font-family="Arial, sans-serif" font-size="10.5" font-weight="600" fill="#b45309" text-anchor="middle">UC-12: Configure Task DAG</text>

  <rect x="330" y="495" width="260" height="38" rx="19" fill="#fffbeb" stroke="#d97706" stroke-width="1.3"/>
  <text x="460" y="519" font-family="Arial, sans-serif" font-size="10.5" font-weight="600" fill="#b45309" text-anchor="middle">UC-13: Set Acceptance Benchmarks</text>

  <!-- Use Cases: Admin (Red) -->
  <rect x="225" y="565" width="220" height="38" rx="19" fill="#fef2f2" stroke="#dc2626" stroke-width="1.3"/>
  <text x="335" y="589" font-family="Arial, sans-serif" font-size="10.5" font-weight="600" fill="#b91c1c" text-anchor="middle">UC-14: Audit Log Governance</text>

  <rect x="475" y="565" width="220" height="38" rx="19" fill="#fef2f2" stroke="#dc2626" stroke-width="1.3"/>
  <text x="585" y="589" font-family="Arial, sans-serif" font-size="10.5" font-weight="600" fill="#b91c1c" text-anchor="middle">UC-15: Fleet Concurrency Limits</text>

  <rect x="330" y="625" width="260" height="38" rx="19" fill="#fef2f2" stroke="#dc2626" stroke-width="1.3"/>
  <text x="460" y="649" font-family="Arial, sans-serif" font-size="10.5" font-weight="600" fill="#b91c1c" text-anchor="middle">UC-16: User Role Management</text>
</svg>
"""

save_and_render("fig_2_use_case", svg_uc, mmd_uc)

# ==============================================================================
# 3. Activity Workflow Diagram (Fig 4.3)
# ==============================================================================
mmd_act = """flowchart TD
    Start([Learner Enters WORKUP]) --> Explore[Explore Career Families & Roles]
    Explore --> SelectSim[Select Simulated Company & Track]
    SelectSim --> CheckPrereq{Prerequisites Met?}
    CheckPrereq -- No --> LockTask[Task Locked in DAG]
    LockTask --> SelectSim
    CheckPrereq -- Yes --> LaunchWS[Provision Isolated Cloud Workspace]
    LaunchWS --> ReadTicket[Inspect Ticket, Legacy Code & ADR]
    ReadTicket --> ImplementCode[Implement Solution in Sandbox]
    ImplementCode --> RunLocalTests[Execute Vitest / Automated Test Suite]
    RunLocalTests --> TestsPass{Tests Pass?}
    TestsPass -- No --> InspectFailures[Analyze Error Traces & Refactor]
    InspectFailures --> ImplementCode
    TestsPass -- Yes --> CreatePR[Submit Git Pull Request & Commit]
    CreatePR --> PRApproved{PR Approved?}
    PRApproved -- Changes Requested --> ReviewComments[Review Feedback & Refactor]
    ReviewComments --> ImplementCode
    PRApproved -- Approved --> UnlockNext[Unlock Dependent Tasks & Update Dossier]
    UnlockNext --> End([Published to Developer Portfolio])
"""

svg_act = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 820" width="850" height="820">
  <rect width="850" height="820" fill="#f8fafc" rx="8"/>

  <!-- Start Node -->
  <circle cx="425" cy="30" r="14" fill="#10b981" stroke="#059669" stroke-width="2"/>
  <text x="425" y="58" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#065f46" text-anchor="middle">Start: Learner Enters WORKUP</text>
  
  <line x1="425" y1="44" x2="425" y2="70" stroke="#3b82f6" stroke-width="1.8"/>
  <polygon points="421,68 425,75 429,68" fill="#3b82f6"/>

  <!-- Step 1: Explore -->
  <rect x="295" y="78" width="260" height="38" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
  <text x="425" y="102" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Explore Career Families &amp; Roles</text>

  <line x1="425" y1="116" x2="425" y2="138" stroke="#3b82f6" stroke-width="1.8"/>
  <polygon points="421,136 425,143 429,136" fill="#3b82f6"/>

  <!-- Step 2: Select Track -->
  <rect x="285" y="145" width="280" height="38" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
  <text x="425" y="169" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Select Simulated Company &amp; Simulation Track</text>

  <line x1="425" y1="183" x2="425" y2="205" stroke="#3b82f6" stroke-width="1.8"/>
  <polygon points="421,203 425,210 429,203" fill="#3b82f6"/>

  <!-- Decision 1: DAG Prerequisites -->
  <polygon points="425,212 515,242 425,272 335,242" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
  <text x="425" y="246" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#92400e" text-anchor="middle">Prerequisites Met?</text>

  <!-- No branch -->
  <line x1="335" y1="242" x2="190" y2="242" stroke="#dc2626" stroke-width="1.8"/>
  <polygon points="193,238 185,242 193,246" fill="#dc2626"/>
  <text x="250" y="235" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#dc2626" text-anchor="middle">No (Locked)</text>

  <rect x="75" y="222" width="110" height="40" rx="4" fill="#fee2e2" stroke="#dc2626"/>
  <text x="130" y="246" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#991b1b" text-anchor="middle">Task Blocked in DAG</text>
  
  <path d="M 130 222 L 130 164 L 285 164" fill="none" stroke="#dc2626" stroke-dasharray="3,3" stroke-width="1.2"/>

  <!-- Yes branch -->
  <line x1="425" y1="272" x2="425" y2="298" stroke="#16a34a" stroke-width="1.8"/>
  <polygon points="421,296 425,303 429,296" fill="#16a34a"/>
  <text x="435" y="288" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#16a34a" text-anchor="start">Yes</text>

  <!-- Step 3: Provision Workspace -->
  <rect x="285" y="305" width="280" height="38" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
  <text x="425" y="329" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Provision Isolated Cloud Workspace</text>

  <line x1="425" y1="343" x2="425" y2="365" stroke="#3b82f6" stroke-width="1.8"/>
  <polygon points="421,363 425,370 429,363" fill="#3b82f6"/>

  <!-- Step 4: Implement Code -->
  <rect x="270" y="372" width="310" height="42" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
  <text x="425" y="391" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Inspect Ticket, Legacy Code &amp; ADR</text>
  <text x="425" y="406" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">Implement solution in sandboxed repo</text>

  <line x1="425" y1="414" x2="425" y2="436" stroke="#3b82f6" stroke-width="1.8"/>
  <polygon points="421,434 425,441 429,434" fill="#3b82f6"/>

  <!-- Step 5: Run Tests -->
  <rect x="280" y="443" width="290" height="38" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
  <text x="425" y="467" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Execute Vitest / Automated Test Suite</text>

  <line x1="425" y1="481" x2="425" y2="503" stroke="#3b82f6" stroke-width="1.8"/>
  <polygon points="421,501 425,508 429,501" fill="#3b82f6"/>

  <!-- Decision 2: Local Tests Pass? -->
  <polygon points="425,510 515,540 425,570 335,540" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
  <text x="425" y="544" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#92400e" text-anchor="middle">Tests Pass?</text>

  <!-- Fail loop -->
  <line x1="515" y1="540" x2="640" y2="540" stroke="#dc2626" stroke-width="1.8"/>
  <polygon points="637,536 645,540 637,544" fill="#dc2626"/>
  <text x="575" y="533" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#dc2626" text-anchor="middle">No (Failures)</text>

  <rect x="645" y="520" width="145" height="40" rx="4" fill="#fee2e2" stroke="#dc2626"/>
  <text x="717" y="544" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#991b1b" text-anchor="middle">Inspect Trace &amp; Refactor</text>
  
  <path d="M 717 520 L 717 393 L 580 393" fill="none" stroke="#dc2626" stroke-dasharray="3,3" stroke-width="1.2"/>

  <!-- Pass branch -->
  <line x1="425" y1="570" x2="425" y2="596" stroke="#16a34a" stroke-width="1.8"/>
  <polygon points="421,594 425,601 429,594" fill="#16a34a"/>
  <text x="435" y="586" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#16a34a" text-anchor="start">Yes</text>

  <!-- Step 6: Submit PR -->
  <rect x="270" y="603" width="310" height="42" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
  <text x="425" y="622" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Submit Git Pull Request &amp; Commit</text>
  <text x="425" y="637" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">Triggers AI Tech Lead evaluation</text>

  <line x1="425" y1="645" x2="425" y2="667" stroke="#3b82f6" stroke-width="1.8"/>
  <polygon points="421,665 425,672 429,665" fill="#3b82f6"/>

  <!-- Decision 3: PR Approved? -->
  <polygon points="425,674 515,702 425,730 335,702" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
  <text x="425" y="706" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#92400e" text-anchor="middle">PR Approved?</text>

  <!-- Changes requested loop -->
  <line x1="335" y1="702" x2="200" y2="702" stroke="#d97706" stroke-width="1.8"/>
  <polygon points="203,698 195,702 203,706" fill="#d97706"/>
  <text x="260" y="694" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#d97706" text-anchor="middle">Changes Req.</text>

  <rect x="75" y="682" width="120" height="40" rx="4" fill="#fffbeb" stroke="#d97706"/>
  <text x="135" y="706" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#92400e" text-anchor="middle">Review PR Critique</text>
  
  <path d="M 75 702 L 40 702 L 40 393 L 270 393" fill="none" stroke="#d97706" stroke-dasharray="3,3" stroke-width="1.2"/>

  <!-- Approved branch -->
  <line x1="425" y1="730" x2="425" y2="752" stroke="#16a34a" stroke-width="1.8"/>
  <polygon points="421,750 425,757 429,750" fill="#16a34a"/>
  <text x="435" y="743" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#16a34a" text-anchor="start">Approved</text>

  <!-- Step 7: Dossier -->
  <rect x="260" y="759" width="330" height="42" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
  <text x="425" y="777" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#065f46" text-anchor="middle">Unlock Next DAG Node &amp; Update Dossier</text>
  <text x="425" y="792" font-family="Arial, sans-serif" font-size="9.5" fill="#047857" text-anchor="middle">Verified commit SHA &amp; rubric recorded</text>
</svg>
"""

save_and_render("fig_3_activity_workflow", svg_act, mmd_act)

# ==============================================================================
# 4. Sequence Diagram (Fig 4.4)
# ==============================================================================
mmd_seq = """sequenceDiagram
    autonumber
    actor Student as Student Learner
    participant UI as Workbench UI
    participant API as API Route Handler
    participant Orch as Workspace Orchestrator
    participant Sandbox as Sandbox Process
    participant DB as Prisma / SQLite DB
    participant Eval as AI Tech Lead Reviewer

    Student->>UI: 1: Click "Run Automated Tests"
    UI->>API: 2: POST /api/workspaces/[id]/test
    API->>Orch: 3: executeTestCommand(wsId)
    Orch->>Sandbox: 4: spawnProcess("npm test", timeout=4000ms)
    Sandbox-->>Orch: 5: stdout: "5 passing", exitCode: 0
    Orch-->>API: 6: TestSummary: { passed: 5, failed: 0 }
    API-->>UI: 7: 200 OK (Render green test badges)

    Student->>UI: 8: Click "Submit Pull Request"
    UI->>API: 9: POST /api/workspaces/[id]/submit
    API->>Orch: 10: createSubmissionSnapshot(wsId)
    Orch->>Sandbox: 11: captureGitDiff() & Commit SHA
    Sandbox-->>Orch: 12: Unified Diff & Commit SHA 7f2a89
    Orch->>DB: 13: INSERT into Submission (status='SUBMITTED')
    API->>Eval: 14: triggerEvaluation(submissionId, diff, rubric)
    Eval->>DB: 15: INSERT Evaluation (Score: 95, Approved: true)
    Eval->>DB: 16: UPDATE Task DAG (Unlock dependent nodes)
    API-->>UI: 17: 200 OK (Evaluation & Line-by-Line Critique)
    UI-->>Student: 18: Display PR Approval & Next Task Unlocked
"""

svg_seq = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 720" width="880" height="720">
  <rect width="880" height="720" fill="#f8fafc" rx="8"/>

  <!-- Actor Headers -->
  <!-- 1. Student -->
  <rect x="25" y="25" width="90" height="34" rx="4" fill="#0284c7"/>
  <text x="70" y="47" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Student</text>
  <line x1="70" y1="59" x2="70" y2="670" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4,4"/>

  <!-- 2. UI -->
  <rect x="150" y="25" width="100" height="34" rx="4" fill="#3b82f6"/>
  <text x="200" y="47" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Workbench UI</text>
  <line x1="200" y1="59" x2="200" y2="670" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4,4"/>

  <!-- 3. API Handler -->
  <rect x="285" y="25" width="95" height="34" rx="4" fill="#6366f1"/>
  <text x="332" y="47" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">API Handler</text>
  <line x1="332" y1="59" x2="332" y2="670" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4,4"/>

  <!-- 4. Orchestrator -->
  <rect x="415" y="25" width="105" height="34" rx="4" fill="#8b5cf6"/>
  <text x="467" y="47" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Orchestrator</text>
  <line x1="467" y1="59" x2="467" y2="670" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4,4"/>

  <!-- 5. Sandbox Process -->
  <rect x="555" y="25" width="105" height="34" rx="4" fill="#d97706"/>
  <text x="607" y="47" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Sandbox Process</text>
  <line x1="607" y1="59" x2="607" y2="670" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4,4"/>

  <!-- 6. Database -->
  <rect x="695" y="25" width="80" height="34" rx="4" fill="#059669"/>
  <text x="735" y="47" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Database</text>
  <line x1="735" y1="59" x2="735" y2="670" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4,4"/>

  <!-- 7. AI Tech Lead -->
  <rect x="795" y="25" width="75" height="34" rx="4" fill="#dc2626"/>
  <text x="832" y="47" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">AI Reviewer</text>
  <line x1="832" y1="59" x2="832" y2="670" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4,4"/>

  <!-- Phase A Header -->
  <rect x="20" y="80" width="840" height="24" rx="4" fill="#e0f2fe"/>
  <text x="35" y="96" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0369a1">PHASE 1: AUTOMATED IN-SANDBOX TEST EXECUTION</text>

  <!-- Message 1: Click Run Tests -->
  <line x1="70" y1="120" x2="195" y2="120" stroke="#2563eb" stroke-width="1.6"/>
  <polygon points="190,116 198,120 190,124" fill="#2563eb"/>
  <text x="80" y="114" font-family="Arial, sans-serif" font-size="10" font-weight="500" fill="#0f172a">1: Click "Run Automated Tests"</text>

  <!-- Message 2: POST test -->
  <line x1="200" y1="145" x2="327" y2="145" stroke="#2563eb" stroke-width="1.6"/>
  <polygon points="322,141 330,145 322,149" fill="#2563eb"/>
  <text x="210" y="139" font-family="Arial, sans-serif" font-size="10" font-weight="500" fill="#0f172a">2: POST /api/workspaces/[id]/test</text>

  <!-- Message 3: executeTestCommand -->
  <line x1="332" y1="170" x2="462" y2="170" stroke="#2563eb" stroke-width="1.6"/>
  <polygon points="457,166 465,170 457,174" fill="#2563eb"/>
  <text x="342" y="164" font-family="Arial, sans-serif" font-size="10" font-weight="500" fill="#0f172a">3: executeTestCommand(wsId)</text>

  <!-- Message 4: spawnProcess -->
  <line x1="467" y1="195" x2="602" y2="195" stroke="#2563eb" stroke-width="1.6"/>
  <polygon points="597,191 605,195 597,199" fill="#2563eb"/>
  <text x="477" y="189" font-family="Arial, sans-serif" font-size="10" font-weight="500" fill="#0f172a">4: spawnProcess("npm test", timeout=4000ms)</text>

  <!-- Message 5: Return stdout -->
  <line x1="607" y1="220" x2="472" y2="220" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4,3"/>
  <polygon points="477,216 469,220 477,224" fill="#10b981"/>
  <text x="480" y="214" font-family="Arial, sans-serif" font-size="10" font-weight="500" fill="#065f46">5: ExitCode: 0, stdout: "5 passing"</text>

  <!-- Message 6: Test Summary -->
  <line x1="467" y1="245" x2="337" y2="245" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4,3"/>
  <polygon points="342,241 334,245 342,249" fill="#10b981"/>
  <text x="345" y="239" font-family="Arial, sans-serif" font-size="10" font-weight="500" fill="#065f46">6: TestSummary: { passed: 5, failed: 0 }</text>

  <!-- Message 7: 200 OK -->
  <line x1="332" y1="270" x2="205" y2="270" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4,3"/>
  <polygon points="210,266 202,270 210,274" fill="#10b981"/>
  <text x="215" y="264" font-family="Arial, sans-serif" font-size="10" font-weight="500" fill="#065f46">7: 200 OK Response (JSON)</text>

  <!-- Message 8: Display Green -->
  <line x1="200" y1="295" x2="75" y2="295" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4,3"/>
  <polygon points="80,291 72,295 80,299" fill="#10b981"/>
  <text x="85" y="289" font-family="Arial, sans-serif" font-size="10" font-weight="500" fill="#065f46">8: Display Green Passing Badges</text>

  <!-- Phase B Header -->
  <rect x="20" y="325" width="840" height="24" rx="4" fill="#fef3c7"/>
  <text x="35" y="341" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#92400e">PHASE 2: GIT PULL REQUEST SUBMISSION &amp; AI TECH LEAD REVIEW</text>

  <!-- Message 9: Click Submit PR -->
  <line x1="70" y1="365" x2="195" y2="365" stroke="#2563eb" stroke-width="1.6"/>
  <polygon points="190,361 198,365 190,369" fill="#2563eb"/>
  <text x="80" y="359" font-family="Arial, sans-serif" font-size="10" font-weight="500" fill="#0f172a">9: Click "Submit Pull Request"</text>

  <!-- Message 10: POST submit -->
  <line x1="200" y1="390" x2="327" y2="390" stroke="#2563eb" stroke-width="1.6"/>
  <polygon points="322,386 330,390 322,394" fill="#2563eb"/>
  <text x="210" y="384" font-family="Arial, sans-serif" font-size="10" font-weight="500" fill="#0f172a">10: POST /api/workspaces/[id]/submit</text>

  <!-- Message 11: createSnapshot -->
  <line x1="332" y1="415" x2="462" y2="415" stroke="#2563eb" stroke-width="1.6"/>
  <polygon points="457,411 465,415 457,419" fill="#2563eb"/>
  <text x="342" y="409" font-family="Arial, sans-serif" font-size="10" font-weight="500" fill="#0f172a">11: createSubmissionSnapshot(wsId)</text>

  <!-- Message 12: captureGitDiff -->
  <line x1="467" y1="440" x2="602" y2="440" stroke="#2563eb" stroke-width="1.6"/>
  <polygon points="597,436 605,440 597,444" fill="#2563eb"/>
  <text x="477" y="434" font-family="Arial, sans-serif" font-size="10" font-weight="500" fill="#0f172a">12: captureGitDiff() &amp; Commit SHA</text>

  <!-- Message 13: Unified diff -->
  <line x1="607" y1="465" x2="472" y2="465" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4,3"/>
  <polygon points="477,461 469,465 477,469" fill="#10b981"/>
  <text x="475" y="459" font-family="Arial, sans-serif" font-size="10" font-weight="500" fill="#065f46">13: Unified Diff &amp; Commit SHA 7f2a89</text>

  <!-- Message 14: INSERT Submission -->
  <line x1="467" y1="490" x2="730" y2="490" stroke="#2563eb" stroke-width="1.6"/>
  <polygon points="725,486 733,490 725,494" fill="#2563eb"/>
  <text x="475" y="484" font-family="Arial, sans-serif" font-size="10" font-weight="500" fill="#0f172a">14: INSERT into Submission (status='SUBMITTED')</text>

  <!-- Message 15: triggerEvaluation -->
  <line x1="332" y1="520" x2="827" y2="520" stroke="#dc2626" stroke-width="1.6"/>
  <polygon points="822,516 830,520 822,524" fill="#dc2626"/>
  <text x="345" y="514" font-family="Arial, sans-serif" font-size="10" font-weight="500" fill="#991b1b">15: triggerEvaluation(submissionId, diff, rubric)</text>

  <!-- Self-reflection box -->
  <rect x="825" y="528" width="14" height="36" rx="2" fill="#fee2e2" stroke="#dc2626"/>
  <text x="815" y="550" font-family="Arial, sans-serif" font-size="9" fill="#991b1b" text-anchor="end">Assess diff vs ADR</text>

  <!-- Message 16: INSERT Evaluation -->
  <line x1="832" y1="575" x2="740" y2="575" stroke="#2563eb" stroke-width="1.6"/>
  <polygon points="745,571 737,575 745,579" fill="#2563eb"/>
  <text x="745" y="569" font-family="Arial, sans-serif" font-size="10" font-weight="500" fill="#0f172a">16: INSERT Evaluation (Score: 95, Approved: true)</text>

  <!-- Message 17: UPDATE DAG -->
  <line x1="832" y1="600" x2="740" y2="600" stroke="#2563eb" stroke-width="1.6"/>
  <polygon points="745,596 737,600 745,604" fill="#2563eb"/>
  <text x="745" y="594" font-family="Arial, sans-serif" font-size="10" font-weight="500" fill="#0f172a">17: UPDATE Task DAG (Unlock dependent nodes)</text>

  <!-- Message 18: 200 OK -->
  <line x1="332" y1="625" x2="205" y2="625" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4,3"/>
  <polygon points="210,621 202,625 210,629" fill="#10b981"/>
  <text x="210" y="619" font-family="Arial, sans-serif" font-size="10" font-weight="500" fill="#065f46">18: 200 OK (Evaluation &amp; Feedback)</text>

  <!-- Message 19: Render PR Review -->
  <line x1="200" y1="650" x2="75" y2="650" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4,3"/>
  <polygon points="80,646 72,650 80,654" fill="#10b981"/>
  <text x="80" y="644" font-family="Arial, sans-serif" font-size="10" font-weight="500" fill="#065f46">19: Render PR Review &amp; Unlock Next Ticket</text>
</svg>
"""

save_and_render("fig_4_sequence_submission", svg_seq, mmd_seq)

# ==============================================================================
# 5. Class / Domain Model Diagram (Fig 4.5)
# ==============================================================================
mmd_cls = """classDiagram
    class User {
        +String id
        +String email
        +String passwordHash
        +String role
        +String status
        +hasPermission()
    }
    class Profile {
        +String id
        +String userId
        +String headline
        +String experienceLevel
    }
    class Profession {
        +String id
        +String slug
        +String name
        +String category
    }
    class Role {
        +String id
        +String professionId
        +String title
        +String level
    }
    class Skill {
        +String id
        +String name
        +String slug
        +String category
    }
    class Company {
        +String id
        +String name
        +String slug
        +String industry
    }
    class Simulation {
        +String id
        +String companyId
        +String title
        +String difficulty
    }
    class Task {
        +String id
        +String ticketKey
        +String title
        +String type
    }
    class Workspace {
        +String id
        +String userId
        +String status
        +Float cpuLimit
    }
    class Submission {
        +String id
        +String taskId
        +String commitSha
        +String status
    }
    class Evaluation {
        +String id
        +Int score
        +String feedback
        +Boolean approved
    }
    class PortfolioItem {
        +String id
        +String userId
        +String dossier
    }

    User --> Profile : has
    User --> Workspace : provisions
    User --> Submission : authors
    User --> PortfolioItem : owns
    Profession --> Role : defines
    Role --> Skill : requires
    Company --> Simulation : sponsors
    Simulation --> Task : contains
    Task --> Workspace : contextualizes
    Task --> Submission : receives
    Submission --> Evaluation : receives
"""

svg_cls = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 780" width="880" height="780">
  <rect width="880" height="780" fill="#f8fafc" rx="8"/>

  <!-- Class 1: User -->
  <rect x="30" y="30" width="160" height="130" rx="4" fill="#ffffff" stroke="#0284c7" stroke-width="1.5"/>
  <rect x="30" y="30" width="160" height="24" rx="4" fill="#0284c7"/>
  <text x="110" y="47" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">User</text>
  <text x="38" y="70" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+id: String</text>
  <text x="38" y="85" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+email: String</text>
  <text x="38" y="100" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+role: RoleEnum</text>
  <text x="38" y="115" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+status: String</text>
  <line x1="30" y1="123" x2="190" y2="123" stroke="#e2e8f0"/>
  <text x="38" y="138" font-family="Courier, monospace" font-size="9.5" font-style="italic" fill="#0369a1" text-anchor="start">+hasPermission()</text>
  <text x="38" y="152" font-family="Courier, monospace" font-size="9.5" font-style="italic" fill="#0369a1" text-anchor="start">+verifyPassword()</text>

  <!-- Class 2: Profile -->
  <rect x="30" y="210" width="160" height="100" rx="4" fill="#ffffff" stroke="#0284c7" stroke-width="1.5"/>
  <rect x="30" y="210" width="160" height="24" rx="4" fill="#0284c7"/>
  <text x="110" y="227" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Profile</text>
  <text x="38" y="250" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+userId: String</text>
  <text x="38" y="265" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+headline: String</text>
  <text x="38" y="280" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+experienceLevel: String</text>
  <text x="38" y="295" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+githubUsername: String</text>

  <line x1="110" y1="160" x2="110" y2="210" stroke="#64748b" stroke-width="1.5"/>
  <text x="116" y="175" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#475569" text-anchor="start">1</text>
  <text x="116" y="202" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#475569" text-anchor="start">1</text>

  <!-- Class 3: Profession -->
  <rect x="250" y="30" width="170" height="110" rx="4" fill="#ffffff" stroke="#7c3aed" stroke-width="1.5"/>
  <rect x="250" y="30" width="170" height="24" rx="4" fill="#7c3aed"/>
  <text x="335" y="47" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Profession</text>
  <text x="258" y="70" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+id: String</text>
  <text x="258" y="85" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+slug: String</text>
  <text x="258" y="100" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+name: String</text>
  <text x="258" y="115" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+category: String</text>
  <text x="258" y="130" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+status: String</text>

  <!-- Class 4: Role -->
  <rect x="250" y="190" width="170" height="120" rx="4" fill="#ffffff" stroke="#7c3aed" stroke-width="1.5"/>
  <rect x="250" y="190" width="170" height="24" rx="4" fill="#7c3aed"/>
  <text x="335" y="207" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Role</text>
  <text x="258" y="230" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+id: String</text>
  <text x="258" y="245" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+professionId: String</text>
  <text x="258" y="260" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+title: String</text>
  <text x="258" y="275" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+level: String</text>
  <text x="258" y="290" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+responsibilities: JSON</text>

  <line x1="335" y1="140" x2="335" y2="190" stroke="#64748b" stroke-width="1.5"/>
  <text x="341" y="155" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#475569" text-anchor="start">1</text>
  <text x="341" y="182" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#475569" text-anchor="start">*</text>

  <!-- Class 5: Skill -->
  <rect x="250" y="360" width="170" height="95" rx="4" fill="#ffffff" stroke="#7c3aed" stroke-width="1.5"/>
  <rect x="250" y="360" width="170" height="24" rx="4" fill="#7c3aed"/>
  <text x="335" y="377" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Skill</text>
  <text x="258" y="400" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+id: String</text>
  <text x="258" y="415" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+name: String</text>
  <text x="258" y="430" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+slug: String</text>
  <text x="258" y="445" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+category: String</text>

  <line x1="335" y1="310" x2="335" y2="360" stroke="#64748b" stroke-width="1.5"/>
  <text x="341" y="325" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#475569" text-anchor="start">*</text>
  <text x="341" y="352" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#475569" text-anchor="start">*</text>

  <!-- Class 6: Company -->
  <rect x="490" y="30" width="175" height="110" rx="4" fill="#ffffff" stroke="#059669" stroke-width="1.5"/>
  <rect x="490" y="30" width="175" height="24" rx="4" fill="#059669"/>
  <text x="577" y="47" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Company</text>
  <text x="498" y="70" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+id: String</text>
  <text x="498" y="85" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+name: String</text>
  <text x="498" y="100" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+industry: String</text>
  <text x="498" y="115" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+size: String</text>
  <text x="498" y="130" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+techStack: JSON</text>

  <!-- Class 7: Simulation -->
  <rect x="490" y="190" width="175" height="120" rx="4" fill="#ffffff" stroke="#059669" stroke-width="1.5"/>
  <rect x="490" y="190" width="175" height="24" rx="4" fill="#059669"/>
  <text x="577" y="207" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Simulation</text>
  <text x="498" y="230" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+id: String</text>
  <text x="498" y="245" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+companyId: String</text>
  <text x="498" y="260" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+title: String</text>
  <text x="498" y="275" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+difficulty: String</text>
  <text x="498" y="290" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+estimatedHours: Int</text>

  <line x1="577" y1="140" x2="577" y2="190" stroke="#64748b" stroke-width="1.5"/>
  <text x="583" y="155" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#475569" text-anchor="start">1</text>
  <text x="583" y="182" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#475569" text-anchor="start">*</text>

  <line x1="420" y1="250" x2="490" y2="250" stroke="#64748b" stroke-width="1.5"/>
  <text x="430" y="245" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#475569" text-anchor="start">1</text>
  <text x="475" y="245" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#475569" text-anchor="start">*</text>

  <!-- Class 8: Task -->
  <rect x="490" y="360" width="175" height="135" rx="4" fill="#ffffff" stroke="#059669" stroke-width="1.5"/>
  <rect x="490" y="360" width="175" height="24" rx="4" fill="#059669"/>
  <text x="577" y="377" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Task</text>
  <text x="498" y="400" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+id: String</text>
  <text x="498" y="415" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+ticketKey: String</text>
  <text x="498" y="430" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+title: String</text>
  <text x="498" y="445" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+type: TaskType</text>
  <text x="498" y="460" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+automatedTests: JSON</text>
  <text x="498" y="475" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+acceptanceRubric: JSON</text>

  <line x1="577" y1="310" x2="577" y2="360" stroke="#64748b" stroke-width="1.5"/>
  <text x="583" y="325" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#475569" text-anchor="start">1</text>
  <text x="583" y="352" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#475569" text-anchor="start">*</text>

  <!-- Class 9: Workspace -->
  <rect x="30" y="370" width="160" height="130" rx="4" fill="#ffffff" stroke="#d97706" stroke-width="1.5"/>
  <rect x="30" y="370" width="160" height="24" rx="4" fill="#d97706"/>
  <text x="110" y="387" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Workspace</text>
  <text x="38" y="410" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+id: String</text>
  <text x="38" y="425" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+userId: String</text>
  <text x="38" y="440" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+status: StatusEnum</text>
  <text x="38" y="455" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+cpuLimit: Float</text>
  <text x="38" y="470" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+memoryLimitMb: Int</text>
  <line x1="30" y1="478" x2="190" y2="478" stroke="#e2e8f0"/>
  <text x="38" y="492" font-family="Courier, monospace" font-size="9.5" font-style="italic" fill="#b45309" text-anchor="start">+provisionSandbox()</text>

  <path d="M 110 160 L 110 370" fill="none" stroke="#64748b" stroke-width="1.5"/>
  <text x="116" y="340" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#475569" text-anchor="start">*</text>

  <!-- Class 10: Submission -->
  <rect x="490" y="550" width="175" height="115" rx="4" fill="#ffffff" stroke="#dc2626" stroke-width="1.5"/>
  <rect x="490" y="550" width="175" height="24" rx="4" fill="#dc2626"/>
  <text x="577" y="567" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Submission</text>
  <text x="498" y="590" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+id: String</text>
  <text x="498" y="605" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+taskId: String</text>
  <text x="498" y="620" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+commitSha: String</text>
  <text x="498" y="635" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+diffSummary: String</text>
  <text x="498" y="650" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+status: PRStatus</text>

  <line x1="577" y1="495" x2="577" y2="550" stroke="#64748b" stroke-width="1.5"/>
  <text x="583" y="515" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#475569" text-anchor="start">1</text>
  <text x="583" y="542" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#475569" text-anchor="start">*</text>

  <!-- Class 11: Evaluation -->
  <rect x="250" y="550" width="170" height="115" rx="4" fill="#ffffff" stroke="#dc2626" stroke-width="1.5"/>
  <rect x="250" y="550" width="170" height="24" rx="4" fill="#dc2626"/>
  <text x="335" y="567" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Evaluation</text>
  <text x="258" y="590" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+id: String</text>
  <text x="258" y="605" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+submissionId: String</text>
  <text x="258" y="620" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+score: Int (0-100)</text>
  <text x="258" y="635" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+feedback: Markdown</text>
  <text x="258" y="650" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+approved: Boolean</text>

  <line x1="490" y1="607" x2="420" y2="607" stroke="#64748b" stroke-width="1.5"/>
  <text x="475" y="602" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#475569" text-anchor="start">1</text>
  <text x="430" y="602" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#475569" text-anchor="start">1</text>

  <!-- Class 12: PortfolioItem -->
  <rect x="30" y="550" width="160" height="115" rx="4" fill="#ffffff" stroke="#059669" stroke-width="1.5"/>
  <rect x="30" y="550" width="160" height="24" rx="4" fill="#059669"/>
  <text x="110" y="567" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">PortfolioItem</text>
  <text x="38" y="590" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+id: String</text>
  <text x="38" y="605" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+userId: String</text>
  <text x="38" y="620" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+simulationId: String</text>
  <text x="38" y="635" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+dossier: JSON</text>
  <text x="38" y="650" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">+isPublic: Boolean</text>

  <line x1="250" y1="607" x2="190" y2="607" stroke="#64748b" stroke-width="1.5"/>
  <text x="205" y="602" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#475569" text-anchor="start">1</text>
  <text x="238" y="602" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#475569" text-anchor="start">*</text>

  <!-- Footer Note -->
  <rect x="30" y="695" width="820" height="55" rx="4" fill="#ffffff" stroke="#e2e8f0"/>
  <text x="45" y="718" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a">Model Schema Consistency:</text>
  <text x="45" y="736" font-family="Arial, sans-serif" font-size="9.5" fill="#475569">Strictly reflects the 21 models defined in prisma/schema.prisma including User, Profession, Role, Company, Simulation, Task, Workspace, Submission, Evaluation, and PortfolioItem.</text>
</svg>
"""

save_and_render("fig_5_class_domain_model", svg_cls, mmd_cls)

# ==============================================================================
# 6. Entity-Relationship (ER) Diagram (Fig 4.6)
# ==============================================================================
mmd_er = """erDiagram
    USER ||--o| PROFILE : "has"
    USER ||--o{ WORKSPACE : "provisions"
    USER ||--o{ SUBMISSION : "creates"
    USER ||--o{ PORTFOLIO_ITEM : "owns"

    PROFESSION ||--o{ ROLE : "defines"
    ROLE ||--o{ ROLE_SKILL : "maps"
    SKILL ||--o{ ROLE_SKILL : "referenced_by"

    COMPANY ||--o{ SIMULATION : "sponsors"
    ROLE ||--o{ SIMULATION : "targeted_by"
    SIMULATION ||--o{ TASK : "contains"
    TASK ||--o{ SUBMISSION : "receives"
    SUBMISSION ||--o| EVALUATION : "assessed_by"
    SIMULATION ||--o{ PORTFOLIO_ITEM : "produces"
"""

svg_er = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 760" width="900" height="760">
  <rect width="900" height="760" fill="#f8fafc" rx="8"/>

  <!-- Table 1: USER -->
  <rect x="30" y="30" width="170" height="120" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="1.2"/>
  <rect x="30" y="30" width="170" height="22" rx="4" fill="#1e293b"/>
  <text x="115" y="45" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">USER</text>
  <text x="38" y="68" font-family="Courier, monospace" font-size="9.5" fill="#b91c1c" font-weight="bold" text-anchor="start">PK <tspan fill="#1e293b" font-weight="normal">id: String</tspan></text>
  <text x="38" y="83" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   email: String (UQ)</text>
  <text x="38" y="98" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   passwordHash: String</text>
  <text x="38" y="113" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   role: RoleEnum</text>
  <text x="38" y="128" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   status: String</text>

  <!-- Table 2: PROFILE -->
  <rect x="30" y="190" width="170" height="95" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="1.2"/>
  <rect x="30" y="190" width="170" height="22" rx="4" fill="#1e293b"/>
  <text x="115" y="205" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">PROFILE</text>
  <text x="38" y="228" font-family="Courier, monospace" font-size="9.5" fill="#b91c1c" font-weight="bold" text-anchor="start">PK <tspan fill="#1e293b" font-weight="normal">id: String</tspan></text>
  <text x="38" y="243" font-family="Courier, monospace" font-size="9.5" fill="#0369a1" font-weight="bold" text-anchor="start">FK <tspan fill="#1e293b" font-weight="normal">userId: String (UQ)</tspan></text>
  <text x="38" y="258" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   headline: String</text>
  <text x="38" y="273" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   experienceLevel: String</text>

  <line x1="115" y1="150" x2="115" y2="190" stroke="#64748b" stroke-width="1.5"/>
  <text x="122" y="172" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#475569" text-anchor="start">1:1</text>

  <!-- Table 3: PROFESSION -->
  <rect x="250" y="30" width="175" height="105" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="1.2"/>
  <rect x="250" y="30" width="175" height="22" rx="4" fill="#1e293b"/>
  <text x="337" y="45" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">PROFESSION</text>
  <text x="258" y="68" font-family="Courier, monospace" font-size="9.5" fill="#b91c1c" font-weight="bold" text-anchor="start">PK <tspan fill="#1e293b" font-weight="normal">id: String</tspan></text>
  <text x="258" y="83" font-family="Courier, monospace" font-size="9.5" fill="#0369a1" font-weight="bold" text-anchor="start">FK <tspan fill="#1e293b" font-weight="normal">careerFamilyId: String</tspan></text>
  <text x="258" y="98" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   slug: String (UQ)</text>
  <text x="258" y="113" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   name: String</text>
  <text x="258" y="128" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   status: String</text>

  <!-- Table 4: ROLE -->
  <rect x="250" y="180" width="175" height="110" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="1.2"/>
  <rect x="250" y="180" width="175" height="22" rx="4" fill="#1e293b"/>
  <text x="337" y="195" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">ROLE</text>
  <text x="258" y="218" font-family="Courier, monospace" font-size="9.5" fill="#b91c1c" font-weight="bold" text-anchor="start">PK <tspan fill="#1e293b" font-weight="normal">id: String</tspan></text>
  <text x="258" y="233" font-family="Courier, monospace" font-size="9.5" fill="#0369a1" font-weight="bold" text-anchor="start">FK <tspan fill="#1e293b" font-weight="normal">professionId: String</tspan></text>
  <text x="258" y="248" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   slug: String (UQ)</text>
  <text x="258" y="263" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   title: String</text>
  <text x="258" y="278" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   level: String</text>

  <line x1="337" y1="135" x2="337" y2="180" stroke="#64748b" stroke-width="1.5"/>
  <text x="343" y="160" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#475569" text-anchor="start">1:N</text>

  <!-- Table 5: SKILL -->
  <rect x="250" y="335" width="175" height="95" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="1.2"/>
  <rect x="250" y="335" width="175" height="22" rx="4" fill="#1e293b"/>
  <text x="337" y="350" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">SKILL</text>
  <text x="258" y="373" font-family="Courier, monospace" font-size="9.5" fill="#b91c1c" font-weight="bold" text-anchor="start">PK <tspan fill="#1e293b" font-weight="normal">id: String</tspan></text>
  <text x="258" y="388" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   name: String</text>
  <text x="258" y="403" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   slug: String (UQ)</text>
  <text x="258" y="418" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   category: String</text>

  <!-- Table 6: COMPANY -->
  <rect x="475" y="30" width="175" height="110" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="1.2"/>
  <rect x="475" y="30" width="175" height="22" rx="4" fill="#1e293b"/>
  <text x="562" y="45" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">COMPANY</text>
  <text x="483" y="68" font-family="Courier, monospace" font-size="9.5" fill="#b91c1c" font-weight="bold" text-anchor="start">PK <tspan fill="#1e293b" font-weight="normal">id: String</tspan></text>
  <text x="483" y="83" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   name: String</text>
  <text x="483" y="98" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   slug: String (UQ)</text>
  <text x="483" y="113" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   industry: String</text>
  <text x="483" y="128" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   techStack: String</text>

  <!-- Table 7: SIMULATION -->
  <rect x="475" y="180" width="175" height="120" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="1.2"/>
  <rect x="475" y="180" width="175" height="22" rx="4" fill="#1e293b"/>
  <text x="562" y="195" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">SIMULATION</text>
  <text x="483" y="218" font-family="Courier, monospace" font-size="9.5" fill="#b91c1c" font-weight="bold" text-anchor="start">PK <tspan fill="#1e293b" font-weight="normal">id: String</tspan></text>
  <text x="483" y="233" font-family="Courier, monospace" font-size="9.5" fill="#0369a1" font-weight="bold" text-anchor="start">FK <tspan fill="#1e293b" font-weight="normal">companyId: String</tspan></text>
  <text x="483" y="248" font-family="Courier, monospace" font-size="9.5" fill="#0369a1" font-weight="bold" text-anchor="start">FK <tspan fill="#1e293b" font-weight="normal">roleId: String</tspan></text>
  <text x="483" y="263" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   title: String</text>
  <text x="483" y="278" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   difficulty: String</text>

  <line x1="562" y1="140" x2="562" y2="180" stroke="#64748b" stroke-width="1.5"/>
  <text x="568" y="160" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#475569" text-anchor="start">1:N</text>

  <line x1="425" y1="235" x2="475" y2="235" stroke="#64748b" stroke-width="1.5"/>
  <text x="440" y="230" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#475569" text-anchor="start">1:N</text>

  <!-- Table 8: TASK -->
  <rect x="475" y="345" width="175" height="130" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="1.2"/>
  <rect x="475" y="345" width="175" height="22" rx="4" fill="#1e293b"/>
  <text x="562" y="360" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">TASK</text>
  <text x="483" y="383" font-family="Courier, monospace" font-size="9.5" fill="#b91c1c" font-weight="bold" text-anchor="start">PK <tspan fill="#1e293b" font-weight="normal">id: String</tspan></text>
  <text x="483" y="398" font-family="Courier, monospace" font-size="9.5" fill="#0369a1" font-weight="bold" text-anchor="start">FK <tspan fill="#1e293b" font-weight="normal">phaseId: String</tspan></text>
  <text x="483" y="413" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   ticketKey: String (UQ)</text>
  <text x="483" y="428" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   type: String</text>
  <text x="483" y="443" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   automatedTests: JSON</text>
  <text x="483" y="458" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   rubric: JSON</text>

  <line x1="562" y1="300" x2="562" y2="345" stroke="#64748b" stroke-width="1.5"/>
  <text x="568" y="322" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#475569" text-anchor="start">1:N</text>

  <!-- Table 9: WORKSPACE -->
  <rect x="30" y="345" width="170" height="130" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="1.2"/>
  <rect x="30" y="345" width="170" height="22" rx="4" fill="#1e293b"/>
  <text x="115" y="360" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">WORKSPACE</text>
  <text x="38" y="383" font-family="Courier, monospace" font-size="9.5" fill="#b91c1c" font-weight="bold" text-anchor="start">PK <tspan fill="#1e293b" font-weight="normal">id: String</tspan></text>
  <text x="38" y="398" font-family="Courier, monospace" font-size="9.5" fill="#0369a1" font-weight="bold" text-anchor="start">FK <tspan fill="#1e293b" font-weight="normal">userId: String</tspan></text>
  <text x="38" y="413" font-family="Courier, monospace" font-size="9.5" fill="#0369a1" font-weight="bold" text-anchor="start">FK <tspan fill="#1e293b" font-weight="normal">simulationId: String</tspan></text>
  <text x="38" y="428" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   status: String</text>
  <text x="38" y="443" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   cpuLimit: Float</text>
  <text x="38" y="458" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   memoryLimitMb: Int</text>

  <path d="M 115 150 L 115 345" fill="none" stroke="#64748b" stroke-width="1.5"/>
  <text x="122" y="315" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#475569" text-anchor="start">1:N</text>

  <!-- Table 10: SUBMISSION -->
  <rect x="475" y="525" width="175" height="115" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="1.2"/>
  <rect x="475" y="525" width="175" height="22" rx="4" fill="#1e293b"/>
  <text x="562" y="540" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">SUBMISSION</text>
  <text x="483" y="563" font-family="Courier, monospace" font-size="9.5" fill="#b91c1c" font-weight="bold" text-anchor="start">PK <tspan fill="#1e293b" font-weight="normal">id: String</tspan></text>
  <text x="483" y="578" font-family="Courier, monospace" font-size="9.5" fill="#0369a1" font-weight="bold" text-anchor="start">FK <tspan fill="#1e293b" font-weight="normal">taskId: String</tspan></text>
  <text x="483" y="593" font-family="Courier, monospace" font-size="9.5" fill="#0369a1" font-weight="bold" text-anchor="start">FK <tspan fill="#1e293b" font-weight="normal">userId: String</tspan></text>
  <text x="483" y="608" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   commitSha: String</text>
  <text x="483" y="623" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   status: String</text>

  <line x1="562" y1="475" x2="562" y2="525" stroke="#64748b" stroke-width="1.5"/>
  <text x="568" y="500" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#475569" text-anchor="start">1:N</text>

  <!-- Table 11: EVALUATION -->
  <rect x="690" y="525" width="175" height="115" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="1.2"/>
  <rect x="690" y="525" width="175" height="22" rx="4" fill="#1e293b"/>
  <text x="777" y="540" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">EVALUATION</text>
  <text x="698" y="563" font-family="Courier, monospace" font-size="9.5" fill="#b91c1c" font-weight="bold" text-anchor="start">PK <tspan fill="#1e293b" font-weight="normal">id: String</tspan></text>
  <text x="698" y="578" font-family="Courier, monospace" font-size="9.5" fill="#0369a1" font-weight="bold" text-anchor="start">FK <tspan fill="#1e293b" font-weight="normal">submissionId: String</tspan></text>
  <text x="698" y="593" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   score: Int (0-100)</text>
  <text x="698" y="608" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   rubricScores: JSON</text>
  <text x="698" y="623" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   approved: Boolean</text>

  <line x1="650" y1="582" x2="690" y2="582" stroke="#64748b" stroke-width="1.5"/>
  <text x="662" y="577" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#475569" text-anchor="start">1:1</text>

  <!-- Table 12: PORTFOLIO_ITEM -->
  <rect x="250" y="525" width="175" height="115" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="1.2"/>
  <rect x="250" y="525" width="175" height="22" rx="4" fill="#1e293b"/>
  <text x="337" y="540" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">PORTFOLIO_ITEM</text>
  <text x="258" y="563" font-family="Courier, monospace" font-size="9.5" fill="#b91c1c" font-weight="bold" text-anchor="start">PK <tspan fill="#1e293b" font-weight="normal">id: String</tspan></text>
  <text x="258" y="578" font-family="Courier, monospace" font-size="9.5" fill="#0369a1" font-weight="bold" text-anchor="start">FK <tspan fill="#1e293b" font-weight="normal">userId: String</tspan></text>
  <text x="258" y="593" font-family="Courier, monospace" font-size="9.5" fill="#0369a1" font-weight="bold" text-anchor="start">FK <tspan fill="#1e293b" font-weight="normal">simulationId: String</tspan></text>
  <text x="258" y="608" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   title: String</text>
  <text x="258" y="623" font-family="Courier, monospace" font-size="9.5" fill="#1e293b" text-anchor="start">   dossier: JSON</text>

  <line x1="475" y1="582" x2="425" y2="582" stroke="#64748b" stroke-width="1.5"/>
  <text x="442" y="577" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#475569" text-anchor="start">1:1</text>
</svg>
"""

save_and_render("fig_6_er_diagram", svg_er, mmd_er)

# ==============================================================================
# 7. Component Diagram (Fig 4.7)
# ==============================================================================
mmd_comp = """flowchart TD
    subgraph Presentation["Presentation Components (React 18 / Next.js 14)"]
        Nav["navbar.tsx, role-badge"]
        Career["profession-card.tsx"]
        Backlog["simulation-card.tsx"]
        Workbench["workspaces/[id]/page.tsx"]
        Admin["admin/page.tsx"]
    end

    subgraph API["API Route Handlers (Typed Controllers)"]
        A1["/api/auth/*"]
        A2["/api/simulations/*"]
        A3["/api/workspaces/*"]
        A4["/api/profile/*"]
        A5["/api/admin/*"]
    end

    subgraph Core["Core Business Services (src/lib)"]
        C1["auth.ts, rbac.ts"]
        C2["task-validator.ts"]
        C3["orchestrator.ts"]
        C4["api-response.ts"]
        C5["logger.ts, env.ts"]
    end

    subgraph Exec["Sandbox Execution Engine"]
        E1["sandbox-provider.ts"]
        E2["Timeout & Process Spawner"]
        E3["Vitest CLI Runner"]
        E4["Git Diff Extractor"]
    end

    subgraph Storage["Persistence & Storage"]
        S1["Prisma Client (prisma.ts)"]
        S2["SQLite dev.db (21 tables)"]
        S3[".workspaces/ Directory"]
        S4[".artifacts/ Snapshots"]
    end

    Presentation --> API
    API --> Core
    Core --> Exec
    Core --> Storage
"""

svg_comp = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 720" width="900" height="720">
  <rect width="900" height="720" fill="#f8fafc" rx="8"/>

  <!-- Presentation Layer -->
  <rect x="25" y="25" width="850" height="110" rx="6" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.5"/>
  <text x="45" y="48" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#1e3a8a">PRESENTATION LAYER (Next.js 14 App Router &amp; Tailwind CSS)</text>

  <rect x="45" y="60" width="150" height="60" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="120" y="85" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Navigation &amp; Auth</text>
  <text x="120" y="100" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">navbar.tsx, role-badge</text>

  <rect x="210" y="60" width="150" height="60" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="285" y="85" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Career Explorer</text>
  <text x="285" y="100" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">profession-card.tsx</text>

  <rect x="375" y="60" width="150" height="60" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="450" y="85" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Simulation Backlog</text>
  <text x="450" y="100" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">simulation-card.tsx</text>

  <rect x="540" y="60" width="165" height="60" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="622" y="85" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Cloud Workbench UI</text>
  <text x="622" y="100" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">workspaces/[id]/page.tsx</text>

  <rect x="720" y="60" width="140" height="60" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="790" y="85" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Admin Studio</text>
  <text x="790" y="100" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">admin/page.tsx</text>

  <line x1="450" y1="135" x2="450" y2="162" stroke="#2563eb" stroke-width="1.8"/>
  <polygon points="445,159 450,166 455,159" fill="#2563eb"/>

  <!-- API Layer -->
  <rect x="25" y="168" width="850" height="110" rx="6" fill="#f0fdf4" stroke="#86efac" stroke-width="1.5"/>
  <text x="45" y="191" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#14532d">API ROUTE HANDLERS (Typed Controllers with Zod)</text>

  <rect x="45" y="203" width="150" height="60" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="120" y="228" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Auth Routes</text>
  <text x="120" y="243" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">/api/auth/*</text>

  <rect x="210" y="203" width="150" height="60" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="285" y="228" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Simulations Routes</text>
  <text x="285" y="243" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">/api/simulations/*</text>

  <rect x="375" y="203" width="150" height="60" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="450" y="228" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Workspace Routes</text>
  <text x="450" y="243" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">/api/workspaces/*</text>

  <rect x="540" y="203" width="165" height="60" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="622" y="228" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Profile &amp; Dossier</text>
  <text x="622" y="243" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">/api/profile/*</text>

  <rect x="720" y="203" width="140" height="60" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="790" y="228" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Admin Audit Routes</text>
  <text x="790" y="243" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">/api/admin/*</text>

  <line x1="450" y1="278" x2="450" y2="305" stroke="#2563eb" stroke-width="1.8"/>
  <polygon points="445,302 450,309 455,302" fill="#2563eb"/>

  <!-- Core Services Layer -->
  <rect x="25" y="311" width="850" height="110" rx="6" fill="#fdf4ff" stroke="#f0abfc" stroke-width="1.5"/>
  <text x="45" y="334" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#701a75">CORE BUSINESS LIBRARIES (src/lib)</text>

  <rect x="45" y="346" width="150" height="60" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="120" y="371" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Auth Service</text>
  <text x="120" y="386" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">auth.ts, rbac.ts</text>

  <rect x="210" y="346" width="150" height="60" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="285" y="371" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Task Validator</text>
  <text x="285" y="386" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">task-validator.ts</text>

  <rect x="375" y="346" width="150" height="60" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="450" y="371" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Workspace Orch.</text>
  <text x="450" y="386" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">orchestrator.ts</text>

  <rect x="540" y="346" width="165" height="60" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="622" y="371" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">API Envelopes</text>
  <text x="622" y="386" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">api-response.ts</text>

  <rect x="720" y="346" width="140" height="60" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="790" y="371" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Structured Logger</text>
  <text x="790" y="386" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">logger.ts, env.ts</text>

  <line x1="260" y1="421" x2="260" y2="455" stroke="#2563eb" stroke-width="1.8"/>
  <polygon points="255,452 260,459 265,452" fill="#2563eb"/>

  <line x1="640" y1="421" x2="640" y2="455" stroke="#2563eb" stroke-width="1.8"/>
  <polygon points="635,452 640,459 645,452" fill="#2563eb"/>

  <!-- Execution Engine (Left Bottom) -->
  <rect x="25" y="460" width="410" height="150" rx="6" fill="#fffbeb" stroke="#fcd34d" stroke-width="1.5"/>
  <text x="45" y="483" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#78350f">SANDBOX EXECUTION ENGINE</text>

  <rect x="45" y="498" width="175" height="48" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="132" y="520" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Sandbox Provider</text>
  <text x="132" y="534" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">sandbox-provider.ts</text>

  <rect x="235" y="498" width="180" height="48" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="325" y="520" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Process Spawner</text>
  <text x="325" y="534" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Timeout &amp; process jailing</text>

  <rect x="45" y="552" width="175" height="48" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="132" y="574" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Test Harness</text>
  <text x="132" y="588" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Vitest CLI executor</text>

  <rect x="235" y="552" width="180" height="48" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="325" y="574" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Diff &amp; Snapshot</text>
  <text x="325" y="588" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Git unified diff generator</text>

  <!-- Storage (Right Bottom) -->
  <rect x="455" y="460" width="420" height="150" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="475" y="483" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">PERSISTENCE &amp; STORAGE</text>

  <rect x="475" y="498" width="185" height="48" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="567" y="520" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Prisma Client</text>
  <text x="567" y="534" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">prisma.ts (Singleton)</text>

  <rect x="675" y="498" width="185" height="48" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="767" y="520" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Relational Storage</text>
  <text x="767" y="534" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">SQLite dev.db (21 tables)</text>

  <rect x="475" y="552" width="185" height="48" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="567" y="574" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Workspace Directory</text>
  <text x="567" y="588" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">.workspaces/&lt;workspaceId&gt;</text>

  <rect x="675" y="552" width="185" height="48" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="767" y="574" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Artifact Storage</text>
  <text x="767" y="588" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">.artifacts/ (Snapshots &amp; PRs)</text>
</svg>
"""

save_and_render("fig_7_component_diagram", svg_comp, mmd_comp)

# ==============================================================================
# 8. Deployment Diagram (Fig 4.8)
# ==============================================================================
mmd_dep = """flowchart TD
    subgraph Client["Client Workstation"]
        Browser["Modern Web Browser (Chrome, Firefox, Safari, Edge)"]
    end

    subgraph Server["Next.js Application Server (Node.js 18+ / 20+)"]
        Web["Next.js 14 App Router Web Server"]
        API["API Gateway & Route Handlers"]
        Auth["Security & JWT Auth Controller"]
    end

    subgraph Sandbox["Sandbox Execution Host (Local / Worker Host)"]
        Orch["Workspace Orchestrator Daemon"]
        Pool["Isolated Process Sandbox Pool"]
        Harness["Test Harness (Vitest / pytest)"]
    end

    subgraph DB["Data Persistence Host"]
        SQL["Relational Database (SQLite dev.db / PostgreSQL)"]
        Files["Persistent File Volume (.artifacts/)"]
    end

    Browser -- "HTTPS / WSS (Port 443 / 3000)" --> Server
    Server -- "Process Spawning / Local IPC" --> Sandbox
    Server -- "Prisma Query Engine (SQL)" --> DB
"""

svg_dep = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 720" width="880" height="720">
  <rect width="880" height="720" fill="#f8fafc" rx="8"/>

  <!-- Client Node -->
  <rect x="25" y="25" width="830" height="100" rx="8" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.5"/>
  <text x="45" y="50" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">«device» Client Workstation</text>

  <rect x="45" y="62" width="790" height="48" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="440" y="84" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Modern Web Browser (Chrome 120+, Firefox 120+, Safari 17+, Edge)</text>
  <text x="440" y="99" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">Renders Next.js React 18 UI, Monaco/Code Editor, Terminal Stream, and Verified Portfolio</text>

  <!-- Connect 1 -> 2 -->
  <line x1="440" y1="125" x2="440" y2="170" stroke="#3b82f6" stroke-width="1.8"/>
  <polygon points="435,167 440,174 445,167" fill="#3b82f6"/>
  <text x="450" y="152" font-family="Courier, monospace" font-size="10" font-weight="bold" fill="#2563eb" text-anchor="start">HTTPS / WSS (Port 443 / 3000)</text>

  <!-- Server Node -->
  <rect x="25" y="174" width="830" height="150" rx="8" fill="#f0fdf4" stroke="#86efac" stroke-width="1.5"/>
  <text x="45" y="199" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">«execution environment» Next.js Application Server (Node.js 18+ / 20+)</text>

  <rect x="45" y="212" width="250" height="95" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="170" y="239" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Next.js 14 Web Server</text>
  <text x="170" y="256" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">App Router, SSR Pages,</text>
  <text x="170" y="272" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">Static Asset Pipeline,</text>
  <text x="170" y="288" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">Tailwind CSS Compiler</text>

  <rect x="315" y="212" width="250" height="95" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="440" y="239" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">API Gateway &amp; Handlers</text>
  <text x="440" y="256" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">RESTful API Endpoints,</text>
  <text x="440" y="272" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">Zod Request Validation,</text>
  <text x="440" y="288" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">Typed JSON Envelopes</text>

  <rect x="585" y="212" width="250" height="95" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="710" y="239" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Security &amp; Auth Controller</text>
  <text x="710" y="256" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">bcryptjs Password Hashing,</text>
  <text x="710" y="272" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">Signed JWT (jose) Sessions,</text>
  <text x="710" y="288" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">HTTP-only Secure Cookies</text>

  <!-- Connect to Execution & DB -->
  <line x1="240" y1="324" x2="240" y2="380" stroke="#3b82f6" stroke-width="1.8"/>
  <polygon points="235,377 240,384 245,377" fill="#3b82f6"/>
  <text x="250" y="356" font-family="Courier, monospace" font-size="10" font-weight="bold" fill="#2563eb" text-anchor="start">Process Spawning / Local IPC</text>

  <line x1="640" y1="324" x2="640" y2="380" stroke="#3b82f6" stroke-width="1.8"/>
  <polygon points="635,377 640,384 645,377" fill="#3b82f6"/>
  <text x="650" y="356" font-family="Courier, monospace" font-size="10" font-weight="bold" fill="#2563eb" text-anchor="start">Prisma Query Engine (SQL)</text>

  <!-- Execution Node (Left) -->
  <rect x="25" y="384" width="400" height="235" rx="8" fill="#fffbeb" stroke="#fcd34d" stroke-width="1.5"/>
  <text x="45" y="409" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">«execution environment» Sandbox Runner</text>

  <rect x="45" y="424" width="360" height="55" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="225" y="447" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Workspace Orchestrator Daemon</text>
  <text x="225" y="462" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Enforces max 2 workspaces/student, 30m idle timeout</text>

  <rect x="45" y="489" width="360" height="55" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="225" y="512" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Isolated Process Sandbox Pool</text>
  <text x="225" y="527" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Jailed in .workspaces/&lt;wsId&gt;, CPU/RAM thresholds</text>

  <rect x="45" y="554" width="360" height="50" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="225" y="577" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Test Harness (Vitest / pytest)</text>
  <text x="225" y="591" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Isolated runner with hard 4000ms timeout cap</text>

  <!-- DB Node (Right) -->
  <rect x="455" y="384" width="400" height="235" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="475" y="409" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">«database system» Data Persistence</text>

  <rect x="475" y="424" width="360" height="85" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="655" y="449" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Relational Database Engine</text>
  <text x="655" y="466" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">SQLite (dev.db for zero-dependency execution)</text>
  <text x="655" y="482" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">PostgreSQL (AWS RDS target for production scaling)</text>
  <text x="655" y="498" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">21 Domain Entity Tables with Foreign Key Cascades</text>

  <rect x="475" y="519" width="360" height="85" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="655" y="544" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a" text-anchor="middle">Local Persistent File Storage</text>
  <text x="655" y="561" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">.artifacts/ (Saved snapshots, PR diffs, review logs)</text>
  <text x="655" y="577" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Immutable Audit Trail Event Logs</text>
  <text x="655" y="593" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Git Repositories and Branch Storage</text>

  <!-- Note Footer -->
  <rect x="25" y="635" width="830" height="65" rx="6" fill="#ffffff" stroke="#e2e8f0"/>
  <text x="45" y="658" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#0f172a">Deployment Scope (Stage-I vs Stage-II):</text>
  <text x="45" y="677" font-family="Arial, sans-serif" font-size="9.5" fill="#475569">Stage-I implements the complete verified single-host deployment (Next.js, SQLite, IsolatedSandboxProvider). Stage-II targets multi-tenant Kubernetes container fleets and managed PostgreSQL.</text>
</svg>
"""

save_and_render("fig_8_deployment_diagram", svg_dep, mmd_dep)

# ==============================================================================
# 9. Universal Professional Lifecycle Diagram (Fig 4.9)
# ==============================================================================
mmd_life = """flowchart LR
    A["1. Career Family"] --> B["2. Engineering Role"]
    B --> C["3. Simulated Company"]
    C --> D["4. Business Problem"]
    D --> E["5. Task Ticket & ADR"]
    E --> F["6. Real Toolchains"]
    F --> G["7. Cloud Workspace"]
    G --> H["8. Implementation"]
    H --> I["9. Automated Testing"]
    I --> J["10. AI PR Review"]
    J --> K["11. Staging Deploy"]
    K --> L["12. Telemetry Alert"]
    L --> M["13. Incident Debug"]
    M --> N["14. Evidence Dossier"]
"""

svg_life = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 430" width="960" height="430">
  <rect width="960" height="430" fill="#f8fafc" rx="8"/>

  <text x="480" y="32" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#1e3a8a" text-anchor="middle">THE UNIVERSAL PROFESSIONAL ENGINEERING LIFECYCLE</text>

  <!-- Row 1: Steps 1 to 7 -->
  <!-- 1. Career -->
  <rect x="25" y="60" width="115" height="130" rx="6" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.2"/>
  <circle cx="82" cy="85" r="14" fill="#2563eb"/>
  <text x="82" y="89" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">1</text>
  <text x="82" y="118" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Career Family</text>
  <text x="82" y="136" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Discipline: SE,</text>
  <text x="82" y="150" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">AI/ML, DevOps,</text>
  <text x="82" y="164" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Cyber, Data</text>

  <line x1="140" y1="125" x2="155" y2="125" stroke="#3b82f6" stroke-width="2"/>
  <polygon points="152,121 159,125 152,129" fill="#3b82f6"/>

  <!-- 2. Role -->
  <rect x="160" y="60" width="115" height="130" rx="6" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.2"/>
  <circle cx="217" cy="85" r="14" fill="#2563eb"/>
  <text x="217" y="89" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">2</text>
  <text x="217" y="118" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Specific Role</text>
  <text x="217" y="136" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Backend Eng,</text>
  <text x="217" y="150" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Associate MLOps,</text>
  <text x="217" y="164" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Platform Eng</text>

  <line x1="275" y1="125" x2="290" y2="125" stroke="#3b82f6" stroke-width="2"/>
  <polygon points="287,121 294,125 287,129" fill="#3b82f6"/>

  <!-- 3. Company -->
  <rect x="295" y="60" width="115" height="130" rx="6" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.2"/>
  <circle cx="352" cy="85" r="14" fill="#2563eb"/>
  <text x="352" y="89" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">3</text>
  <text x="352" y="118" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Company</text>
  <text x="352" y="136" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">FinFlow Tech,</text>
  <text x="352" y="150" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">OmniRetail,</text>
  <text x="352" y="164" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Team topologies</text>

  <line x1="410" y1="125" x2="425" y2="125" stroke="#3b82f6" stroke-width="2"/>
  <polygon points="422,121 429,125 422,129" fill="#3b82f6"/>

  <!-- 4. Business Problem -->
  <rect x="430" y="60" width="115" height="130" rx="6" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.2"/>
  <circle cx="487" cy="85" r="14" fill="#2563eb"/>
  <text x="487" y="89" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">4</text>
  <text x="487" y="118" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Problem</text>
  <text x="487" y="136" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Payment double-</text>
  <text x="487" y="150" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">charging, customer</text>
  <text x="487" y="164" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">churn spike</text>

  <line x1="545" y1="125" x2="560" y2="125" stroke="#3b82f6" stroke-width="2"/>
  <polygon points="557,121 564,125 557,129" fill="#3b82f6"/>

  <!-- 5. Task & ADR -->
  <rect x="565" y="60" width="115" height="130" rx="6" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.2"/>
  <circle cx="622" cy="85" r="14" fill="#2563eb"/>
  <text x="622" y="89" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">5</text>
  <text x="622" y="118" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Task &amp; ADR</text>
  <text x="622" y="136" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Ticket FF-104,</text>
  <text x="622" y="150" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Idempotency ADR,</text>
  <text x="622" y="164" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Acceptance criteria</text>

  <line x1="680" y1="125" x2="695" y2="125" stroke="#3b82f6" stroke-width="2"/>
  <polygon points="692,121 699,125 692,129" fill="#3b82f6"/>

  <!-- 6. Real Tools -->
  <rect x="700" y="60" width="115" height="130" rx="6" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.2"/>
  <circle cx="757" cy="85" r="14" fill="#2563eb"/>
  <text x="757" y="89" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">6</text>
  <text x="757" y="118" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Real Tools</text>
  <text x="757" y="136" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Git, Vitest,</text>
  <text x="757" y="150" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">FastAPI, Docker,</text>
  <text x="757" y="164" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">MLflow, npm</text>

  <line x1="815" y1="125" x2="830" y2="125" stroke="#3b82f6" stroke-width="2"/>
  <polygon points="827,121 834,125 827,129" fill="#3b82f6"/>

  <!-- 7. Workspace -->
  <rect x="835" y="60" width="105" height="130" rx="6" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.2"/>
  <circle cx="887" cy="85" r="14" fill="#2563eb"/>
  <text x="887" y="89" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">7</text>
  <text x="887" y="118" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Workspace</text>
  <text x="887" y="136" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Jailed sandbox,</text>
  <text x="887" y="150" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">legacy codebase,</text>
  <text x="887" y="164" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">terminal shell</text>

  <!-- Connect Row 1 to Row 2 -->
  <path d="M 887 190 L 887 215 L 82 215 L 82 238" fill="none" stroke="#3b82f6" stroke-width="2"/>
  <polygon points="78,235 82,242 86,235" fill="#3b82f6"/>

  <!-- Row 2: Steps 8 to 14 -->
  <!-- 8. Implementation -->
  <rect x="25" y="245" width="115" height="130" rx="6" fill="#f0fdf4" stroke="#86efac" stroke-width="1.2"/>
  <circle cx="82" cy="270" r="14" fill="#16a34a"/>
  <text x="82" y="274" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">8</text>
  <text x="82" y="303" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Implementation</text>
  <text x="82" y="321" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Refactor code,</text>
  <text x="82" y="335" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">fix technical debt,</text>
  <text x="82" y="349" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">follow style guide</text>

  <line x1="140" y1="310" x2="155" y2="310" stroke="#16a34a" stroke-width="2"/>
  <polygon points="152,306 159,310 152,314" fill="#16a34a"/>

  <!-- 9. Testing -->
  <rect x="160" y="245" width="115" height="130" rx="6" fill="#f0fdf4" stroke="#86efac" stroke-width="1.2"/>
  <circle cx="217" cy="270" r="14" fill="#16a34a"/>
  <text x="217" y="274" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">9</text>
  <text x="217" y="303" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Automated Tests</text>
  <text x="217" y="321" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Unit &amp; integration,</text>
  <text x="217" y="335" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">idempotency keys,</text>
  <text x="217" y="349" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">edge-case checks</text>

  <line x1="275" y1="310" x2="290" y2="310" stroke="#16a34a" stroke-width="2"/>
  <polygon points="287,306 294,310 287,314" fill="#16a34a"/>

  <!-- 10. AI Review -->
  <rect x="295" y="245" width="115" height="130" rx="6" fill="#f0fdf4" stroke="#86efac" stroke-width="1.2"/>
  <circle cx="352" cy="270" r="14" fill="#16a34a"/>
  <text x="352" y="274" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">10</text>
  <text x="352" y="303" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">AI PR Review</text>
  <text x="352" y="321" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Line-level diff,</text>
  <text x="352" y="335" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">rubric scoring,</text>
  <text x="352" y="349" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">architect critique</text>

  <line x1="410" y1="310" x2="425" y2="310" stroke="#16a34a" stroke-width="2"/>
  <polygon points="422,306 429,310 422,314" fill="#16a34a"/>

  <!-- 11. Staging Deploy -->
  <rect x="430" y="245" width="115" height="130" rx="6" fill="#f0fdf4" stroke="#86efac" stroke-width="1.2"/>
  <circle cx="487" cy="270" r="14" fill="#16a34a"/>
  <text x="487" y="274" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">11</text>
  <text x="487" y="303" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Deployment</text>
  <text x="487" y="321" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Staging build,</text>
  <text x="487" y="335" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">container deploy,</text>
  <text x="487" y="349" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">smoke validation</text>

  <line x1="545" y1="310" x2="560" y2="310" stroke="#16a34a" stroke-width="2"/>
  <polygon points="557,306 564,310 557,314" fill="#16a34a"/>

  <!-- 12. Monitoring -->
  <rect x="565" y="245" width="115" height="130" rx="6" fill="#f0fdf4" stroke="#86efac" stroke-width="1.2"/>
  <circle cx="622" cy="270" r="14" fill="#16a34a"/>
  <text x="622" y="274" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">12</text>
  <text x="622" y="303" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Telemetry Alert</text>
  <text x="622" y="321" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Synthetic Grafana,</text>
  <text x="622" y="335" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">502 spike alert,</text>
  <text x="622" y="349" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">latency drift</text>

  <line x1="680" y1="310" x2="695" y2="310" stroke="#16a34a" stroke-width="2"/>
  <polygon points="692,306 699,310 692,314" fill="#16a34a"/>

  <!-- 13. Debugging -->
  <rect x="700" y="245" width="115" height="130" rx="6" fill="#f0fdf4" stroke="#86efac" stroke-width="1.2"/>
  <circle cx="757" cy="270" r="14" fill="#16a34a"/>
  <text x="757" y="274" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">13</text>
  <text x="757" y="303" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Incident Triage</text>
  <text x="757" y="321" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Hotfix patch,</text>
  <text x="757" y="335" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">root-cause analysis,</text>
  <text x="757" y="349" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">postmortem doc</text>

  <line x1="815" y1="310" x2="830" y2="310" stroke="#dc2626" stroke-width="2"/>
  <polygon points="827,306 834,310 827,314" fill="#dc2626"/>

  <!-- 14. Evidence of Skill -->
  <rect x="835" y="245" width="105" height="130" rx="6" fill="#fef2f2" stroke="#f87171" stroke-width="1.5"/>
  <circle cx="887" cy="270" r="14" fill="#dc2626"/>
  <text x="887" y="274" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">14</text>
  <text x="887" y="303" font-family="Arial, sans-serif" font-size="10.5" font-weight="bold" fill="#991b1b" text-anchor="middle">Evidence Dossier</text>
  <text x="887" y="321" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Verified commit,</text>
  <text x="887" y="335" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">rubric audit trail,</text>
  <text x="887" y="349" font-family="Arial, sans-serif" font-size="9" fill="#475569" text-anchor="middle">recruiter dossier</text>
</svg>
"""

save_and_render("fig_9_universal_lifecycle", svg_life, mmd_life)

print("All 9 diagrams re-generated and re-rendered with perfect attributes!")
