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