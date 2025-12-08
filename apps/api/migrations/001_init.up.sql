CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create a custom type for user roles
CREATE TYPE user_role AS ENUM ('CANDIDATE', 'RECRUITER');

-- Create the Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(42) UNIQUE,
    email VARCHAR(255) UNIQUE,
    role user_role NOT NULL,
    karma INT DEFAULT 0,
    is_pro BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create the Jobs table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recruiter_id UUID NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    embedding VECTOR(384), -- For AI matching
    gateway_question TEXT,
    is_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create an index on the embedding for faster similarity searches
CREATE INDEX ON jobs USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);