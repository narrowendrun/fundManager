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
