const mysql = require("mysql2");
const fs = require("fs");
const csv = require("fast-csv");

const DB_NAME = "fast_food_on_map";
const TABLE_NAME = "fast_food_restaurants";

const columnTypes = {
  address: "VARCHAR(255)",
  city: "VARCHAR(255)",
  country: "VARCHAR(255)",
  keys: "VARCHAR(255)",
  latitude: "DECIMAL(9,6)",
  longitude: "DECIMAL(9,6)",
  name: "VARCHAR(255)",
  postalCode: "VARCHAR(10)",
  province: "VARCHAR(255)",
  websites: "TEXT",
};

// Function to create the database
function createDatabase() {
  // Database connection configuration
  const connection = mysql.createConnection({
    host: "gis-database.cezz5gd7zjpv.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "password",
  });
  const createDBQuery = `CREATE DATABASE ${DB_NAME}`;

  connection.query(createDBQuery, (error, results, fields) => {
    if (error) {
      console.error("Error creating database:", error);
    } else {
      console.log("Database created successfully.");
      connection.end(); // Close the connection after creating the database
    }
  });
}

// Path to the CSV file
const csvFilePath = "FastFoodRestaurants.csv";

// Function to load CSV data into the database
function loadCSVDataToDatabase() {
  const connection = mysql.createConnection({
    host: "gis-database.cezz5gd7zjpv.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "password",
    database: DB_NAME,
  });
  fs.createReadStream(csvFilePath)
    .pipe(csv.parse({ headers: true }))
    .on("data", (row) => {
      // Create INSERT statement using the row data
      const insertQuery = `INSERT INTO ${TABLE_NAME} (address, city, country, \`keys\`, latitude, longitude, name, postalCode, province, websites) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const values = [
        row.address,
        row.city,
        row.country,
        row.keys,
        row.latitude,
        row.longitude,
        row.name,
        row.postalCode,
        row.province,
        row.websites,
      ];

      connection.query(insertQuery, values, (error, results, fields) => {
        if (error) {
          console.error("Error inserting data:", error);
        }
      });
    })
    .on("end", () => {
      connection.end(); // Close the connection after inserting the data
      console.log("Data insertion completed.");
    })
    .on("error", (error) => {
      console.error("Error reading CSV file:", error);
      connection.end(); // Close the connection if there's an error
    });
}

// Function to create a table
function createTable() {
  const connection = mysql.createConnection({
    host: "gis-database.cezz5gd7zjpv.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "password",
    database: DB_NAME,
  });
  const createTableQuery = `CREATE TABLE IF NOT EXISTS fast_food_restaurants (
    address VARCHAR(255),
    city VARCHAR(255),
    country VARCHAR(255),
    \`keys\` VARCHAR(255),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    name VARCHAR(255),
    postalCode VARCHAR(10),
    province VARCHAR(255),
    websites TEXT
  )`;

  connection.query(createTableQuery, (error, results, fields) => {
    if (error) {
      console.error("Error creating table:", error);
    } else {
      console.log("Table created successfully.");
    }
    connection.end(); // Close the connection after creating the table or encountering an error
  });
}

function readFromDatabase() {
  const connection = mysql.createConnection({
    host: "gis-database.cezz5gd7zjpv.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "password",
    database: DB_NAME,
  });
  const selectQuery = `SELECT * FROM ${TABLE_NAME}`;
  connection.query(selectQuery, (error, results, fields) => {
    if (error) {
      console.error("Error reading data:", error);
    } else {
      console.log("Data read successfully.", results);
      console.log("Number of rows:", results.length);
    }
  });
  const countQuery = `SELECT COUNT(*) AS total FROM ${TABLE_NAME}`;

  connection.query(countQuery, (error, results) => {
    if (error) {
      console.error("Error counting data:", error);
    } else {
      const count = results[0].total;
      console.log("Total number of records:", count);
    }
    connection.end(); // Close the connection after reading the data
  });
}

// Call the function to start loading the CSV data
// Call the function to create the database
// createDatabase();
// createTable();
loadCSVDataToDatabase();
// readFromDatabase();
