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