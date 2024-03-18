const express = require("express");
const sqlite3 = require("sqlite3").verbose();// Import SQLite3 module
const path = require("path");
const router = express.Router();


// Connect to SQLite database
const dbPath = path.join(__dirname, "../my_database.db"); // Path to your SQLite database file
const db = new sqlite3.Database(dbPath);


router.post("/findorcreateuser", (req, res) => {
  const { username } = req.body;
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      console.log("User already exists");
      return res.json(row);
    } else {
      db.run("INSERT INTO users (username) VALUES (?)", [username], function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        console.log(`User ${username} created with ID ${this.lastID}`);
        return res.json({ id: this.lastID, username });
      });
    }
  });
});

router.get("/getalluser", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.json({ data: rows });
  });
});

router.post("/updatescore", (req, res) => {
  const { username, score } = req.body;
  db.run("UPDATE users SET score = ? WHERE username = ?", [score, username], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    console.log(`Score updated for user ${username}`);
    return res.json({ success: true });
  });
});

module.exports = router;
