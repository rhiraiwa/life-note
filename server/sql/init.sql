CREATE DATABASE LIFE_NOTE;

CREATE USER 'writer'@'localhost' IDENTIFIED BY 'writer00';
GRANT ALL PRIVILEGES ON LIFE_NOTE.* TO 'writer'@'localhost';