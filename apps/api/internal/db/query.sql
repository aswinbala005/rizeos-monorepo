-- name: CreateUser :one
INSERT INTO users (
  wallet_address,
  email,
  role,
  full_name,
  password_hash
) VALUES (
  $1, $2, $3, $4, $5
)
RETURNING *;

-- name: GetUserByWallet :one
SELECT * FROM users
WHERE wallet_address = $1 LIMIT 1;

-- name: UpdateUser :one
UPDATE users
SET 
  full_name = COALESCE($2, full_name),
  email = COALESCE($3, email),
  bio = COALESCE($4, bio),
  skills = COALESCE($5, skills),
  experience = COALESCE($6, experience),
  projects = COALESCE($7, projects),
  education = COALESCE($8, education),
  job_role = COALESCE($9, job_role)
WHERE id = $1
RETURNING *;

-- name: CreateJob :one
INSERT INTO jobs (
  recruiter_id,
  title,
  description,
  gateway_question,
  is_paid
) VALUES (
  $1, $2, $3, $4, $5
)
RETURNING id, recruiter_id, title, description, gateway_question, is_paid, created_at, updated_at;

-- name: ListJobs :many
SELECT 
  id, 
  recruiter_id, 
  title, 
  description, 
  gateway_question, 
  is_paid, 
  created_at, 
  updated_at 
FROM jobs
ORDER BY created_at DESC;

-- name: CreateApplication :one
INSERT INTO applications (
  job_id,
  candidate_id,
  status,
  match_score,
  gateway_answer
) VALUES (
  $1, $2, $3, $4, $5
)
RETURNING *;

-- name: GetApplicationsByCandidate :many
SELECT 
    a.id, a.status, a.created_at, a.match_score,
    j.title as job_title, 
    j.description as job_description
FROM applications a
JOIN jobs j ON a.job_id = j.id
WHERE a.candidate_id = $1
ORDER BY a.created_at DESC;

-- name: DeleteApplication :exec
DELETE FROM applications
WHERE id = $1;