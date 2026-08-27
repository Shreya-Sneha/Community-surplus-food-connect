const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. Get all active listings
app.get('/api/listings', (req, res) => {
  db.all('SELECT * FROM listings ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 2. Create a new food donation listing
app.post('/api/listings', (req, res) => {
  const { food_name, donor_name, category, quantity, pickup_address, expires_in_hours } = req.body;
  if (!food_name || !donor_name || !quantity || !pickup_address || !expires_in_hours) {
    return res.status(400).json({ error: 'All required fields must be filled.' });
  }

  const sql = `INSERT INTO listings (food_name, donor_name, category, quantity, pickup_address, expires_in_hours)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [food_name, donor_name, category || 'Cooked Meals', quantity, pickup_address, expires_in_hours];

  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Listing created successfully', id: this.lastID });
  });
});

// 3. Mark food listing as claimed
app.patch('/api/listings/:id/claim', (req, res) => {
  const { id } = req.params;
  db.run(`UPDATE listings SET status = 'claimed' WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Listing not found.' });
    res.json({ message: 'Listing successfully marked as claimed.' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});