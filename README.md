# [workup] — Virtual Professional Experience Platform

> **Experience how engineers actually work inside companies.**  
> Built on the production foundation approved during Phase 0:  
> `Career → Role → Company → Business Problem → Professional Task → Real Tools → Cloud Workspace → Implementation → Testing → Review → Deployment → Monitoring → Debugging → Evidence of Skill`

---

## 1. System Overview

**[workup]** is a production-grade Virtual Professional Experience Platform designed to bridge academic theory and practical corporate engineering.

The platform is NOT:
* An online course platform with passive video lectures.
* A coding challenge website testing isolated single-file algorithms.
* A generic AI tutor answering questions out of context.
* A certificate mill generating unverifiable PDF badges.
* A fake virtual office with 2D avatars.

Instead, learners step into the shoes of practicing engineers inside simulated tech companies. They receive business problem tickets, open containerized cloud workspaces, inspect legacy codebases with technical debt and Architecture Decision Records (ADRs), write code according to corporate style guides, pass unit/integration tests, endure rigorous line-level pull request reviews from an **AI Tech Lead**, trigger staging deployments, observe synthetic production telemetry in Grafana, hotfix live production alerts, and graduate with an immutable, cryptographically verifiable **Evidence of Skill Dossier** backed by real Git commits.

---

## 2. Technology Stack

* **Frontend:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Lucide Icons
* **Backend / API:** Next.js Route Handlers (RESTful, typed APIs, Zod validation, structured error handling)
* **Database & ORM:** Prisma ORM 5 with SQLite (`dev.db`) for instant zero-dependency local setup; seamless migration path to PostgreSQL for production
* **Authentication:** Password hashing with `bcryptjs`, signed JWT sessions via `jose`, HTTP-only secure cookies, and password reset flows
* **Authorization:** Role-Based Access Control (RBAC) supporting `student`, `content_author`, `reviewer`, and `administrator` roles
* **Testing:** Vitest automated test suite with TypeScript path aliasing and unit/integration test suites
* **CI/CD:** GitHub Actions workflow executing linting, migrations, database seeding, test runner, and production build checks

---

## 3. Core Domain Entities

The platform is architected to be completely domain-agnostic, supporting any future technical discipline (Software Engineering, AI/ML, Cloud/DevOps, Cybersecurity, Data Engineering) without hard-coding specific logic:

1. **`User`**: System account with role (`student`, `content_author`, `reviewer`, `administrator`), status, and credential hashes.
2. **`Profile`**: Developer portfolio profile, headline, bio, experience level, GitHub/LinkedIn links, and preferences.
3. **`Session`**: Active authenticated session tokens with database revocation and expiration tracking.
4. **`PasswordResetToken`**: Single-use time-limited tokens for secure password recovery.
5. **`Profession`**: High-level engineering disciplines (e.g. *Software Engineering*, *AI & Machine Learning*).
6. **`Role`**: Industry job titles within a profession (e.g. *Junior Backend Engineer*, *Associate MLOps Engineer*).
7. **`Skill`**: Normalized technical competencies (e.g. *Python*, *FastAPI*, *PostgreSQL*, *Redis*, *MLflow*, *Docker*, *pytest*).
8. **`RoleSkill`**: Many-to-many relationship mapping skills to roles.
9. **`Company`**: Simulated employers (e.g. *FinFlow Technologies*, *OmniRetail Marketplace*) with size, culture, tech stack, and architecture overviews.
10. **`Team`**: Engineering teams within companies with charters, tech leads, and communication channels.
11. **`Simulation`**: Business scenario packages containing projects, difficulty ratings, and estimated hours.
12. **`Project`**: Sprints within a simulation with business objectives and Architecture Decision Records (ADRs).
13. **`Task`**: Individual tickets with ticket keys (e.g. `FF-104`, `OR-201`), types (`INVESTIGATION`, `IMPLEMENTATION`, `TESTING`, `CODE_REVIEW`, `DEPLOYMENT`, `MONITORING_INCIDENT`), and acceptance criteria.
14. **`TaskSkill`**: Technical skills exercised by specific tasks.
15. **`TaskDependency`**: Directed acyclic graph (DAG) specifying prerequisites and task blocking rules.
16. **`Workspace`**: Cloud container session state and DevContainer configuration metadata.
17. **`Submission`**: Pull request records, branch names, commit SHAs, and diff summaries.
18. **`Evaluation`**: Automated AI Tech Lead or human reviewer rubric scores, line-level critiques, and approval status.
19. **`PortfolioItem`**: Verified Evidence of Skill dossier showcasing completed simulations with audit trails.
20. **`AuditLog`**: Immutable platform audit events recording user actions, IP addresses, and metadata.

---

## 4. Local Development Setup

Follow these exact steps to run the platform locally on your machine.

### Prerequisites

* **Node.js**: v18.18+ or v20+ or v22+
* **npm**: v9+ or v10+
* **Git**

