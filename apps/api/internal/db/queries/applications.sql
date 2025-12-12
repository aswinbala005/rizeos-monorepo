-- name: CreateApplication :one
INSERT INTO applications (
  job_id, candidate_id, status, match_score, gateway_answer
) VALUES (
  $1, $2, $3, $4, $5
)
RETURNING id, job_id, candidate_id, status, match_score, gateway_answer, created_at, updated_at;

-- name: GetApplicationsByCandidate :many
SELECT 
    a.id, 
    a.status, 
    a.created_at, 
    a.match_score,
    j.title as job_title, 
    j.description as job_description,
    j.location_city,
    j.location_type,
    j.salary_min,
    j.salary_max,
    j.currency,
    j.is_unpaid,
    u.organization_name as company_name -- <--- Get this from the USERS table
FROM applications a
JOIN jobs j ON a.job_id = j.id
JOIN users u ON j.recruiter_id = u.id -- <--- JOIN to link Job -> Recruiter
WHERE a.candidate_id = $1
ORDER BY a.created_at DESC;

-- name: GetApplicationsByJob :many
SELECT 
    a.id, 
    a.status, 
    a.created_at, 
    a.match_score,
    a.gateway_answer,
    u.full_name as candidate_name,
    u.email as candidate_email,
    u.job_role as candidate_role,
    u.skills as candidate_skills,
    u.experience as candidate_experience
FROM applications a
JOIN users u ON a.candidate_id = u.id
WHERE a.job_id = $1
ORDER BY a.match_score DESC;

-- name: GetApplicationVolumeByRecruiter :many
SELECT 
    DATE(a.created_at)::text as application_date,
    COUNT(*) as total
FROM applications a
JOIN jobs j ON a.job_id = j.id
WHERE j.recruiter_id = $1
  AND EXTRACT(MONTH FROM a.created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
  AND EXTRACT(YEAR FROM a.created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY application_date
ORDER BY application_date ASC;

-- name: DeleteApplication :exec
DELETE FROM applications WHERE id = $1;

-- name: GetAllApplicationsByRecruiter :many
SELECT 
    a.id, 
    a.status, 
    a.created_at, 
    a.match_score,
    a.gateway_answer,
    a.job_id, -- <--- ADDED THIS
    j.title as job_title,
    u.id as candidate_id,
    u.full_name as candidate_name,
    u.email as candidate_email,
    u.job_role as candidate_role,
    u.skills as candidate_skills,
    u.education as candidate_education, -- <--- ADDED THIS
    u.experience as candidate_experience
FROM applications a
JOIN jobs j ON a.job_id = j.id
JOIN users u ON a.candidate_id = u.id
WHERE j.recruiter_id = $1
ORDER BY a.match_score DESC;