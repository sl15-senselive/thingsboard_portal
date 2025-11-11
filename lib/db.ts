

import { Pool } from "pg";

// ✅ Use a singleton pattern to avoid multiple connections in dev mode
declare global {
  // allow global `pool` reuse during hot-reloads in dev
  // eslint-disable-next-line no-var
  var _pool: Pool | undefined;
}

const pool =
  global._pool ||
  new Pool({
    user: "postgres",          // your DB username
    host: "localhost",         // DB host
    database: "thingsboard_portal", // your DB name
    password: "190904",        // your DB password
    port: 5432,                // default PostgreSQL port
  });

// Prevent multiple pools in dev
if (process.env.NODE_ENV !== "production") {
  global._pool = pool;
}

// ✅ Optional: log connection success only once
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to PostgreSQL");
    client.release();
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err);
  }
})();

export { pool };
