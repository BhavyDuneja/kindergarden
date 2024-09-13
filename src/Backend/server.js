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

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT UserID, Role, Password FROM user WHERE Email = ?';
  db.query(query, [email], (error, results) => {
    if (error) {
      console.error('Error querying database: ', error);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length > 0) {
      const user = results[0];
      bcrypt.compare(password, user.Password, (err, isMatch) => {
        if (err) {
          console.error('Error comparing passwords: ', err);
          return res.status(500).json({ success: false, message: 'Error comparing passwords' });
        }

        if (isMatch) {
          res.json({ success: true, role: user.Role, userId: user.UserID }); // Send userId here
        } else {
          res.json({ success: false, message: 'Invalid credentials' });
        }
      });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
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
// Fetch checklist of students (nursery)
app.get('/api/teacher-dashboard/:teacherID/checklist', (req, res) => {
  const { teacherID } = req.params;

  const query = `
    SELECT c.ChildID, c.Name AS childName, c.Age, c.GroupName, c.Photo
    FROM Child c
    JOIN Class cl ON c.Class = cl.ClassName
    WHERE cl.TeacherID = ?;
  `;

  db.query(query, [teacherID], (err, results) => {
    if (err) {
      console.error('Error fetching checklist:', err);
      return res.status(500).send('Error fetching checklist');
    }
    res.status(200).json(results);
  });
});

// Add a log for a child (for activities, health, etc.)
app.post('/api/add-log', (req, res) => {
  const { childID, userID, date, temperature, healthStatus, activitySummary } = req.body;

  if (!childID || !userID || !date) {
    return res.status(400).send('Missing required fields');
  }

  const query = `
    INSERT INTO Log (ChildID, UserID, Date, Temperature, HealthStatus, ActivitySummary)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [childID, userID, date, temperature, healthStatus, activitySummary], (err, result) => {
    if (err) {
      console.error('Error adding log:', err);
      return res.status(500).send('Error adding log');
    }
    res.status(200).send('Log added successfully');
  });
});

// Fetch logs for a child
app.get('/api/child/:childID/logs', (req, res) => {
  const { childID } = req.params;

  const query = `
    SELECT l.LogID, l.Date, l.Temperature, l.HealthStatus, l.ActivitySummary, u.Name AS userName
    FROM Log l
    JOIN User u ON l.UserID = u.UserID
    WHERE l.ChildID = ?
    ORDER BY l.Date DESC;
  `;

  db.query(query, [childID], (err, results) => {
    if (err) {
      console.error('Error fetching logs:', err);
      return res.status(500).send('Error fetching logs');
    }
    res.status(200).json(results);
  });
});

// Mark attendance for a child
app.post('/api/mark-attendance', (req, res) => {
  const { childID, date, arrivalTime, departureTime } = req.body;

  if (!childID || !date || !arrivalTime) {
    return res.status(400).send('Missing required fields');
  }

  const query = `
    INSERT INTO Attendance (ChildID, Date, ArrivalTime, DepartureTime)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE ArrivalTime = ?, DepartureTime = ?;
  `;

  db.query(query, [childID, date, arrivalTime, departureTime, arrivalTime, departureTime], (err, result) => {
    if (err) {
      console.error('Error marking attendance:', err);
      return res.status(500).send('Error marking attendance');
    }
    res.status(200).send('Attendance marked successfully');
  });
});

// Fetch attendance for a child
app.get('/api/child/:childID/attendance', (req, res) => {
  const { childID } = req.params;

  const query = `
    SELECT a.AttendanceID, a.Date, a.ArrivalTime, a.DepartureTime
    FROM Attendance a
    WHERE a.ChildID = ?
    ORDER BY a.Date DESC;
  `;

  db.query(query, [childID], (err, results) => {
    if (err) {
      console.error('Error fetching attendance:', err);
      return res.status(500).send('Error fetching attendance');
    }
    res.status(200).json(results);
  });
});


// Start server
app.listen(3001, () => {
  console.log('Server running on port 3001');
});
