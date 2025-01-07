import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// Migration function
async function main() {
  const connection = postgres(process.env.DATABASE_URL || '');
  const db = drizzle(connection);

  console.log('Running migrations...');
  
  await migrate(db, { migrationsFolder: './src/db/migrations' });
  
  console.log('Migrations completed!');
  
  await connection.end();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});