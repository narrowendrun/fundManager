CREATE TABLE liquidation_investment AS
SELECT
    fund_id,
    DATE_TRUNC('month', updated_liq_date)::DATE AS month,
    SUM(liq_price) AS liquidation_proceeds,
    SUM(total_investment) AS total_investment
FROM loan_details
GROUP BY fund_id, DATE_TRUNC('month', updated_liq_date)::DATE
ORDER BY fund_id, month;
