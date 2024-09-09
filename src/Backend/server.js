const express = require('express');
const mysql = require('mysql2'); // Updated to mysql2
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create a connection to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Your MySQL username
  password: 'Tech_123', // Your MySQL password
  database: 'techdb', // Your database name
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL Database');
});

// Register user and save data to MySQL
app.post('/register', (req, res) => {
  const { role, name, email, password, phoneNumber } = req.body;

  // Hash the password
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      return res.status(500).send(err);
    }

    const query = 'INSERT INTO User (Role, Name, Email, Password, PhoneNumber) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [role, name, email, hash, phoneNumber], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).send('Registration Successful');
    });
  });
});

// Start server
app.listen(3001, () => {
  console.log('Server running on port 3001');
});
