const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database(':memory:');

// No fix needed. The code correctly uses environment variables for sensitive data.
const password = process.env.PASSWORD;
const apiKey = process.env.API_KEY;
const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.SECRET_KEY;
const privateKey = process.env.PRIVATE_KEY;

// Use secretKey and privateKey in your application logic
// Before: console.log('User credentials:', username, password);
// After: console.log('User login attempt:', username);
// Or remove logging entirely if not needed for debugging.

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize DB
db.serialize(() => {
  db.run("CREATE TABLE users (id INT, username TEXT, password TEXT, role TEXT)");
// The actual code uses parameterized query, which is safe. No changes needed.
const query = 'SELECT * FROM users WHERE id = ?'; db.query(query, [userId], (err, results) => { if (err) throw err; console.log(results); });
});

// AEGIS VULNERABILITY: SQL Injection
app.get('/api/users', (req, res) => {
  const userId = req.query.id;
  // Dangerous: direct concatenation
const query = 'SELECT * FROM users WHERE id = ?'; connection.query(query, [userId], (error, results) => { if (error) throw error; console.log(results); });
  
  db.all(query, [], (err, rows) => {
const sanitizeHtml = require('sanitize-html');
app.get('/user', (req, res) => {
  const userInput = req.query.name;
  const safeInput = sanitizeHtml(userInput, { allowedTags: [], allowedAttributes: {} });
  res.send(`<div>${safeInput}</div>`);
});
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
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Example usage with sanitized input
app.post('/run', async (req, res) => {
  const userInput = req.body.command;
  // Validate and sanitize input - allow only alphanumeric and specific safe characters
  const safePattern = /^[a-zA-Z0-9\s\-_\.]+$/;
  if (!safePattern.test(userInput)) {
    return res.status(400).send('Invalid input');
  }
  try {
    const { stdout, stderr } = await execAsync(userInput, { shell: false });
    res.send(stdout);
  } catch (error) {
// Before: console.log('User credentials:', username, password);
// After: console.log('User login attempt:', username);
// Instead of logging the actual value, log a placeholder or omit it
console.log('Password received (not logged for security)');
const { exec } = require('child_process');
const sanitize = require('sanitize-filename');

app.post('/execute', (req, res) => {
  const userInput = req.body.command;
  const safeInput = sanitize(userInput);
  if (safeInput !== userInput) {
    return res.status(400).send('Invalid input');
  }
  exec(`echo ${safeInput}`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send('Execution failed');
    }
    res.send(stdout);
  });
});
});
const sanitize = require('sanitize-filename');

app.post('/execute', (req, res) => {
  const userInput = req.body.command;
  const safeInput = sanitize(userInput);
  if (safeInput !== userInput) {
    return res.status(400).send('Invalid input');
  }
// Replace eval() with a safer alternative, e.g., JSON.parse() for JSON strings
const result = JSON.parse(userInput);
    if (error) {
      return res.status(500).send('Execution failed');
    }
    res.send(stdout);
// Assuming the input is a JSON string, use JSON.parse instead of eval
const userInput = req.body.input; // example input
let data;
try {
  data = JSON.parse(userInput);
} catch (e) {
  // Handle invalid JSON input gracefully
  console.error('Invalid JSON input:', e);
  data = null;
}
});

// AEGIS VULNERABILITY: Command Injection
app.get('/api/ping', (req, res) => {
// Before: console.log('User password:', password);
// After:
console.log('User password: [REDACTED]');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function runCommand(userInput) {
  // Validate and sanitize user input
  const sanitizedInput = userInput.replace(/[^a-zA-Z0-9\s]/g, '');
  
  // Use exec with sanitized input, but prefer execFile or spawn for untrusted input
  try {
    const { stdout, stderr } = await execAsync(`echo ${sanitizedInput}`);
    console.log('stdout:', stdout);
    console.error('stderr:', stderr);
  } catch (error) {
    console.error('Error:', error);
  }
// Before: console.log('User credentials:', username, password);
// After: console.log('User login attempt for:', username);
  const exec = require('child_process').exec;
  // Dangerous: user input in shell command
const { execFile } = require('child_process');
const path = require('path');

// Validate and sanitize user input
const userInput = req.body.input;
if (typeof userInput !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(userInput)) {
  throw new Error('Invalid input');
}

// Replace eval() with a safer alternative, e.g., JSON.parse() if evaluating JSON, or a function constructor with restricted scope.
// Example: If the original code was: let result = eval(input);
// Use: let result = JSON.parse(input); // Only if input is valid JSON
// Or: let result = new Function('return ' + input)(); // Still risky, but better than eval
// For arbitrary code execution, consider a sandbox or avoid dynamic evaluation entirely.
// If the purpose is to evaluate mathematical expressions, use a library like math.js.
// Here's a safe replacement assuming input is a JSON string:
let result = JSON.parse(input);
const scriptPath = path.join(__dirname, 'scripts', 'process.sh');
execFile(scriptPath, [userInput], (error, stdout, stderr) => {
  if (error) {
    console.error(`Execution error: ${error}`);
    return;
  }
  console.log(`Output: ${stdout}`);
});
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
