import os
import sys

fitz_path = r"C:\Users\Mruthyunjaya\AppData\Local\uv\cache\archive-v0\AUW_ryEu2qVj8bBs\Lib\site-packages"
if fitz_path not in sys.path:
    sys.path.insert(0, fitz_path)
import fitz

diagrams_dir = r"WORKUP_Project_Review_Presentation\diagrams"
os.makedirs(diagrams_dir, exist_ok=True)

def render_svg_to_png(name, svg_content):
    svg_path = os.path.join(diagrams_dir, f"{name}.svg")
    png_path = os.path.join(diagrams_dir, f"{name}.png")
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg_content)
    doc = fitz.open(svg_path)
    page = doc[0]
    pix = page.get_pixmap(dpi=220)
    pix.save(png_path)
    print(f"Rendered: {name}.png ({pix.width}x{pix.height})")

# 1. OBJECT DIAGRAM (SVG)
svg_object = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600" width="1000" height="600" style="background:#ffffff; font-family:'Segoe UI', Arial, sans-serif;">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="2" dy="3" stdDeviation="3" flood-opacity="0.15"/>
    </filter>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#1e3a8a"/>
    </marker>
  </defs>

  <!-- Title Header -->
  <text x="500" y="32" font-size="20" font-weight="bold" fill="#0f172a" text-anchor="middle">WORKUP: Runtime Object Instance Diagram</text>
  <text x="500" y="52" font-size="12" fill="#64748b" text-anchor="middle">Concrete snapshots of entities during active simulation execution</text>

  <!-- Object 1: userInstance -->
  <g transform="translate(60, 90)" filter="url(#shadow)">
    <rect width="260" height="135" rx="6" fill="#f8fafc" stroke="#2563eb" stroke-width="2"/>
    <path d="M 0 32 L 260 32" stroke="#2563eb" stroke-width="1.5"/>
    <text x="130" y="22" font-size="13" font-weight="bold" fill="#1e3a8a" text-anchor="middle">userInstance : User</text>
    <text x="15" y="52" font-size="11" fill="#334155">userId = "usr_018f9a2b"</text>
    <text x="15" y="72" font-size="11" fill="#334155">name = "Namasani Aravind"</text>
    <text x="15" y="92" font-size="11" fill="#334155">email = "aravind@aceec.ac.in"</text>
    <text x="15" y="112" font-size="11" fill="#334155">role = "STUDENT_LEARNER"</text>
  </g>

  <!-- Object 2: companyInstance -->
  <g transform="translate(370, 90)" filter="url(#shadow)">
    <rect width="260" height="135" rx="6" fill="#f8fafc" stroke="#0d9488" stroke-width="2"/>
    <path d="M 0 32 L 260 32" stroke="#0d9488" stroke-width="1.5"/>
    <text x="130" y="22" font-size="13" font-weight="bold" fill="#0f766e" text-anchor="middle">companyInstance : Company</text>
    <text x="15" y="52" font-size="11" fill="#334155">companyId = "cmp_finflow_01"</text>
    <text x="15" y="72" font-size="11" fill="#334155">name = "FinFlow Technologies"</text>
    <text x="15" y="92" font-size="11" fill="#334155">industry = "Fintech &amp; Banking"</text>
    <text x="15" y="112" font-size="11" fill="#334155">tier = "ENTERPRISE_SIM"</text>
  </g>

  <!-- Object 3: projectInstance -->
  <g transform="translate(680, 90)" filter="url(#shadow)">
    <rect width="260" height="135" rx="6" fill="#f8fafc" stroke="#4f46e5" stroke-width="2"/>
    <path d="M 0 32 L 260 32" stroke="#4f46e5" stroke-width="1.5"/>
    <text x="130" y="22" font-size="13" font-weight="bold" fill="#3730a3" text-anchor="middle">projectInstance : Project</text>
    <text x="15" y="52" font-size="11" fill="#334155">projectId = "prj_paygw_01"</text>
    <text x="15" y="72" font-size="11" fill="#334155">title = "Payment Gateway Core"</text>
    <text x="15" y="92" font-size="11" fill="#334155">repo = "finflow/payment-service"</text>
    <text x="15" y="112" font-size="11" fill="#334155">workflow = "SPRINT_BACKLOG"</text>
  </g>

  <!-- Object 4: taskInstance -->
  <g transform="translate(60, 290)" filter="url(#shadow)">
    <rect width="260" height="135" rx="6" fill="#f8fafc" stroke="#d97706" stroke-width="2"/>
    <path d="M 0 32 L 260 32" stroke="#d97706" stroke-width="1.5"/>
    <text x="130" y="22" font-size="13" font-weight="bold" fill="#b45309" text-anchor="middle">taskInstance : Task</text>
    <text x="15" y="52" font-size="11" fill="#334155">taskId = "tsk_auth_token_04"</text>
    <text x="15" y="72" font-size="11" fill="#334155">title = "Idempotent Webhooks"</text>
    <text x="15" y="92" font-size="11" fill="#334155">adrRef = "ADR-004-REDIS-LOCK"</text>
    <text x="15" y="112" font-size="11" fill="#334155">state = "IN_PROGRESS"</text>
  </g>

  <!-- Object 5: workspaceInstance -->
  <g transform="translate(370, 290)" filter="url(#shadow)">
    <rect width="260" height="135" rx="6" fill="#f8fafc" stroke="#0284c7" stroke-width="2"/>
    <path d="M 0 32 L 260 32" stroke="#0284c7" stroke-width="1.5"/>
    <text x="130" y="22" font-size="13" font-weight="bold" fill="#0369a1" text-anchor="middle">workspaceInstance : Workspace</text>
    <text x="15" y="52" font-size="11" fill="#334155">workspaceId = "wks_sand_9921"</text>
    <text x="15" y="72" font-size="11" fill="#334155">runtime = "Node.js 20 / Vitest"</text>
    <text x="15" y="92" font-size="11" fill="#334155">containerStatus = "ACTIVE"</text>
    <text x="15" y="112" font-size="11" fill="#334155">executionTimeout = 4000</text>
  </g>

  <!-- Object 6: evaluationInstance -->
  <g transform="translate(680, 290)" filter="url(#shadow)">
    <rect width="260" height="135" rx="6" fill="#f8fafc" stroke="#16a34a" stroke-width="2"/>
    <path d="M 0 32 L 260 32" stroke="#16a34a" stroke-width="1.5"/>
    <text x="130" y="22" font-size="13" font-weight="bold" fill="#15803d" text-anchor="middle">evalInstance : Evaluation</text>
    <text x="15" y="52" font-size="11" fill="#334155">evalId = "eval_ai_8832"</text>
    <text x="15" y="72" font-size="11" fill="#334155">commitSHA = "e8f39a1c2b"</text>
    <text x="15" y="92" font-size="11" fill="#334155">rubricScore = 94.5 / 100</text>
    <text x="15" y="112" font-size="11" fill="#334155">decision = "APPROVED"</text>
  </g>

  <!-- Object 7: portfolioBadgeInstance (Bottom Center) -->
  <g transform="translate(370, 470)" filter="url(#shadow)">
    <rect width="260" height="95" rx="6" fill="#f8fafc" stroke="#7c3aed" stroke-width="2"/>
    <path d="M 0 28 L 260 28" stroke="#7c3aed" stroke-width="1.5"/>
    <text x="130" y="20" font-size="13" font-weight="bold" fill="#6d28d9" text-anchor="middle">dossierInstance : EvidencePortfolio</text>
    <text x="15" y="48" font-size="11" fill="#334155">entryCount = 8 verified commits</text>
    <text x="15" y="68" font-size="11" fill="#334155">verificationURL = "workup.dev/verify/usr_018f"</text>
    <text x="15" y="86" font-size="11" fill="#334155">status = "PUBLIC_VERIFIED"</text>
  </g>

  <!-- Connectors -->
  <!-- userInstance to workspaceInstance -->
  <line x1="190" y1="225" x2="370" y2="350" stroke="#64748b" stroke-width="1.8" stroke-dasharray="4,4"/>
  <text x="240" y="295" font-size="11" fill="#475569" font-weight="600">executes</text>

  <!-- companyInstance to projectInstance -->
  <line x1="630" y1="157" x2="680" y2="157" stroke="#64748b" stroke-width="1.8"/>
  <text x="640" y="148" font-size="11" fill="#475569" font-weight="600">owns</text>

  <!-- projectInstance to taskInstance -->
  <path d="M 810 225 L 810 260 L 320 260 L 320 320" fill="none" stroke="#64748b" stroke-width="1.8"/>
  <text x="560" y="253" font-size="11" fill="#475569" font-weight="600">decomposes into</text>

  <!-- taskInstance to workspaceInstance -->
  <line x1="320" y1="357" x2="370" y2="357" stroke="#64748b" stroke-width="1.8"/>
  <text x="330" y="350" font-size="11" fill="#475569" font-weight="600">hosts</text>

  <!-- workspaceInstance to evaluationInstance -->
  <line x1="630" y1="357" x2="680" y2="357" stroke="#64748b" stroke-width="1.8"/>
  <text x="635" y="350" font-size="11" fill="#475569" font-weight="600">submits to</text>

  <!-- evaluationInstance to portfolioInstance -->
  <line x1="720" y1="425" x2="630" y2="510" stroke="#64748b" stroke-width="1.8"/>
  <text x="685" y="475" font-size="11" fill="#475569" font-weight="600">records in</text>

  <!-- userInstance to portfolioInstance -->
  <path d="M 190 225 L 190 515 L 370 515" fill="none" stroke="#64748b" stroke-width="1.8"/>
  <text x="210" y="508" font-size="11" fill="#475569" font-weight="600">showcases</text>
