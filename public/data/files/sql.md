# SQL
These notes draw upon <a target="_blank" href="https://launchschool.com/">Launch School's</a> course materials and <a target="_blank" href="https://www.postgresql.org/">PostgreSQL's</a> official documentation.

Structured Query Language (SQL) is used to communicate with relational databases. It is a powerful language that uses simple English commands to *Select* (find), *Order* (organize), and *Delete* (manage) a large amount of data.

A *Relational Database Management System* (RDBMS) is used to interact with a relational database.  We use PostgreSQL, which grants us access to the Postgres
client and server.  We use the Postgres Command Prompt `$` to connect to the psql console `some_database=#`, through which we send queries to the database.

An excel spreadsheet is a perfect analogy for a relational database governed by SQL:

|Excel File |SQL DB|
|---|---|
|Spreadsheet|Database|
|Worksheet|Table|
|Worksheet Column|Table Column|
|Woorksheet Row|Table Row|

## Interacting with PostgreSQL on Cloud9
Interacting with PostgreSQL on Cloud9 IDE is a little different than in a standard environment, and involves three steps, executed via the CLI:

1. `$ sudo su postgresql start` -- starts the PostgreSQL service
2. `$ sudo su - postgres` -- starts the PostgreSQL service command line
3. `$ psql` connects to the PostgreSQL console, through which we can interact directly with the server

## Joins

A JOIN is a clause in SQL statements that links two tables based on one or more fields.

### Inner

An `INNER JOIN` returns all records where the joining field (as defined in the `JOIN` statement) is present and has a shared value.  If we want to see all fields from tables A and B for those records with a shared `key` field, we would produce the following statement which *joins* the two tables on the `key` field:

