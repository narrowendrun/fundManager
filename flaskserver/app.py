from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
import json
from sqlalchemy import Table, Column, Integer, Float, Date, MetaData, String, text, BigInteger, ForeignKey
import subprocess
from dotenv import load_dotenv
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError


app = Flask(__name__)

# Load environment variables
dotenv_path = './.env'
load_dotenv(dotenv_path)

# Configure the database URI
app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)

def execute_sql_file(sql_file_path):
    """
    Executes SQL commands from a file using the psql command-line utility.
    
    Args:
        sql_file_path (str): Path to the SQL file.
        
    Returns:
        str: Output message from psql command.
    """
    # Fetch database connection details from environment variables
    dbname = os.getenv('DB_NAME')
    username = os.getenv('DB_USER')
    password = os.getenv('DB_PASSWORD')
    host = os.getenv('DB_HOST')
    port = os.getenv('DB_PORT')

    # Build the psql command
    psql_command = [
        'psql',
        '-d', dbname,
        '-U', username,
        '-h', host,
        '-p', port,
        '-f', sql_file_path
    ]

    # Use PGPASSWORD environment variable for password
    env = os.environ.copy()
    env['PGPASSWORD'] = password
    # Execute the psql command
    try:
        output = subprocess.check_output(psql_command, stderr=subprocess.STDOUT, env=env)
        return output.decode('utf-8')
    except subprocess.CalledProcessError as e:
        return e.output.decode('utf-8')

# Define the Capital Return Schedule model
class CapitalReturnSchedule(db.Model):
    __tablename__ = 'capitalreturnschedule'
    id = db.Column(db.BIGINT, primary_key=True)
    fund_id = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False)
    senior = db.Column(db.Float, nullable=True)
    mezz = db.Column(db.Float, nullable=True)
    junior = db.Column(db.Float, nullable=True)
    classa = db.Column(db.Float, nullable=True)
    classb = db.Column(db.Float, nullable=True)

# Define the Capital Deployment Schedule model
class CapitalDeploymentSchedule(db.Model):
    __tablename__ = 'capitaldeploymentschedule'
    id = db.Column(db.BIGINT, primary_key=True)
    fund_id = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False)
    senior = db.Column(db.Float, nullable=True)
    mezz = db.Column(db.Float, nullable=True)
    junior = db.Column(db.Float, nullable=True)
    classa = db.Column(db.Float, nullable=True)
    classb = db.Column(db.Float, nullable=True)

class FundInformation(db.Model):
    __tablename__ = 'fund_information'
    fund_id = Column(BigInteger, primary_key=True, nullable=False)
    name = Column(String(50), nullable=False)
    start_date = Column(Date, nullable=False)
    term = Column(Integer, nullable=False)
    fund_size = Column(Float, nullable=True)
    acquisition_term = Column(Integer, nullable=False)

    def __repr__(self):
        return f"<FundInformation(fund_id={self.fund_id}, name='{self.name}', start_date={self.start_date}, term={self.term}, fund_size={self.fund_size}, acquisition_term={self.acquisition_term})>"
class EquityStructure(db.Model):
    __tablename__ = 'equity_structure'

    equity_id = Column(db.BIGINT, primary_key=True, autoincrement=True)
    fund_id = Column(Integer, ForeignKey('fund_information.fund_id'), nullable=False)
    equity_type = Column(String(50), nullable=True)
    size_usd = Column(Float, nullable=True)
    preferred_percent = Column(Float, nullable=True)
    tranche_percent = Column(Float, nullable=True)
    splits_percent = Column(Float, nullable=True)
    payment_frequency = Column(String(50), nullable=True)

    def __repr__(self):
        return (f"<EquityStructure(equity_id={self.equity_id}, fund_id={self.fund_id}, "
                f"equity_type='{self.equity_type}', size_usd={self.size_usd}, "
                f"preferred_percent={self.preferred_percent}, tranche_percent={self.tranche_percent}, "
                f"splits_percent={self.splits_percent}, payment_frequency='{self.payment_frequency}')>")

