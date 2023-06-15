const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = 3000; // Change the port number as needed
// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "fast_food_on_map",
});

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Login page
app.post("/restaurants/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  const values = [username, password];

  pool.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error logging in" });
    } else {
      if (results.length > 0) {
        res.redirect("/restaurants");
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    }
  });
});

// Registration page
app.post("/restaurants/register", (req, res) => {
  const { username, password } = req.body;
  const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
  const values = [username, password];
  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error registering user" });
    }
  });
});

// initial fetch
app.get("/restaurants", (req, res) => {
  pool.query(
    'SELECT * FROM fast_food_on_map.fast_food_restaurants where country = "US" LIMIT 100;',
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Error retrieving restaurants" });
      } else {
        res.json(results);
      }
    }
  );
});

// add restaurant
app.post("/restaurants", (req, res) => {
  const { name, address, website, lat, lng } = req.body;
  const values = [name, address, website, lat, lng];
  const sql =
    "INSERT INTO fast_food_on_map.fast_food_restaurants (name, address, websites, latitude, longitude) VALUES (?, ?, ?, ?, ?)";

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error creating restaurant", sql: sql });
    } else {
      res.json({
        message: "Restaurant created successfully",
        id: result.insertId,
      });
    }
  });
});

// search restaurants
app.get("/restaurants/:Search", (req, res) => {
  const { Search } = req.params;
  const { name, address } = req.query;
  const values = [`%${name}%`, `%${address}%`];
  const sql =
    "SELECT * FROM fast_food_on_map.fast_food_restaurants WHERE name LIKE ? AND address LIKE ? LIMIT 400";
  pool.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error retrieving restaurants", sql: sql });
    } else {
      res.json(results);
    }
  });
});

// delete restaurant
app.post("/restaurants/delete", (req, res) => {
  const { name, address } = req.body;
  const values = [name, address];
  const sql =
      "DELETE FROM fast_food_on_map.fast_food_restaurants WHERE name = ? AND address = ?";

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error deleting restaurant", sql: sql });
    } else {
      res.json({
        // message: "Restaurant deleted successfully",
        message: sql,
        id: result.insertId,
      });
    }
  });
});

