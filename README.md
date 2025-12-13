# GrindLink

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

## 📚 Documentation Index

This repository is a **Turborepo** monorepo. Detailed documentation for each application can be found below:

- **[Backend API Documentation](./apps/api/README.md)**: A deep dive into the Go, Fiber, PostgreSQL, and AI logic.
- **[Frontend Web Documentation](./apps/web/README.md)**: A deep dive into the Next.js, TypeScript, and Web3 architecture.
- **[System Workflows](./docs/WORKFLOWS.md)**: A detailed breakdown of how the services interact for key features.

---

## 🌟 Overview

GrindLink is designed to solve the biggest problems in modern tech recruiting: resume spam, skill misrepresentation, and candidate ghosting. We achieve this through a unique, hybrid architecture:

*   **AI-First Approach:** We use Large Language Models (Cerebras/Llama 3.3) to parse resumes, generate professional summaries, and power our autonomous sourcing and screening agents.
*   **Proof-of-Skill:** Instead of relying solely on resumes, our platform is built to integrate on-chain and off-chain proof of a candidate's abilities.
*   **Hybrid Identity:** Users can sign up with a traditional email/password or connect a crypto wallet, binding their professional profile to a decentralized identity.

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