class DebtStructure(db.Model):
    __tablename__ = 'debt_structure'

    debt_id = Column(BigInteger, primary_key=True, nullable=False)
    fund_id = Column(Integer, ForeignKey('fund_information.fund_id'), nullable=False)
    debt_type = Column(String(50), nullable=True)
    size_usd = Column(Float, nullable=True)
    interest_rate = Column(Float, nullable=True)
    debt_equity_ratio = Column(Float, nullable=True)
    splits_percent = Column(Float, nullable=True)
    payment_frequency = Column(String(50), nullable=True)

    def __repr__(self):
        return (f"<DebtStructure(debt_id={self.debt_id}, fund_id={self.fund_id}, debt_type='{self.debt_type}', "
                f"size_usd={self.size_usd}, interest_rate={self.interest_rate}, debt_equity_ratio={self.debt_equity_ratio}, "
                f"splits_percent={self.splits_percent}, payment_frequency='{self.payment_frequency}')>")

class FeesInformation(db.Model):
    __tablename__ = 'fees_information'

    id = Column(BigInteger, primary_key=True, nullable=False)
    fund_id = Column(Integer, ForeignKey('fund_information.fund_id'), nullable=True)
    acquisition = Column(Float, nullable=True)
    asset_management = Column(Float, nullable=True)
    debt_origination = Column(Float, nullable=True)
    other = Column(Float, nullable=True)

    def __repr__(self):
        return (f"<FeesInformation(id={self.id}, fund_id={self.fund_id}, acquisition={self.acquisition}, "
                f"asset_management={self.asset_management}, debt_origination={self.debt_origination}, other={self.other})>")

