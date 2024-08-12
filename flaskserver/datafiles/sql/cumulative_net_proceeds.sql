CREATE TABLE cumulative_net_proceeds (
    id SERIAL PRIMARY KEY,
    fund_id INT REFERENCES fund_information(fund_id),
    date DATE NOT NULL,
    inflows FLOAT DEFAULT 0,
    outflows FLOAT DEFAULT 0,
    cumulative_net_proceeds FLOAT DEFAULT 0
);

WITH fund_ids AS (
    SELECT DISTINCT fund_id FROM fund_information
),

inflows AS (
    SELECT 
        fund_id,
        DATE_TRUNC('month', acq_date)::DATE AS month_start, 
        SUM(acq_price + total_loan_costs) AS total_inflows
    FROM loan_details
    WHERE status = 'SOLD'
    GROUP BY fund_id, month_start
),

outflows_liq AS (
    SELECT 
        fund_id,
        DATE_TRUNC('month', liq_date)::DATE AS month_start, 
        SUM(liq_price) AS liq_proceeds
    FROM loan_details
    WHERE status = 'SOLD'
    GROUP BY fund_id, month_start
),

outflows_cashflow AS (
    SELECT 
        fund_id,
        DATE_TRUNC('month', date)::DATE AS month_start, 
        SUM(total_p_i_income) AS p_i_income
    FROM cashflow_schedule
    GROUP BY fund_id, month_start
),

all_months AS (
    SELECT DISTINCT 
        f.fund_id,
        DATE_TRUNC('month', GREATEST(
            COALESCE(ld.acq_date, '1970-01-01'::date),
            COALESCE(ld.liq_date, '1970-01-01'::date),
            COALESCE(cs.date, '1970-01-01'::date)
        ))::DATE AS month_start
    FROM fund_ids f
    LEFT JOIN loan_details ld ON f.fund_id = ld.fund_id
    LEFT JOIN cashflow_schedule cs ON f.fund_id = cs.fund_id
),

outflows AS (
    SELECT 
        m.fund_id,
        m.month_start,
        COALESCE(liq.liq_proceeds, 0) + COALESCE(cashflow.p_i_income, 0) AS total_outflows
    FROM all_months m
    LEFT JOIN outflows_liq liq ON m.fund_id = liq.fund_id AND m.month_start = liq.month_start
    LEFT JOIN outflows_cashflow cashflow ON m.fund_id = cashflow.fund_id AND m.month_start = cashflow.month_start
),

cumulative AS (
    SELECT 
        m.fund_id,
        m.month_start,
        COALESCE(inflows.total_inflows, 0) AS inflows,
        COALESCE(outflows.total_outflows, 0) AS outflows,
        SUM(
            COALESCE(outflows.total_outflows, 0) - COALESCE(inflows.total_inflows, 0)
        ) OVER (PARTITION BY m.fund_id ORDER BY m.month_start) / 1000000 AS cumulative_net_proceeds
    FROM all_months m
    LEFT JOIN inflows ON m.fund_id = inflows.fund_id AND m.month_start = inflows.month_start
    LEFT JOIN outflows ON m.fund_id = outflows.fund_id AND m.month_start = outflows.month_start
    ORDER BY m.fund_id, m.month_start
)

INSERT INTO cumulative_net_proceeds (fund_id, date, inflows, outflows, cumulative_net_proceeds)
SELECT 
    fund_id, 
    month_start, 
    inflows, 
    outflows, 
    cumulative_net_proceeds
FROM cumulative;