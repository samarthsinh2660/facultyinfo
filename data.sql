-- Create the database
 SHOW DATABASES LIKE 'faculty_info_bd';
CREATE DATABASE faculty_info_db;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Samarth@99082';

-- Use the newly created database
USE faculty_info_db;


-- Create the faculty table
CREATE TABLE faculty (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    office_number VARCHAR(255) NOT NULL,
    free_time TEXT NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
SELECT * FROM faculty_info_db