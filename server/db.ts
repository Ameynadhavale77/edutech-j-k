import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

let pool: Pool | null = null;
let db: any = null;

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema });
    console.log('✅ Connected to Neon PostgreSQL database');
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    pool = null;
    db = null;
  }
} else {
  console.log('⚠️  DATABASE_URL not set, database operations will use fallback storage');
}

export { pool, db };