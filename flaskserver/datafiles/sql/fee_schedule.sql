CREATE TABLE fee_schedule (
    fund_id INT,
    date DATE,
    capitalbalance NUMERIC,
    asset_management_fee NUMERIC,
    acquisition_price NUMERIC,
    acquisition_fee NUMERIC,
    total_fee NUMERIC
);
INSERT INTO fee_schedule (fund_id, date, capitalbalance, asset_management_fee, acquisition_price, acquisition_fee, total_fee)
SELECT
    COALESCE(cb.fund_id, ld.fund_id) AS fund_id,
    COALESCE(cb.date, ld.acq_date) AS date,
    COALESCE(cb.capitalbalance, 0) AS capitalbalance,
    COALESCE(cb.capitalbalance, 0) * COALESCE(fi.asset_management, 0) / 36500 AS asset_management_fee,
    COALESCE(ld.acquisition_price, 0) AS acquisition_price,
    COALESCE(ld.acquisition_price, 0) * COALESCE(fi.acquisition, 0) / 100 AS acquisition_fee,
    (COALESCE(cb.capitalbalance, 0) * COALESCE(fi.asset_management, 0) / 36500) + 
    (COALESCE(ld.acquisition_price, 0) * COALESCE(fi.acquisition, 0) / 100) AS total_fee
FROM (
    SELECT
        fund_id,
        date,
        COALESCE(SUM(senior), 0) + COALESCE(SUM(mezz), 0) + COALESCE(SUM(junior), 0) + COALESCE(SUM(classa), 0) + COALESCE(SUM(classb), 0) AS capitalbalance
    FROM
        capitaloutstandingbalance
    GROUP BY
        fund_id, date
) cb
FULL OUTER JOIN (
    SELECT
        fund_id,
        acq_date,
        COALESCE(SUM(acq_price), 0) AS acquisition_price
    FROM
        loan_details
    GROUP BY
        fund_id, acq_date
) ld ON cb.fund_id = ld.fund_id AND cb.date = ld.acq_date
LEFT JOIN fees_information fi ON COALESCE(cb.fund_id, ld.fund_id) = fi.fund_id
ORDER BY
    COALESCE(cb.fund_id, ld.fund_id), COALESCE(cb.date, ld.acq_date);
