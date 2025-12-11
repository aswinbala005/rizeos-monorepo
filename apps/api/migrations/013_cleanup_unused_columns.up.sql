-- Remove unused columns from jobs table
ALTER TABLE jobs DROP COLUMN IF EXISTS embedding;
ALTER TABLE jobs DROP COLUMN IF EXISTS gateway_question;
ALTER TABLE jobs DROP COLUMN IF EXISTS languages;
ALTER TABLE jobs DROP COLUMN IF EXISTS work_conditions;

-- Remove unused column from applications table
ALTER TABLE applications DROP COLUMN IF EXISTS gateway_grade;

-- Delete specific job records
DELETE FROM jobs WHERE id IN (
    '4953320a-511c-4310-bda0-fa1f52ffe518',
    '511bb2f0-47ac-48bc-8d15-031e0fe1e73a',
    '745e6019-4112-4040-963a-77781730bf72',
    '7a16fe93-5c78-4fb0-bf75-216b08cac685',
    '7f5734fa-7e28-4ac2-aa67-a00e878e402e'
);
