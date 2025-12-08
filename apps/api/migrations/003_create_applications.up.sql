CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id),
    candidate_id UUID NOT NULL REFERENCES users(id),
    status TEXT NOT NULL DEFAULT 'SENT', -- SENT, DELIVERED, IN_REVIEW, VIEWED, DECISION
    match_score INT DEFAULT 0,
    gateway_answer TEXT,
    gateway_grade TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add an index to quickly find applications by candidate
CREATE INDEX idx_applications_candidate ON applications(candidate_id);
-- Add an index to quickly find applications by job
CREATE INDEX idx_applications_job ON applications(job_id);