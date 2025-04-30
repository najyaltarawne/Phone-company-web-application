Our backend consists of a 7-table PostgreSQL database system for processing and storing customer data:

customer: Stores user info like name, customer ID, phone number, etc.
payment: Records all payment transactions (amount, date, payment ID).
cust_bank: Holds customer banking details and card info.
call_record: Logs customer call history including time, data usage, and cost.
phone_plan: Contains available phone plans with features and pricing.
dependent: Stores info about dependents linked to a main customer.
cust_signup: Tracks sign-up dates linked to customer ID.
----------
Frontend

The frontend consists of 6 main files that together build a GUI for customer interaction:

index.html: Login page structure.
indexScripts.js: Scripts to handle login and API calls.
payment.html: Payment page.
paymentScripts.js: Handles logic and backend communication for payments.
callInfo.html: Interface for text/call tracking.
callScripts.js: Handles logic for the callInfo page.
---------
server.js

Utilizes Express and PostgreSQL.
Provides API routes to handle user login, payments, and call/text tracking.
Uses SQL queries to interact with the database (sample queries are shown below).
--------
All 7 tables comply with 2NF, 3NF, and BCNF:

No partial or transitive dependencies.
All non-prime attributes depend only on primary keys.
Optimized for data integrity and performance
-------

 Sample SQL Queries

Here are a few SQL examples used in the app:

(1. Retrieve Customer + Plan Info)
SELECT c.customer_id, c.name, c.phone_number, c.owed_balance, c.plan_id, 
       c.payment_method, c.email, p.plan_name, p.plan_type, p.price, 
       p.features, p.text_limit, p.talk_minutes, c.text_used, c.pwd,
       COALESCE(SUM(cr.call_minutes), 0) AS total_call_minutes,
       COALESCE(SUM(cr.data_used), 0) AS total_data_used
FROM customer c
JOIN phone_plan p ON c.plan_id = p.plan_id
LEFT JOIN call_record cr ON c.customer_id = cr.customer_id
WHERE c.phone_number = $1
GROUP BY c.customer_id, c.name, c.phone_number, c.owed_balance, 
         c.plan_id, c.payment_method, c.email, p.plan_name, p.plan_type, 
         p.price, p.features, p.text_limit, p.talk_minutes, c.text_used, c.pwd;

(2. Check Bank Details)

SELECT cust_id, balance, card_num, ex_date, cvc
FROM cust_bank
WHERE cust_id = $1 AND card_num = $2 AND ex_date = $3 AND cvc = $4;
--------

Running the Project

Create a PostgreSQL database named HW.
Load the pgdump.sql backup file.
Open the project folder in your preferred IDE.
Run the server using:
node server.js
Visit http://localhost:3000 in your browser.
Make sure to adjust PostgreSQL login credentials in server.js.
________

smaple login:

| Name         | Phone No   | Email                     | Password | Balance | Card No           | Exp Date | CVC |
|--------------|------------|---------------------------|----------|---------|--------------------|----------|-----|
| John Doe     | 1234567890 | johndoe@example.com       | 123456   | 18435.7 | 1234567890123456   | 11/25    | 123 |
| Jane Smith   | 2345678901 | janesmith@example.com     | 123456   | 678.9   | 2345678901234567   | 04/26    | 456 |
| Mike Johnson | 3456789012 | mikejohnson@example.com   | 123456   | 250     | 3456789012345678   | 01/27    | 789 |
| Emily Davis  | 4567890123 | emilydavis@example.com    | 123456   | 250.5   | 4567890123456789   | 09/24    | 321 |
| Chris Lee    | 5678901234 | chrislee@example.com      | 123456   | 899.99  | 5678901234567890   | 12/28    | 654 |






