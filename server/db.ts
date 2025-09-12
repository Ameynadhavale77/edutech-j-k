import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "../shared/schema.js";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure pool with flexible SSL settings
const sslConfig = process.env.NODE_ENV === 'production' ? 
  { rejectUnauthorized: false } :  // Allow self-signed certs in production
  process.env.DB_SSL === 'true' ? 
    { rejectUnauthorized: false } : 
    false;  // Disable SSL for local development by default

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig
});

export const db = drizzle({ client: pool, schema });
