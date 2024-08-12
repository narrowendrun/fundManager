CREATE TABLE report (
    fund_id INT PRIMARY KEY,
    capital_invested NUMERIC,
    capital_returned NUMERIC,
    average_cob NUMERIC,
    revenue_to_date NUMERIC,
    start_date DATE,
    age NUMERIC,
    proceeds NUMERIC,
    roi_annualized NUMERIC,
    CONSTRAINT fk_fund_id
        FOREIGN KEY (fund_id) 
        REFERENCES fund_information(fund_id)
);
INSERT INTO report (fund_id, capital_invested, capital_returned, average_cob, revenue_to_date, start_date, age, proceeds, roi_annualized)
SELECT 
    fi.fund_id,
    ROUND(fi.fund_size) AS capital_invested,
    ROUND(COALESCE(crs.capital_returned, 0)) AS capital_returned,
    ROUND(COALESCE(cob.average_cob, 0)) AS average_cob,
    ROUND(COALESCE(cfs.revenue_to_date, 0)) AS revenue_to_date,
    fi.start_date,
    ROUND(EXTRACT(YEAR FROM AGE(CURRENT_DATE, fi.start_date)) * 12 + EXTRACT(MONTH FROM AGE(CURRENT_DATE, fi.start_date))) AS age,
    ROUND(COALESCE(cs.net_proceeds, 0) - COALESCE(fs.total_fee, 0)) AS proceeds,
    CASE
        WHEN (COALESCE(cob.average_cob, 0) * (EXTRACT(YEAR FROM AGE(CURRENT_DATE, fi.start_date)) * 12 + EXTRACT(MONTH FROM AGE(CURRENT_DATE, fi.start_date)))) = 0 THEN 0
        ELSE ROUND((ROUND(COALESCE(cs.net_proceeds, 0) - COALESCE(fs.total_fee, 0)) / COALESCE(cob.average_cob, 0)) * (12 / (EXTRACT(YEAR FROM AGE(CURRENT_DATE, fi.start_date)) * 12 + EXTRACT(MONTH FROM AGE(CURRENT_DATE, fi.start_date)))) * 100, 2)
    END AS roi_annualized
FROM 
    fund_information fi
LEFT JOIN (
    SELECT fund_id, SUM(senior + mezz + junior + classa + classb) AS capital_returned
    FROM capitalreturnschedule
    GROUP BY fund_id
) crs ON fi.fund_id = crs.fund_id
LEFT JOIN (
    SELECT fund_id, AVG(total) AS average_cob
    FROM capitaloutstandingbalance
    GROUP BY fund_id
) cob ON fi.fund_id = cob.fund_id
LEFT JOIN (
    SELECT fund_id, SUM(total_p_i_income) + SUM(liquidation_proceeds) AS revenue_to_date
    FROM cashflow_schedule
    GROUP BY fund_id
) cfs ON fi.fund_id = cfs.fund_id
LEFT JOIN (
    SELECT fund_id, SUM(net_proceeds) AS net_proceeds
    FROM cashflow_schedule
    GROUP BY fund_id
) cs ON fi.fund_id = cs.fund_id
LEFT JOIN (
    SELECT fund_id, SUM(asset_management_fee + acquisition_fee) AS total_fee
    FROM fee_schedule
    GROUP BY fund_id
) fs ON fi.fund_id = fs.fund_id;

CREATE TABLE report_performance (
    fund_id INT PRIMARY KEY,
    cost_of_assets_sold NUMERIC,
    net_proceeds NUMERIC,
    roi NUMERIC,
    annualised_returns NUMERIC,
    target_annualised_return NUMERIC,
    gain_on_sale_yield NUMERIC,
    projected_annualised_returns NUMERIC,
    cash_flow_yield NUMERIC,
    CONSTRAINT fk_fund_id
        FOREIGN KEY (fund_id) 
        REFERENCES fund_information(fund_id)
);
INSERT INTO report_performance (
    fund_id, 
    cost_of_assets_sold, 
    net_proceeds, 
    roi, 
    annualised_returns, 
    target_annualised_return, 
    gain_on_sale_yield, 
    projected_annualised_returns, 
    cash_flow_yield
)
SELECT 
    fi.fund_id,
    COALESCE(SUM(cfs.total_investment), 0) AS cost_of_assets_sold,
    COALESCE(SUM(cfs.net_proceeds), 0) AS net_proceeds,
    ROUND(
        COALESCE(SUM(cfs.net_proceeds), 0) / NULLIF(r.average_cob, 0) * 100, 
        1
    ) AS roi,
    ROUND(
        CASE
            WHEN r.age > 0 THEN
                (COALESCE(SUM(cfs.net_proceeds), 0) / NULLIF(r.average_cob, 0)) * (12 / r.age) * 100
            ELSE 0
        END,
        1
    ) AS annualised_returns,
    25 AS target_annualised_return,
    ROUND(
        COALESCE(SUM(cfs.liquidation_proceeds - cfs.total_investment), 0) / NULLIF(r.average_cob, 0) * 100,
        1
    ) AS gain_on_sale_yield,
    15 AS projected_annualised_returns,
    ROUND(
        COALESCE(SUM(cfs.total_p_i_income), 0) / NULLIF(r.average_cob, 0) * 100,
        1
    ) AS cash_flow_yield
FROM 
    fund_information fi
LEFT JOIN cashflow_schedule cfs ON fi.fund_id = cfs.fund_id
LEFT JOIN report r ON fi.fund_id = r.fund_id
GROUP BY 
    fi.fund_id, r.average_cob, r.age;

