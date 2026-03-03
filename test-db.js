// server/test-db.js
import dotenv from "dotenv";
dotenv.config();
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL || "";
const dbSslFlag = (process.env.DB_SSL || "").toLowerCase();
const isLocalDatabaseUrl = /@(localhost|127\.0\.0\.1|::1)(:|\/|$)/i.test(databaseUrl);
const shouldUseSsl = dbSslFlag === "true" || !(dbSslFlag === "false" || isLocalDatabaseUrl);

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
});

(async () => {
  try {
    const { rows } = await pool.query("SELECT 1 as ok");
    console.log("DB test OK:", rows);
  } catch (e) {
    console.error("DB test failed:", e);
  } finally {
    await pool.end();
  }
})();
