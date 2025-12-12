# Database Migrations

This directory contains the SQL migration files for the GrindLink database schema. Migrations allow us to version-control our database, ensuring that schema changes are consistent, repeatable, and easy to manage across different development and production environments.

---

## 📜 Migration Philosophy

We use a **timestamp-based, raw SQL migration** approach. Each file represents a single, incremental change to the database schema.

*   **Immutable History:** Once a migration is applied, its file should never be edited. To revert a change, a new migration must be created to undo the previous one.
*   **Clarity:** Writing raw SQL makes the changes explicit and easy for any developer to understand without needing to know a specific ORM's syntax.

---

## 🗄️ Database Schema Overview

The migrations in this directory build the following core tables:

1.  **`users`**: A central table storing both `CANDIDATE` and `RECRUITER` profiles. It includes fields for Web2 authentication (`email`, `password_hash`) and Web3 identity (`wallet_address`). Recruiter-specific details like `organization_name` are also present.

2.  **`jobs`**: Contains all job postings. It is linked to the `users` table via `recruiter_id` and includes detailed fields for salary, location, skills, and job status (`OPEN`/`CLOSED`).

3.  **`applications`**: A join table that connects a `candidate_id` from the `users` table to a `job_id` from the `jobs` table. It stores the application status and the AI-calculated `match_score`.

---

## ⚙️ Workflow

### Creating a New Migration

1.  **Create a new file** in this directory using the naming convention `XXX_description.up.sql`, where `XXX` is the next sequential number (e.g., `014_add_new_user_field.up.sql`).
2.  **Write the SQL** for your schema change. Use DDL (Data Definition Language) commands like `CREATE TABLE`, `ALTER TABLE`, `CREATE INDEX`, etc.

    **Example: Adding a new column**
    ```sql
    -- In file 014_add_linkedin_profile.up.sql
    ALTER TABLE users
    ADD COLUMN linkedin_url TEXT;
    ```

### Applying Migrations

In a production environment or a collaborative team, you would use a dedicated migration tool like [golang-migrate/migrate](https://github.com/golang-migrate/migrate) or [pressly/goose](https://github.com/pressly/goose) to apply these changes systematically.

**Example command using `golang-migrate`:**
```bash
# This command would be run from the apps/api directory
migrate -database "${DATABASE_URL}" -path migrations up
