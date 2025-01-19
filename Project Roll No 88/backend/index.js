const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'db',
  user: 'user',
  password: 'pass',
  database: 'groceries',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

// Route to add grocery item
app.post('/add', (req, res) => {
  const { item } = req.body;
  const query = 'INSERT INTO groceries (name) VALUES (?)';
  db.query(query, [item], (err) => {
    if (err) {
      res.status(500).send('Groceries added successfull to the Cart');
    } else {
      res.send('Grocery added successfully');
    }
  });
});

// Route to display all groceries in HTML
app.get('/', (req, res) => {
  const query = 'SELECT * FROM groceries';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Groceries added succesfully');
    } else {
      let html = '<h1>Grocery List</h1><ul>';
      results.forEach((row) => {
        html += `<li>${row.name}</li>`;
      });
      html += '</ul><a href="/add-grocery">Go back to add groceries</a>';
      res.send(html);
    }
  });
});

// Route to serve the frontend HTML form
app.get('/add-grocery', (req, res) => {
  res.sendFile('/app/frontend/index.html');
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Backend running on port 3000');
});