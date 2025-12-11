Here is a comprehensive, professional, and extensively detailed `README.md` file tailored for your repository. You can copy and paste this directly into your root `README.md`.

***

# RizeOS Monorepo (GrindLink)

**The Proof-of-Skill Protocol & AI-Native Recruitment Platform**

RizeOS is a next-generation monorepo platform that bridges Web2 professional data with Web3 identity. It features autonomous AI recruiting agents, semantic job matching, decentralized identity (wallet-based auth), and a "Proof-of-Skill" community protocol.

---

## 📚 Table of Contents

1. [Architecture Overview](#-architecture-overview)
2. [Tech Stack](#-tech-stack)
3. [Directory Structure](#-directory-structure)
4. [Database Schema](#-database-schema)
5. [Backend Documentation (API)](#-backend-documentation-appsapi)
    - [Core Logic & Handlers](#core-logic--handlers)
    - [AI & Smart Matching Algorithms](#ai--smart-matching-algorithms)
6. [Frontend Documentation (Web)](#-frontend-documentation-appsweb)
    - [Dashboards & Agents](#dashboards--agents)
    - [Web3 Integration](#web3-integration)
7. [Workflows & System Design](#-workflows--system-design)
8. [Getting Started](#-getting-started)
9. [Environment Variables](#-environment-variables)

---

## 🏛 Architecture Overview

This project is a **Turborepo** monorepo containing a high-performance Go backend and a Next.js 14 frontend.

*   **Hybrid Identity:** Users can login via Email/Password OR Crypto Wallet (Web3).
*   **AI-First:** Resume parsing is handled by Large Language Models (Cerebras/Llama 3.3). Job matching uses custom tokenization and synonym mapping algorithms.
*   **Clean Architecture:** The backend separates concerns into Configuration, Database (SQLC), Handlers (HTTP), and Services (External Logic).

---

## 🛠 Tech Stack

### **Apps**
| Component | Technology | Description |
| :--- | :--- | :--- |
| **Web** | Next.js 14 (App Router) | React framework with Server Components. |
| **API** | Go (Golang) 1.25 | High-performance backend service. |

### **Libraries & Tools**
*   **Frontend:** TypeScript, Tailwind CSS, Shadcn UI, Framer Motion, Wagmi/Viem (Web3), Recharts (Analytics), UploadThing (Storage).
*   **Backend:** Fiber (Web Framework), pgx (Postgres Driver), sqlc (Type-safe SQL), PDFParse, Cerebras SDK.
*   **Database:** PostgreSQL 15+ with `pgvector` extension.
*   **Build System:** Turborepo.

---

## 📂 Directory Structure

```text
aswinbala005-rizeos-monorepo/
├── apps/
│   ├── api/                        # Golang Backend Service
│   │   ├── cmd/server/             # Entry point (main.go, server.go)
│   │   ├── internal/
│   │   │   ├── config/             # Environment variable loader
│   │   │   ├── db/                 # Database connection & SQLC generated code
│   │   │   │   └── queries/        # Raw SQL queries
│   │   │   ├── handlers/           # HTTP Controllers (Business Logic)
│   │   │   └── services/           # External integrations (AI, PDF)
│   │   └── migrations/             # SQL migration files (Up/Down)
│   └── web/                        # Next.js Frontend Application
│       ├── app/                    # App Router (Pages & Layouts)
│       │   ├── api/                # Next.js API Routes (Proxy & UploadThing)
│       │   ├── dashboard/          # Protected Routes (Seeker/Recruiter)
│       │   └── auth/               # Authentication Pages
│       ├── components/             # Reusable UI Components
│       ├── hooks/                  # Custom React Hooks (Data Fetching)
│       └── providers/              # Context Providers (Web3, QueryClient)
├── packages/                       # Shared Configs
│   ├── eslint-config/              # Linting rules
│   └── typescript-config/          # TSConfig bases
└── turbo.json                      # Monorepo build pipeline config
```

---

## 🗄 Database Schema

The database is managed via SQL migrations located in `apps/api/migrations`.

### Key Tables
1.  **`users`**
    *   Stores both **Candidates** and **Recruiters**.
    *   **Fields:** `wallet_address` (Unique), `email`, `role` (ENUM), `projects` (JSONB), `skills`, `embedding` (Vector).
    *   **Recruiter Fields:** `organization_name`, `organization_bio`, `professional_email`.
2.  **`jobs`**
    *   **Fields:** `recruiter_id` (FK), `title`, `description`, `salary_min`, `salary_max`, `status` (OPEN/CLOSED).
    *   **AI:** `embedding` column (Vector 384 dim) for semantic search.
3.  **`applications`**
    *   **Fields:** `job_id`, `candidate_id`, `status` (SENT, VIEWED, DECISION), `match_score` (0-100).

---

## 🔌 Backend Documentation (`apps/api`)

The backend is built with **Go** and **Fiber**. It uses **sqlc** to generate type-safe Go code from raw SQL.

### Core Logic & Handlers (`internal/handlers`)

#### 1. `UserHandler` (`user_handler.go`)
*   **`CreateUser`**: Registers users. Hashes passwords using `bcrypt`. Supports role assignment (CANDIDATE/RECRUITER).
*   **`Login`**: Standard email/password authentication.
*   **`GetUser`**: Dual-lookup strategy. Fetches user by `email` OR `wallet_address` (0x...).
*   **`UpdateUser`**: Handles profile updates.
    *   *Logic:* Splits logic based on role. Recruiters update organization details; Seekers update projects (stored as JSONB).
*   **`SearchCandidates`**: **(Agent Feature)** Uses PostgreSQL Full-Text Search (`websearch_to_tsquery`) to find candidates based on natural language queries (e.g., "React developer with Go").

#### 2. `JobHandler` (`job_handler.go`)
*   **`CreateJob`**: Creates a job listing linked to a recruiter.
*   **`ListJobs`**: Fetches all `OPEN` jobs.
    *   **Smart Matching Logic**: When a candidate requests jobs, this handler calculates a `match_score` dynamically based on the overlap between Job Requirements and Candidate Skills/Role.
*   **`ListJobsByRecruiter`**: Returns jobs owned by the authenticated recruiter.
*   **`GetDashboardStats`**: Aggregates applicant counts per job for the Recruiter Dashboard.

#### 3. `ApplicationHandler` (`application_handler.go`)
*   **`ApplyToJob`**: Creates an application record.
    *   *Workflow:* Fetches Job + Candidate details -> Calculates Match Score -> Saves to DB.
*   **`GetApplicationVolume`**: Returns time-series data (daily application counts) for analytics charts.
*   **`GetRecruiterApplications`**: Fetches *all* applications across *all* jobs for the "Faye" AI agent to screen.

#### 4. `ResumeHandler` (`resume_handler.go`)
*   **`ParseResume`**: The entry point for the AI Resume Parser.
    *   *Input:* PDF URL.
    *   *Process:* Downloads PDF -> Extracts Text -> Calls `ResumeService`.

### AI & Smart Matching Algorithms

#### **Resume Parsing (`internal/services/resume_service.go`)**
*   **`ExtractTextFromPDF`**: Uses `ledongthuc/pdf` to convert PDF bytes to raw string.
*   **`ParseResumeWithAI`**: Sends raw text to **Cerebras AI (Llama 3.3-70b)** with a strict system prompt to extract:
    *   Full Name, Email, Bio.
    *   Skills (Comma separated).
    *   Projects (Array of Title/Summary).
    *   *Output:* Returns a structured JSON object used to auto-fill frontend forms.

#### **Smart Score Algorithm (`job_handler.go`)**
A custom Go algorithm that scores candidates (0-100) against jobs:
1.  **Tokenization**: Splits skills/titles into normalized tokens.
2.  **Synonym Mapping**: Maps terms like "React" -> "Frontend", "ML" -> "AI".
3.  **Scoring**:
    *   **Role Match (50%)**: Direct or synonym match on Job Title.
    *   **Skill Overlap (50%)**: Ratio of matching skills.
    *   **Seniority Bonus**: Boosts score if "Senior" matches in both.

---

## 💻 Frontend Documentation (`apps/web`)

Built with **Next.js 14**, utilizing the App Router and Server Components.

### Dashboards & Agents

#### **Recruiter Dashboard (`/dashboard/recruiter`)**
*   **Analytics**: Visualizes hiring pipeline using `Recharts` (Area/Bar charts).
*   **Agent Tracer (Sourcing)**: A Chat UI that interfaces with the backend `SearchCandidates` API. Allows natural language sourcing.
*   **Agent Faye (Screening)**: An automated screener that buckets applicants into "High Signal" (>80% match), "Potential Fit", and "Low Signal".
*   **Job Management**: Post, Close, and Reopen jobs.

#### **Seeker Dashboard (`/dashboard/seeker`)**
*   **Job Feed**: Displays jobs sorted by **Match Score**, Salary, or Date.
*   **Match Badge**: A visual indicator (Green/Yellow/Gray) showing how well the user fits the role based on the backend algorithm.
*   **Application Tracker**: Visual timeline of application status (Sent -> Delivered -> In Review).

### Web3 Integration
*   **Provider**: `Web3Provider.tsx` wraps the app with **Wagmi** and **RainbowKit**.
*   **Auth**: The `AuthPage` allows connecting a wallet. The wallet address is sent to the backend during registration (`/users` endpoint) to bind the on-chain identity to the off-chain profile.

---

## 🔄 Workflows & System Design

### 1. The AI Resume Onboarding Flow
1.  **User Action**: Uploads PDF in `dashboard/seeker/onboarding`.
2.  **Frontend**: Uses `UploadThing` to store file -> Gets URL.
3.  **API Call**: POSTs URL to `/api/v1/parse-resume`.
4.  **Backend**: Downloads PDF -> Extracts Text -> Llama 3.3 Inference -> Returns JSON.
5.  **Frontend**: Auto-populates the React Hook Form with the extracted data.

### 2. The "Faye" Screening Agent Flow
1.  **Trigger**: Candidate applies to a job.
2.  **Calculation**: Backend calculates `match_score` immediately upon application.
3.  **Recruiter View**: Goes to `dashboard/recruiter/agents`.
4.  **Agent Logic**: Fetches all applications. Filters and sorts them by `match_score`.
5.  **Display**: Candidates are presented in tiered buckets (High/Medium/Low) for rapid review.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   Go 1.25+
*   PostgreSQL (with `pgvector` extension installed)
*   Turbo CLI (`npm install -g turbo`)

### Installation

1.  **Clone the repo:**
    ```bash
    git clone <repo-url>
    cd aswinbala005-rizeos-monorepo
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Database Setup:**
    *   Ensure Postgres is running.
    *   Run migrations located in `apps/api/migrations`.

4.  **Run the Monorepo:**
    ```bash
    turbo dev
    ```
    *   Frontend: `http://localhost:3000`
    *   Backend: `http://localhost:8080`

---

## 🔐 Environment Variables

Create a `.env` file in `apps/api` and `apps/web`.

### Backend (`apps/api/.env`)
```env
PORT=8080
DATABASE_URL=postgres://user:password@localhost:5432/rizeos?sslmode=disable
CEREBRAS_API_KEY=your_cerebras_ai_key
```

### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
INTERNAL_API_URL=http://127.0.0.1:8080 # For server-side proxying
NEXT_PUBLIC_WALLET_CONNECT_ID=your_wallet_connect_id
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```
