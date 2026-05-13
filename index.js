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
const password = process.env.PASSWORD;
const apiKey = process.env.API_KEY;
const secretKey = process.env.SECRET_KEY;
const privateKey = process.env.PRIVATE_KEY;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.serialize(() => {
  db.run("CREATE TABLE users (id INT, username TEXT, password TEXT, role TEXT)");
});

app.get('/api/users', (req, res) => {
  const userId = req.query.id;
  const query = 'SELECT * FROM users WHERE id = ?';
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
    const result = JSON.parse(expression);
    res.json({ result });
  } catch (e) {
    res.status(400).json({ error: 'Invalid expression' });
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt: user=${username}, password=[REDACTED]`);
  res.send("Logged in!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Vulnerable App listening on port ${PORT}`);
  console.log(`AEGIS: Ready for scanning!`);
});