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

/**
 *  Yeni kullanıcı kayıt etmek için kullandığımız endpoint
 */
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


/**
 *  Login için kullandığımız endpoint
 */
app.post('/api/login', (req, res) => {
    console.log("Request body:", req.body);

    const { username, password } = req.body;

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
                password: user.password,
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

/**
 *  Parolamızı güncellemek için kullandığımız endpoint
 */
app.post("/api/change-password", (req, res) => {
    const { currentPassword, newPassword, userId } = req.body;
  
    if (!currentPassword || !newPassword || !userId) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    // First, verify the current password against the database
    const query = "SELECT password FROM users WHERE id = ?";
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Error querying database:", err);
        return res.status(500).json({ error: "Database error" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const storedPassword = results[0].password;
  
      // Compare the provided current password with the stored password
      if (currentPassword !== storedPassword) {
        return res.status(401).json({ error: "Incorrect current password" });
      }
  
      // Proceed to update the password if everything is valid
      const updateQuery = "UPDATE users SET password = ? WHERE id = ?";
      db.query(updateQuery, [newPassword, userId], (err) => {
        if (err) {
          console.error("Error updating password:", err);
          return res.status(500).json({ error: "Error updating password" });
        }
  
        return res.status(200).json({ message: "Password updated successfully" });
      });
    });
  });
  
  
  app.put("/api/update-user", (req, res) => {
    const { username, email, location, interests, first_name, last_name, dob, gender, phone, userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
  
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
 * Event eklemek için kullandığımız endpoint
 */
app.post('/api/add-events', upload.single('image'), (req, res) => {
    const {
        name,
        description,
        date,
        time,
        duration,
        category,
        lat,
        lng,
        created_by, 
    } = req.body;

    console.log(req.body);

    // Store only latitude and longitude as a string
    const location = `${lat}, ${lng}`;

    // Handle image upload
    const eventImageBuffer = req.file ? req.file.buffer : null;

    const query = `
        INSERT INTO events (name, description, date, time, duration, category, location, created_by, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [name, description, date, time, duration, category, location, created_by, eventImageBuffer],
        (err) => {
            if (err) {
                console.error('Error inserting event:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ message: 'Event added successfully' });
        }
    );
});

/**
 *  events için tüm etkinlerine bilgisini getiren endpoint
 */
app.get('/api/events', (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const query = `SELECT * FROM events LIMIT ? OFFSET ?`;

    db.query(query, [parseInt(limit), parseInt(offset)], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Encode images as Base64
        const events = results.map(event => {
            if (event.image) {
                event.image = `data:image/jpeg;base64,${event.image.toString('base64')}`;
            }
            return event;
        });

        res.json(events);
    });
});
/**
 *  Seçilen etkinliğin id'sini alarak tüm bilgilerini getiren endpoint
 */
app.get('/api/events/:id', (req, res) => {
    const { id } = req.params;

    const query = `SELECT * FROM events WHERE id = ?`;

    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Event not found" });
        }

        const event = results[0];

        // Encode image as Base64
        if (event.image) {
            event.image = `data:image/jpeg;base64,${event.image.toString('base64')}`;
        }

        res.json(event);
    });
});
/**
 * Endpoint to check if there's a conflict with the user's event schedule.
 */
app.post('/api/check-event-conflict', (req, res) => {
  const { user_id, event_date_time } = req.body;

  if (!user_id || !event_date_time) {
    return res.status(400).json({ error: "User ID and event date/time are required" });
  }

  // SQL query to check if there are any other events for the user at the same date and time
  const query = `
    SELECT * FROM participants
    JOIN events ON participants.event_id = events.id
    WHERE participants.user_id = ? AND CONCAT(events.date, 'T', events.time) = ?
  `;

  db.query(query, [user_id, event_date_time], (err, results) => {
    if (err) {
      console.error("Error checking event conflict:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      // Conflict found
      return res.json({ conflict: true });
    } else {
      // No conflict
      return res.json({ conflict: false });
    }
  });
});

/**
 * Endpoint to get all events the logged-in user is attending
 */
app.post('/api/user-events', (req, res) => {

  const { user_id } = req.body;

  if (!user_id) {
    return res.status(401).json({ error: "User not logged in" });
  }

  const query = `
    SELECT events.id, events.name, events.date, events.time, events.duration
    FROM participants
    JOIN events ON participants.event_id = events.id
    WHERE participants.user_id = ?
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching user events:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results); // Return all events the user is attending
  });
});
app.post('/api/delete-event', (req, res) => {
  const { event_id, user_id } = req.body;

  if (!event_id || !user_id) {
    return res.status(400).json({ error: "Event ID and User ID are required" });
  }

  const query = `DELETE FROM participants WHERE event_id = ? AND user_id = ?`;

  db.query(query, [event_id, user_id], (err, result) => {
    if (err) {
      console.error('Error deleting event:', err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Event not found for this user" });
    }

    res.status(200).json({ message: "Event removed successfully" });
  });
});

/**
 * Brings the event name and id for search bar
 */
app.get('/api/events-names-for-search-bar', (req, res) => {
  const query = `SELECT id, name FROM events`;

  db.query(query, (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }

      res.json(results); // Send back all event names and ids
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

app.post('/api/participants', (req, res) => {
  const { user_id, event_id } = req.body;

  if (!user_id || !event_id) {
    return res.status(400).json({ error: "User ID and Event ID are required." });
  }

  const query = `INSERT INTO participants (user_id, event_id) VALUES (?, ?)`;

  db.query(query, [user_id, event_id], (err) => {
    if (err) {
      console.error("Error adding participant:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "Participant added successfully." });
  });
});



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
