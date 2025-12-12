# GrindLink (RizeOS Monorepo)

[![Status](https://img.shields.io/badge/status-live-brightgreen.svg)](https://grindlink-web.onrender.com)
[![Stack](https://img.shields.io/badge/stack-Go_|_Next.js-blue.svg)](https://github.com/aswinbala005/rizeos-monorepo)
[![License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](./LICENSE)

**The Proof-of-Skill Protocol & AI-Native Recruitment Platform.**

GrindLink is a next-generation hiring platform that bridges Web2 professional data with Web3 identity. It features autonomous AI recruiting agents, semantic job matching, and a decentralized, wallet-based authentication system.

---

## 🚀 Live Deployment

This project is deployed and running in real-time.

*   **Frontend (Next.js):** [**https://grindlink-web.onrender.com**](https://grindlink-web.onrender.com) (Deployed as a Web Service on Render)
*   **Backend API (Go):** The frontend communicates with the live Go API, also deployed as a separate Web Service on Render.
*   **Database (Postgres):** Hosted on [**Neon**](https://neon.tech), a serverless PostgreSQL platform.

---

## 📚 Table of Contents

1.  [Overview](#-overview)
2.  [Key Features](#-key-features)
3.  [Comprehensive Tech Stack](#-comprehensive-tech-stack)
4.  [System Workflows](#-system-workflows)
5.  [Local Development Setup](#-local-development-setup)
6.  [Environment Variables](#-environment-variables)

---

## 🌟 Overview

GrindLink is designed to solve the biggest problems in modern tech recruiting: resume spam, skill misrepresentation, and candidate ghosting. We achieve this through a unique, hybrid architecture:

*   **AI-First Approach:** We use Large Language Models (Cerebras/Llama 3.3) to parse resumes, generate professional summaries, and power our autonomous sourcing and screening agents.
*   **Proof-of-Skill:** Instead of relying solely on resumes, our platform is built to integrate on-chain and off-chain proof of a candidate's abilities.
*   **Hybrid Identity:** Users can sign up with a traditional email/password or connect a crypto wallet, binding their professional profile to a decentralized identity.

---

## ✨ Key Features

### For Job Seekers (`CANDIDATE`)
*   **AI-Powered Onboarding:** Upload your resume (PDF) and have your entire profile auto-filled in seconds.
*   **Smart Job Matching:** Our custom algorithm scores and ranks jobs based on a deep understanding of your skills and career goals, not just keyword matching.
*   **Application Tracker:** A visual timeline to track your application status from "Sent" to "Viewed" to "Decision".
*   **Web3 Integration:** Connect your wallet to build an on-chain reputation.

### For Recruiters (`RECRUITER`)
*   **Autonomous AI Agents:**
    *   **Agent Tracer (Sourcing):** Use natural language to find the perfect candidates (e.g., "Find me a Go developer with experience in fintech").
    *   **Agent Faye (Screening):** Automatically screens and buckets all applicants into "High Signal," "Potential Fit," and "Low Signal" based on their match score.
*   **Analytics Dashboard:** Visualize your hiring pipeline with real-time data on application volume and job performance using `Recharts`.
*   **Seamless Job Posting:** A clean, multi-step interface to post, manage, close, and reopen job listings.

---

## 🛠 Comprehensive Tech Stack

### **Frontend (`apps/web`)**
| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | SSR, Routing, and full-stack capabilities. |
| **Language** | TypeScript | Type safety and improved developer experience. |
| **Styling** | Tailwind CSS & Shadcn UI | Utility-first CSS and a library of accessible components. |
| **State/Data** | TanStack Query (React Query) | Server-state management, caching, and data fetching. |
| **Web3** | Wagmi, Viem, RainbowKit | Wallet connection, contract interaction, and chain management. |
| **Forms** | React Hook Form & Zod | Performant form handling and schema validation. |
| **Animation** | Framer Motion | Declarative animations for a fluid user experience. |
| **Charts** | Recharts | Data visualization for analytics dashboards. |

### **Backend (`apps/api`)**
| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Language** | Go (Golang) 1.25 | High-performance, concurrent API development. |
| **Framework** | Fiber v2 | Express.js-inspired, high-performance web framework for Go. |
| **Database** | PostgreSQL (hosted on **Neon**) | Serverless, scalable Postgres for relational data. |
| **DB Driver** | `pgx/v5` | High-performance PostgreSQL driver for Go. |
| **ORM/DAO** | `sqlc` | Generates type-safe Go code directly from SQL queries. |
| **Vector Search**| `pgvector` Extension | Enables semantic search and AI-powered matching. |
| **AI/LLM** | Cerebras (Llama 3.3) | Powers resume parsing and AI agent logic. |
| **Auth** | `bcrypt` (Go Crypto) | Secure password hashing and comparison. |

### **Platform & Tooling**
| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Monorepo** | Turborepo | High-performance build system for managing the monorepo. |
| **Deployment** | Render | Cloud platform for deploying the Next.js and Go services. |
| **Database** | Neon | Serverless PostgreSQL hosting. |
| **File Storage**| UploadThing | Manages PDF resume uploads and storage. |

---

## 🔄 System Workflows

### The AI Resume Onboarding Flow
This is a core feature that demonstrates the power of our AI integration.

1.  **Upload:** A user uploads their PDF resume on the frontend.
2.  **Storage:** The file is sent to **UploadThing**, which stores it and returns a secure URL.
3.  **API Call:** The frontend sends this URL to our Go backend at the `/api/v1/parse-resume` endpoint.
4.  **AI Processing:** The backend downloads the PDF, extracts the text, and sends it to the **Cerebras AI** with a structured prompt.
5.  **Response:** The AI returns a clean JSON object with the candidate's skills, experience, projects, and more.
6.  **Auto-Fill:** The frontend uses this JSON to populate the entire profile form, which the user can then review and submit.

---

## 🚀 Local Development Setup

### Prerequisites
*   Node.js 18+
*   Go 1.25+
*   PostgreSQL (or a connection string from a Neon dev branch)
*   Turbo CLI (`npm install -g turbo`)

### Installation

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/aswinbala005/rizeos-monorepo.git
    cd rizeos-monorepo
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Database Setup:**
    *   Ensure your local PostgreSQL instance is running (with `pgvector` enabled) OR get your connection string from Neon.
    *   Execute the SQL migration files located in `apps/api/migrations` to create the schema.

4.  **Run the Monorepo:**
    ```bash
    turbo dev
    ```
    *   Frontend will be available at `http://localhost:3000`
    *   Backend API will be available at `http://localhost:8080`

---

## 🔐 Environment Variables

You will need to create two environment files for local development.

### Backend (`apps/api/.env`)
```env
PORT=8080
# Replace with your Neon connection string or local Postgres URL
DATABASE_URL=postgres://user:password@host:port/dbname?sslmode=require
CEREBRAS_API_KEY=your_cerebras_ai_key
