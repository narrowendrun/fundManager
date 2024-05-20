-- Create the capitaloutstandingbalance table with fund_id column
CREATE TABLE capitaloutstandingbalance (
    id SERIAL PRIMARY KEY,
    fund_id INTEGER,
    date DATE,
    senior FLOAT,
    mezz FLOAT,
    junior FLOAT,
    classa FLOAT,
    classb FLOAT,
    CONSTRAINT fk_fund_id FOREIGN KEY (fund_id) REFERENCES fund_information (fund_id)
);

-- Insert initial rows for each fund
WITH first_dates AS (
    SELECT fund_id, MIN(date) AS start_date
    FROM capitalreturnschedule
    GROUP BY fund_id
)
INSERT INTO capitaloutstandingbalance (fund_id, date, senior, mezz, junior, classa, classb)
SELECT 
    fd.fund_id,
    fd.start_date - interval '1 day' AS date,
    0, 0, 0, 0, 0
FROM 
    first_dates fd;

-- Calculate outstanding balance
WITH balances AS (
    SELECT
        cr.fund_id,
        cr.date,
        coalesce(cd.senior - cr.senior, 0) AS senior_balance,
        coalesce(cd.mezz - cr.mezz, 0) AS mezz_balance,
        coalesce(cd.junior - cr.junior, 0) AS junior_balance,
        coalesce(cd.classa - cr.classa, 0) AS classa_balance,
        coalesce(cd.classb - cr.classb, 0) AS classb_balance
    FROM
        capitalreturnschedule cr
    LEFT JOIN
        capitaldeploymentschedule cd ON cr.date = cd.date
)
INSERT INTO capitaloutstandingbalance (fund_id, date, senior, mezz, junior, classa, classb)
SELECT
    b.fund_id,
    b.date,
    LAG(senior_balance, 1, 0) OVER (PARTITION BY b.fund_id ORDER BY b.date) + senior_balance AS senior,
    LAG(mezz_balance, 1, 0) OVER (PARTITION BY b.fund_id ORDER BY b.date) + mezz_balance AS mezz,
    LAG(junior_balance, 1, 0) OVER (PARTITION BY b.fund_id ORDER BY b.date) + junior_balance AS junior,
    LAG(classa_balance, 1, 0) OVER (PARTITION BY b.fund_id ORDER BY b.date) + classa_balance AS classa,
    LAG(classb_balance, 1, 0) OVER (PARTITION BY b.fund_id ORDER BY b.date) + classb_balance AS classb
FROM
    balances b;
