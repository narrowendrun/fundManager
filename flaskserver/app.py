from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
import json
from sqlalchemy import Table, Column, Integer, Float, Date, MetaData, String, text
import subprocess
from dotenv import load_dotenv
import pandas as pd
from sqlalchemy import create_engine

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
    
    with open(filename, 'r') as f:
        data = json.load(f)
    
    model_mapping = {
        'capitalreturnschedule': CapitalReturnSchedule,
        'capitaldeploymentschedule': CapitalDeploymentSchedule
    }
    
    if table_name not in model_mapping:
        os.remove(filename)
        return jsonify({'error': 'Invalid table name'}), 400
    
    model = model_mapping[table_name]
    
    for entry in data:
        record = model(**entry)
        db.session.add(record)
    
    db.session.commit()
    os.remove(filename)
    
    return jsonify({'message': f'Data inserted into {table_name}'}), 200

@app.route('/api/query', methods=['POST'])
def execute_query():
    query = request.json.get('query', None)
    if not query:
        return jsonify({'error': 'Query parameter is missing'}), 400

    try:
        with db.engine.connect() as connection:
            result = connection.execute(text(query))
            rows = [dict(zip(result.keys(), [str(value) for value in row])) for row in result]
            return jsonify(rows)
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

    # Define the new table schema, allowing it to extend if it already exists
    new_table = Table(
        name, metadata,
        Column('date', String, nullable=False),
        Column('net_proceeds', Float, nullable=True),
        Column('cafd0', Float, nullable=True),
        extend_existing=True
    )

    for i, column in enumerate(columns):
        new_table.append_column(Column(column, Float, nullable=True, extend_existing=True))
        new_table.append_column(Column(f'allocation{i+1}', Float, default=allocations[i], nullable=True, extend_existing=True))
        new_table.append_column(Column(f'due{i+1}', Float, default=0, nullable=True, extend_existing=True))
        new_table.append_column(Column(f'paid{i+1}', Float, default=0, nullable=True, extend_existing=True))
        new_table.append_column(Column(f'accrued{i+1}', Float, default=0, nullable=True, extend_existing=True))
        new_table.append_column(Column(f'cafd{i+1}', Float, default=0, nullable=True, extend_existing=True))

    # Debugging: Log the created or extended columns
    logging.debug(f"Creating or extending table {name} with columns: {[col.name for col in new_table.columns]}")

    # Create the table in the database, extending it if necessary
    metadata.create_all(db.engine, checkfirst=True)

    try:
        with db.engine.connect() as connection:
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
            previous_record = None  # Store the previous quarter's record

            for row in date_and_proceeds_result:
                quarter = row[0].strftime('%Y-%m-%d')  # Ensure date is in string format
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
                        paid = min(net_proceeds * allocations[i] / 100, due)  # Use cafd0 for the first calculation
                        cafd = net_proceeds - paid
                    else:
                        paid = min(record[f'cafd{i}'] * allocations[i] / 100, due)  # Use the previous cafd for subsequent calculations
                        cafd = record[f'cafd{i}'] - paid

                    accrued = due - paid

                    record[column] = column_value
                    record[f'allocation{i+1}'] = allocations[i]
                    record[f'due{i+1}'] = due
                    record[f'paid{i+1}'] = paid
                    record[f'accrued{i+1}'] = accrued
                    record[f'cafd{i+1}'] = cafd

                insert_data.append(record)
                previous_record = record  # Update previous_record for the next iteration

            # Debug: Print insert data
            logging.debug(f"Insert data: {insert_data}")

            if not insert_data:
                return jsonify({'error': 'No data to insert. Check if the cashflow_schedule has data for the given fund_id.'}), 400

            # Save data to a CSV file permanently
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

    insert_csv_to_psql(csv_filename,name)   
    return jsonify({'message': f'Data saved to {csv_filename}'}), 200
if __name__ == "__main__":
    app.run(debug=True)