const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files like HTML, CSS, JS, and images
app.use(express.static(__dirname)); // Serve files from the root directory

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // Replace with your MySQL username
    password: 'namit1008',    // Replace with your MySQL password
    database: 'dkte_bus'      // Replace with your database name
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Global variable to store the driver's location
let driverLocation = { latitude: null, longitude: null };

// Driver shares location
app.post('/api/share-location', (req, res) => {
    const { latitude, longitude } = req.body;
    driverLocation = { latitude, longitude };
    res.json({ message: 'Location shared successfully' });
});

// Student fetches driver location
app.get('/api/get-location', (req, res) => {
    res.json(driverLocation);
});

// Registration endpoint
app.post('/register', (req, res) => {
    const { username, email, mobile, password, gender } = req.body;

    // Hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send('Error hashing password');
        }

        const query = 'INSERT INTO users (username, email, mobile_no, password, gender) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [username, email, mobile, hashedPassword, gender], (error) => {
            if (error) {
                console.error('Error inserting user:', error);
                return res.status(500).send('Error inserting user');
            }
            res.status(201).redirect('/login.html');  // Redirect to login page after registration
        });
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { mobile, password } = req.body;

    const query = 'SELECT * FROM users WHERE mobile_no = ?';
    db.query(query, [mobile], (error, results) => {
        if (error) {
            console.error('Error fetching user:', error);
            return res.status(500).send('Error fetching user');
        }
        
        if (results.length === 0) {
            return res.status(401).send('Invalid mobile number or password');
        }

        const user = results[0];

        // Compare hashed password
        bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).send('Error comparing passwords');
            }
            if (match) {
                res.status(200).redirect('/home_page.html');  // Redirect to home page on successful login
            } else {
                res.status(401).send('Invalid mobile number or password');
            }
        });
    });
});

// Password Reset Endpoint
app.post('/forgot-password', (req, res) => {
    const { email } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (error, results) => {
        if (error) {
            console.error('Error fetching user:', error);
            return res.status(500).send('Error fetching user');
        }

        if (results.length === 0) {
            return res.status(404).send('Email not found');
        }

        // Here, you would typically send an email with a password reset link
        // For simplicity, we'll just send a success message
        res.status(200).send('Password reset link sent to your email');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
