const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Tech_123',
  database: 'techdb',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err.stack);
    return;
  }
  console.log('Connected to MySQL Database');
});

// Register user and save data to MySQL
// Check for existing email in registration
app.post('/register', (req, res) => {
  const { role, name, email, password, phoneNumber } = req.body;

  // Hash the password
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
// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt for email:', email);

  const query = 'SELECT UserID, Role, Password FROM admin WHERE Email = ?';
  db.query(query, [email], (error, results) => {
    if (error) {
      console.error('Error querying database: ', error);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    console.log('Query results:', results);
    if (results.length > 0) {
      const user = results[0];
      console.log('User found:', user);

      bcrypt.compare(password, user.Password, (err, isMatch) => {
        if (err) {
          console.error('Error comparing passwords: ', err);
          return res.status(500).json({ success: false, message: 'Error comparing passwords' });
        }

        if (isMatch) {
          console.log('Login successful for user:', user.UserID);
          res.json({ success: true, role: user.Role, userId: user.UserID });
        } else {
          console.log('Invalid credentials for email:', email);
          res.json({ success: false, message: 'Invalid credentials' });
        }
      });
    } else {
      console.log('No user found with that email:', email);
      res.json({ success: false, message: 'Invalid credentials' });
    }
  });
});


// Fetch all admin data
app.get('/api/admin-data', (req, res) => {
  const query = 'SELECT * FROM admin';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching admin data:', err);
      return res.status(500).json({ error: 'Error fetching admin data' });
    }
    res.json(results);
  });
});

// Fetch all user data
app.get('/api/user-data', (req, res) => {
  const query = 'SELECT * FROM user';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching user data:', err);
      return res.status(500).json({ error: 'Error fetching user data' });
    }
    res.json(results);
  });
});

// Approve registration and move to user table
app.post('/api/approve-registration', (req, res) => {
  const { email } = req.body;
  const getAdminQuery = 'SELECT * FROM admin WHERE Email = ?';
  db.query(getAdminQuery, [email], (err, results) => {
    if (err) {
      console.error('Error fetching admin data:', err);
      return res.status(500).json({ error: 'Error fetching admin data' });
    }
    if (results.length > 0) {
      const user = results[0];
      const insertUserQuery = 'INSERT INTO user (Role, Name, Email, Password, PhoneNumber) VALUES (?, ?, ?, ?, ?)';
      db.query(insertUserQuery, [user.Role, user.Name, user.Email, user.Password, user.PhoneNumber], (err) => {
        if (err) {
          console.error('Error inserting user data:', err);
          return res.status(500).json({ error: 'Error inserting user data' });
        }
        const deleteAdminQuery = 'DELETE FROM admin WHERE Email = ?';
        db.query(deleteAdminQuery, [email], (err) => {
          if (err) {
            console.error('Error deleting admin data:', err);
            return res.status(500).json({ error: 'Error deleting admin data' });
          }
          res.status(200).json({ message: 'User approved and moved to user table' });
        });
      });
    } else {
      res.status(404).json({ message: 'Registration not found' });
    }
  });
});

// Reject registration and remove from admin table
app.post('/api/reject-registration', (req, res) => {
  const { email } = req.body;
  const deleteAdminQuery = 'DELETE FROM admin WHERE Email = ?';
  db.query(deleteAdminQuery, [email], (err) => {
    if (err) {
      console.error('Error deleting admin data:', err);
      return res.status(500).json({ error: 'Error deleting admin data' });
    }
    res.status(200).json({ message: 'Registration rejected and removed from admin table' });
  });
});

// Update user details
app.put('/api/update-user/:id', (req, res) => {
  const { id } = req.params;
  const { Role, Name, Email, Password, PhoneNumber } = req.body;
  const updateUserQuery = 'UPDATE user SET Role = ?, Name = ?, Email = ?, Password = ?, PhoneNumber = ? WHERE UserID = ?';
  db.query(updateUserQuery, [Role, Name, Email, Password, PhoneNumber, id], (err) => {
    if (err) {
      console.error('Error updating user data:', err);
      return res.status(500).json({ error: 'Error updating user data' });
    }
    res.status(200).json({ message: 'User updated successfully' });
  });
});

// Delete user
app.delete('/api/delete-user/:id', (req, res) => {
  const { id } = req.params;
  const deleteUserQuery = 'DELETE FROM user WHERE UserID = ?';
  db.query(deleteUserQuery, [id], (err) => {
    if (err) {
      console.error('Error deleting user data:', err);
      return res.status(500).json({ error: 'Error deleting user data' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });
});

// Add child data
app.post('/api/add-child', (req, res) => {
  const { parentID, name, age, classInfo } = req.body;

  if (!parentID || !name || !age || !classInfo) {
    return res.status(400).send('All fields are required');
  }

  const query = 'INSERT INTO Child (ParentID, Name, Age, Class) VALUES (?, ?, ?, ?)';
  db.query(query, [parentID, name, age, classInfo], (err, result) => {
    if (err) {
      console.error('Error adding child:', err);
      return res.status(500).send('Error adding child');
    }
    res.status(200).send('Child added successfully');
  });
});

// Fetch parent dashboard data
app.get('/api/parent-dashboard/:parentID', (req, res) => {
  const { parentID } = req.params;

  const query = `
    SELECT 
      c.ChildID, 
      c.Name AS childName,
      c.Age, 
      c.Class,
      a.Date AS attendanceDate, 
      a.ArrivalTime, 
      a.DepartureTime,
      l.Temperature, 
      l.HealthStatus, 
      l.ActivitySummary
    FROM Child c
    LEFT JOIN Attendance a ON c.ChildID = a.ChildID
    LEFT JOIN Log l ON c.ChildID = l.ChildID
    WHERE c.ParentID = ?;
  `;

  db.query(query, [parentID], (err, results) => {
    if (err) {
      console.error('Error fetching parent dashboard data:', err);
      return res.status(500).send('Error fetching dashboard data');
    }
    res.status(200).json(results);
  });
});


app.get('/api/children', (req, res) => {
  const query = `
    SELECT ChildID, Name, Age, Class
    FROM Child
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching children:', err);
      return res.status(500).send('Error fetching children');
    }
    res.status(200).json(results);
  });
});

// Submit attendance data for a child
app.post('/api/attendance', (req, res) => {
  const { childId, date, arrivalTime, departureTime } = req.body;

  if (!childId || !date || !arrivalTime) {
    return res.status(400).send('Missing required fields');
  }

  const query = `
    INSERT INTO Attendance (ChildID, Date, ArrivalTime, DepartureTime)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE ArrivalTime = ?, DepartureTime = ?;
  `;

  db.query(query, [childId, date, arrivalTime, departureTime, arrivalTime, departureTime], (err, result) => {
    if (err) {
      console.error('Error marking attendance:', err);
      return res.status(500).send('Error marking attendance');
    }
    res.status(200).send('Attendance marked successfully');
  });
});

// Submit log data for a child
app.post('/api/logs', (req, res) => {
  const { childId, date, temperature, healthStatus, activitySummary } = req.body;

  if (!childId || !date || !temperature || !healthStatus) {
    return res.status(400).send('Missing required fields');
  }

  const query = `
    INSERT INTO Log (ChildID, Date, Temperature, HealthStatus, ActivitySummary)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [childId, date, temperature, healthStatus, activitySummary], (err, result) => {
    if (err) {
      console.error('Error adding log:', err);
      return res.status(500).send('Error adding log');
    }
    res.status(200).send('Log added successfully');
  });
});

// Start server
app.listen(3001, () => {
  console.log('Server running on port 3001');
});

