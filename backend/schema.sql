CREATE DATABASE crowd_monitoring_db;

\c crowd_monitoring_db;

CREATE TABLE IF NOT EXISTS places (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    crowd_level VARCHAR(50) NOT NULL,
    best_time VARCHAR(100) NOT NULL,
    alternatives TEXT NOT NULL
);

INSERT INTO places (name, city, crowd_level, best_time, alternatives) VALUES
('Marina Beach', 'Chennai', 'High', '6 AM - 8 AM', 'Elliots Beach and Semmozhi Poonga'),
('Ooty Lake', 'Ooty', 'Medium', '8 AM - 10 AM', 'Pykara Lake and Avalanche Lake'),
('Mysore Palace', 'Mysore', 'High', '9 AM - 11 AM', 'Chamundi Hills and Brindavan Gardens'),
('Mahabalipuram Beach', 'Mahabalipuram', 'Medium', '7 AM - 9 AM', 'Covelong Beach and Tiger Cave');
