INSERT INTO users (username, email, password_hash, created_at) VALUES ('alice', 'alice@example.com', '$2a$10$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.T5FXsxR5hJ9EFS', '2020-01-01 00:00:00');
INSERT INTO users (username, email, password_hash, created_at) VALUES ('bob', 'bob@example.com', '$2a$10$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.T5FXsxR5hJ9EFS', '2020-01-02 00:00:00');

INSERT INTO inks (title, content, author_id, author_username, created_at, updated_at) VALUES ('Welcome', 'This is the first ink in your blog.', 1, 'alice', '2020-01-01 00:00:00', '2020-01-01 00:00:00');