import { Pool } from "pg";

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test connection
pool.connect((err) => {
  if (err) {
    console.error("PostgreSQL connection error:", err.stack);
  } else {
    console.log("Connected to PostgreSQL database");
  }
});

export default pool;