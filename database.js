const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./food_connect.db', (err) => {
  if (err) console.error('Database connection error:', err.message);
  else console.log('Connected to SQLite database.');
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      food_name TEXT NOT NULL,
      donor_name TEXT NOT NULL,
      category TEXT NOT NULL,
      quantity TEXT NOT NULL,
      pickup_address TEXT NOT NULL,
      expires_in_hours INTEGER NOT NULL,
      status TEXT DEFAULT 'available',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;