class LoanDetails(db.Model):
    __tablename__ = 'loan_details'
    
    loan_id = db.Column(db.String(100), primary_key=True, nullable=False)
    svc_loan_id = db.Column(db.String(100))
    prev_loan_id = db.Column(db.String(100))
    prev_svc_loan_id = db.Column(db.String(100))
    fund_id = db.Column(db.Integer, db.ForeignKey('fund_information.fund_id'))
    legal_entity = db.Column(db.String(100))
    co_investor = db.Column(db.String(100))
    prev_servicer = db.Column(db.String(100))
    revolve_servicer = db.Column(db.String(100))
    acquisition_service_xfer_date = db.Column(db.Date)
    liquidation_service_xfer_date = db.Column(db.Date)
    asset_mgr = db.Column(db.String(100))
    months_in_inventory = db.Column(db.Numeric)
    acq_pool = db.Column(db.String(100))
    acq_path = db.Column(db.String(100))
    acq_product = db.Column(db.String(100))
    model_exit_time = db.Column(db.DateTime)
    updated_liq_date = db.Column(db.Date)
    status = db.Column(db.String(100))
    total_investment = db.Column(db.Numeric)
    revolve_val_most_recent = db.Column(db.Numeric)
    revolve_value_date_most_recent = db.Column(db.Date)
    name = db.Column(db.String(100))
    address = db.Column(db.String(100))
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    zip = db.Column(db.String(20))
    under_contract_x = db.Column(db.String(10))
    buyer = db.Column(db.String(100))
    under_contract_price = db.Column(db.Numeric)
    est_close_date = db.Column(db.String(50))
    acq_mos_dlq = db.Column(db.String(25))
    fci_status = db.Column(db.String(100))
    fci_board_date = db.Column(db.String(50))
    parson_status = db.Column(db.String(100))
    parson_boarding = db.Column(db.Numeric)
    loss_mit_path = db.Column(db.String(100))
    loss_mit_milestone = db.Column(db.String(100))
    date_status_updated = db.Column(db.String(25))
    revolve_comments = db.Column(db.Text)
    follow_up_task = db.Column(db.String(100))
    follow_up_date = db.Column(db.Numeric)
    pay_plan_x = db.Column(db.String(10))
    fc_flag_x = db.Column(db.String(10))
    fc_rfd_date = db.Column(db.String(50))
    pct_of_fc_cmplt = db.Column(db.Numeric)
    est_sale_date = db.Column(db.String(50))
    actual_sale_date = db.Column(db.String(50))
    bk_flag_x = db.Column(db.String(10))
    bk_chapter = db.Column(db.String(10))
    bk_file_date = db.Column(db.String(50))
    bk_dismiss_date = db.Column(db.String(50))
    current_occupancy = db.Column(db.String(100))
    occupancy_date = db.Column(db.Date)
    eviction_ordered_date = db.Column(db.String(50))
    acq_date = db.Column(db.Date)
    acq_price = db.Column(db.Numeric)
    other_costs = db.Column(db.Numeric)
    dd_srvcg_costs = db.Column(db.Numeric)
    legal_costs = db.Column(db.Numeric)
    reo_costs = db.Column(db.Numeric)
    debt_costs = db.Column(db.Numeric)
    total_loan_costs = db.Column(db.Numeric)
    liq_price = db.Column(db.Numeric)
    liq_date = db.Column(db.Date)
    net_proceeds = db.Column(db.Numeric)
    ltv = db.Column(db.Numeric)
    next_due = db.Column(db.String(50))
    int_rate = db.Column(db.Numeric)
    p_i_pmt = db.Column(db.Numeric)
    t_i_pmt = db.Column(db.Numeric)
    upb = db.Column(db.Numeric)
    legal_balance = db.Column(db.Numeric)
    defr_d_princ = db.Column(db.Numeric)
    escrow_balance = db.Column(db.Numeric)
    loan_charges = db.Column(db.Numeric)
    acq_mod_flag = db.Column(db.String(10))
    mod_flag_date = db.Column(db.String(50))
    bpo_recent_val = db.Column(db.Numeric)
    bpo_recent_val_date = db.Column(db.String(50))
    bpo_high_val = db.Column(db.Numeric)
    bpo_high_val_date = db.Column(db.String(50))
    value_type = db.Column(db.String(100))
    updated_value_date = db.Column(db.Numeric)
    current_pool = db.Column(db.String(100))
    latest_pool_date = db.Column(db.Numeric)
    total_pools = db.Column(db.Numeric)
    projected_next_pool_date = db.Column(db.Numeric)
    suspense_balance = db.Column(db.Numeric)
    p_i_since_boarding = db.Column(db.Numeric)
    count_3 = db.Column(db.Numeric)
    count_6 = db.Column(db.Numeric)
    count_9 = db.Column(db.Numeric)
    count_12 = db.Column(db.Numeric)
    p_i_curr_mth = db.Column(db.Numeric)
    p_i_last_2 = db.Column(db.Numeric)
    p_i_last_3 = db.Column(db.Numeric)
    p_i_last_4 = db.Column(db.Numeric)
    p_i_last_5 = db.Column(db.Numeric)
    p_i_last_6 = db.Column(db.Numeric)
    p_i_last_7 = db.Column(db.Numeric)
    p_i_last_8 = db.Column(db.Numeric)
    p_i_last_9 = db.Column(db.Numeric)
    p_i_last_10 = db.Column(db.Numeric)
    p_i_last_11 = db.Column(db.Numeric)
    p_i_last_12 = db.Column(db.Numeric)
    p_i_last_13 = db.Column(db.Numeric)
    p_i_last_14 = db.Column(db.Numeric)
    p_i_last_15 = db.Column(db.Numeric)
    p_i_last_16 = db.Column(db.Numeric)
    p_i_last_17 = db.Column(db.Numeric)
    p_i_last_18 = db.Column(db.Numeric)
    p_i_last_19 = db.Column(db.Numeric)
    p_i_last_20 = db.Column(db.Numeric)
    p_i_last_21 = db.Column(db.Numeric)
    p_i_last_22 = db.Column(db.Numeric)
    p_i_last_23 = db.Column(db.Numeric)
    p_i_last_24 = db.Column(db.Numeric)
    dlq_tax_24 = db.Column(db.Numeric)
    lien_1 = db.Column(db.String(100))
    lien_other = db.Column(db.String(100))
    note_date = db.Column(db.Date)
    amort = db.Column(db.Numeric)
    first_pmt_due = db.Column(db.Date)
    maturity_date = db.Column(db.Date)
    acq_value = db.Column(db.Numeric)
    acq_value_date = db.Column(db.Date)
    orig_loan_amt = db.Column(db.Numeric)
    acq_upb = db.Column(db.Numeric)
    acq_legal_bal = db.Column(db.Numeric)
    acq_next_due = db.Column(db.Date)
    acq_i_rate = db.Column(db.Numeric)
    acq_p_i = db.Column(db.Numeric)
    acq_t_i = db.Column(db.Numeric)
    acq_occ = db.Column(db.String(100))
    acq_fc_flag = db.Column(db.String(100))
    acq_fc_start = db.Column(db.String(25))
    acq_bk_yn = db.Column(db.String(10))
    acq_bk_713 = db.Column(db.String(10))
    acq_dlqt_taxes = db.Column(db.Numeric)
    acq_prop_type = db.Column(db.String(100))
    acq_jr_lien = db.Column(db.String(100))
    reporting_category = db.Column(db.String(100))
    reporting_group = db.Column(db.String(100))
    updated_exit_path = db.Column(db.String(100))
    expected_future_dollars = db.Column(db.Numeric)
    optimized_actual_wholesale_price = db.Column(db.Numeric)
    optimized_retail_price = db.Column(db.Numeric)
    remaining_costs = db.Column(db.Numeric)
    actual_projected_moic = db.Column(db.Numeric)
    liquidation_type = db.Column(db.String(100))

