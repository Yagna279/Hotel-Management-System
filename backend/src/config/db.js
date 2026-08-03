import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
console.log("DB_NAME:", process.env.DB_NAME);
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect(async (err, client, release) => {
  if (err) {
    console.error("Connection Error:", err);
  } else {
    console.log("✅ PostgreSQL Connected Successfully");

    const db = await client.query("SELECT current_database()");
    console.log("Database:", db.rows[0]);

    const schema = await client.query("SHOW search_path");
    console.log("Search Path:", schema.rows[0]);

    const tables = await client.query(`
      SELECT schemaname, tablename
      FROM pg_tables
      WHERE schemaname='public'
    `);

    console.log("Tables:", tables.rows);

    release();
  }
});

export default pool;