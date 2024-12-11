backend -> mysql2
frontend -> create

backend : nodemon server.js
frontend : npm start





-- Create the database
CREATE DATABASE todolist;

-- Use the database
USE todolist;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tasks table
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);




echo "# NodeJSBackendJwtCRUD" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/1Deepak007/NodeJSBackendJwtCRUD.git
git push -u origin main



git remote add origin https://github.com/1Deepak007/NodeJSBackendJwtCRUD.git
git branch -M main
git push -u origin main