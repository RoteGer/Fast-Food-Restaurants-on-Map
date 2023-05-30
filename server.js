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
    pool.query("SELECT * FROM fast_food_on_map.fast_food_restaurants where country = \"US\" LIMIT 100;", (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({error: 'Error retrieving restaurants'});
        } else {
            res.json(results);
        }
    });
});
app.post('/restaurants', (req, res) => {
    const {name, address, lat, lng} = req.body;
    const values = [name, address, lat, lng];
    const sql = 'INSERT INTO fast_food_on_map.fast_food_restaurants (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({error: 'Error creating restaurant', sql: sql});
        } else {
            res.json({message: 'Restaurant created successfully', id: result.insertId});
        }
    });
});

// app.put('/restaurants/:name', (req, res) => {
//     const { name, address } = req.body;
//     const values = [`%${name}%`, `%${address}%`];
//     console.log(values)
//     const sql = 'SELECT * FROM fast_food_on_map.fast_food_restaurants WHERE name LIKE ? AND address LIKE ? LIMIT 100';
//
//     pool.query(sql, values, (err, res) => {
//         if (err) {
//             console.error(err);
//             res.status(500).json({ error: 'Error updating restaurant' });
//         } else {
//             console.log(res);
//             res.json(res);
//         }
//
//     });
// });

app.get('/restaurants/:Search', (req, res) => {
    const { name, address } = req.query;
    const values = [`%${name}%`, `%${address}%`];
    const sql = 'SELECT * FROM fast_food_on_map.fast_food_restaurants WHERE name LIKE ? AND address LIKE ? LIMIT 100';
    pool.query(sql, values, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error retrieving restaurants', sql:sql });
        } else {
            console.log(results);
            res.json(results);
        }
    });
});