CREATE TABLE performance_snapshot (
    fund_id INT PRIMARY KEY,
    count_acq INT,
    legal_balance_acq NUMERIC,
    property_value_acq NUMERIC,
    investment_acq NUMERIC,
    count_sold INT,
    legal_balance_sold NUMERIC,
    property_value_sold NUMERIC,
    investment_sold NUMERIC,
    count_hold INT,
    legal_balance_hold NUMERIC,
    property_value_hold NUMERIC,
    investment_hold NUMERIC,
    FOREIGN KEY (fund_id) REFERENCES fund_information(fund_id)
);
INSERT INTO performance_snapshot (fund_id, count_acq, legal_balance_acq, property_value_acq, investment_acq,
                                  count_sold, legal_balance_sold, property_value_sold, investment_sold,
                                  count_hold, legal_balance_hold, property_value_hold, investment_hold)
SELECT 
    fi.fund_id,
    -- Acquisition Metrics
    (SELECT COUNT(status) FROM loan_details WHERE fund_id = fi.fund_id) AS count_acq,
    (SELECT SUM(legal_balance) FROM loan_details WHERE fund_id = fi.fund_id) AS legal_balance_acq,
    (SELECT SUM(revolve_val_most_recent) FROM loan_details WHERE fund_id = fi.fund_id) AS property_value_acq,
    (SELECT SUM(acq_price + total_loan_costs) FROM loan_details WHERE fund_id = fi.fund_id) AS investment_acq,
    -- Sold Metrics
    (SELECT COUNT(status) FROM loan_details WHERE status = 'SOLD' AND fund_id = fi.fund_id) AS count_sold,
    (SELECT SUM(legal_balance) FROM loan_details WHERE status = 'SOLD' AND fund_id = fi.fund_id) AS legal_balance_sold,
    (SELECT SUM(revolve_val_most_recent) FROM loan_details WHERE status = 'SOLD' AND fund_id = fi.fund_id) AS property_value_sold,
    (SELECT SUM(acq_price + total_loan_costs) FROM loan_details WHERE status = 'SOLD' AND fund_id = fi.fund_id) AS investment_sold,
    -- Hold Metrics
    (SELECT COUNT(status) FROM loan_details WHERE status = 'HOLD' AND fund_id = fi.fund_id) AS count_hold,
    (SELECT SUM(legal_balance) FROM loan_details WHERE status = 'HOLD' AND fund_id = fi.fund_id) AS legal_balance_hold,
    (SELECT SUM(revolve_val_most_recent) FROM loan_details WHERE status = 'HOLD' AND fund_id = fi.fund_id) AS property_value_hold,
    (SELECT SUM(acq_price + total_loan_costs) FROM loan_details WHERE status = 'HOLD' AND fund_id = fi.fund_id) AS investment_hold
FROM 
    fund_information fi;

CREATE TABLE unit_economics (
    fund_id INT,
    revenue NUMERIC,
    acq_cost NUMERIC,
    margin_per_loan NUMERIC,
    roi NUMERIC(5, 2),
    life INT,
    return_annualized NUMERIC,
    performance_ratio NUMERIC(6, 3),
    FOREIGN KEY (fund_id) REFERENCES fund_information(fund_id)
);
INSERT INTO unit_economics (fund_id, revenue, acq_cost, margin_per_loan, roi, life, return_annualized, performance_ratio)
SELECT 
    fi.fund_id,
    -- Revenue
    rp.revenue_to_date / NULLIF(ps.count_sold, 0) AS revenue,
    -- Acquisition Cost
    rp2.cost_of_assets_sold / NULLIF(ps.count_sold, 0) AS acq_cost,
    -- Margin per Loan
    (rp.revenue_to_date / NULLIF(ps.count_sold, 0)) - (rp2.cost_of_assets_sold / NULLIF(ps.count_sold, 0)) AS margin_per_loan,
    -- ROI
    ROUND(((rp.revenue_to_date / NULLIF(ps.count_sold, 0)) - (rp2.cost_of_assets_sold / NULLIF(ps.count_sold, 0))) / NULLIF((rp2.cost_of_assets_sold / NULLIF(ps.count_sold, 0)), 0) * 100, 2) AS roi,
    -- Life
    EXTRACT(YEAR FROM AGE(NOW(), fi.start_date)) * 12 + EXTRACT(MONTH FROM AGE(NOW(), fi.start_date)) AS life,
    -- Return (Annualized)
    ROUND(((rp.revenue_to_date / NULLIF(ps.count_sold, 0)) - (rp2.cost_of_assets_sold / NULLIF(ps.count_sold, 0))) / NULLIF((rp2.cost_of_assets_sold / NULLIF(ps.count_sold, 0)), 0) * 100 * 12 / NULLIF((EXTRACT(YEAR FROM AGE(NOW(), fi.start_date)) * 12 + EXTRACT(MONTH FROM AGE(NOW(), fi.start_date))), 0), 2) AS return_annualized,
    -- Performance Ratio
    ROUND((ROUND(((rp.revenue_to_date / NULLIF(ps.count_sold, 0)) - (rp2.cost_of_assets_sold / NULLIF(ps.count_sold, 0))) / NULLIF((rp2.cost_of_assets_sold / NULLIF(ps.count_sold, 0)), 0) * 100 * 12 / NULLIF((EXTRACT(YEAR FROM AGE(NOW(), fi.start_date)) * 12 + EXTRACT(MONTH FROM AGE(NOW(), fi.start_date))), 0), 2) / rp2.target_annualised_return), 3) AS performance_ratio
FROM 
    fund_information fi
JOIN
    performance_snapshot ps ON fi.fund_id = ps.fund_id
JOIN
    report rp ON fi.fund_id = rp.fund_id
JOIN
    report_performance rp2 ON fi.fund_id = rp2.fund_id;



---- cumulative proceeds
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