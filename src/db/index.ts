import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Create postgres connection
const connection = postgres(process.env.DATABASE_URL || '');

// Create drizzle database instance
export const db = drizzle(connection, { schema });

export type Database = typeof db;