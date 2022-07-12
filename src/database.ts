import pg from "pg";

import "./setup.js";

const { Pool } = pg;
const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default connection;