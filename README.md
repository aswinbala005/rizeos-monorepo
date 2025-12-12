# GrindLink (RizeOS Monorepo)

[![Status](https://img.shields.io/badge/status-live-brightgreen.svg)](https://grindlink-web.onrender.com)
[![Stack](https://img.shields.io/badge/stack-Go_|_Next.js-blue.svg)](https://github.com/aswinbala005/rizeos-monorepo)
[![License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](./LICENSE)

**The Proof-of-Skill Protocol & AI-Native Recruitment Platform.**

GrindLink is a next-generation hiring platform that bridges Web2 professional data with Web3 identity. It features autonomous AI recruiting agents, semantic job matching, and a decentralized, wallet-based authentication system.

---

## 🚀 Live Demo

This project is deployed and running in real-time on Render.

*   **Frontend (Next.js):** [**https://grindlink-web.onrender.com**](https://grindlink-web.onrender.com)
*   **Backend API (Go):** The frontend is configured to communicate with the live API.

---

## 📚 Table of Contents

1.  [Overview](#-overview)
2.  [Key Features](#-key-features)
3.  [Tech Stack](#-tech-stack)
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

## 🛠 Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Web** | Next.js 14 (App Router) | React framework with Server Components. |
| **API** | Go (Golang) 1.25 | High-performance backend service. |
| **Web3** | Wagmi / RainbowKit | Wallet connection and interaction. |
| **Styling** | Tailwind CSS + Shadcn UI | Modern, accessible component library. |
| **Database** | PostgreSQL + `pgvector` | Relational data and vector embeddings for AI. |
| **ORM/DAO** | `sqlc` | Generates type-safe Go code from raw SQL queries. |
| **AI** | Cerebras (Llama 3.3) | LLM for resume parsing and agent logic. |
| **Build System**| Turborepo | High-performance build system for monorepos. |
| **Deployment**| Render | Cloud platform for deploying web apps and services. |

---

## 🔄 System Workflows

### The AI Resume Onboarding Flow
This is a core feature that demonstrates the power of our AI integration.

1.  **Upload:** A user uploads their PDF resume on the frontend.
2.  **Storage:** The file is sent to `UploadThing`, which stores it and returns a secure URL.
3.  **API Call:** The frontend sends this URL to our Go backend at the `/api/v1/parse-resume` endpoint.
4.  **AI Processing:** The backend downloads the PDF, extracts the text, and sends it to the Cerebras AI with a structured prompt.
5.  **Response:** The AI returns a clean JSON object with the candidate's skills, experience, projects, and more.
6.  **Auto-Fill:** The frontend uses this JSON to populate the entire profile form, which the user can then review and submit.

---

## 🚀 Local Development Setup

### Prerequisites
*   Node.js 18+
*   Go 1.25+
*   PostgreSQL (with the `pgvector` extension enabled)
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
    *   Ensure your local PostgreSQL instance is running.
    *   Execute the SQL migration files located in `apps/api/migrations` to create the necessary tables and types.

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
DATABASE_URL=postgres://user:password@localhost:5432/rizeos?sslmode=disable
CEREBRAS_API_KEY=your_cerebras_ai_key
