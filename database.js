// // package
// const {createPool} = require('mysql')
//
// // assign connection parameter
// const pool = createPool ({
//     host: "127.0.0.1",
//     user: "root",
//     password: "passpass",
//
// })
//
//
// pool.query(`SELECT * FROM fast_food_on_map.fast_food_restaurants limit 20`, (err, res) => {
//     if (err) {
//         console.error(err);
//         return;
//     }
//     return console.log(res)
// })

const mysql = require('mysql');

class Database {
    constructor() {
        this.config = {
            host: "127.0.0.1",
            user: "root",
            password: "passpass",
            database: "fast_food_on_map"
        };
        this.connection = null;
    }

    connect() {
        this.connection = mysql.createConnection(this.config);
        this.connection.connect((err) => {
            if (err) {
                console.error('Error connecting to the database:', err);
                return;
            }
            console.log('Connected to the database.');
        });
    }

    disconnect() {
        if (this.connection) {
            this.connection.end((err) => {
                if (err) {
                    console.error('Error disconnecting from the database:', err);
                    return;
                }
                console.log('Disconnected from the database.');
            });
        }
    }
}

module.exports = Database;
