const { Pool } = require("pg");

export const pool = new Pool({
  user: "postgres",          // your DB username
  host: "localhost",         // DB server
  database: "thingsboard_portal",      // your DB name
  password: "190904",  // your DB password
  port: 5432,                // default PostgreSQL port
});

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL");
});

