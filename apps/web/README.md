# GrindLink Frontend (Web App)

This is the Next.js 14 frontend for GrindLink, built with the App Router. It serves as the primary user interface for both Job Seekers and Recruiters, featuring dynamic dashboards, Web3 wallet integration, and AI-powered features.

---

## 📂 Directory Structure

The frontend is structured to separate concerns and leverage the Next.js App Router conventions.

```text
apps/web/
├── app/
│   ├── api/                # Next.js API Routes (Proxy & UploadThing)
│   ├── auth/               # Login/Signup Page & Logic
│   ├── dashboard/
│   │   ├── recruiter/      # Recruiter-specific routes, layouts, and pages
│   │   └── seeker/         # Seeker-specific routes, layouts, and pages
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Public landing page
├── components/
│   ├── dashboard/          # High-level components for dashboards (e.g., Navbars)
│   ├── landing/            # Components for the public landing page
│   └── ui/                 # Reusable, primitive components from Shadcn UI
├── hooks/                  # Custom React Query hooks for data fetching
├── lib/                    # Utility functions and constants (e.g., cn, abi.json)
└── providers/              # React Context providers (Web3Provider)
```

---

## ✨ Core Features & Modules

### 1. Hybrid Authentication (`app/auth/page.tsx`)
The app supports a dual identity model, allowing users to choose their preferred login method.
*   **Web2 (Email/Password):** A traditional, secure login flow using `bcrypt` on the backend.
*   **Web3 (Wallet):** Users can connect their crypto wallet using **RainbowKit**. The wallet address is then sent to the backend during registration to bind the on-chain identity to the off-chain profile.
*   **Session Management:** User sessions are managed via `localStorage` (`recruiter_email`, `seeker_email`) for persistence across browser tabs and reloads.

### 2. Seeker Dashboard (`app/dashboard/seeker/`)
*   **AI-Powered Onboarding:** The onboarding flow (`/onboarding`) uses **UploadThing** to handle resume uploads. The file URL is then sent to the backend's AI service to parse the resume and auto-fill the profile form, providing a seamless setup experience.
*   **Smart Job Feed:** The main job feed (`/jobs`) fetches opportunities and sorts them by the **Match Score** calculated by the backend's custom algorithm, ensuring the most relevant jobs are always at the top.
*   **Application Tracking:** The `/applications` page provides a clear, visual timeline of the status of every job application.

### 3. Recruiter Dashboard (`app/dashboard/recruiter/`)
*   **AI Agents (`/agents`):**
    *   **Tracer (Sourcing):** A chat-based interface that allows recruiters to find candidates using natural language queries.
    *   **Faye (Screening):** An automated pipeline that fetches all applicants for a recruiter's jobs and buckets them into "High Signal," "Potential Fit," and "Low Signal" based on their match score.
*   **Analytics (`/dashboard`):** A data-rich dashboard using **Recharts** to visualize key hiring metrics like application volume over time and performance per job.
*   **Job Management:** A full suite of tools to post, review, close, and reopen job listings.

---

## 🛠 Key Technologies & Architectural Patterns

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | SSR, file-based routing, and API routes. |
| **State/Data** | TanStack Query | Manages server state, caching, and data fetching via custom hooks. |
| **Web3** | Wagmi, Viem, RainbowKit | Provides a robust and user-friendly wallet connection experience. |
| **Styling** | Tailwind CSS & Shadcn UI | Ensures a consistent, modern, and accessible design system. |
| **Forms** | React Hook Form & Zod | Delivers performant form handling with strong schema validation. |
| **File Uploads**| UploadThing | Simplifies file uploads for resumes, handling storage and URL generation. |

### API Proxy (`app/api/[...proxy]/route.ts`)
To prevent CORS issues during local development, the Next.js server acts as a proxy. All requests made from the client to `/api/v1/*` are automatically forwarded to the Go backend running on `http://localhost:8080/api/v1/*`. This is handled by the route file at `app/api/[...proxy]/route.ts`.

### Data Fetching with Custom Hooks (`/hooks`)
All data fetching is centralized in custom hooks (e.g., `useJobs`, `useApplications`). These hooks encapsulate TanStack Query's `useQuery` logic, providing a clean, reusable, and auto-caching API for components to consume data without worrying about the implementation details.

---

## 🚀 Running Locally

This application is part of a Turborepo monorepo.

1.  **Navigate to the root directory** of the monorepo.
2.  Ensure the **Go backend is running** or will be started by the `dev` script. This frontend is dependent on the API.
3.  Run the development server:
    ```bash
    npm install
    turbo dev
