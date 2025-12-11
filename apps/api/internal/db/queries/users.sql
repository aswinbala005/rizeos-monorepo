-- name: CreateUser :one
INSERT INTO users (
  wallet_address, email, role, full_name, password_hash
) VALUES (
  $1, $2, $3, $4, $5
)
RETURNING *;

-- name: GetUserByWallet :one
SELECT * FROM users WHERE wallet_address = $1 LIMIT 1;

-- name: GetUserByID :one
SELECT * FROM users WHERE id = $1 LIMIT 1;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1 LIMIT 1;

-- name: UpdateSeekerProfile :one
UPDATE users
SET 
  full_name = COALESCE($2, full_name),
  -- email = COALESCE($3, email),  <-- REMOVED: Don't update login email here
  bio = COALESCE($3, bio),
  skills = COALESCE($4, skills),
  experience = COALESCE($5, experience),
  projects = COALESCE($6, projects),
  education = COALESCE($7, education),
  job_role = COALESCE($8, job_role),
  professional_email = COALESCE($9, professional_email) -- <-- NEW
WHERE id = $1
RETURNING *;

-- name: UpdateRecruiterProfile :one
UPDATE users
SET 
  full_name = COALESCE($2, full_name),
  -- email = COALESCE($3, email), <-- REMOVED
  phone = COALESCE($3, phone),
  organization_name = COALESCE($4, organization_name),
  organization_location = COALESCE($5, organization_location),
  organization_bio = COALESCE($6, organization_bio),
  bio = COALESCE($7, bio),
  skills = COALESCE($8, skills),
  experience = COALESCE($9, experience),
  education = COALESCE($10, education),
  job_role = COALESCE($11, job_role),
  professional_email = COALESCE($12, professional_email) -- <-- NEW
WHERE id = $1
RETURNING *;

-- name: SearchCandidates :many
SELECT * FROM users 
WHERE role = 'CANDIDATE' 
  AND (
    to_tsvector('english', 
      COALESCE(full_name, '') || ' ' || 
      COALESCE(skills, '') || ' ' || 
      COALESCE(job_role, '') || ' ' || 
      COALESCE(bio, '')
    ) @@ websearch_to_tsquery('english', $1)
    OR
    -- Fallback for partial word matches (e.g. 'Reac' matching 'React') which TSVECTOR might miss if not stemmed
    full_name ILIKE '%' || $1 || '%' OR
    skills ILIKE '%' || $1 || '%'
  )
LIMIT 20;