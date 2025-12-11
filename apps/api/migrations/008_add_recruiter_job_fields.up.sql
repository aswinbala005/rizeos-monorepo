-- 1. Add Recruiter Fields to Users
ALTER TABLE users 
ADD COLUMN phone TEXT,
ADD COLUMN organization_name TEXT,
ADD COLUMN organization_location TEXT,
ADD COLUMN organization_bio TEXT;

-- 2. Add Detailed Fields to Jobs
ALTER TABLE jobs 
ADD COLUMN job_type TEXT,
ADD COLUMN location_type TEXT,
ADD COLUMN location_city TEXT,
ADD COLUMN salary_min INT,
ADD COLUMN salary_max INT,
ADD COLUMN currency TEXT DEFAULT 'INR',
ADD COLUMN experience_min INT,
ADD COLUMN experience_max INT,
ADD COLUMN benefits TEXT,
ADD COLUMN requirements TEXT,
ADD COLUMN job_summary TEXT, -- Ensure these are here
ADD COLUMN education_requirements TEXT,
ADD COLUMN skills_requirements TEXT,
ADD COLUMN languages TEXT,
ADD COLUMN work_conditions TEXT,
ADD COLUMN is_unpaid BOOLEAN DEFAULT FALSE;