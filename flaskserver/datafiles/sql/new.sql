-- Create CTEs for missing quarters for each fund_id in cashflow_schedule and costofcapital
WITH all_quarters AS (
    SELECT 
        fund_id,
        generate_series(min(date_trunc('quarter', date)), max(date_trunc('quarter', date)), '3 months'::interval) AS quarter_start
    FROM (
        SELECT fund_id, date FROM cashflow_schedule
        UNION ALL
        SELECT fund_id, date FROM costofcapital
    ) subquery
    GROUP BY fund_id
),
missing_quarters_cashflow AS (
    SELECT 
        aq.fund_id,
        aq.quarter_start
    FROM all_quarters aq
    LEFT JOIN cashflow_schedule cs
    ON aq.fund_id = cs.fund_id AND aq.quarter_start = date_trunc('quarter', cs.date)
    WHERE cs.date IS NULL
),
missing_quarters_costofcapital AS (
    SELECT 
        aq.fund_id,
        aq.quarter_start
    FROM all_quarters aq
    LEFT JOIN costofcapital cc
    ON aq.fund_id = cc.fund_id AND aq.quarter_start = date_trunc('quarter', cc.date)
    WHERE cc.date IS NULL
)

-- Insert missing quarters into cashflow_schedule
INSERT INTO cashflow_schedule (fund_id, date, liquidation_proceeds, total_p_i_income, total_investment, net_proceeds)
SELECT 
    mq.fund_id,
    mq.quarter_start,
    0 AS liquidation_proceeds,
    0 AS total_p_i_income,
    0 AS total_investment,
    0 AS net_proceeds
FROM missing_quarters_cashflow mq;

-- Re-define CTEs for the next insert operation
WITH all_quarters AS (
    SELECT 
        fund_id,
        generate_series(min(date_trunc('quarter', date)), max(date_trunc('quarter', date)), '3 months'::interval) AS quarter_start
    FROM (
        SELECT fund_id, date FROM cashflow_schedule
        UNION ALL
        SELECT fund_id, date FROM costofcapital
    ) subquery
    GROUP BY fund_id
),
missing_quarters_costofcapital AS (
    SELECT 
        aq.fund_id,
        aq.quarter_start
    FROM all_quarters aq
    LEFT JOIN costofcapital cc
    ON aq.fund_id = cc.fund_id AND aq.quarter_start = date_trunc('quarter', cc.date)
    WHERE cc.date IS NULL
)

-- Insert missing quarters into costofcapital
INSERT INTO costofcapital (fund_id, date, senior, mezz, junior, classa, classb)
SELECT 
    mq.fund_id,
    mq.quarter_start,
    0 AS senior,
    0 AS mezz,
    0 AS junior,
    0 AS classa,
    0 AS classb
FROM missing_quarters_costofcapital mq;
