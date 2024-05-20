CREATE TABLE total_pi_income_table AS
SELECT
    fund_id,
    acq_date,
    SUM(
        p_i_curr_mth +
        CASE
            WHEN months_since_inception >= 2 THEN p_i_last_2
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 3 THEN p_i_last_3
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 4 THEN p_i_last_4
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 5 THEN p_i_last_5
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 6 THEN p_i_last_6
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 7 THEN p_i_last_7
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 8 THEN p_i_last_8
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 9 THEN p_i_last_9
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 10 THEN p_i_last_10
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 11 THEN p_i_last_11
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 12 THEN p_i_last_12
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 13 THEN p_i_last_13
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 14 THEN p_i_last_14
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 15 THEN p_i_last_15
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 16 THEN p_i_last_16
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 17 THEN p_i_last_17
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 18 THEN p_i_last_18
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 19 THEN p_i_last_19
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 20 THEN p_i_last_20
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 21 THEN p_i_last_21
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 22 THEN p_i_last_22
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 23 THEN p_i_last_23
            ELSE 0
        END +
        CASE
            WHEN months_since_inception >= 24 THEN p_i_last_24
            ELSE 0
        END
    ) AS total_p_i_income
FROM (
    SELECT
        fund_id,
        acq_date,
        p_i_curr_mth,
        EXTRACT(MONTH FROM AGE(current_date, acq_date)) AS months_since_inception,
        p_i_last_2,
        p_i_last_3,
        p_i_last_4,
        p_i_last_5,
        p_i_last_6,
        p_i_last_7,
        p_i_last_8,
        p_i_last_9,
        p_i_last_10,
        p_i_last_11,
        p_i_last_12,
        p_i_last_13,
        p_i_last_14,
        p_i_last_15,
        p_i_last_16,
        p_i_last_17,
        p_i_last_18,
        p_i_last_19,
        p_i_last_20,
        p_i_last_21,
        p_i_last_22,
        p_i_last_23,
        p_i_last_24
    FROM loan_details
) AS subquery
GROUP BY fund_id, acq_date
ORDER BY fund_id, acq_date;
