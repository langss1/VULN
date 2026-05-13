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
if (!dbPassword) {
  throw new Error('DB_PASSWORD environment variable is not set');
}
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

app.get('/api/users', authenticate, (req, res) => {
  const userId = parseInt(req.query.id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  const query = 'SELECT * FROM users WHERE id = $1';
  db.all(query, [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
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
  const safePattern = /^[a-zA-Z0-9\s\-_\.]+$/;
  if (!safePattern.test(userInput)) {
    return res.status(400).send('Invalid input');
  }
  execFile('ping', ['-c', '1', userInput], (error, stdout, stderr) => {
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
    const safeParse = (input) => {
      const parsed = JSON.parse(input);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const blockedKeys = ['__proto__', 'constructor', 'prototype'];
        for (const key of Object.keys(parsed)) {
          if (blockedKeys.includes(key)) {
            throw new Error('Invalid key: ' + key);
          }
        }
      }
      return parsed;
    };
    const result = safeParse(expression);
    res.json({ result });
  } catch (e) {
    res.status(400).json({ error: 'Invalid expression' });
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const crypto = require('crypto');
  const anonymizedUsername = crypto.createHash('sha256').update(username).digest('hex').substring(0, 8);
  console.log('Login attempt for user:', anonymizedUsername);
  res.send("Logged in!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Vulnerable App listening on port ${PORT}`);
  console.log(`AEGIS: Ready for scanning!`);
});