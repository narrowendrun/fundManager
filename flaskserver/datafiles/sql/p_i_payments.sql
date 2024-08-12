-- Step 1: Calculate the Number of Months Since acq_date for Each Record
ALTER TABLE loan_details ADD COLUMN months_since_acq INT;

UPDATE loan_details
SET months_since_acq = EXTRACT(YEAR FROM AGE(CURRENT_DATE, acq_date)) * 12 +
                       EXTRACT(MONTH FROM AGE(CURRENT_DATE, acq_date));

-- Step 2: Create a New Table with Specific Columns
CREATE TABLE loan_summary AS
SELECT 
    fund_id, 
    acq_date, 
    p_i_curr_mth,
    CASE WHEN months_since_acq >= 2 THEN p_i_last_2 ELSE 0 END AS p_i_last_2,
    CASE WHEN months_since_acq >= 3 THEN p_i_last_3 ELSE 0 END AS p_i_last_3,
    CASE WHEN months_since_acq >= 4 THEN p_i_last_4 ELSE 0 END AS p_i_last_4,
    CASE WHEN months_since_acq >= 5 THEN p_i_last_5 ELSE 0 END AS p_i_last_5,
    CASE WHEN months_since_acq >= 6 THEN p_i_last_6 ELSE 0 END AS p_i_last_6,
    CASE WHEN months_since_acq >= 7 THEN p_i_last_7 ELSE 0 END AS p_i_last_7,
    CASE WHEN months_since_acq >= 8 THEN p_i_last_8 ELSE 0 END AS p_i_last_8,
    CASE WHEN months_since_acq >= 9 THEN p_i_last_9 ELSE 0 END AS p_i_last_9,
    CASE WHEN months_since_acq >= 10 THEN p_i_last_10 ELSE 0 END AS p_i_last_10,
    CASE WHEN months_since_acq >= 11 THEN p_i_last_11 ELSE 0 END AS p_i_last_11,
    CASE WHEN months_since_acq >= 12 THEN p_i_last_12 ELSE 0 END AS p_i_last_12,
    CASE WHEN months_since_acq >= 13 THEN p_i_last_13 ELSE 0 END AS p_i_last_13,
    CASE WHEN months_since_acq >= 14 THEN p_i_last_14 ELSE 0 END AS p_i_last_14,
    CASE WHEN months_since_acq >= 15 THEN p_i_last_15 ELSE 0 END AS p_i_last_15,
    CASE WHEN months_since_acq >= 16 THEN p_i_last_16 ELSE 0 END AS p_i_last_16,
    CASE WHEN months_since_acq >= 17 THEN p_i_last_17 ELSE 0 END AS p_i_last_17,
    CASE WHEN months_since_acq >= 18 THEN p_i_last_18 ELSE 0 END AS p_i_last_18,
    CASE WHEN months_since_acq >= 19 THEN p_i_last_19 ELSE 0 END AS p_i_last_19,
    CASE WHEN months_since_acq >= 20 THEN p_i_last_20 ELSE 0 END AS p_i_last_20,
    CASE WHEN months_since_acq >= 21 THEN p_i_last_21 ELSE 0 END AS p_i_last_21,
    CASE WHEN months_since_acq >= 22 THEN p_i_last_22 ELSE 0 END AS p_i_last_22,
    CASE WHEN months_since_acq >= 23 THEN p_i_last_23 ELSE 0 END AS p_i_last_23,
    CASE WHEN months_since_acq >= 24 THEN p_i_last_24 ELSE 0 END AS p_i_last_24
FROM 
    loan_details;

-- Step 3: Summate Each Column for Every fund_id
CREATE TABLE fund_summary AS
SELECT
    fund_id,
    SUM(p_i_curr_mth) AS total_curr_mth,
    SUM(p_i_last_2) AS total_last_2,
    SUM(p_i_last_3) AS total_last_3,
    SUM(p_i_last_4) AS total_last_4,
    SUM(p_i_last_5) AS total_last_5,
    SUM(p_i_last_6) AS total_last_6,
    SUM(p_i_last_7) AS total_last_7,
    SUM(p_i_last_8) AS total_last_8,
    SUM(p_i_last_9) AS total_last_9,
    SUM(p_i_last_10) AS total_last_10,
    SUM(p_i_last_11) AS total_last_11,
    SUM(p_i_last_12) AS total_last_12,
    SUM(p_i_last_13) AS total_last_13,
    SUM(p_i_last_14) AS total_last_14,
    SUM(p_i_last_15) AS total_last_15,
    SUM(p_i_last_16) AS total_last_16,
    SUM(p_i_last_17) AS total_last_17,
    SUM(p_i_last_18) AS total_last_18,
    SUM(p_i_last_19) AS total_last_19,
    SUM(p_i_last_20) AS total_last_20,
    SUM(p_i_last_21) AS total_last_21,
    SUM(p_i_last_22) AS total_last_22,
    SUM(p_i_last_23) AS total_last_23,
    SUM(p_i_last_24) AS total_last_24
FROM
    loan_summary
GROUP BY 
    fund_id;

-- Step 4: Transpose Summated Columns as Rows
CREATE TABLE transposed_fund_summary AS
SELECT
    fund_id,
    'current_month' AS period,
    total_curr_mth AS amount
FROM
    fund_summary
UNION ALL
SELECT
    fund_id,
    'p_i_last_2' AS period,
    total_last_2 AS amount
FROM
    fund_summary
UNION ALL
SELECT
    fund_id,
    'p_i_last_3' AS period,
    total_last_3 AS amount
FROM
    fund_summary
UNION ALL
SELECT
    fund_id,
    'p_i_last_4' AS period,
    total_last_4 AS amount
