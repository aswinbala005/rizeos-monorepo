-- name: CreateJob :one
INSERT INTO jobs (
  recruiter_id, title, description, requirements, is_paid,
  job_type, location_type, location_city, salary_min, salary_max, currency,
  experience_min, experience_max, benefits,
  job_summary, education_requirements, skills_requirements, is_unpaid,
  recruiter_email
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
)
RETURNING id, recruiter_id, title, description, is_paid, created_at, updated_at;

-- name: ListJobs :many
SELECT 
  j.id, j.recruiter_id, j.title, j.description, j.is_paid, j.created_at, j.updated_at,
  j.job_type, j.location_type, j.location_city, j.salary_min, j.salary_max, j.currency,
  j.job_summary, j.education_requirements, j.skills_requirements, j.is_unpaid,
  u.organization_name
FROM jobs j
JOIN users u ON j.recruiter_id = u.id
WHERE status = 'OPEN'
ORDER BY j.created_at DESC;

-- name: ListJobsByRecruiter :many
SELECT 
  id, title, created_at, location_city, location_type,
  salary_min, salary_max, currency, is_unpaid, skills_requirements,
  status -- <-- NEW FIELD
FROM jobs
WHERE recruiter_id = $1
ORDER BY created_at DESC;

-- name: CloseJob :exec
UPDATE jobs SET status = 'CLOSED' WHERE id = $1;

-- name: ReopenJob :exec
UPDATE jobs SET status = 'OPEN' WHERE id = $1;

-- name: GetJobApplicationCounts :many
SELECT 
    j.id,
    j.title,
    j.status,
    COUNT(a.id)::int as applicant_count
FROM jobs j
LEFT JOIN applications a ON j.id = a.job_id
WHERE j.recruiter_id = $1
GROUP BY j.id
ORDER BY applicant_count DESC;

-- name: GetJobByID :one
SELECT * FROM jobs WHERE id = $1 LIMIT 1;