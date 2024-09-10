const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(cors({ origin: 'http://localhost:3000' })); // Adjust this according to your frontend setup
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Tech_123',
  database: 'techdb',
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL Database');
});

// Check for existing email in registration
app.post('/register', (req, res) => {
  const { role, name, email, password, phoneNumber } = req.body;

  const checkEmailQuery = 'SELECT * FROM admin WHERE Email = ?';
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password and store in admin table
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        return res.status(500).send(err);
      }

      const query = 'INSERT INTO admin (Role, Name, Email, Password, PhoneNumber) VALUES (?, ?, ?, ?, ?)';
      db.query(query, [role, name, email, hash, phoneNumber], (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).send('Registration Successful');
      });
    });
  });
});

// Login user and validate credentials from the user table
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT Role, Password FROM user WHERE Email = ?';
  db.query(query, [email], (error, results) => {
    if (error) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length > 0) {
      const user = results[0];
      bcrypt.compare(password, user.Password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error comparing passwords' });
        }

        if (isMatch) {
          res.json({ success: true, role: user.Role });
        } else {
          res.json({ success: false, message: 'Invalid credentials' });
        }
      });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// Admin endpoint to approve registration and move data to the user table
app.post('/api/approve-registration', (req, res) => {
  const { email } = req.body;

  const getAdminQuery = 'SELECT Role, Name, Email, Password, PhoneNumber FROM admin WHERE Email = ?';
  db.query(getAdminQuery, [email], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (results.length > 0) {
      const user = results[0];

      const insertUserQuery = 'INSERT INTO user (Role, Name, Email, Password, PhoneNumber) VALUES (?, ?, ?, ?, ?)';
      db.query(insertUserQuery, [user.Role, user.Name, user.Email, user.Password, user.PhoneNumber], (err) => {
        if (err) {
          return res.status(500).send(err);
        }

        const deleteAdminQuery = 'DELETE FROM admin WHERE Email = ?';
        db.query(deleteAdminQuery, [email], (err) => {
          if (err) {
            return res.status(500).send(err);
          }

          res.status(200).send('User approved and moved to user table');
        });
      });
    } else {
      res.status(404).send('Registration not found');
    }
  });
});

// Admin endpoint to reject registration (remove from admin table)
app.post('/api/reject-registration', (req, res) => {
  const { email } = req.body;

  const deleteAdminQuery = 'DELETE FROM admin WHERE Email = ?';
  db.query(deleteAdminQuery, [email], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send('Registration rejected and removed from admin table');
  });
});

// Fetch admin data
app.get('/api/admin-data', (req, res) => {
  const query = 'SELECT * FROM admin';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching admin data:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Fetch user data
app.get('/api/user-data', (req, res) => {
  const query = 'SELECT * FROM user';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching user data:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Update user details with password hashing
app.put('/api/update-user/:id', (req, res) => {
  const { id } = req.params;
  const { role, name, email, password, phoneNumber } = req.body;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      return res.status(500).send(err);
    }

    const updateUserQuery = 'UPDATE user SET Role = ?, Name = ?, Email = ?, Password = ?, PhoneNumber = ? WHERE UserID = ?';
    db.query(updateUserQuery, [role, name, email, hash, phoneNumber, id], (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).send('User updated successfully');
    });
  });
});

// Delete user
app.delete('/api/delete-user/:id', (req, res) => {
  const { id } = req.params;

  const deleteUserQuery = 'DELETE FROM user WHERE UserID = ?';
  db.query(deleteUserQuery, [id], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send('User deleted successfully');
  });
});

// Start server
app.listen(3001, () => {
  console.log('Server running on port 3001');
});
