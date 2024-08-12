-- For capitaldeploymentschedule

-- Step 1: Create a temporary table to store all the dates within the range for each fund_id
CREATE TEMP TABLE date_series_deploy AS
SELECT DISTINCT fund_id, generate_series(
    (SELECT MIN(date) FROM capitaldeploymentschedule WHERE fund_id = cds.fund_id),
    CURRENT_DATE,  -- Extend the series to the current date
    '1 day'::interval
) AS date
FROM capitaldeploymentschedule cds;

-- Step 2: Insert the missing dates into the original table with zeros in all columns for each fund_id
INSERT INTO capitaldeploymentschedule (fund_id, date, senior, mezz, junior, classa, classb)
SELECT
    ds.fund_id,
    ds.date,
    0 AS senior,
    0 AS mezz,
    0 AS junior,
    0 AS classa,
    0 AS classb
FROM date_series_deploy ds
LEFT JOIN capitaldeploymentschedule cds
ON ds.fund_id = cds.fund_id AND ds.date = cds.date
WHERE cds.date IS NULL;

-- Step 3: Drop the temporary table as it is no longer needed
DROP TABLE date_series_deploy;

-- For capitalreturnschedule

-- Step 1: Create a temporary table to store all the dates within the range for each fund_id
CREATE TEMP TABLE date_series_return AS
SELECT DISTINCT fund_id, generate_series(
    (SELECT MIN(date) FROM capitalreturnschedule WHERE fund_id = crs.fund_id),
    CURRENT_DATE,  -- Extend the series to the current date
    '1 day'::interval
) AS date
FROM capitalreturnschedule crs;

-- Step 2: Insert the missing dates into the original table with zeros in all columns for each fund_id
INSERT INTO capitalreturnschedule (fund_id, date, senior, mezz, junior, classa, classb)
SELECT
    ds.fund_id,
    ds.date,
    0 AS senior,
    0 AS mezz,
    0 AS junior,
    0 AS classa,
    0 AS classb
FROM date_series_return ds
LEFT JOIN capitalreturnschedule crs
ON ds.fund_id = crs.fund_id AND ds.date = crs.date
WHERE crs.date IS NULL;

-- Step 3: Drop the temporary table as it is no longer needed
DROP TABLE date_series_return;





-- Step 1: Create the new table with an additional 'total' column
CREATE TABLE capitaloutstandingbalance (
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

-- Step 2: Insert initial values for each fund_id with the smallest date minus one day
INSERT INTO capitaloutstandingbalance (fund_id, date, senior, mezz, junior, classa, classb)
SELECT DISTINCT fund_id, date - INTERVAL '1 day', 0, 0, 0, 0, 0
FROM capitaldeploymentschedule
WHERE (fund_id, date) IN (
    SELECT fund_id, MIN(date)
    FROM capitaldeploymentschedule
    GROUP BY fund_id
);

-- Step 3: Populate subsequent values with the calculated outstanding balances
DO $$
DECLARE
    rec RECORD;
    prev_balances RECORD;
BEGIN
    FOR rec IN
        SELECT cds.id, cds.fund_id, cds.date, cds.senior, cds.mezz, cds.junior, cds.classa, cds.classb,
               crs.senior AS crs_senior, crs.mezz AS crs_mezz, crs.junior AS crs_junior, crs.classa AS crs_classa, crs.classb AS crs_classb
        FROM capitaldeploymentschedule cds
        JOIN capitalreturnschedule crs ON cds.fund_id = crs.fund_id AND cds.date = crs.date
        ORDER BY cds.fund_id, cds.date
    LOOP
        -- Get the previous balances
        SELECT * INTO prev_balances
        FROM capitaloutstandingbalance
        WHERE fund_id = rec.fund_id
        ORDER BY date DESC
        LIMIT 1;

        -- Calculate the new balances
        INSERT INTO capitaloutstandingbalance (fund_id, date, senior, mezz, junior, classa, classb)
        VALUES (
            rec.fund_id,
            rec.date,
            rec.senior - rec.crs_senior + COALESCE(prev_balances.senior, 0),
            rec.mezz - rec.crs_mezz + COALESCE(prev_balances.mezz, 0),
            rec.junior - rec.crs_junior + COALESCE(prev_balances.junior, 0),
            rec.classa - rec.crs_classa + COALESCE(prev_balances.classa, 0),
            rec.classb - rec.crs_classb + COALESCE(prev_balances.classb, 0)
        );
    END LOOP;
END $$;

-- Step 4: Delete the initial record (the one with all zeros and the min date minus one)
DELETE FROM capitaloutstandingbalance
WHERE (fund_id, date) IN (
    SELECT fund_id, MIN(date - INTERVAL '1 day')
    FROM capitaldeploymentschedule
    GROUP BY fund_id
);
