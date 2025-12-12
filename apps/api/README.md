# GrindLink Backend API

The backend is a high-performance **Go** application using the **Fiber** web framework. It is designed for speed, concurrency, and type safety, leveraging **SQLC** to generate Go code from raw SQL queries and connecting to a **Neon** serverless PostgreSQL database.

---

## 📂 Directory Structure

The backend follows a standard Go project layout, separating concerns for maintainability and scalability.

```text
apps/api/
├── cmd/server/         # Main application entry point (main.go, server.go)
├── internal/
│   ├── config/         # Environment variable loading (config.go)
│   ├── db/             # Database connection logic and all SQLC-generated code
│   │   └── queries/    # Raw SQL files (*.sql) - THE SOURCE OF TRUTH for database logic
│   ├── handlers/       # HTTP Request Handlers (Controllers) for each resource
│   └── services/       # External service integrations (e.g., AI, PDF parsing)
├── migrations/         # SQL migration files for database schema evolution
├── go.mod              # Go module dependencies
└── sqlc.yaml           # Configuration file for the SQLC code generator
```

---

## 🛠 Setup & Configuration

### Environment Variables (`.env`)
Create a `.env` file in this directory (`apps/api/.env`):
```env
PORT=8080
# Your connection string from Neon (or a local Postgres instance)
DATABASE_URL=postgres://user:password@host:port/dbname?sslmode=require
# Your API key for the Cerebras AI service
CEREBRAS_API_KEY=your_cerebras_ai_key
```

### Running the Server Standalone
While `turbo dev` is recommended for development, you can run the API server independently from the `apps/api` directory:
```bash
go run cmd/server/main.go
```

---

## 🧠 Core Modules & Functions

### 1. Server & Routing (`cmd/server/server.go`)
*   **`NewServer()`**: Initializes all core components: config, database pool, SQLC queries, and the Fiber app.
*   **`setupMiddleware()`**: Configures global middleware, including `CORS` for the frontend, `Logger` for request logging, and `Recover` to prevent crashes from panics.
*   **`setupRoutes()`**: Defines all API endpoints under the `/api/v1` group. It instantiates handlers and maps them to specific HTTP methods and paths (e.g., `api.Post("/users", userHandler.CreateUser)`).

### 2. Handlers (`internal/handlers`)
These files are the "controllers" of the application, handling HTTP requests, validating input, calling database logic, and formatting responses.

*   **`user_handler.go`**: Manages all user-related operations.
    *   `CreateUser`: Registers a new user (Candidate or Recruiter). Hashes passwords using `bcrypt`.
    *   `Login`: Authenticates users via Email/Password.
    *   `GetUser`: A flexible endpoint that fetches a user by either their **Email** or their **Wallet Address**.
    *   `UpdateUser`: Handles profile updates with role-specific logic.
    *   `SearchCandidates`: Powers the **Agent Tracer** feature by using PostgreSQL's Full-Text Search (`websearch_to_tsquery`) to find candidates from natural language queries.

*   **`job_handler.go`**: Manages job postings and the matching logic.
    *   `CreateJob`: Posts a new job listing.
    *   `ListJobs`: Fetches all `OPEN` jobs. This is a critical function that contains the **Smart Matching Algorithm** (see below) to dynamically score jobs for the requesting candidate.
    *   `ListJobsByRecruiter`: Returns jobs owned by a specific recruiter.
    *   `GetDashboardStats`: Aggregates applicant counts for the recruiter dashboard.

*   **`application_handler.go`**: Manages the application process.
    *   `ApplyToJob`: Creates the link between a `candidate_id` and a `job_id`.
    *   `GetRecruiterApplications`: Powers the **Agent Faye** feature by fetching all applications across all of a recruiter's jobs for screening.
    *   `GetApplicationVolume`: Returns time-series data for the recruiter analytics charts.

*   **`resume_handler.go`**: The entry point for our AI pipeline.
    *   `ParseResume`: Accepts a public PDF URL, triggers the download and text extraction, and passes the content to the AI service.

### 3. Services (`internal/services`)
This layer contains business logic that is decoupled from the web framework.

*   **`resume_service.go`**:
    *   `ExtractTextFromPDF`: Uses the `ledongthuc/pdf` library to convert raw PDF bytes into a single string of text.
    *   `ParseResumeWithAI`: Sends the extracted text to the **Cerebras (Llama 3.3-70b)** API. It uses a carefully crafted system prompt to instruct the LLM to return a valid JSON object matching a predefined Go struct, ensuring reliable parsing.

### 4. Database (`internal/db` & `sqlc.yaml`)
We use **SQLC** to avoid writing boilerplate database code. The workflow is:
1.  Write raw, tested SQL queries in the `internal/db/queries/` directory.
2.  Run `sqlc generate`.
3.  SQLC reads `sqlc.yaml`, connects to the schema, validates the queries, and generates fully type-safe Go methods for every query. This provides the safety of an ORM with the performance of raw SQL.

---

## 🤖 Key Algorithms

### Smart Score Algorithm (`job_handler.go`)
This custom algorithm is the heart of our job feed. When a candidate requests the job list, we dynamically calculate a match score (0-100) for them against every open job.

1.  **Tokenization**: User skills (`"React, Go, Postgres"`) and job requirements are split into normalized, lowercase tokens (`["react", "go", "postgres"]`).
2.  **Synonym Mapping**: A predefined map expands tokens to include related technologies (e.g., a search for "AI" will also match "ML", "PyTorch", "Machine Learning").
3.  **Scoring Weights**:
    *   **Role/Title Match (50% weight):** A high score is given if the user's `job_role` directly or via synonym matches the job `title`.
    *   **Skill Overlap (50% weight):** Calculated as `(matching_skills / total_required_skills) * 50`.
    *   **Seniority Bonus**: A small bonus is added if terms like "Senior" or "Lead" match in both profiles.

---

## 📦 Key Dependencies (`go.mod`)

*   **`github.com/gofiber/fiber/v2`**: The core web framework.
*   **`github.com/jackc/pgx/v5`**: The high-performance PostgreSQL driver used for database connections.
*   **`github.com/joho/godotenv`**: For loading environment variables from a `.env` file.
*   **`github.com/ledongthuc/pdf`**: A pure Go library for extracting text from PDF files.
*   **`github.com/pgvector/pgvector-go`**: Provides the `Vector` type for working with `pgvector` embeddings.
*   **`golang.org/x/crypto/bcrypt`**: For secure password hashing.

---

## 🗄️ Database Migrations

Schema changes are managed via raw SQL migration files located in the `/migrations` directory. Each file is numbered sequentially and contains `up` logic to apply the change.

To apply migrations, you would typically use a migration tool compatible with raw SQL files, such as `golang-migrate/migrate` or `pressly/goose`.
```
