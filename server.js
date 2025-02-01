const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');
const app = express();

// Set the view engine (e.g., EJS)
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "public" directory
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'images')));

app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'HW',
    password: '6823',
    port: 5432,
});

app.post('/check-account', async (req, res) => {
    const { name, email, phone, password } = req.body; // Destructure the received data

    console.log(`Name: ${name}, Email: ${email}, Phone: ${phone}, Password: ${password}`);

    try {
        const result = await pool.query(`
            SELECT 
                c.customer_id, 
                c.name, 
                c.phone_number, 
                c.owed_balance, 
                c.plan_id, 
                c.payment_method,
                c.email, 
                p.plan_name, 
                p.plan_type, 
                p.price, 
                p.features,
                c.pwd  -- Include the password in the selection
            FROM 
                customer c
            JOIN 
                phone_plans p ON c.plan_id = p.plan_id
            WHERE 
                c.phone_number = $1;
        `, [phone]);

        // Example response
        if (result.rows.length > 0) {
            const user = result.rows[0];

            // Check if the provided password matches the stored password
            if (user.pwd === password) {
                console.log(user);
                res.json({ success: true, data: user });
            } else {
                res.json({ success: false, message: 'Password incorrect.' });
            }
        } else {
            res.json({ success: false, message: 'No account found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Database error.' });
    }
});

app.get("/", (req, res) => {
    console.log("Here")
    res.render("index"); // Ensure that the 'index.ejs' file exists in the views directory
});

app.listen(3000, () => console.log('Server running on port 3000'));


