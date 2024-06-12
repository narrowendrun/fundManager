WITH quarters_to_insert_to_cashflow_scedule AS (
    SELECT DISTINCT 
        cs.fund_id,
        EXTRACT(YEAR FROM cc.date) AS year,
        CASE 
            WHEN EXTRACT(MONTH FROM cc.date) BETWEEN 1 AND 3 THEN 'Q1'
            WHEN EXTRACT(MONTH FROM cc.date) BETWEEN 4 AND 6 THEN 'Q2'
            WHEN EXTRACT(MONTH FROM cc.date) BETWEEN 7 AND 9 THEN 'Q3'
            ELSE 'Q4'
        END AS quarter
    FROM costofcapital cc
    CROSS JOIN (
        SELECT DISTINCT fund_id FROM cashflow_schedule
    ) cs
    WHERE EXTRACT(YEAR FROM cc.date) || 
        CASE 
            WHEN EXTRACT(MONTH FROM cc.date) BETWEEN 1 AND 3 THEN 'Q1'
            WHEN EXTRACT(MONTH FROM cc.date) BETWEEN 4 AND 6 THEN 'Q2'
            WHEN EXTRACT(MONTH FROM cc.date) BETWEEN 7 AND 9 THEN 'Q3'
            ELSE 'Q4'
        END NOT IN (
            SELECT 
                EXTRACT(YEAR FROM date) || 
                CASE 
                    WHEN EXTRACT(MONTH FROM date) BETWEEN 1 AND 3 THEN 'Q1'
                    WHEN EXTRACT(MONTH FROM date) BETWEEN 4 AND 6 THEN 'Q2'
                    WHEN EXTRACT(MONTH FROM date) BETWEEN 7 AND 9 THEN 'Q3'
                    ELSE 'Q4'
                END
            FROM cashflow_schedule
        )
)
INSERT INTO cashflow_schedule (fund_id, date, liquidation_proceeds, total_p_i_income, total_investment, net_proceeds)
SELECT
    qics.fund_id,
    DATE_TRUNC('quarter', CAST(year || '-' || 
        CASE 
            WHEN quarter = 'Q1' THEN '01-01'
            WHEN quarter = 'Q2' THEN '04-01'
            WHEN quarter = 'Q3' THEN '07-01'
            ELSE '10-01'
        END AS DATE)) AS date,
    0 AS liquidation_proceeds,
    0 AS total_p_i_income,
    0 AS total_investment,
    0 AS net_proceeds
FROM quarters_to_insert_to_cashflow_scedule qics;

WITH quarters_to_insert_to_costofcapital AS (
    SELECT DISTINCT 
        cs.fund_id,
        EXTRACT(YEAR FROM cs.date) AS year,
        CASE 
            WHEN EXTRACT(MONTH FROM cs.date) BETWEEN 1 AND 3 THEN 'Q1'
            WHEN EXTRACT(MONTH FROM cs.date) BETWEEN 4 AND 6 THEN 'Q2'
            WHEN EXTRACT(MONTH FROM cs.date) BETWEEN 7 AND 9 THEN 'Q3'
            ELSE 'Q4'
        END AS quarter
    FROM cashflow_schedule cs
    CROSS JOIN (
        SELECT DISTINCT fund_id FROM costofcapital
    ) cc
    WHERE EXTRACT(YEAR FROM cs.date) || 
        CASE 
            WHEN EXTRACT(MONTH FROM cs.date) BETWEEN 1 AND 3 THEN 'Q1'
            WHEN EXTRACT(MONTH FROM cs.date) BETWEEN 4 AND 6 THEN 'Q2'
            WHEN EXTRACT(MONTH FROM cs.date) BETWEEN 7 AND 9 THEN 'Q3'
            ELSE 'Q4'
        END NOT IN (
            SELECT 
                EXTRACT(YEAR FROM date) || 
                CASE 
                    WHEN EXTRACT(MONTH FROM date) BETWEEN 1 AND 3 THEN 'Q1'
                    WHEN EXTRACT(MONTH FROM date) BETWEEN 4 AND 6 THEN 'Q2'
                    WHEN EXTRACT(MONTH FROM date) BETWEEN 7 AND 9 THEN 'Q3'
                    ELSE 'Q4'
                END
            FROM costofcapital
        )
)
INSERT INTO costofcapital(fund_id, date, senior, mezz, junior, classa, classb)
SELECT
    qicc.fund_id,
    DATE_TRUNC('quarter', CAST(year || '-' || 
        CASE 
            WHEN quarter = 'Q1' THEN '01-01'
            WHEN quarter = 'Q2' THEN '04-01'
            WHEN quarter = 'Q3' THEN '07-01'
            ELSE '10-01'
        END AS DATE)) AS date,
    0 AS senior,
    0 AS mezz,
    0 AS junior,
    0 AS classa,
    0 AS classb
FROM quarters_to_insert_to_costofcapital qicc;

