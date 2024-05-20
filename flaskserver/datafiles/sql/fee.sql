INSERT INTO fee_schedule (fund_id, capital_balance, asset_management_fee, acquisition_fee, acquisition_amount, total_fee, date)
SELECT f.fund_id,
       coalesce(c.capital_balance, 0) AS capital_balance,
       fi.asset_management * c.capital_balance / 1200 AS asset_management_fee,
       l.acquisition_amount * fi.acquisition / 100 AS acquisition_fee,
       l.acquisition_amount,
       c.capital_balance * fi.asset_management / 1200 + l.acquisition_amount * fi.acquisition / 100 AS total_fee,
       c.month
FROM fund_information f
LEFT JOIN (
    SELECT TO_CHAR(date, 'YYYY-MM') AS month, fund_id, SUM(senior + mezz + junior + classa + classb) AS capital_balance
    FROM capitaloutstandingbalance
    GROUP BY TO_CHAR(date, 'YYYY-MM'), fund_id
) c ON f.fund_id = c.fund_id
LEFT JOIN (
    SELECT TO_CHAR(DATE_TRUNC('month', liq_date), 'YYYY-MM') AS month, fund_id, SUM(acq_price) AS acquisition_amount
    FROM loan_details
    GROUP BY TO_CHAR(DATE_TRUNC('month', liq_date), 'YYYY-MM'), fund_id
) l ON f.fund_id = l.fund_id
LEFT JOIN fees_information fi ON f.fund_id = fi.fund_id;

-- INSERT INTO fee_schedule (fund_id, capital_balance, asset_management_fee, acquisition_fee, acquisition_amount, total_fee, date)
-- SELECT f.fund_id,
--        coalesce(c.capital_balance, 0) AS capital_balance,
--        fi.asset_management * c.capital_balance / 1200 AS asset_management_fee,
--        l.acquisition_amount * fi.acquisition / 100 AS acquisition_fee,
--        l.acquisition_amount,
--        c.capital_balance * fi.asset_management / 1200 + l.acquisition_amount * fi.acquisition / 100 AS total_fee,
--        c.month::date AS date  -- Add ::date to cast month to date
-- FROM fund_information f
-- LEFT JOIN (
--     SELECT TO_CHAR(date, 'YYYY-MM') AS month, fund_id, SUM(senior + mezz + junior + classa + classb) AS capital_balance
--     FROM capitaloutstandingbalance
--     GROUP BY TO_CHAR(date, 'YYYY-MM'), fund_id
-- ) c ON f.fund_id = c.fund_id
-- LEFT JOIN (
--     SELECT TO_CHAR(DATE_TRUNC('month', liq_date), 'YYYY-MM') AS month, fund_id, SUM(acq_price) AS acquisition_amount
--     FROM loan_details
--     GROUP BY TO_CHAR(DATE_TRUNC('month', liq_date), 'YYYY-MM'), fund_id
-- ) l ON f.fund_id = l.fund_id
-- LEFT JOIN fees_information fi ON f.fund_id = fi.fund_id;
