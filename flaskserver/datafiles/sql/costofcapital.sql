CREATE TABLE costofcapital (
    id SERIAL PRIMARY KEY,
    fund_id INTEGER,
    date DATE,
    senior FLOAT,
    mezz FLOAT,
    junior FLOAT,
    classa FLOAT,
    classb FLOAT,
    total FLOAT,
    CONSTRAINT fk_fund_id_cost FOREIGN KEY (fund_id) REFERENCES fund_information (fund_id)
);

INSERT INTO costofcapital (fund_id, date, senior, mezz, junior, classa, classb, total)
SELECT 
    c.fund_id,
    c.date,
    c.senior * d.interest_rate AS senior,
    c.mezz * d.interest_rate AS mezz,
    c.junior * d.interest_rate AS junior,
    c.classa * e.preferred_percent AS classa,
    c.classb * e.preferred_percent AS classb,
    (c.senior * d.interest_rate + c.mezz * d.interest_rate + c.junior * d.interest_rate + c.classa * e.preferred_percent + c.classb * e.preferred_percent) AS total
FROM 
    capitaloutstandingbalance c
JOIN 
    debt_structure d ON c.fund_id = d.fund_id
JOIN 
    equity_structure e ON c.fund_id = e.fund_id;