</svg>
"""

# 2. COLLABORATION / COMMUNICATION DIAGRAM (SVG)
svg_collab = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600" width="1000" height="600" style="background:#ffffff; font-family:'Segoe UI', Arial, sans-serif;">
  <defs>
    <filter id="shadow2" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.15"/>
    </filter>
  </defs>

  <text x="500" y="32" font-size="20" font-weight="bold" fill="#0f172a" text-anchor="middle">WORKUP: Collaboration (Communication) Diagram</text>
  <text x="500" y="52" font-size="12" fill="#64748b" text-anchor="middle">Structural object links and ordered sequence of messages during a task execution cycle</text>

  <!-- Center Node: WebApp Controller -->
  <g transform="translate(390, 240)" filter="url(#shadow2)">
    <rect width="220" height="70" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <text x="110" y="32" font-size="13" font-weight="bold" fill="#1e3a8a" text-anchor="middle">:AppController</text>
    <text x="110" y="50" font-size="11" fill="#475569" text-anchor="middle">(Next.js 14 Route Handler)</text>
  </g>

  <!-- Top-Left: Learner (Actor) -->
  <g transform="translate(60, 100)" filter="url(#shadow2)">
    <rect width="180" height="60" rx="6" fill="#f8fafc" stroke="#475569" stroke-width="2"/>
    <text x="90" y="28" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">:Learner</text>
    <text x="90" y="46" font-size="11" fill="#64748b" text-anchor="middle">(Engineering Student)</text>
  </g>

  <!-- Top-Center: Workbench UI -->
  <g transform="translate(400, 90)" filter="url(#shadow2)">
    <rect width="200" height="60" rx="6" fill="#f8fafc" stroke="#0284c7" stroke-width="2"/>
    <text x="100" y="28" font-size="13" font-weight="bold" fill="#0369a1" text-anchor="middle">:WorkbenchUI</text>
    <text x="100" y="46" font-size="11" fill="#64748b" text-anchor="middle">(React 18 / Monaco Editor)</text>
  </g>

  <!-- Top-Right: DAG Task Engine -->
  <g transform="translate(740, 100)" filter="url(#shadow2)">
    <rect width="200" height="60" rx="6" fill="#f8fafc" stroke="#d97706" stroke-width="2"/>
    <text x="100" y="28" font-size="13" font-weight="bold" fill="#b45309" text-anchor="middle">:TaskEngine</text>
    <text x="100" y="46" font-size="11" fill="#64748b" text-anchor="middle">(DAG Prerequisite Checker)</text>
  </g>

  <!-- Bottom-Left: Sandbox Runtime -->
  <g transform="translate(60, 420)" filter="url(#shadow2)">
    <rect width="200" height="60" rx="6" fill="#f8fafc" stroke="#0d9488" stroke-width="2"/>
    <text x="100" y="28" font-size="13" font-weight="bold" fill="#0f766e" text-anchor="middle">:CloudSandbox</text>
    <text x="100" y="46" font-size="11" fill="#64748b" text-anchor="middle">(Path-Jailed Node Runtime)</text>
  </g>

  <!-- Bottom-Center: Vitest Runner -->
  <g transform="translate(400, 440)" filter="url(#shadow2)">
    <rect width="200" height="60" rx="6" fill="#f8fafc" stroke="#7c3aed" stroke-width="2"/>
    <text x="100" y="28" font-size="13" font-weight="bold" fill="#6d28d9" text-anchor="middle">:TestRunner</text>
    <text x="100" y="46" font-size="11" fill="#64748b" text-anchor="middle">(Vitest Test Harness)</text>
  </g>

  <!-- Bottom-Right: AI Tech Lead Reviewer -->
  <g transform="translate(740, 420)" filter="url(#shadow2)">
    <rect width="200" height="60" rx="6" fill="#f8fafc" stroke="#16a34a" stroke-width="2"/>
    <text x="100" y="28" font-size="13" font-weight="bold" fill="#15803d" text-anchor="middle">:ReviewEngine</text>
    <text x="100" y="46" font-size="11" fill="#64748b" text-anchor="middle">(AI Tech Lead &amp; Rubrics)</text>
  </g>

  <!-- Links and Messages -->
  <!-- 1. Learner -> WorkbenchUI -->
  <line x1="240" y1="130" x2="400" y2="120" stroke="#334155" stroke-width="2"/>
  <text x="320" y="112" font-size="11" fill="#1e3a8a" font-weight="600" text-anchor="middle">1: selectTask(id) →</text>
  <text x="320" y="142" font-size="11" fill="#1e3a8a" font-weight="600" text-anchor="middle">4: editCode(diff) →</text>

  <!-- 2. WorkbenchUI -> AppController -->
  <line x1="500" y1="150" x2="500" y2="240" stroke="#334155" stroke-width="2"/>
  <text x="380" y="195" font-size="11" fill="#1e3a8a" font-weight="600">2: openWorkspace() →</text>
  <text x="380" y="212" font-size="11" fill="#1e3a8a" font-weight="600">6: submitForReview() →</text>

  <!-- 3. AppController -> TaskEngine -->
  <line x1="580" y1="240" x2="750" y2="160" stroke="#334155" stroke-width="2"/>
  <text x="700" y="200" font-size="11" fill="#b45309" font-weight="600">3: verifyDAGPrerequisites() ↗</text>

  <!-- 4. AppController -> CloudSandbox -->
  <line x1="420" y1="310" x2="220" y2="420" stroke="#334155" stroke-width="2"/>
  <text x="210" y="360" font-size="11" fill="#0f766e" font-weight="600">↙ 3.1: initWorkspace()</text>
  <text x="210" y="378" font-size="11" fill="#0f766e" font-weight="600">↙ 4.1: executeSandboxCode()</text>

  <!-- 5. CloudSandbox -> TestRunner -->
  <line x1="260" y1="460" x2="400" y2="465" stroke="#334155" stroke-width="2"/>
  <text x="330" y="450" font-size="11" fill="#6d28d9" font-weight="600" text-anchor="middle">5: runVitestTests() →</text>
  <text x="330" y="485" font-size="11" fill="#6d28d9" font-weight="600" text-anchor="middle">← 5.1: returnResults(pass/fail)</text>

  <!-- 6. AppController -> ReviewEngine -->
  <line x1="580" y1="310" x2="760" y2="420" stroke="#334155" stroke-width="2"/>
  <text x="700" y="355" font-size="11" fill="#15803d" font-weight="600">7: evaluateDiffAgainstADR() ↘</text>
  <text x="700" y="375" font-size="11" fill="#15803d" font-weight="600">8: issueFeedback(scores, SHA) ↙</text>
</svg>
"""

