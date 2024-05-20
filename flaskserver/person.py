# Define the Person model
# class Person(db.Model):
#     id = db.Column(db.BIGINT, primary_key=True)
#     firstname = db.Column(db.String(50), nullable=False)
#     lastname = db.Column(db.String(50), nullable=False)
#     email = db.Column(db.String(50), nullable=False)
#     gender = db.Column(db.String(10), nullable=False)
#     country_of_birth = db.Column(db.String(50), nullable=False)
#     date_of_birth = db.Column(db.Date, nullable=False)
# # Route to upload JSON file and insert data into the 'person' table
# @app.route('/api/upload', methods=['POST'])
# def upload_file():
#     if 'file' not in request.files:
#         return jsonify('No file part')
#     file = request.files['file']
#     if file.filename == '':
#         return jsonify('No selected file')
#     if file:
#         filename = file.filename
#         file.save(filename)
#         # Delete all entries from the 'person' table
#         db.session.execute(delete(Person))

#         # Commit the deletion
#         db.session.commit()
#         # Read JSON file and insert data into 'person' table
#         with open(filename, 'r') as f:
#             data = json.load(f)
#             for entry in data:
#                 person = Person(
#                     firstname=entry['firstname'],
#                     lastname=entry['lastname'],
#                     email=entry['email'],
#                     gender=entry['gender'],
#                     country_of_birth=entry['country_of_birth'],
#                     date_of_birth=entry['date_of_birth']
#                 )
#                 db.session.add(person)
#             db.session.commit()

#         os.remove(filename)
#         return 'File uploaded successfully and data inserted into database'