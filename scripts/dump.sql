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

-- Create Table: students
CREATE TABLE IF NOT EXISTS students (
    id SERIAL UNIQUE NOT NULL,
    username VARCHAR(25) NOT NULL,
    group_code CHAR(4) NOT NULL REFERENCES groups(code) ON DELETE CASCADE,
    PRIMARY KEY (username, group_code)
);

-- Create Table: sessions
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    student_id SERIAL NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    token text NOT NULL UNIQUE,
    last_updated TIMESTAMP NOT NULL DEFAULT NOW()
    -- Update last_updated when token is updated
    CONSTRAINT sessions_token_check CHECK (last_updated = NOW())
);

-- Seed Table: users with admin user
-- Password: admin
INSERT INTO users (username, password_hash) VALUES ('admin', E'$2b$10$Zv0WxzXyUkxpJJrZqv7zLOeC9xtGGyP15Yvn.6AVtLM6nbLUgx6nq');
INSERT INTO groups (code, name, creator_id) VALUES ('WEBd', 'ICT WebDev e', 1);