# 3. STATE CHART DIAGRAM (SVG)
svg_statechart = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600" width="1000" height="600" style="background:#ffffff; font-family:'Segoe UI', Arial, sans-serif;">
  <defs>
    <filter id="shadow3" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.15"/>
    </filter>
    <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#0f172a"/>
    </marker>
  </defs>

  <text x="500" y="32" font-size="20" font-weight="bold" fill="#0f172a" text-anchor="middle">WORKUP: Task and Submission Lifecycle State Chart</text>
  <text x="500" y="52" font-size="12" fill="#64748b" text-anchor="middle">State transitions from prerequisite DAG gating through implementation, testing, review, and portfolio commit</text>

  <!-- Initial State Circle -->
  <circle cx="90" cy="110" r="14" fill="#0f172a"/>

  <!-- State 1: LOCKED -->
  <g transform="translate(160, 80)" filter="url(#shadow3)">
    <rect width="130" height="60" rx="10" fill="#f1f5f9" stroke="#64748b" stroke-width="2"/>
    <text x="65" y="35" font-size="13" font-weight="bold" fill="#334155" text-anchor="middle">LOCKED</text>
  </g>

  <!-- State 2: AVAILABLE -->
  <g transform="translate(370, 80)" filter="url(#shadow3)">
    <rect width="140" height="60" rx="10" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <text x="70" y="35" font-size="13" font-weight="bold" fill="#92400e" text-anchor="middle">AVAILABLE</text>
  </g>

  <!-- State 3: IN_PROGRESS -->
  <g transform="translate(600, 80)" filter="url(#shadow3)">
    <rect width="150" height="60" rx="10" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
    <text x="75" y="35" font-size="13" font-weight="bold" fill="#075985" text-anchor="middle">IN_PROGRESS</text>
  </g>

  <!-- State 4: LOCAL_TESTING -->
  <g transform="translate(600, 240)" filter="url(#shadow3)">
    <rect width="150" height="60" rx="10" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
    <text x="75" y="35" font-size="13" font-weight="bold" fill="#5b21b6" text-anchor="middle">TESTING_CODE</text>
  </g>

  <!-- State 5: SUBMITTED / UNDER_REVIEW -->
  <g transform="translate(370, 240)" filter="url(#shadow3)">
    <rect width="150" height="60" rx="10" fill="#fef9c3" stroke="#ca8a04" stroke-width="2"/>
    <text x="75" y="35" font-size="13" font-weight="bold" fill="#854d0e" text-anchor="middle">UNDER_REVIEW</text>
  </g>

  <!-- State 6: REVISION_REQUESTED -->
  <g transform="translate(160, 240)" filter="url(#shadow3)">
    <rect width="160" height="60" rx="10" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
    <text x="80" y="28" font-size="12" font-weight="bold" fill="#991b1b" text-anchor="middle">REVISION_NEEDED</text>
    <text x="80" y="46" font-size="10" fill="#b91c1c" text-anchor="middle">Line Feedback Given</text>
  </g>

  <!-- State 7: APPROVED / VERIFIED -->
  <g transform="translate(370, 420)" filter="url(#shadow3)">
    <rect width="160" height="65" rx="10" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
    <text x="80" y="30" font-size="13" font-weight="bold" fill="#166534" text-anchor="middle">TASK_APPROVED</text>
    <text x="80" y="48" font-size="10" fill="#15803d" text-anchor="middle">Commit SHA Recorded</text>
  </g>

  <!-- Final State -->
  <g transform="translate(660, 452)">
    <circle cx="0" cy="0" r="16" fill="none" stroke="#0f172a" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="10" fill="#0f172a"/>
  </g>

  <!-- Transitions -->
  <!-- Initial -> LOCKED -->
  <line x1="104" y1="110" x2="158" y2="110" stroke="#0f172a" stroke-width="1.8" marker-end="url(#arr)"/>

  <!-- LOCKED -> AVAILABLE -->
  <line x1="290" y1="110" x2="368" y2="110" stroke="#0f172a" stroke-width="1.8" marker-end="url(#arr)"/>
  <text x="330" y="100" font-size="10" fill="#475569" text-anchor="middle">[Prerequisites Met]</text>

  <!-- AVAILABLE -> IN_PROGRESS -->
  <line x1="510" y1="110" x2="598" y2="110" stroke="#0f172a" stroke-width="1.8" marker-end="url(#arr)"/>
  <text x="555" y="100" font-size="10" fill="#475569" text-anchor="middle">Accept Task</text>

  <!-- IN_PROGRESS -> TESTING_CODE -->
  <line x1="675" y1="140" x2="675" y2="238" stroke="#0f172a" stroke-width="1.8" marker-end="url(#arr)"/>
  <text x="735" y="190" font-size="10" fill="#475569" text-anchor="middle">Run Vitest Suite</text>

  <!-- TESTING_CODE -> IN_PROGRESS (loop back on test failure) -->
  <path d="M 750 260 C 830 260 830 120 752 120" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="3,3" marker-end="url(#arr)"/>
  <text x="850" y="190" font-size="10" fill="#dc2626" text-anchor="middle">[Tests Failed]</text>

  <!-- TESTING_CODE -> UNDER_REVIEW -->
  <line x1="600" y1="270" x2="522" y2="270" stroke="#0f172a" stroke-width="1.8" marker-end="url(#arr)"/>
  <text x="560" y="260" font-size="10" fill="#475569" text-anchor="middle">[Tests Passed] / Submit PR</text>

  <!-- UNDER_REVIEW -> REVISION_NEEDED -->
  <line x1="370" y1="270" x2="322" y2="270" stroke="#dc2626" stroke-width="1.8" marker-end="url(#arr)"/>
  <text x="345" y="260" font-size="10" fill="#dc2626" text-anchor="middle">[Review Rejection]</text>

  <!-- REVISION_NEEDED -> IN_PROGRESS -->
  <path d="M 240 240 L 240 180 L 630 180 L 630 142" fill="none" stroke="#0f172a" stroke-width="1.8" marker-end="url(#arr)"/>
  <text x="420" y="172" font-size="10" fill="#475569" text-anchor="middle">Read AI Comments &amp; Refactor</text>

  <!-- UNDER_REVIEW -> TASK_APPROVED -->
  <line x1="445" y1="300" x2="445" y2="418" stroke="#16a34a" stroke-width="2" marker-end="url(#arr)"/>
  <text x="500" y="360" font-size="10" fill="#16a34a" font-weight="600">[Rubric Approved]</text>

  <!-- TASK_APPROVED -> Final State -->
  <line x1="530" y1="452" x2="642" y2="452" stroke="#0f172a" stroke-width="2" marker-end="url(#arr)"/>
  <text x="585" y="442" font-size="10" fill="#475569" text-anchor="middle">Unlock Next DAG Tasks</text>
</svg>
"""

render_svg_to_png("fig_object_diagram", svg_object)
render_svg_to_png("fig_collaboration_diagram", svg_collab)
render_svg_to_png("fig_statechart_diagram", svg_statechart)
print("All 3 missing diagrams generated successfully!")
