CREATE DATABASE harrypotter;

CREATE TABLE IF NOT EXISTS wizard(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    house VARCHAR(20) NOT NULL,
    hability VARCHAR(75) NOT NULL,
    bloodstatus VARCHAR(7) NOT NULL,
    patron VARCHAR(50)
); 

INSERT INTO wizard (name, house, hability, bloodstatus, patron) VALUES ('Monteiro', 'Grifinória', 'gostosura', 'puro', '');

CREATE TABLE IF NOT EXISTS wands(
    id SERIAL PRIMARY KEY,
    material VARCHAR(100) NOT NULL,
    long INT NOT NULL,
    core VARCHAR(75) NOT NULL,
    manufacturingDate CHAR(10) NOT NULL
); 

INSERT INTO wands (material, long, core, manufacturingDate) VALUES ('Madeira', 30, 'fogo', '2020-12-12');
