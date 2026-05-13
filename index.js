const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const { execFile } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(execFile);
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const db = new sqlite3.Database(':memory:');
const dbPassword = process.env.DB_PASSWORD;
// Use dbPassword for database connection
const dbConfig = { host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD };

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.serialize(() => {
  db.run("CREATE TABLE users (id INT, username TEXT, password TEXT, role TEXT)");
});

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

app.get('/api/users', authenticate, (req, res) => {
  const userId = req.user.id;
  const query = 'SELECT * FROM users WHERE id = ?';
  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

app.get('/welcome', (req, res) => {
  const name = req.query.name || 'Guest';
  const safeName = sanitizeHtml(name, {
    allowedTags: [],
    allowedAttributes: {}
  });
  res.send(`<h1>Hello, ${safeName}</h1>`);
});

app.get('/api/ping', (req, res) => {
  const userInput = req.query.host || 'localhost';
  const allowedHosts = ['localhost', '127.0.0.1'];
  if (!allowedHosts.includes(userInput)) {
    return res.status(400).send('Invalid host');
  }
  execFile('ping', ['-c', '1', userInput], { shell: false }, (error, stdout, stderr) => {
    if (error) {
      res.status(500).send('Ping failed');
      return;
    }
    res.send(`<pre>${stdout}</pre>`);
  });
});

app.post('/api/calculate', (req, res) => {
  const expression = req.body.expression;
  try {
    const result = math.evaluate(expression);
    res.json({ result });
  } catch (e) {
    res.status(400).json({ error: 'Invalid expression' });
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const crypto = require('crypto');
  console.log('Login attempt received');
  res.send("Logged in!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Vulnerable App listening on port ${PORT}`);
  console.log(`AEGIS: Ready for scanning!`);
});