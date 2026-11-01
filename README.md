# [workup] — Virtual Professional Experience Platform

> **Experience how engineers actually work inside tech companies.**  
> `Career → Role → Company → Business Problem → Professional Task → Real Tools → Cloud Workspace → Implementation → Testing → Review → Deployment → Monitoring → Debugging → Evidence of Skill`

---

## 1. What is [workup]?

**[workup]** is a Virtual Professional Experience Platform designed to bridge academic education and real corporate software engineering.

The platform is **NOT**:
* ❌ An online course with passive video lectures.
* ❌ A coding challenge website testing isolated, synthetic algorithms.
* ❌ A generic AI chatbot hallucinating answers out of context.
* ❌ A certificate mill generating unverifiable PDF badges.
* ❌ A superficial 2D virtual office game.

### The Core Differentiator
A person who has **never worked in a software company** can open WORKUP, be welcomed by their simulated team lead, understand their first assignment in plain English, complete it with assistance from an **AI technical colleague (Quila)**, run automated tests, and see the verified evidence of what they achieved.

---

## 2. Key Capabilities & Features

### 🎯 1. Mission Guidance System
Every mission provides complete business context rather than a dry coding prompt:
* **Workplace Context**: Ticket key (e.g. `FF-001`), Department (`Backend Engineering`), Company (`FinFlow Technologies`), Difficulty (`Beginner`), and Team Lead (`Alex Rivera, Senior Backend Lead`).
* **The Scenario**: Explains the customer-facing problem in simple, accessible language.
* **Why This Matters**: Connects technical tasks to business impact (e.g., stopping ghost user sessions and preventing database corruption).
* **Target Files with 1-Click Open**: Direct links to open target source files (e.g., `src/auth/validator.py`) straight into the editor.
* **Step-by-Step Checklist**: Checkable progress indicators guiding the student through investigation, modification, testing, and submission.
* **Measurable Expected Outcome**: Explicit definition of what success looks like.
* **Progressive Hints**: Layered hints locked by default and revealed sequentially (direction $\rightarrow$ logic $\rightarrow$ syntax) so learners solve problems independently.

### 🤖 2. AI Helpdesk — Virtual Team Assistant (Quila)
A persistent floating technical mentor accessible throughout the workspace:
* **Helpful Colleague Persona**: Behaves like an empathetic senior teammate sitting next to the learner, not a generic chatbot.
* **Capabilities**:
  * **Mission Explanation**: Explains what the ticket requires in beginner-friendly language without technical jargon.
  * **Step Guidance**: Explains what to do next based on whether tests are currently passing or failing.
  * **Progressive Hints**: Gives subtle clues before revealing code solutions.
  * **Error Troubleshooting**: Translates test assertion errors and stack traces into plain English.
  * **Submission Help**: Guides students on how to save, test, and submit work for Tech Lead review.
* **Quick-Action Chips**: Instant prompts like *"Where should I start?"*, *"Give me a hint"*, and *"Why did my test fail?"*.

### 🚀 3. First-Mission Guided Onboarding Tour
A welcoming 8-step onboarding walkthrough that greets first-time users before they touch the code editor:
1. **Welcome to WORKUP**: Explains the simulated workplace concept.
2. **Choose a Profession**: Select from Backend, Frontend, Data, Cloud, or ML.
3. **Meet Your Simulated Team**: Introduces FinFlow Technologies, Alex Rivera (Senior Backend Lead), and ticket `FF-001`.
4. **Understand Your Mission**: Outlines the task and expected outcomes.
5. **Explore Your Cloud Workspace**: Highlights the File Explorer, Code Editor, Test Terminal, Mission Guidance Drawer, and AI Helpdesk.
6. **Submit & Earn Evidence of Skill**: Explains how work is evaluated and verified.
* Includes a **"Tour & Guide"** button in the workbench top bar to replay the walkthrough anytime.