@app.route('/api/debug_env', methods=['GET'])
def debug_env():
    env_vars = {
        'DB_USER': os.getenv('DB_USER'),
        'DB_PASSWORD': os.getenv('DB_PASSWORD'),
        'DB_HOST': os.getenv('DB_HOST'),
        'DB_PORT': os.getenv('DB_PORT'),
        'DB_NAME': os.getenv('DB_NAME')
    }
    return jsonify(env_vars)    

@app.route('/api/welcome', methods=['GET'])
def welcome():
    return jsonify({'message': 'welcome'}), 200

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files or 'table_name' not in request.form:
        return jsonify({'error': 'File or table name is missing'}), 400
    
    file = request.files['file']
    table_name = request.form['table_name']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    filename = file.filename
    file.save(filename)
    
    # Read the CSV file using pandas
    try:
        data = pd.read_csv(filename)
    except Exception as e:
        os.remove(filename)
        return jsonify({'error': f'Failed to read CSV file: {str(e)}'}), 400
    
    model_mapping = {
        'capitalreturnschedule': CapitalReturnSchedule,
        'capitaldeploymentschedule': CapitalDeploymentSchedule,
        'fundinformation': FundInformation,
        "feesinformation": FeesInformation,
        "equitystructure": EquityStructure,
        "debtstructure": DebtStructure,
        "loandetails": LoanDetails
    }
    
    if table_name not in model_mapping:
        os.remove(filename)
        print(table_name)
        return jsonify({'error': 'Invalid table name'}), 400
    
    model = model_mapping[table_name]

    # Delete existing records from the table
    try:
        db.session.query(model).delete()
        db.session.commit()
    except Exception as e:
        os.remove(filename)
        return jsonify({'error': f'Failed to delete existing data from {table_name}: {str(e)}'}), 500

    # Convert the CSV data into a list of dictionaries
    data_dicts = data.to_dict(orient='records')
    
    try:
        for entry in data_dicts:
            record = model(**entry)
            db.session.add(record)
        db.session.commit()
    except Exception as e:
        os.remove(filename)
        return jsonify({'error': f'Failed to insert data into {table_name}: {str(e)}'}), 500
    
    os.remove(filename)
    return jsonify({'message': f'Existing data cleared and new data inserted into {table_name}'}), 200


