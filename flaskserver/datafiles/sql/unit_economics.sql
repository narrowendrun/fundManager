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