### 🎬 4. Interactive Mission Walkthrough Demo (`/demo`)
A dedicated interactive video-style presentation showcasing the end-to-end experience:
* **Interactive Controls**: Play/pause, scrubber timeline, speed toggles (1x, 1.5x, 2x), and chapter markers.
* **6 Chapters**:
  1. `0:00` — Welcome & Career Selection
  2. `0:45` — Receiving Ticket FF-001 at FinFlow Technologies
  3. `1:30` — Provisioning Isolated Cloud Workspace & Locating `validator.py`
  4. `2:15` — Consulting AI Helpdesk (Quila) for Progressive Hints
  5. `3:00` — Implementing Fix & Running Automated Pytest Suite
  6. `3:45` — Submission & Earning Verified Evidence of Skill
* Direct button to transition from the demo into the live cloud workspace.

### ⚡ 5. Isolated Cloud Workspace Orchestration
* **Secure Sandbox**: Ephemeral environments with isolated virtual directories, strict CPU/memory limits, execution timeouts, and secret shielding (platform credentials stripped from student sub-processes).
* **Automated Test Runner**: 1-click test execution running `pytest` or `unittest` with real-time console feedback.
* **Auto-Reaping**: Stale or idle workspaces are automatically decommissioned while preserving student deliverables in the artifact vault.

### 🏆 6. AI Tech Lead Review & Verified Evidence of Skill (`/portfolio/[slug]`)
* **Rubric-Driven Evaluation**: Submissions are evaluated against weighted, multi-criterion engineering rubrics.
* **Tech Lead Review Letter**: Synthesizes persona-driven feedback (e.g. from Alex Rivera or Sarah Chen) highlighting strengths and areas for improvement.
* **Cryptographic Evidence Dossier**: Successful submissions ($\ge 70\%$) mint an immutable, SHA-256 hashed portfolio credential with a public URL for recruiters to verify.

### 📊 7. Admin & Author Dashboards & Mission Outcome Hub
* **Admin Dashboard (`/admin`)**:
  * Platform-wide metrics: Total missions, published, drafts, archived, total attempts, pass rate %, average score %.
  * **Mission-Wise Learner Performance Table**: Attempts, pass rates, and average scores per mission.
  * **Author-Wise Contributions Table**: Missions created, total learner attempts, and completions per author.
* **Author Studio (`/admin` for `content_author`)**:
  * Scoped strictly to missions authored by the logged-in author, preserving author privacy.
* **Mission Outcome Tracking Hub (`/admin/outcomes`)**:
  * Comprehensive outcome records across all learners: `Not Started`, `In Progress`, `Submitted`, `Under Review`, `Passed`, `Needs Improvement`, `Failed`.
  * Detail modal inspecting test stdout/stderr, reviewer feedback, and final scores.

---

## 3. Beginner-Friendly Mission Collection (10–30 min each)

| Ticket | Profession | Company & Dept | Mission Objective | Key Files |
| :--- | :--- | :--- | :--- | :--- |
| **FF-001** | **Backend Developer** | **FinFlow Technologies**<br>*(Backend Engineering)* | Fix login email validation accepting empty strings | `src/auth/validator.py`<br>`tests/test_validator.py` |
| **NC-001** | **Frontend Developer** | **Nova Commerce**<br>*(Web UX Engineering)* | Fix broken checkout submit button locked in disabled state | `src/components/CheckoutButton.py`<br>`tests/test_checkout.py` |
| **MLOG-001** | **Data Analyst** | **MetroLogistics**<br>*(Business Intelligence)* | Calculate delivery turnaround times and tally SLA-delayed packages | `src/analysis/delivery_metrics.py`<br>`data/deliveries.json` |
| **DP-001** | **Python Developer** | **DataPulse Analytics**<br>*(Core Automation)* | Fix invoice tiered order discount calculation percentages | `src/calculator/discounts.py`<br>`tests/test_discounts.py` |
| **SRC-001** | **Cloud Engineer** | **SkyRoute Cloud**<br>*(Cloud Infrastructure)* | Fix API gateway CORS configuration rejecting mobile clients | `config/gateway_cors.json`<br>`tests/test_cors.py` |
| **VIQ-001** | **ML Engineer** | **VisionIQ Labs**<br>*(Applied AI)* | Implement prediction confidence threshold filter | `src/model/evaluator.py`<br>`tests/test_evaluator.py` |
| **SP-001** | **QA Engineer** | **SecurePay Systems**<br>*(Quality Assurance)* | Author edge-case unit test suite for password policies | `src/registration.py`<br>`tests/test_registration.py` |
| **COW-001** | **DevOps Engineer** | **CloudOps Works**<br>*(CI/CD Platform)* | Fix test error trapping script in CI automated build pipeline | `scripts/ci_test_runner.py`<br>`tests/test_ci.py` |