from sqlalchemy import text

@app.route('/api/query', methods=['POST'])
def execute_query():
    query = request.json.get('query', None)
    if not query:
        return jsonify({'error': 'Query parameter is missing'}), 400

    try:
        with db.engine.connect() as connection:
            # Start a transaction
            transaction = connection.begin()
            try:
                result = connection.execute(text(query))
                
                # Commit the transaction if the query modifies data or schema
                transaction.commit()
                
                if result.returns_rows:
                    rows = [dict(zip(result.keys(), [str(value) for value in row])) for row in result]
                    return jsonify(rows)
                else:
                    return jsonify({'message': 'Query executed successfully'})
            except Exception as query_exception:
                # Rollback if there's an issue with the query
                transaction.rollback()
                return jsonify({'error': str(query_exception)}), 500
    except Exception as e:  
        return jsonify({'error': str(e)}), 500
        
    
    
@app.route('/api/runsql', methods=['POST'])
def run_sql_file():
    # Ensure the request contains the SQL file path
    if 'sql_file_path' not in request.json:
        return jsonify({'error': 'No SQL file path provided'}), 400

    # Get the SQL file path from the request
    #datafiles/sql/costofcapital.sql
    sql_file_path = 'datafiles/sql/'+request.json.get('sql_file_path',None)

    # Execute the SQL file
    output = execute_sql_file(sql_file_path)

    return jsonify({'output': output}), 200

def insert_csv_to_psql(csv_file_name, table_name):
    # Create a database engine
    engine = create_engine(
        f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
        f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    )

    # Path to the CSV file
    csv_file_path = f"{csv_file_name}"

    # Read the CSV file into a DataFrame
    df = pd.read_csv(csv_file_path)

    # Insert data into the PostgreSQL table
    try:
        df.to_sql(table_name, engine, if_exists='append', index=False)
        print(f"Data from {csv_file_name} has been successfully inserted into {table_name} table.")
    except Exception as e:
        print(f"An error occurred: {e}")


import sqlalchemy as sa
from sqlalchemy.sql import text
import csv
import os
import tempfile
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
from sqlalchemy import MetaData, Table, Column, String, Float
from sqlalchemy.sql import text
import logging
from datetime import datetime
from dotenv import load_dotenv

