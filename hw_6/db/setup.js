import mysql from "mysql2";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the database!");
});
const createProductsTableQuery = `
  CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
    );
`;
connection.query(createProductsTableQuery, (err, results) => {
  if (err) {
    console.error("Error creating products table:", err.stack);
    return;
  }
  console.log("Products table created successfully!");
});

export default connection;
