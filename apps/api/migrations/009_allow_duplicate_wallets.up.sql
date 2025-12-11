-- Drop the unique constraint on wallet_address
ALTER TABLE users DROP CONSTRAINT users_wallet_address_key;

-- Ensure Email is still unique (it should be already, but this is safe)
-- ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);