metadata = MetaData()
@app.route('/api/waterfall', methods=['POST'])
def waterfall():
    data = request.json
    name = data.get('name')
    columns = data.get('columns')
    from_tables = data.get('fromTable')
    allocations = data.get('allocations')
    fund_id = data.get('fundID')

    if not all([name, columns, from_tables, allocations, fund_id]):
        return jsonify({'error': 'Missing required parameters'}), 400

    # Define the new table schema
    new_table = Table(
        name, metadata,
        Column('date', String, nullable=False),
        Column('net_proceeds', Float, nullable=True),
        Column('cafd0', Float, nullable=True),
        extend_existing=True
    )

    for i, column in enumerate(columns):
        new_table.append_column(Column(column, Float, nullable=True),replace_existing=True)
        new_table.append_column(Column(f'allocation{i+1}', Float, default=allocations[i], nullable=True),replace_existing=True)
        new_table.append_column(Column(f'due{i+1}', Float, default=0, nullable=True),replace_existing=True)
        new_table.append_column(Column(f'paid{i+1}', Float, default=0, nullable=True),replace_existing=True)
        new_table.append_column(Column(f'accrued{i+1}', Float, default=0, nullable=True),replace_existing=True)
        new_table.append_column(Column(f'cafd{i+1}', Float, default=0, nullable=True),replace_existing=True)

    logging.debug(f"Creating or extending table {name} with columns: {[col.name for col in new_table.columns]}")

    try:
        with db.engine.connect() as connection:
            # Drop the table if it exists
            drop_query = text(f"DROP TABLE IF EXISTS {name};")
            connection.execute(drop_query)
            logging.info(f"Table {name} dropped successfully if it existed.")

            # Create the table in the database
            logging.info(f"Attempting to create table {name}.")
            metadata.create_all(db.engine, checkfirst=True)

            # Check if the table was created
            table_exists_query = text(f"""
                SELECT EXISTS (
                    SELECT 1 
                    FROM information_schema.tables 
                    WHERE table_name = :name
                );
            """)
            table_exists = connection.execute(table_exists_query, {'name': name}).scalar()

            if table_exists:
                logging.info(f"Table {name} created successfully.")
                
                # Truncate the table before inserting new data
                truncate_query = text(f"TRUNCATE TABLE {name};")
                connection.execute(truncate_query)
                logging.info(f"Table {name} truncated successfully.")
            else:
                logging.error(f"Table {name} was not created. Skipping truncate operation.")
                return jsonify({'error': f"Table {name} was not created. Skipping truncate operation."}), 500

            # Execute query to get date and proceeds
            date_and_proceeds_query = text("""
                SELECT
                    DATE_TRUNC('quarter', date) AS quarter,
                    SUM(net_proceeds) AS net_proceeds
                FROM cashflow_schedule
                WHERE fund_id = :fund_id
                GROUP BY quarter
                ORDER BY quarter
            """)
            date_and_proceeds_result = connection.execute(date_and_proceeds_query, {'fund_id': fund_id}).fetchall()

            insert_data = []
            previous_record = None

            for row in date_and_proceeds_result:
                quarter = row[0].strftime('%Y-%m-%d')
                net_proceeds = float(row[1])
                
                record = {
                    'date': quarter,
                    'net_proceeds': net_proceeds,
                    'cafd0': net_proceeds
                }

                for i, (column, from_table) in enumerate(zip(columns, from_tables)):
                    fee_query = text(f"""
                        SELECT SUM({column}) AS total_column_value FROM {from_table}
                        WHERE fund_id = :fund_id AND DATE_TRUNC('quarter', date) = :quarter
                    """)
                    fee_result = connection.execute(fee_query, {'fund_id': fund_id, 'quarter': quarter}).scalar()

                    column_value = float(fee_result) if fee_result is not None else 0.0
                    previous_accrued = previous_record[f'accrued{i+1}'] if previous_record else 0.0
                    
                    due = previous_accrued + column_value
                    if i == 0:
                        paid = min(net_proceeds * allocations[i] / 100, due)
                        cafd = net_proceeds - paid
                    else:
                        paid = min(record[f'cafd{i}'] * allocations[i] / 100, due)
                        cafd = record[f'cafd{i}'] - paid

                    accrued = due - paid

                    record[column] = column_value
                    record[f'allocation{i+1}'] = allocations[i]
                    record[f'due{i+1}'] = due
                    record[f'paid{i+1}'] = paid
                    record[f'accrued{i+1}'] = accrued
                    record[f'cafd{i+1}'] = cafd

                insert_data.append(record)
                previous_record = record

            logging.debug(f"Insert data: {insert_data}")

            if not insert_data:
                return jsonify({'error': 'No data to insert. Check if the cashflow_schedule has data for the given fund_id.'}), 400

            save_directory = './saved_csv_files/'
            os.makedirs(save_directory, exist_ok=True)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            csv_filename = os.path.join(save_directory, f"{name}_waterfall_{timestamp}.csv")
            
            with open(csv_filename, mode='w', newline='', encoding='utf-8') as file:
                writer = csv.DictWriter(file, fieldnames=insert_data[0].keys())
                writer.writeheader()
                writer.writerows(insert_data)

    except Exception as e:
        db.session.rollback()
        logging.error(f"Exception occurred: {e}")
        return jsonify({'error': str(e)}), 500

    insert_csv_to_psql(csv_filename, name)   
    return jsonify({'message': f'Data saved to {csv_filename}'}), 200
if __name__ == "__main__":
    app.run(debug=True)