*(Plus flagship multi-phase production tracks: **OmniRetail MLOps Drift Detection & Governance** and **FinFlow Webhook Idempotency & Latency Optimization**).*

---

## 4. Technology Stack

* **Frontend:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Lucide Icons
* **Backend / API:** Next.js Route Handlers (28 RESTful typed endpoints, Zod validation)
* **Database & ORM:** Prisma ORM 5 with SQLite (`dev.db`) for instant zero-dependency local setup
* **AI Evaluation & Mentorship:** Built-in rule-based reasoning engine & AI Tech Lead evaluator with progressive hints and structured rubric scoring
* **Authentication & RBAC:** Password hashing (`bcryptjs`), signed JWT sessions (`jose`), HTTP-only cookies, supporting `student`, `content_author`, `reviewer`, and `administrator` roles
* **Testing:** Vitest automated test runner (11 test suites, 45 tests, 100% pass rate)

---

## 5. Local Development Setup

### Prerequisites
* **Node.js**: v18.18+ or v20+ or v22+
* **npm**: v9+ or v10+
* **Git**

### Step 1: Clone the Repository
```bash
git clone https://github.com/asam0001/WORKUP.git
cd WORKUP
```

### Step 2: Configure Environment Variables
Copy the template configuration:
```bash
cp .env.example .env
```
Default `.env` configuration (zero external database configuration required):
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="workup-super-secret-dev-jwt-key-change-in-production-min-32-chars"
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="workup"
LOG_LEVEL="info"
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Initialize the Database & Seed Missions
Generate Prisma Client, push the schema, and seed the mission catalog:
```bash
npx prisma generate
npx prisma db push
npm run seed
```

### Step 5: Start the Development Server
```bash
npm run dev
```
*(On Windows PowerShell where script execution is restricted, run: `npm.cmd run dev` or `node ./node_modules/next/dist/bin/next dev`)*

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Pre-seeded Demo Accounts

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Student** | `student@workup.dev` | `Password123` | Career Explorer, Interactive Cloud Workbench, AI Helpdesk, Verified Portfolio |
| **Administrator** | `admin@workup.dev` | `Password123` | Platform Administration, Mission Outcomes Hub, Workspace Fleet, Content Authoring |
| **Content Author** | `author@workup.dev` | `Password123` | Author Studio, Authored Missions Performance Analytics, Mission Management |
| **Reviewer** | `reviewer@workup.dev` | `Password123` | Submissions & Reviews, Manual Code Review Inspection |

*(You can also register a brand-new student account via `/auth/register`)*.

---

## 7. Automated Testing & Verification

Run the full test suite with Vitest:
```bash
npm test
```

### Test Suite Coverage (100% Passing)
```text
✓ src/tests/helpdesk.test.ts (5 tests) — AI Helpdesk explanations, step guidance, progressive hints, error triage
✓ src/tests/mission-outcomes.test.ts (3 tests) — Mission outcome tracking, status transitions, author scoping
✓ src/tests/rbac.test.ts (4 tests) — Role-based access control matrix
✓ src/tests/validation.test.ts (4 tests) — Input sanitization & schema validation
✓ src/tests/validator.test.ts (6 tests) — Task validation engine & dependency cycles
✓ src/tests/admin-authoring.test.ts (1 test) — Content authoring engine
✓ src/tests/domain.test.ts (5 tests) — Relational domain integrity
✓ src/tests/evaluation.test.ts (3 tests) — AI Tech Lead scoring & portfolio minting
✓ src/tests/auth.test.ts (3 tests) — Password hashing & JWT sessions
✓ src/tests/workspace-orchestrator.test.ts (4 tests) — Sandbox provisioning, concurrency limits, auto-reaping
✓ src/tests/workspace-provider.test.ts (7 tests) — Process isolation, timeout enforcement, secret shielding

Test Files: 11 passed (11)
Tests:      45 passed (45)
```

