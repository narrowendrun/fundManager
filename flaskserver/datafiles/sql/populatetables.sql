-- COPY fund_information
-- FROM '/docker-entrypoint-initdb.d/fund_information.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY equity_structure
-- FROM '/docker-entrypoint-initdb.d/equity_structure.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY debt_structure
-- FROM '/docker-entrypoint-initdb.d/debt_structure.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY fees_information
-- FROM '/docker-entrypoint-initdb.d/fees_information.csv'
-- DELIMITER ','
-- CSV HEADER;

COPY loan_details
FROM '/docker-entrypoint-initdb.d/loan_details.csv'
DELIMITER ','
CSV HEADER;w