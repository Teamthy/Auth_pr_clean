// server/config/db.js
import dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";

const pool = new Pool({
  host: process.env.DB_HOST || undefined,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER || undefined,
  password: process.env.DB_PASSWORD || undefined,
  database: process.env.DB_NAME || undefined,
  // fallback to connectionString if you prefer
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,                    // max clients in pool 
  idleTimeoutMillis: 30000,   // close idle clients after 30s
  connectionTimeoutMillis: 20000, // 20s connect timeout
  allowExitOnIdle: false,
});

pool.on("error", (err) => {
  console.error("PG Pool error:", err);
});

pool.on("acquire", () => {
  // optional: log when a client is checked out
});

export const db = drizzle(pool, { schema });
export { schema, pool };

export async function ensureDatabaseCompatibility() {
  const compatibilitySql = `
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'users'
      ) THEN
        ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name varchar(150);
        ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
        ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT now();
        ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash varchar(255);

        UPDATE public.users
        SET is_active = true
        WHERE is_active IS NULL;

        UPDATE public.users
        SET updated_at = COALESCE(updated_at, created_at, NOW())
        WHERE updated_at IS NULL;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'users'
            AND column_name = 'password'
        ) THEN
          UPDATE public.users
          SET password_hash = COALESCE(password_hash, password)
          WHERE password_hash IS NULL;
        END IF;
      END IF;
    END $$;
  `;

  try {
    await pool.query(compatibilitySql);
    console.log("Database compatibility check completed");
  } catch (error) {
    console.error("Database compatibility check failed:", error.message);
  }
}