### Clean Production Build Verification
```bash
npm run build
```
Compiled and prerendered 24 static/dynamic routes and 28 API endpoints with `0` errors.

---

## 8. Application Navigation & Route Structure

```
WORKUP Platform
├── Learner Experience
│   ├── /                          # Landing page with value proposition
│   ├── /demo                      # Interactive 4-minute mission walkthrough demo
│   ├── /careers                   # Career explorer & profession tracks
│   ├── /careers/[slug]            # Role breakdown and technical backlog
│   ├── /companies                 # Simulated companies & tech stacks directory
│   ├── /resources                 # Zero-jargon engineering handbooks
│   ├── /dashboard                 # Student workstation & active workspace alert
│   ├── /workspaces/[id]           # Cloud workbench (Editor, Terminal, Mission Guidance, AI Helpdesk)
│   ├── /submissions/[id]          # AI Tech Lead review letter & rubric scorecard
│   └── /portfolio/[slug]          # Public cryptographically verified Evidence of Skill
├── Staff & Administration
│   ├── /admin                     # Platform administration & Author Studio
│   ├── /admin/outcomes            # Mission Outcome Tracking Hub
│   ├── /admin/authoring           # Mission & content authoring studio
│   ├── /admin/submissions         # All submissions audit table
│   └── /admin/workspaces          # Active workspace fleet & resource telemetry
└── Authentication
    ├── /auth/login                # Login with session cookie
    ├── /auth/register             # Registration
    └── /auth/reset-password       # Secure password reset flow
```

---

## 9. Repository Structure

```
workup/
├── prisma/
│   ├── schema.prisma              # Domain schema (Missions, Outcomes, Helpdesk, Workspaces, Rubrics)
│   ├── seed.ts                    # Database seeder with 8 beginner missions & sample outcomes
│   └── dev.db                     # Local SQLite database
├── src/
│   ├── app/
│   │   ├── api/                   # 28 RESTful API route handlers
│   │   │   ├── admin/             # Stats, outcomes, authoring, workspaces, and audit APIs
│   │   │   ├── auth/              # Login, register, logout, me, reset-password
│   │   │   ├── helpdesk/          # Contextual AI Helpdesk chat endpoint
│   │   │   ├── portfolio/         # Public recruiter verification API
│   │   │   └── workspaces/        # Provisioning, execute, test, snapshot, submit APIs
│   │   ├── admin/                 # Administration, Author Studio, and Outcomes Hub
│   │   ├── careers/               # Career tracks and role details
│   │   ├── companies/             # Simulated company profiles and engineering teams
│   │   ├── dashboard/             # Learner workstation dashboard
│   │   ├── demo/                  # Interactive mission walkthrough demo
│   │   ├── portfolio/             # Verified Evidence of Skill dossiers
│   │   ├── resources/             # Engineering handbooks and tutorials
│   │   ├── simulations/           # Simulation details and ticket backlogs
│   │   ├── submissions/           # AI Tech Lead review letters and scorecards
│   │   └── workspaces/            # Cloud workbench (Editor, Terminal, Guidance, Helpdesk)
│   ├── components/
│   │   ├── ai-helpdesk.tsx        # Floating AI Helpdesk (Quila) component
│   │   ├── mission-guidance.tsx   # Mission Guidance drawer component
│   │   ├── first-mission-onboarding.tsx # Guided onboarding tour modal
│   │   ├── mission-demo-player.tsx # Interactive video walkthrough player
│   │   ├── navbar.tsx             # Responsive platform navigation bar
│   │   └── role-badge.tsx         # RBAC role chip component
│   ├── lib/
│   │   ├── evaluation/            # AI Tech Lead rubric scoring & portfolio minting
│   │   ├── helpdesk/              # Assistant logic, progressive hints, and error triage
│   │   ├── workspace/             # Workspace orchestrator & isolated sandbox provider
│   │   ├── auth.ts                # Session management & password hashing
│   │   ├── rbac.ts                # Role permissions matrix
│   │   └── prisma.ts              # Database client singleton
│   └── tests/                     # 11 Vitest test suites (45 tests)
├── package.json
└── tsconfig.json
```

---

## 10. License

Private prototype developed for the **[workup] Virtual Professional Experience Platform**.
All rights reserved.
