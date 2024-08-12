SELECT 
    CONCAT('Q', EXTRACT(QUARTER FROM cs.date)) AS duration,
    EXTRACT(YEAR FROM cs.date) AS fiscal_year,
    SUM(cs.net_proceeds) AS net_proceeds,
    SUM(cc.senior) AS senior_cc,
     SUM(cc.classa) AS classa_cc
FROM 
    cashflow_schedule cs
JOIN 
    costofcapital cc ON cs.fund_id = cc.fund_id --AND EXTRACT(QUARTER FROM cs.date) = EXTRACT(QUARTER FROM cc.date) AND EXTRACT(YEAR FROM cs.date) = EXTRACT(YEAR FROM cc.date)
WHERE 
    cs.fund_id = 1
GROUP BY 
    duration, fiscal_year
ORDER BY 
    fiscal_year, duration;
