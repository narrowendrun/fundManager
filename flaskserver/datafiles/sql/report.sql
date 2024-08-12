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