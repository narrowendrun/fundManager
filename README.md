# fundManager

An analytics and dashboards tool that allows you to maintain your mortgage/loan purchases


## Prerequisites

Please ensure to have the following tech stack installed in your machine

* npm 
* PSQL
* python3
   * flask
   * flask_sqlalchemy
   * sqlalchemy


## Setup

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

install npm in the reactpage directory
```bash
   cd /path/to/fundManager/reactpage
   npm install
```
Change the permissions for start_project.sh
```bash
   chmod +x start_project.sh
```





## Deployment

Once the prerequisites and setup are taken care of, we can start the project

```bash
   cd /path/to/fundManager
   ./start_project
```
##  Skills

React, PSQL, JavaScript, Python

## Note

This guide assumes that the repo is cloned to a linux/mac machine
