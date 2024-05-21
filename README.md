
# fundManager

An analytics and dashboards tool that allows you to maintain your mortgage/loan purchases


## Deployment

Create a makefile.env inside flaskserver/datafiles/ that stores your psql database variables
```bash
   cd flaskserver/datafiles
   nano makefile.env
```
Insert your PSQL database details using the line items into the makefile.env
```dotenv
   DB_USER=""
   DB_PASSWORD=""
   DB_HOST=""
   DB_PORT=5432
   DB_NAME=""
```
Ensure your database is initialised with all the necessary tables using the createtables.sql file
```sql
-- connect to the database
\c your_database
-- run the file
\i /path/to/repo/fundManager/flaskserver/datafiles/sql/createtables.sql 
```
Change the permissions for start_project.sh
```bash
   chmod +x start_project.sh
```
Once the prerequisites are taken care of, we can start the project
```bash
  ./start_project.sh
```



## 🛠 Skills
React, PSQL, JavaScript, Python


