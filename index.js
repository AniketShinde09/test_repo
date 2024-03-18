const express = require("express");
const sqlite3 = require("sqlite3").verbose(); // Import SQLite3 module
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

const dbPath = path.join(__dirname, "my_database.db"); // Path to your SQLite database file

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to SQLite database:", err.message);
  } else {
    console.log("Connected to SQLite database");

    // Check if the "users" table exists, and create it if it doesn't
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, score INTEGER DEFAULT 0)", (err) => {
      if (err) {
        console.error("Error creating 'users' table:", err.message);
      } else {
        console.log("Table 'users' created successfully");
      }
    });
  }
});

// Include userRoutes here...
const userRoutes = require("./routes/userRoutes");
app.use("/api", userRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, function () {
  console.log(`Server is working on port ${PORT}`);
});
