ALTER TABLE users 
ADD COLUMN bio TEXT,
ADD COLUMN skills TEXT, -- Stored as comma-separated string for simplicity
ADD COLUMN experience TEXT,
ADD COLUMN projects TEXT;