-- Step 1: Create the new table 'costofcapital'
CREATE TABLE costofcapital (
    id SERIAL PRIMARY KEY,
    fund_id INTEGER,
    date DATE,
    senior NUMERIC,
    mezz NUMERIC,
    junior NUMERIC,
    classa NUMERIC,
    classb NUMERIC,
    total NUMERIC GENERATED ALWAYS AS (senior + mezz + junior + classa + classb) STORED,
    FOREIGN KEY (fund_id) REFERENCES fund_information(fund_id)
);

-- Step 2: Populate the 'costofcapital' table with adjusted subqueries
INSERT INTO costofcapital (fund_id, date, senior, mezz, junior, classa, classb)
SELECT
    cob.fund_id,
    cob.date,
    cob.senior * (SELECT MAX(interest_rate) FROM debt_structure WHERE debt_type='senior' AND fund_id=cob.fund_id) / 36500,
    cob.mezz * (SELECT MAX(interest_rate) FROM debt_structure WHERE debt_type='mezz' AND fund_id=cob.fund_id) / 36500,
    cob.junior * (SELECT MAX(interest_rate) FROM debt_structure WHERE debt_type='junior' AND fund_id=cob.fund_id) / 36500,
    cob.classa * (SELECT MAX(preferred_percent) FROM equity_structure WHERE equity_type='classa' AND fund_id=cob.fund_id) / 36500,
    cob.classb * (SELECT MAX(preferred_percent) FROM equity_structure WHERE equity_type='classb' AND fund_id=cob.fund_id) / 36500
FROM capitaloutstandingbalance cob;