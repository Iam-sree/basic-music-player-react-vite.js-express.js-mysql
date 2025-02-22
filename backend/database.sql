CREATE DATABASE music_db_react;

USE music_db_react;

CREATE TABLE music (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    audio VARCHAR(255) NOT NULL
);
