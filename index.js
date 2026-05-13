const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database(':memory:');

// AEGIS VULNERABILITY: Hardcoded Secrets
const password = process.env.PASSWORD;
const apiKey = process.env.API_KEY;
const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.SECRET_KEY;
const privateKey = process.env.PRIVATE_KEY;

// Use secretKey and privateKey in your application logic
console.log('Keys loaded from environment variables');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize DB
db.serialize(() => {
  db.run("CREATE TABLE users (id INT, username TEXT, password TEXT, role TEXT)");
  db.run("INSERT INTO users VALUES (1, 'admin', 'admin123', 'admin')");
  db.run("INSERT INTO users VALUES (2, 'user', 'user123', 'user')");
});

// AEGIS VULNERABILITY: SQL Injection
app.get('/api/users', (req, res) => {
  const userId = req.query.id;
  // Dangerous: direct concatenation
  const query = "SELECT * FROM users WHERE id = " + userId;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// AEGIS VULNERABILITY: XSS (Cross-Site Scripting)
app.get('/welcome', (req, res) => {
  const name = req.query.name || 'Guest';
  // Dangerous: raw HTML rendering
  res.send(`<h1>Welcome, ${name}!</h1><p>You are logged in.</p>`);
});

// AEGIS VULNERABILITY: Command Injection
app.get('/api/ping', (req, res) => {
  const host = req.query.host;
  const exec = require('child_process').exec;
  // Dangerous: user input in shell command
  exec(`ping -c 1 ${host}`, (error, stdout, stderr) => {
    res.send(`<pre>${stdout}</pre>`);
  });
});

// AEGIS VULNERABILITY: Eval Usage
app.post('/api/calculate', (req, res) => {
  const expression = req.body.expression;
  // Extremely Dangerous
  const result = eval(expression);
  res.json({ result });
});

// AEGIS VULNERABILITY: Console Log Sensitive Data
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt: user=${username}, password=${password}`);
  res.send("Logged in!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Vulnerable App listening on port ${PORT}`);
  console.log(`AEGIS: Ready for scanning!`);
});
