CREATE TABLE total_pi_income_table AS
SELECT
    fund_id,
    acq_date,
    SUM(
        p_i_curr_mth +
        CASE
            WHEN months_since_inception >= 2 THEN p_i_last_2
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 3 THEN p_i_last_3
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 4 THEN p_i_last_4
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 5 THEN p_i_last_5
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 6 THEN p_i_last_6
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 7 THEN p_i_last_7
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 8 THEN p_i_last_8
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 9 THEN p_i_last_9
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 10 THEN p_i_last_10
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 11 THEN p_i_last_11
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 12 THEN p_i_last_12
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 13 THEN p_i_last_13
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 14 THEN p_i_last_14
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 15 THEN p_i_last_15
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 16 THEN p_i_last_16
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 17 THEN p_i_last_17
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 18 THEN p_i_last_18
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 19 THEN p_i_last_19
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 20 THEN p_i_last_20
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 21 THEN p_i_last_21
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 22 THEN p_i_last_22
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 23 THEN p_i_last_23
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 24 THEN p_i_last_24
            ELSE 0
        END
    ) AS total_p_i_income
FROM (
    SELECT
        fund_id,
        acq_date,
        p_i_curr_mth,
        EXTRACT(MONTH FROM AGE(current_date, acq_date)) AS months_since_inception,
        p_i_last_2,
        p_i_last_3,
        p_i_last_4,
        p_i_last_5,
        p_i_last_6,
        p_i_last_7,
        p_i_last_8,
        p_i_last_9,
        p_i_last_10,
        p_i_last_11,
        p_i_last_12,
        p_i_last_13,
        p_i_last_14,
        p_i_last_15,
        p_i_last_16,
        p_i_last_17,
        p_i_last_18,
        p_i_last_19,
        p_i_last_20,
        p_i_last_21,
        p_i_last_22,
        p_i_last_23,
        p_i_last_24
    FROM loan_details
) AS subquery
GROUP BY fund_id, acq_date
ORDER BY fund_id, acq_date;

---
CREATE TABLE liquidation_investment AS
SELECT
    fund_id,
    DATE_TRUNC('month', updated_liq_date)::DATE AS month,
    SUM(liq_price) AS liquidation_proceeds,
    SUM(total_investment) AS total_investment
FROM loan_details
GROUP BY fund_id, DATE_TRUNC('month', updated_liq_date)::DATE
ORDER BY fund_id, month;

-- Create the cashflow_schedule table with the necessary columns
CREATE TABLE cashflow_schedule (
    fund_id INT,
    date DATE,
    liquidation_proceeds NUMERIC DEFAULT 0,
    total_p_i_income NUMERIC DEFAULT 0,
    total_investment NUMERIC DEFAULT 0,
    net_proceeds NUMERIC
);

-- Insert combined data into fee_schedule
INSERT INTO cashflow_schedule (fund_id, date, liquidation_proceeds, total_p_i_income, total_investment, net_proceeds)
SELECT
    d.fund_id,
    d.date,
    COALESCE(li.liquidation_proceeds, 0) AS liquidation_proceeds,
    COALESCE(pi.total_p_i_income, 0) AS total_p_i_income,
    COALESCE(li.total_investment, 0) AS total_investment,
    COALESCE(li.liquidation_proceeds, 0) + COALESCE(pi.total_p_i_income, 0) - COALESCE(li.total_investment, 0) AS net_proceeds
FROM
    (SELECT fund_id, acq_date AS date FROM total_pi_income_table
     UNION
     SELECT fund_id, month AS date FROM liquidation_investment) d
LEFT JOIN
    total_pi_income_table pi ON d.fund_id = pi.fund_id AND d.date = pi.acq_date
LEFT JOIN
    liquidation_investment li ON d.fund_id = li.fund_id AND d.date = li.month;
DROP TABLE liquidation_investment, total_pi_income_table;