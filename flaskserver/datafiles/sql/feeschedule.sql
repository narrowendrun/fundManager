-- print acquisition_amount monthwise for a particular fund
SELECT TO_CHAR(DATE_TRUNC('month', liq_date), 'YYYY-MM') AS month,
       SUM(acq_price) AS acquisition_amount
FROM loan_details
WHERE fund_id=1
GROUP BY TO_CHAR(DATE_TRUNC('month', liq_date), 'YYYY-MM'), fund_id;

-- print capital balance monthwise for each fund_id
SELECT fund_id,
       TO_CHAR(date, 'YYYY-MM') AS month,
       SUM(senior + mezz + junior + classa + classb) AS capital_balance
FROM capitaloutstandingbalance
WHERE fund_id=1
GROUP BY TO_CHAR(date, 'YYYY-MM'), fund_id;
