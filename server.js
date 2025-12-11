const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: "db4free.net",
    user: "girishdb",        // replace with your db4free username
    password: "Girish@18",    // replace with your db4free password
    database: "registration_db",  // replace with your database name
    port: 3306
});

db.connect(err => {
    if(err) return console.error("Database Connection Error:", err.message);
    console.log("Connected to db4free!");
});

// Ensure users table exists
db.query(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(50),
    lname VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
    if(err) console.error("Error creating table:", err.message);
});

// Register route
app.post('/register', async (req, res) => {
    const { fname, lname, email, password } = req.body;
    console.log("Received:", req.body);

    // Backend validation
    if(!fname || !lname || !email || !password) return res.status(400).send("All fields are required");
    if(password.length < 6) return res.status(400).send("Password must be at least 6 characters");
    if(!email.includes("@") || !email.includes(".")) return res.status(400).send("Invalid email format");

    // Check existing email
    db.query("SELECT email FROM users WHERE email = ?", [email], async (err, result) => {
        if(err) {
            console.error("Select Error:", err);
            return res.status(500).send("Server error: " + err.message);
        }

        if(result.length > 0) return res.status(400).send("Email already registered");

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query("INSERT INTO users (fname, lname, email, password) VALUES (?, ?, ?, ?)",
            [fname, lname, email, hashedPassword],
            (err, result) => {
                if(err) {
                    console.error("Insert Error:", err);
                    return res.status(500).send("Database error: " + err.message);
                }
                res.send("Successfully Registered!");
            }
        );
    });
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
