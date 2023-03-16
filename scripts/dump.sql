-- Create Table: users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(128) UNIQUE NOT NULL,
    password_hash text NOT NULL
);

-- Create Table: groups
CREATE TABLE IF NOT EXISTS groups (
    code CHAR(4) PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    -- Check that code is 4 characters long and contains only letters and numbers (no spaces)
    CONSTRAINT groups_code_check CHECK (code ~ '^[A-Za-z0-9]{4}$' AND code !~ '\s'),
    creator_id SERIAL NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Seed Table: users with admin user
-- Password: admin
INSERT INTO users (username, password_hash) VALUES ('admin', E'$2b$10$Zv0WxzXyUkxpJJrZqv7zLOeC9xtGGyP15Yvn.6AVtLM6nbLUgx6nq');
INSERT INTO groups (code, name, creator_id) VALUES ('WEBd', 'ICT WebDev e', 1);