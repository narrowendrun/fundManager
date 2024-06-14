from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
import json
from sqlalchemy import text, delete
import subprocess
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# Load environment variables
dotenv_path = './.env'
load_dotenv(dotenv_path)
# Debugging: Print loaded environment variables
print(f"DB_USER: {os.getenv('DB_USER')}")
print(f"DB_PASSWORD: {os.getenv('DB_PASSWORD')}")
print(f"DB_HOST: {os.getenv('DB_HOST')}")
print(f"DB_PORT: {os.getenv('DB_PORT')}")
print(f"DB_NAME: {os.getenv('DB_NAME')}")

# Configure the database URI
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
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
    
    # # If password is provided, include it in the command
    # if password:
    #     psql_command.extend(['-W', password])
    
    # Use PGPASSWORD environment variable for password
    env = os.environ.copy()
    env['PGPASSWORD'] = password
    # Execute the psql command
    try:
        output = subprocess.check_output(psql_command, stderr=subprocess.STDOUT, env=env)
        return output.decode('utf-8')
    except subprocess.CalledProcessError as e:
        return e.output.decode('utf-8')

# Define the Capital Returns Model
class CapitalReturnSchedule(db.Model):
    __tablename__ = 'capitalreturnschedule'
    id = db.Column(db.BIGINT, primary_key=True)
    fund_id=db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date,nullable=False)
    senior = db.Column(db.Float, nullable=True)
    mezz = db.Column(db.Float, nullable=True)
    junior = db.Column(db.Float, nullable=True)
    classa = db.Column(db.Float, nullable=True)
    classb = db.Column(db.Float, nullable=True)

# Define the Capital Returns Model
class CapitalDeploymentSchedule(db.Model):
    __tablename__ = 'capitaldeploymentschedule'
    id = db.Column(db.BIGINT, primary_key=True)
    fund_id=db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date,nullable=False)
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
    return jsonify('welcome',200)

@app.route('/api/upload', methods=['POST'])
def upload_file():
    # Check if the request contains a file
    if 'file' not in request.files:
        return jsonify('No file part')
    
    file = request.files['file']
    
    # Check if a file is selected
    if file.filename == '':
        return jsonify('No selected file')
    
    # Check if the JSON body contains the necessary information
    if 'table_name' not in request.form:
        return jsonify('No table name provided')
    
    # Save the uploaded file
    filename = file.filename
    file.save(filename)
    
    # Read the JSON data from the file
    with open(filename, 'r') as f:
        data = json.load(f)
    
    # Get the table name from the JSON body
    table_name = request.form['table_name']
    
    # Insert data into the appropriate table
    for entry in data:
        records = None
        if table_name == 'capitalreturnschedule':
            records = CapitalReturnSchedule(
                fund_id = entry['fund_id'],
                date = entry['date'],
                senior = entry['senior'],
                mezz = entry['mezz'],
                junior = entry['junior'],
                classa = entry['classa'],
                classb = entry['classb']
            )
        elif table_name == 'capitaldeploymentschedule':
            records = CapitalDeploymentSchedule(
                fund_id = entry['fund_id'],
                date = entry['date'],
                senior = entry['senior'],
                mezz = entry['mezz'],
                junior = entry['junior'],
                classa = entry['classa'],
                classb = entry['classb']
            )
        
        # Add records to the session
        db.session.add(records)
    
    # Commit the changes to the database
    db.session.commit()
    
    # Remove the uploaded file
    os.remove(filename)
    
    return jsonify(table_name+" uploaded successfully and data inserted into database")
@app.route('/api/query', methods=['POST'])
def execute_query():
    query = request.json.get('query', None)
    if not query:
        return jsonify({'error': 'Query parameter is missing'}), 400

    try:
        with db.engine.connect() as connection:
            result = connection.execute(text(query))
            rows = []
            for row in result:
                # Access each column value by index
                formatted_row = [str(value) for value in row]  # Convert all values to strings
                rows.append(dict(zip(result.keys(), formatted_row)))
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

if __name__ == "__main__":
    # app.run(host='0.0.0.0', port=5000)
    app.run(debug=True)
