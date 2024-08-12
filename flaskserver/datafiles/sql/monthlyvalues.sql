SELECT 
    TO_CHAR(DATE_TRUNC('month', date), 'YYYY-MM-DD') AS month_start_date,
    AVG(total) AS avg_cob
FROM 
    capitaloutstandingbalance
WHERE 
    fund_id = 1
GROUP BY 
    month_start_date
ORDER BY 
    month_start_date;

SELECT 
    TO_CHAR(DATE_TRUNC('month', date), 'YYYY-MM-DD') AS month_start_date,
    SUM(net_proceeds) AS net_proceeds
FROM 
    cashflow_schedule
WHERE 
    fund_id = 1
GROUP BY 
    month_start_date
ORDER BY 
    month_start_date;

SELECT 
    TO_CHAR(DATE_TRUNC('month', date), 'YYYY-MM-DD') AS month_start_date,
    SUM(total_fee) AS total_fee
FROM 
    fee_schedule
WHERE 
    fund_id = 1
GROUP BY 
    month_start_date
ORDER BY 
    month_start_date;

SELECT 
    TO_CHAR(DATE_TRUNC('month', date), 'YYYY-MM-DD') AS month_start_date,
    SUM(classa) AS classa
FROM 
    costofcapital
WHERE 
    fund_id = 1
GROUP BY 
    month_start_date
ORDER BY 
    month_start_date;