
CREATE TABLE fund_information (
fund_id BIGSERIAL PRIMARY KEY NOT NULL,
name VARCHAR(50) NOT NULL,
start_date DATE NOT NULL,
term INTEGER NOT NULL,
fund_size FLOAT,
acquisition_term INTEGER NOT NULL
);


CREATE TABLE capitaldeploymentschedule (
    id SERIAL PRIMARY KEY,
    fund_id INTEGER NOT NULL,
    date DATE,
    senior FLOAT,
    mezz FLOAT,
    junior FLOAT,
    classa FLOAT,
    classb FLOAT,
    FOREIGN KEY (fund_id) REFERENCES fund_information(fund_id)  
);
CREATE TABLE capitalreturnschedule (
    id SERIAL PRIMARY KEY,
    fund_id INTEGER NOT NULL,
    date DATE,
    senior FLOAT,
    mezz FLOAT,
    junior FLOAT,
    classa FLOAT,
    classb FLOAT,
    FOREIGN KEY (fund_id) REFERENCES fund_information(fund_id)  
);
CREATE TABLE debt_structure (
debt_id BIGSERIAL PRIMARY KEY NOT NULL,
fund_id INTEGER NOT NULL,
debt_type VARCHAR(50), 
size_usd FLOAT, 
interest_rate FLOAT, 
debt_equity_ratio FLOAT, 
splits_percent FLOAT, 
payment_frequency VARCHAR(50),
FOREIGN KEY (fund_id) REFERENCES fund_information(fund_id)
);

CREATE TABLE equity_structure (
    equity_id BIGSERIAL PRIMARY KEY NOT NULL,
    fund_id INTEGER NOT NULL, 
    equity_type VARCHAR(50), 
    size_usd FLOAT, 
    preferred_percent FLOAT, 
    tranche_percent FLOAT, 
    splits_percent FLOAT, 
    payment_frequency VARCHAR(50),
    FOREIGN KEY (fund_id) REFERENCES fund_information(fund_id)
);

CREATE TABLE fees_information (
  id BIGSERIAL PRIMARY KEY NOT NULL ,
  fund_id INTEGER ,
  acquisition DOUBLE PRECISION,
  asset_management DOUBLE PRECISION,
  debt_origination DOUBLE PRECISION,
  other DOUBLE PRECISION,
  FOREIGN KEY (fund_id) REFERENCES fund_information(fund_id)
);


