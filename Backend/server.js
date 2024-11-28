const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors())

// Configure Multer for File Uploads
const storage = multer.memoryStorage(); 
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL Database');
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).send('Invalid Token');
    }
};


/**
 * Endpoint about users table
 */

// User Registration with File Upload
app.post('/api/register', upload.single('profile_pic'), async (req, res) => {
    const {
        username,
        password,
        email,
        location,
        interests,
        first_name,
        last_name,
        dob,
        gender,
        phone,
    } = req.body;

    // Log the file for debugging
    console.log('Uploaded file:', req.file);

    const profilePicBuffer = req.file ? req.file.buffer : null;

    try {
        // SQL query to insert user data
        const query = `
            INSERT INTO users (username, password, email, location, interests, first_name, last_name, dob, gender, phone, profile_pic)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Execute query
        db.query(
            query,
            [
                username,
                password,
                email,
                location,
                interests,
                first_name,
                last_name,
                dob,
                gender,
                phone,
                profilePicBuffer,
            ],
            (err) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    return res.status(500).json({ error: 'Database error' });
                }
                res.status(201).json({ message: 'User registered successfully' });
            }
        );
    } catch (error) {
        console.error('Error in registration:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// User Login
app.post('/api/login', (req, res) => {
    console.log("Request body:", req.body);

    const { username, password, dob } = req.body;
    console.log("Username:", username, "Password:", password, "Dob:", dob);

    const query = `SELECT * FROM users WHERE username = ?`;

    db.query(query, [username], async (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];
        const isMatch = user.password === password;

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Encode the BLOB as Base64
        const profilePicBase64 = user.profile_pic
            ? `data:image/jpeg;base64,${user.profile_pic.toString('base64')}`
            : null;
        
        

        // Send the user details along with the token
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                location: user.location,
                interests: user.interests,
                first_name: user.first_name,
                last_name: user.last_name,
                dob: user.dob,
                gender: user.gender,
                phone: user.phone,
                profile_pic: profilePicBase64,
            },
        });
    });
});

app.post("/api/forgot-password", authenticateToken, (req, res) => {
    const { newPassword } = req.body;
    console.log("Received newPassword:", newPassword); // Debug
    console.log("User ID:", req.user.id); // Debug
    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }
  
    const userId = req.user.id;
    const query = "UPDATE users SET password = ? WHERE id = ?";
    db.query(query, [newPassword, userId], (err) => {
      if (err) {
        console.error("Error updating password:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json({ message: "Password updated successfully" });
    });
  });
  
  app.put("/api/update-user", authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { username, email, location, interests, first_name, last_name, dob, gender, phone } = req.body;
  
    const query = `
      UPDATE users
      SET username = ?, email = ?, location = ?, interests = ?, first_name = ?, last_name = ?, dob = ?, gender = ?, phone = ?
      WHERE id = ?
    `;
  
    db.query(
      query,
      [username, email, location, interests, first_name, last_name, dob, gender, phone, userId],
      (err, result) => {
        if (err) {
          console.error("Error updating user:", err);
          return res.status(500).json({ error: "Database error" });
        }
        res.status(200).json({ message: "User updated successfully", updatedUser: req.body });
      }
    );
  });
  


/**
 * Endpoint about events table
 */
app.post('/api/events', authenticateToken, (req, res) => {
    const { name, date, time, description, location, category } = req.body;

    const query = `INSERT INTO events (name, date, time, description, location, category, created_by) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [name, date, time, description, location, category, req.user.id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Event created successfully' });
        }
    });
});

// Get Events
app.get('/api/events', authenticateToken, (req, res) => {
    const query = `SELECT * FROM events`;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Chat Message
app.post('/api/chats', authenticateToken, (req, res) => {
    const { eventId, message } = req.body;

    const query = `INSERT INTO chats (event_id, user_id, message) VALUES (?, ?, ?)`;

    db.query(query, [eventId, req.user.id, message], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Message sent successfully' });
        }
    });
});

// Get Chat Messages
app.get('/api/chats/:eventId', authenticateToken, (req, res) => {
    const { eventId } = req.params;

    const query = `SELECT * FROM chats WHERE event_id = ?`;

    db.query(query, [eventId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/test-db', (req, res) => {
    db.query('SELECT 1 + 1 AS solution', (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            res.status(500).send('Database query failed');
        } else {
            res.send(`Database connected. Test query result: ${results[0].solution}`);
        }
    });
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
