-- Create Table: users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(128) UNIQUE NOT NULL,
    password_hash text NOT NULL
);

-- Seed Table: users with admin user
-- Password: admin
INSERT INTO users (username, password_hash) VALUES ('admin', E'$2b$10$Zv0WxzXyUkxpJJrZqv7zLOeC9xtGGyP15Yvn.6AVtLM6nbLUgx6nq')