CREATE TABLE loan_details (
    loan_id VARCHAR(100) PRIMARY KEY NOT NULL,
    svc_loan_id VARCHAR(100),
    prev_loan_id VARCHAR(100),
    prev_svc_loan_id VARCHAR(100),
    fund_id INTEGER,
    legal_entity VARCHAR(100),
    co_investor VARCHAR(100),
    prev_servicer VARCHAR(100),
    revolve_servicer VARCHAR(100),
    acquisition_service_xfer_date DATE,
    liquidation_service_xfer_date DATE,
    asset_mgr VARCHAR(100),
    months_in_inventory NUMERIC,
    acq_pool VARCHAR(100),
    acq_path VARCHAR(100),
    acq_product VARCHAR(100),
    model_exit_time TIMESTAMP,
    updated_liq_date DATE,
    status VARCHAR(100),
    total_investment NUMERIC,
    revolve_val_most_recent NUMERIC,
    revolve_value_date_most_recent DATE,
    name VARCHAR(100),
    address VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(100),
    zip VARCHAR(20),
    under_contract_x VARCHAR(10),
    buyer VARCHAR(100),
    under_contract_price NUMERIC,
    est_close_date VARCHAR(50),
    acq_mos_dlq VARCHAR(25),
    fci_status VARCHAR(100),
    fci_board_date VARCHAR(50),
    parson_status VARCHAR(100),
    parson_boarding NUMERIC,
    loss_mit_path VARCHAR(100),
    loss_mit_milestone VARCHAR(100),
    date_status_updated VARCHAR(25),
    revolve_comments TEXT,
    follow_up_task VARCHAR(100),
    follow_up_date NUMERIC,
    pay_plan_x VARCHAR(10),
    fc_flag_x VARCHAR(10),
    fc_rfd_date VARCHAR(50),
    pct_of_fc_cmplt NUMERIC,
    est_sale_date VARCHAR(50),
    actual_sale_date VARCHAR(50),
    bk_flag_x VARCHAR(10),
    bk_chapter VARCHAR(10),
    bk_file_date VARCHAR(50),
    bk_dismiss_date VARCHAR(50),
    current_occupancy VARCHAR(100),
    occupancy_date DATE,
    eviction_ordered_date VARCHAR(50),
    acq_date DATE,
    acq_price NUMERIC,
    other_costs NUMERIC,
    dd_srvcg_costs NUMERIC,
    legal_costs NUMERIC,
    reo_costs NUMERIC,
    debt_costs NUMERIC,
    total_loan_costs NUMERIC,
    liq_price NUMERIC,
    liq_date DATE,
    net_proceeds NUMERIC,
    ltv NUMERIC,
    next_due VARCHAR(50),
    int_rate NUMERIC,
    p_i_pmt NUMERIC,
    t_i_pmt NUMERIC,
    upb NUMERIC,
    legal_balance NUMERIC,
    defr_d_princ NUMERIC,
    escrow_balance NUMERIC,
    loan_charges NUMERIC,
    acq_mod_flag VARCHAR(10),
    mod_flag_date VARCHAR(50),
    bpo_recent_val NUMERIC,
    bpo_recent_val_date VARCHAR(50),
    bpo_high_val NUMERIC,
    bpo_high_val_date VARCHAR(50),
    value_type VARCHAR(100),
    updated_value_date NUMERIC,
    current_pool VARCHAR(100),
    latest_pool_date NUMERIC,
    total_pools NUMERIC,
    projected_next_pool_date NUMERIC,
    suspense_balance NUMERIC,
    p_i_since_boarding NUMERIC,
    "count_3" NUMERIC,
    "count_6" NUMERIC,
    "count_9" NUMERIC,
    "count_12" NUMERIC,
    p_i_curr_mth NUMERIC,
    p_i_last_2 NUMERIC,
    p_i_last_3 NUMERIC,
    p_i_last_4 NUMERIC,
    p_i_last_5 NUMERIC,
    p_i_last_6 NUMERIC,
    p_i_last_7 NUMERIC,
    p_i_last_8 NUMERIC,
    p_i_last_9 NUMERIC,
    p_i_last_10 NUMERIC,
    p_i_last_11 NUMERIC,
    p_i_last_12 NUMERIC,
    p_i_last_13 NUMERIC,
    p_i_last_14 NUMERIC,
    p_i_last_15 NUMERIC,
    p_i_last_16 NUMERIC,
    p_i_last_17 NUMERIC,
    p_i_last_18 NUMERIC,
    p_i_last_19 NUMERIC,
    p_i_last_20 NUMERIC,
    p_i_last_21 NUMERIC,
    p_i_last_22 NUMERIC,
    p_i_last_23 NUMERIC,
    p_i_last_24 NUMERIC,
    dlq_tax_24 NUMERIC,
    lien_1 VARCHAR(100),
    lien_other VARCHAR(100),
    note_date DATE,
    amort NUMERIC,
    first_pmt_due DATE,
    maturity_date DATE,
    acq_value NUMERIC,
    acq_value_date DATE,
    orig_loan_amt NUMERIC,
    acq_upb NUMERIC,
    acq_legal_bal NUMERIC,
    acq_next_due DATE,
    acq_i_rate NUMERIC,
    acq_p_i NUMERIC,
    acq_t_i NUMERIC,
    acq_occ VARCHAR(100),
    acq_fc_flag VARCHAR(100),
    acq_fc_start VARCHAR(25),
    acq_bk_yn VARCHAR(10),
    acq_bk_713 VARCHAR(10),
    acq_dlqt_taxes NUMERIC,
    acq_prop_type VARCHAR(100),
    acq_jr_lien VARCHAR(100),
    reporting_category VARCHAR(100),
    reporting_group VARCHAR(100),
    updated_exit_path VARCHAR(100),
    expected_future_dollars NUMERIC,
    optimized_actual_wholesale_price NUMERIC,
    optimized_retail_price NUMERIC,
    remaining_costs NUMERIC,
    actual_projected_moic NUMERIC,
    liquidation_type VARCHAR(100),
    FOREIGN KEY (fund_id) REFERENCES fund_information(fund_id)
);
-- Deleting existing data from the tables before copying new data

DELETE FROM loan_details;
DELETE FROM fees_information;
DELETE FROM debt_structure;
DELETE FROM equity_structure;
DELETE FROM capitalreturnschedule;
DELETE FROM capitaldeploymentschedule;
DELETE FROM fund_information;


-- COPY fund_information
-- FROM '/docker-entrypoint-initdb.d/fund_information.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY equity_structure
-- FROM '/docker-entrypoint-initdb.d/equity_structure.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY debt_structure
-- FROM '/docker-entrypoint-initdb.d/debt_structure.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY fees_information
-- FROM '/docker-entrypoint-initdb.d/fees_information.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY loan_details
-- FROM '/docker-entrypoint-initdb.d/loan_details.csv'
-- DELIMITER ','
-- CSV HEADER;