```sql
-- model:
SELECT A.*, B.*
FROM A
INNER JOIN B on A.key = B.key;

-- real life example:
SELECT users.*, addresses.*
FROM users
INNER JOIN addresses
ON users.id = addresses.user_id;
```
This latter query would return all records with shared values in the `key` column (that is, all records from `users` joined with `addresses` where both possess the same value in the `users.id` and `addresses.user_id` columns as a single table.  An `INNER JOIN` can be visualized according to the following venn diagram:

<img src="http://d186loudes4jlv.cloudfront.net/sql/images/chapter4/inner-join.png"/>

### Left Outer

A `LEFT JOIN` or `LEFT OUTER JOIN` includes *all* the records on the `LEFT` table and joins it with a second, or right table, including only those values from the right table that have a corresponding value in the joining field:

```sql
-- model:
SELECT A.*, B.*
FROM A
LEFT JOIN B on A.key = B.key;
-- real life example:
SELECT users.*, addresses.*
FROM users
LEFT JOIN addresses
ON users.id = addresses.user_id;
```
This code would return all of the records in the `users` table, and only those records in the `addressess` table with a `user_id` that matches a user.  The general concept of a `LEFT JOIN` can be visualized as follows:

<img src="http://d186loudes4jlv.cloudfront.net/sql/images/chapter4/left-join.png"/>

### Right Outer

A `RIGHT OUTER JOIN` defines the same relationship between tables as a `LEFT JOIN/LEFT OUTER JOIN`, but simply reverses the tables, meaning that all the records of the right table will be included, while only reccords with corresponding values from the left table will be included.

## The Sublanguages of SQL

There are three functional sublanguages of SQL:

### DDL
*Data Definition Language* is used to create, modify, and delete tables and databases; in other words, it is responsible for describing how data is structured.  Common DDL statements include:

```sql
CREATE
ALTER
DROP
```
At the table level, DDL governs schema.

### DML
*Data Manipulation Language* is used to create, read, update, and delete data stored in a database.  Common DML statements include:

```sql
SELECT
INSERT
UPDATE
DELETE
```

At the table level, DML governs the data populating the table.

### DCL
*Data Control Language* is used to control access to a database; it is responsible for defining the rights and roles granted to individual users.  Example statements include:

```sql

GRANT
REVOKE
```

## Common SQL Statements

INSERT, UPDATE, DELETE, CREATE/ALTER/DROP TABLE, ADD/ALTER/DROP COLUMN.

### INSERT

`INSERT` is used to create a new record in a table:

```sql
-- model
INSERT INTO table (field1, field2)
VALUES (value1, value2);

-- simple insertion
INSERT INTO users (name, age)
VALUES ("John Rodriguez", 27);
```

### UDPATE
`UPDATE` is used to modify existing records, and is often paired with `WHERE` in order to specify which records to update.

```sql
-- model:
UPDATE table SET field = value;

-- update statement paired with where clause:
UPDATE users SET name = "Bobby" WHERE last_name = "Smith";
```

### DELETE
`DELETE` is used to remove records from a table, and is also often paired with `WHERE` in order to specify which records should be deleted.

```sql
-- simple delete statement, removes all records:
DELETE FROM users;

-- delete statement paired with where clause
DELETE FROM users WHERE last_name = "Parker";
```

### CREATE TABLE
`CREATE TABLE` is used to create a new table in a database.  Each element in parenthases defines a field within the table.

Each field is defined as follows: name data_type constraint_1 constraint_2 ...

```sql
CREATE TABLE table_name (
  field_1 data_type_a,
  field_2 data_type_b constraint_1 constraint_2,
  ... etc ...
  name VARCHAR(50) NOT NULL DEFAULT "Bobby"
);
```

### ALTER TABLE
`ALTER TABLE` is used to alter existing table schema, i.e., the rules that govern how and what kinds of data can be stored in a table.

```sql
ALTER TABLE table_to_change HOW TO CHANGE THE TABLE additional argument;

e.g.,

ALTER TABLE users ADD COLUMN last_login timestamp NOT NULL DEFAULT NOW();
```

### DROP TABLE
`DROP TABLE` is used to delete a table from a database

```sql
DROP TABLE table_name;
```

### ADD/DROP COLUMN
`ADD/DROP COLUMN` is used to add or drop a column in an existing table, and always follows an `ALTER TABLE` statement.

```sql
ALTER TABLE table_name ADD/DROP COLUMN column_name;
```

### ALTER COLUMN
`ALTER COLUMN` is used to change characteristics of a table column, typically by listing the characteristic to be changed and then the value it will be changed to after the `ALTER COLUMN` statement:

```sql
ALTER TABLE table_name ALTER COLUMN column_name CHARACTERISTIC NEW_VAL;

... eg ...

ALTER TABLE users ALTER COLUMN full_name TYPE VARCHAR;
```

## Additional Statements

### GROUP BY

The `GROUP BY` clause is used to group together all of those rows in a table with the same values in all listed columns.  This is typically done to reduce redundency in output or to set up aggregate functions to be applied to these records.

```sql
-- model
SELECT expression FROM table GROUP BY value;

-- all fields and records
SELECT * FROM age_income;
=>
 age | income
-----+--------
  22 |  28000
  22 |  24000
  22 |  32000
  25 |  31000
  24 |  23000
  (5 rows)

-- simple GROUP BY statement
SELECT age FROM age_income GROUP BY age;
 age
-----
  25
  22
  24
(3 rows)

-- GROUP BY statement with aggregate function
SELECT age, AVG(income) FROM age_income GROUP BY age;
 age |        avg         
-----+--------------------
  25 | 31000.000000000000
  22 | 28000.000000000000
  24 | 23000.000000000000
(3 rows)
```

NB: All columns in the select clause must either be arguments to the GROUP BY function *or* be included in aggregate functions, otherwise postgres will raise an error.

### ORDER BY

The `ORDER BY` clause is used to sort the result rows according to the expression specefied within the clause.

```sql
-- model
SELECT value FROM table ORDER BY expression ASC/DESC;

-- simple table ordered by income in descending order
SELECT * FROM age_income ORDER BY income DESC;
 age | income
-----+--------
  22 |  32000
  25 |  31000
  22 |  28000
  22 |  24000
  24 |  23000
(5 rows)
```

NB: multiple columns can be specified in the ORDER BY clause. If two rows are equal according to the leftmost expression, they are compared according to the next expression, and so on...

### WHERE / HAVING

The `WHERE` clause evaluates the expression to a boolean result, removing any records for which the expression evaluates to false. Variables and columns can be referenced in the WHERE clause.
```sql
-- model
WHERE expression

-- select statement with where clause
SELECT * FROM age_income WHERE age > 22;
 age | income
-----+--------
  25 |  31000
  24 |  23000
(2 rows)
```

The `HAVING` clause functions exactly the same as the `WHERE` clause with one key difference: while `WHERE` filters individual rows, `HAVING` filters group rows created by the `GROUP BY` clause.
```sql
SELECT age, avg(income) FROM age_income GROUP BY age HAVING avg(income) > 24000;
 age |        avg         
-----+--------------------
  25 | 31000.000000000000
  22 | 28000.000000000000
(2 rows)
```
NB: `WHERE` and `HAVING` should appear after `FROM` and `GROUP BY`.

NB: Aggregate functions used in a `HAVING` clause **must** be restated, and **cannot** be referenced by alias or function name; this will produce an error.

# Sequel

Sequel is a library that provides a Ruby API for accessing SQL databases.  It is a *SQL database access toolkit for Ruby*.

In a Ruby environment, Sequel can be installed and tested as follows:

```ruby
$ gem install sequel
$ pry
> require 'sequel'
=> true
```

## Sequel Connection to Database

In a Ruby environment, a Sequel databases object can be created to communicate with a particular SQL database.
```ruby
DB = Sequel.connect("postgres://user:password@host:post/database_name")
```

### Common SQL Queries in Sequel Ruby API

Sequel methods called on `Dataset`s can be passed column names in a variety of ways in order to construct a SQL query which is then passed to the database, returning a `Dataset`.

As a String representation of pure SQL in a method argument:

```ruby
DB[:table_a].select("table_a.column_1")
```

As a block argument in Sequel format:

```ruby
DB[:table_a].select { table_a__column_1 }
```

As a symbol in a method argument:

```ruby
DB[:table_a].select(:column_1)
```

#### CREATE TABLE

```ruby
DB.create_table(:table_name) do
  data_type :column_name, constraint: true
  # e.g...
  String :occupation, null: true
  primary_key :id
end
```

#### d

```ruby
DB.tables
```

#### d table_name

```ruby
DB.schema(:table_name)
```

#### SELECT * FROM table_name

```ruby
DB[:table_name].all # => array of row hashes
```

#### INSERT

```ruby
BD[:table_name].insert(column_a: value, column_b: value, column_c: value)
```

#### WHERE

```ruby
DB[:table_name].where(column_name: > 1)
```

#### ORDER BY

```ruby
DB[:table_name].order(:column_name)
```

#### SELECT
```ruby
DB[:table_name].select(:column_name)
```
#### COUNT

```ruby
DB[:table_name].count # returns total number of records
```

#### JOINS

```ruby
DB[:a].join_table(:join_type, a_column: :b_column)
```

## Understand what a Dataset is and how they are used in an application

A `Dataset` object can be thought of as representing an SQL query, and is the primary means by which Sequel accesses the database.  `Dataset`s can be stored as variables and reused, and most instance methods called on them do not alter the receiver, but rather return a new `Dataset` object modified according to the method call.

This means that method calls can be chained, allowing for the modular construction of complex SQL queries.

Most `Dataset` methods that return modified datasets do not execute the dataset's code on the database.  Those methods that yield or return results (think `Dataset#first`, `Dataset#yield`) should always be the last method call in the chain.

Read more <a target="_blank" href="http://sequel.jeremyevans.net/rdoc/files/doc/dataset_basics_rdoc.html">here</a>.
