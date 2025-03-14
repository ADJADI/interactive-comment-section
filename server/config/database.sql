-- First, create the database (if it doesn't exist)
CREATE DATABASE IF NOT EXISTS interactive_comments;

-- Use the database
USE interactive_comments;

-- Create users table first (because comments will reference it)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(191) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password VARCHAR(191) NOT NULL,  -- For storing hashed passwords
    image_png_url VARCHAR(191),
    image_web_url VARCHAR(191),
    reset_token VARCHAR(191),        -- For password reset functionality
    reset_token_expires DATETIME,    -- Token expiration
    last_login TIMESTAMP,           -- Track last login
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    score INT DEFAULT 0,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create replies table
CREATE TABLE IF NOT EXISTS replies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    score INT DEFAULT 0,
    user_id INT,
    parent_comment_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (parent_comment_id) REFERENCES comments(id)
);

-- Insert some test data
INSERT INTO users (username, image_png_url, image_web_url) VALUES
('testUser', '/images/user1.png', '/images/user1.webp');
