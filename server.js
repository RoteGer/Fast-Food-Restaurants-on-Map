const express = require('express');
const mysql = require('mysql');
const cors = require("cors")

const app = express();
const port = 3000; // Change the port number as needed

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'passpass',
    database: 'fast_food_on_map'
});

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors())

// Define your endpoints here
// ...

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
app.get('/restaurants', (req, res) => {
    pool.query("SELECT * FROM fast_food_on_map.fast_food_restaurants LIMIT 20", (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error retrieving restaurants' });
        } else {
            res.json(results);
        }
    });
});
app.post('/restaurants', (req, res) => {
    const { name, address, cuisine } = req.body;
    const sql = 'INSERT INTO restaurants (name, address, cuisine) VALUES (?, ?, ?)';
    const values = [name, address, cuisine];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error creating restaurant' });
        } else {
            res.json({ message: 'Restaurant created successfully', id: result.insertId });
        }
    });
});
app.put('/restaurants/:id', (req, res) => {
    const { id } = req.params;
    const { name, address, cuisine } = req.body;
    const sql = 'UPDATE restaurants SET name = ?, address = ?, cuisine = ? WHERE id = ?';
    const values = [name, address, cuisine, id];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error updating restaurant' });
        } else {
            if (result.affectedRows > 0) {
                res.json({ message: 'Restaurant updated successfully' });
            } else {
                res.status(404).json({ error: 'Restaurant not found' });
            }
        }
    });
});