FROM
    fund_summary
UNION ALL
SELECT
    fund_id,
    'p_i_last_5' AS period,
    total_last_5 AS amount
FROM
    fund_summary
UNION ALL
SELECT
    fund_id,
    'p_i_last_6' AS period,
    total_last_6 AS amount
FROM
    fund_summary
UNION ALL
SELECT
    fund_id,
    'p_i_last_7' AS period,
    total_last_7 AS amount
FROM
    fund_summary
UNION ALL
SELECT
    fund_id,
    'p_i_last_8' AS period,
    total_last_8 AS amount
FROM
    fund_summary
UNION ALL
SELECT
    fund_id,
    'p_i_last_9' AS period,
    total_last_9 AS amount
FROM
    fund_summary
UNION ALL
SELECT
    fund_id,
    'p_i_last_10' AS period,
    total_last_10 AS amount
FROM
    fund_summary
UNION ALL
SELECT
    fund_id,
    'p_i_last_11' AS period,
    total_last_11 AS amount
FROM
    fund_summary
UNION ALL
SELECT
    fund_id,
    'p_i_last_12' AS period,
    total_last_12 AS amount
FROM
    fund_summary
UNION ALL
SELECT
    fund_id,
    'p_i_last_13' AS period,
    total_last_13 AS amount
FROM
    fund_summary
UNION ALL
SELECT
    fund_id,
    'p_i_last_14' AS period,
    total_last_14 AS amount
FROM
    fund_summary
UNION ALL
SELECT
    fund_id,
    'p_i_last_15' AS period,
    total_last_15 AS amount
FROM
    fund_summary
UNION ALL
SELECT
    fund_id,
    'p_i_last_16' AS period,
    total_last_16 AS amount
FROM
    fund_summary
UNION ALL
SELECT
    fund_id,
    'p_i_last_17' AS period,
    total_last_17 AS amount
FROM
    fund_summary
UNION ALL
SELECT
    fund_id,
    'p_i_last_18' AS period,
    total_last_18 AS amount
FROM
    fund_summary
UNION ALL
SELECT
    fund_id,
    'p_i_last_19' AS period,
    total_last_19 AS amount
FROM
    fund_summary
UNION ALL
SELECT
    fund_id,
    'p_i_last_20' AS period,
    total_last_20 AS amount
FROM
    fund_summary
UNION ALL
SELECT
    fund_id,
    'p_i_last_21' AS period,
    total_last_21 AS amount
FROM
    fund_summary
UNION ALL
SELECT
    fund_id,
    'p_i_last_22' AS period,
    total_last_22 AS amount
FROM
    fund_summary
UNION ALL
SELECT
    fund_id,
    'p_i_last_23' AS period,
    total_last_23 AS amount
FROM
    fund_summary
UNION ALL
SELECT
    fund_id,
    'p_i_last_24' AS period,
    total_last_24 AS amount
FROM
    fund_summary;

-- Step 5: Adjust the Periods to Correspond to Dates
CREATE TABLE final_fund_summary AS
SELECT
    fund_id,
    TO_CHAR(
    CASE 
        WHEN period = 'current_month' THEN CURRENT_DATE
        WHEN period = 'p_i_last_2' THEN CURRENT_DATE - INTERVAL '1 month'
WHEN period = 'p_i_last_3' THEN CURRENT_DATE - INTERVAL '2 months'
WHEN period = 'p_i_last_4' THEN CURRENT_DATE - INTERVAL '3 months'
WHEN period = 'p_i_last_5' THEN CURRENT_DATE - INTERVAL '4 months'
WHEN period = 'p_i_last_6' THEN CURRENT_DATE - INTERVAL '5 months'
WHEN period = 'p_i_last_7' THEN CURRENT_DATE - INTERVAL '6 months'
WHEN period = 'p_i_last_8' THEN CURRENT_DATE - INTERVAL '7 months'
WHEN period = 'p_i_last_9' THEN CURRENT_DATE - INTERVAL '8 months'
WHEN period = 'p_i_last_10' THEN CURRENT_DATE - INTERVAL '9 months'
WHEN period = 'p_i_last_11' THEN CURRENT_DATE - INTERVAL '10 months'
WHEN period = 'p_i_last_12' THEN CURRENT_DATE - INTERVAL '11 months'
WHEN period = 'p_i_last_13' THEN CURRENT_DATE - INTERVAL '12 months'
WHEN period = 'p_i_last_14' THEN CURRENT_DATE - INTERVAL '13 months'
WHEN period = 'p_i_last_15' THEN CURRENT_DATE - INTERVAL '14 months'
WHEN period = 'p_i_last_16' THEN CURRENT_DATE - INTERVAL '15 months'
WHEN period = 'p_i_last_17' THEN CURRENT_DATE - INTERVAL '16 months'
WHEN period = 'p_i_last_18' THEN CURRENT_DATE - INTERVAL '17 months'
WHEN period = 'p_i_last_19' THEN CURRENT_DATE - INTERVAL '18 months'
WHEN period = 'p_i_last_20' THEN CURRENT_DATE - INTERVAL '19 months'
WHEN period = 'p_i_last_21' THEN CURRENT_DATE - INTERVAL '20 months'
WHEN period = 'p_i_last_22' THEN CURRENT_DATE - INTERVAL '21 months'
WHEN period = 'p_i_last_23' THEN CURRENT_DATE - INTERVAL '22 months'
WHEN period = 'p_i_last_24' THEN CURRENT_DATE - INTERVAL '23 months'
END,
'YYYY-MM-DD'
) AS period_date,
amount
FROM
transposed_fund_summary;