### Step 1: Clone the Repository

```bash
git clone <repository-url> workup
cd workup
```

### Step 2: Configure Environment Variables

Copy the example environment configuration:

```bash
cp .env.example .env
```

The default `.env` configuration uses SQLite (`file:./dev.db`), requiring **zero external database setup**:

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

### Step 4: Initialize the Database & Seed Data

Generate the Prisma client, synchronize the schema, and seed the flagship simulation catalog:

```bash
# Generate client and sync SQLite schema
npx prisma generate
npx prisma db push

# Seed initial users, professions, roles, companies, and simulations
npm run seed
```

### Step 5: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Default Demo Accounts

The database seed provisions active test accounts for all four supported platform roles:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Student** | `student@workup.dev` | `Password123` | View tracks, launch simulations, submit pull requests, edit profile |
| **Administrator** | `admin@workup.dev` | `Password123` | Full access, view platform metrics, inspect system audit logs |
| **Content Author** | `author@workup.dev` | `Password123` | Author and modify simulations, projects, tasks, and company scenarios |
| **Reviewer** | `reviewer@workup.dev` | `Password123` | Inspect student submissions, score rubrics, approve/request changes |

*(You can also register a brand-new account directly via `/auth/register`)*.

---

## 6. Running the Automated Test Suite

The test suite is powered by **Vitest** and tests authentication, role authorization, domain entity relationships, and schema validations:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 7. Repository Structure

```
workup/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI workflow
├── prisma/
│   ├── schema.prisma            # Complete 20-entity domain schema
│   ├── seed.ts                  # Seed script with flagship enterprise tracks
│   └── dev.db                   # Local SQLite database (git-ignored)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/            # Auth endpoints (register, login, logout, me, reset)
│   │   │   ├── professions/     # Professions & roles catalog API
│   │   │   ├── simulations/     # Simulations & detailed slug API
│   │   │   ├── profile/         # Profile management API
│   │   │   └── admin/           # Platform stats and audit log APIs
│   │   ├── auth/                # Auth pages (login, register, forgot/reset password)
│   │   ├── dashboard/           # Student workstation dashboard
│   │   ├── careers/             # Career explorer & profession views
│   │   ├── simulations/         # Simulation detail, ADR, and task backlog
│   │   ├── profile/             # User profile editing & portfolio
│   │   ├── admin/               # Admin governance & audit logs
│   │   ├── layout.tsx           # Global layout with Navbar, Footer, ErrorBoundary
│   │   ├── page.tsx             # Interactive landing page
│   │   ├── globals.css          # Tailwind CSS styling
│   │   ├── error.tsx            # Global error boundary
│   │   └── not-found.tsx        # 404 page
│   ├── components/
│   │   ├── navbar.tsx           # Session-aware navigation bar
│   │   ├── footer.tsx           # Platform footer & loop diagram
│   │   ├── error-boundary.tsx   # React ErrorBoundary component
│   │   ├── role-badge.tsx       # RBAC role chip component
│   │   ├── profession-card.tsx  # Career discipline preview card
│   │   └── simulation-card.tsx  # Enterprise simulation card
│   ├── lib/
│   │   ├── env.ts               # Zod-validated environment configuration
│   │   ├── logger.ts            # Structured JSON logger
│   │   ├── prisma.ts            # Singleton Prisma client instance
│   │   ├── auth.ts              # Password hashing, JWT sessions, cookies
│   │   ├── rbac.ts              # Role-Based Access Control matrix
│   │   ├── api-response.ts      # Typed API response & error formatters
│   │   └── utils.ts             # Styling & date utilities
│   ├── types/
│   │   └── index.ts             # Domain models, enums, and Zod schemas
│   └── tests/
│       ├── auth.test.ts         # Password hashing & JWT session tests
│       ├── rbac.test.ts         # Role permission & guard tests
│       ├── domain.test.ts       # Database relationships & constraints
│       └── validation.test.ts   # Input sanitization & password complexity
├── .env.example                 # Documented environment variables template
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
├── next.config.mjs              # Next.js production configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── vitest.config.ts             # Vitest test runner configuration
```

---

## 8. Verification of Acceptance Criteria

All Phase 1 foundational acceptance criteria are fully met:

1. **Clone the repository:** Clean, self-contained repository with standard npm scripts.
2. **Configure environment variables:** `.env.example` provided with secure defaults.
3. **Run the application locally:** `npm run dev` boots Next.js at `http://localhost:3000`.
4. **Create an account:** `/auth/register` creates verified users with selected roles.
5. **Log in:** `/auth/login` verifies credentials, writes secure HTTP-only cookies, and redirects to `/dashboard`.
6. **View available professions:** `/careers` lists professions, roles, and skills.
7. **View a simulation:** `/simulations/payment-webhook-idempotency-and-optimization` presents the full business scenario, ADR, team topology, and task backlog.
8. **Run the automated test suite:** `npm test` runs 15 passing tests across 4 test suites.
