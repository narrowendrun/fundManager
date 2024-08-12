from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
import json
from sqlalchemy import text,  Table, Column, Integer, Float, Date, MetaData
import subprocess
from dotenv import load_dotenv

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

# @app.route('/api/create_table', methods=['POST'])
# def create_table():
#     """
#     API endpoint to create a new table with the specified name and columns.

#     Expected JSON body format:
#     {
#         "table_name": "your_table_name",
#         "columns": ["total_fee", "classa"]
#     }
#     """
#     data = request.json
#     table_name = data.get('table_name')
#     input_columns = data.get('columns', [])

#     if not table_name or not input_columns:
#         return jsonify({'error': 'Table name and columns are required'}), 400

#     try:
#         result = create_dynamic_table(table_name, input_columns)
#         return jsonify({'message': result}), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# def create_dynamic_table(table_name, input_columns):
#     """
#     Creates a new table with the specified name and columns in the database.

#     Args:
#         table_name (str): The name of the new table to be created.
#         input_columns (list): A list of column names to be included in the table.
        
#     Returns:
#         str: Success message if the table is created successfully.
#     """
#     # Define common columns
#     common_columns = [
#         Column('date', Date, nullable=False),
#         Column('netproceeds', Float, nullable=True),
#         Column('cafd-1', Float, nullable=True)
#     ]

#     # Create a metadata instance
#     metadata = MetaData()

#     # Define the table with the common columns
#     columns = common_columns.copy()

#     # Iterate over input columns and add the required columns dynamically
#     for i, col in enumerate(input_columns, start=2):
#         columns.append(Column(col, Float, nullable=True))
#         columns.append(Column(f'allocation-{i}', Float, nullable=True))
#         columns.append(Column(f'due-{i}', Float, nullable=True))
#         columns.append(Column(f'paid-{i}', Float, nullable=True))
#         columns.append(Column(f'accrued-{i}', Float, nullable=True))
#         columns.append(Column(f'cafd-{i}', Float, nullable=True))

#     # Create the table dynamically
#     new_table = Table(table_name, metadata, *columns)

#     # Use the metadata to create the table in the database
#     with db.engine.connect() as connection:
#         metadata.create_all(connection)
#         connection.execute(text(f'COMMIT'))

#     return f"Table '{table_name}' created successfully with columns: {', '.join(c.name for c in new_table.columns)}"


@app.route('/api/waterfall', methods=['POST'])
def create_table():
    """
    API endpoint to create a new table with the specified name and columns, and populate it with data.

    Expected JSON body format:
    {
        "table_name": "your_table_name",
        "columns": ["total_fee", "classa"],
        "fund_id": "your_fund_id",
        "mappings": {
            "netproceeds": "cashflow_schedule",
            "total_fee": "fee_schedule",
            "classa": "costofcapital"
        }
    }
    """
    data = request.json
    table_name = data.get('table_name')
    input_columns = data.get('columns', [])
    fund_id = data.get('fund_id')
    mappings = data.get('mappings', {})

    if not table_name or not input_columns or not fund_id or not mappings:
        return jsonify({'error': 'Table name, columns, fund_id, and mappings are required'}), 400

    try:
        create_result = create_dynamic_table(table_name, input_columns)
        populate_result = populate_dynamic_table(table_name, fund_id, mappings)
        return jsonify({'message': f"{create_result}. {populate_result}"}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def create_dynamic_table(table_name, input_columns):
    """
    Creates a new table with the specified name and columns in the database.

    Args:
        table_name (str): The name of the new table to be created.
        input_columns (list): A list of column names to be included in the table.
        
    Returns:
        str: Success message if the table is created successfully.
    """
    # Define common columns
    common_columns = [
        Column('date', Date, nullable=False),
        Column('netproceeds', Float, nullable=True),
        Column('cafd-1', Float, nullable=True)
    ]

    # Create a metadata instance
    metadata = MetaData()

    # Define the table with the common columns
    columns = common_columns.copy()

    # Iterate over input columns and add the required columns dynamically
    for i, col in enumerate(input_columns, start=2):
        columns.append(Column(col, Float, nullable=True))
        columns.append(Column(f'allocation-{i}', Float, nullable=True))
        columns.append(Column(f'due-{i}', Float, nullable=True))
        columns.append(Column(f'paid-{i}', Float, nullable=True))
        columns.append(Column(f'accrued-{i}', Float, nullable=True))
        columns.append(Column(f'cafd-{i}', Float, nullable=True))

    # Create the table dynamically
    new_table = Table(table_name, metadata, *columns)

    # Use the metadata to create the table in the database
    with db.engine.connect() as connection:
        metadata.create_all(connection)
        connection.execute(text(f'COMMIT'))

    return f"Table '{table_name}' created successfully with columns: {', '.join(c.name for c in new_table.columns)}"

def populate_dynamic_table(table_name, fund_id, mappings):
    """
    Populates a table with data from specified mappings based on fund_id.

    Args:
        table_name (str): The name of the table to populate.
        fund_id (str): The fund_id to filter the data.
        mappings (dict): A dictionary with column names as keys and source tables as values.

    Returns:
        str: Success message if the table is populated successfully.
    """
    with db.engine.connect() as connection:
        # Get distinct dates from all source tables to ensure all dates are covered
        dates = set()
        for column, source_table in mappings.items():
            date_query = text(f"""
                SELECT DISTINCT date
                FROM {source_table}
                WHERE fund_id = :fund_id
            """)
            result = connection.execute(date_query, {'fund_id': fund_id})
            dates.update(row[0] for row in result)

        # Insert rows for all distinct dates into the target table
        for date in dates:
            insert_query = text(f"""
                INSERT INTO {table_name} (date)
                VALUES (:date)
                ON CONFLICT (date) DO NOTHING
            """)
            connection.execute(insert_query, {'date': date})

        # Generate and execute queries for each mapping
        for column, source_table in mappings.items():
            update_query = text(f"""
                UPDATE {table_name}
                SET {column} = COALESCE(
                    (SELECT {column} 
                     FROM {source_table} 
                     WHERE {source_table}.fund_id = :fund_id 
                     AND {source_table}.date = {table_name}.date
                     LIMIT 1), 0)
            """)
            connection.execute(update_query, {'fund_id': fund_id})
        
        # Commit the changes to the database
        connection.execute(text('COMMIT'))

    return f"Table '{table_name}' populated successfully with data from specified mappings."

if __name__ == "__main__":
    app.run(debug=True)