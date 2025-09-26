import { Pool } from "pg";
import dotenv from "dotenv";


dotenv.config();

// Validate required environment variables for the database connection
const requiredEnvVars = [
  'DB_USER',
  'DB_HOST',
  'DB_NAME',
  'DB_PASSWORD',
  'DB_PORT'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required database environment variables: ${missingEnvVars.join(', ')}`);
}

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