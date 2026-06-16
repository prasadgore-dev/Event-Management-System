const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/database');

const rootDir = path.resolve(__dirname, '../..');
const migrationsDir = path.join(rootDir, 'database/migrations');

const ensureMigrationsTable = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const getAppliedMigrations = async (client) => {
  const result = await client.query('SELECT filename FROM schema_migrations');
  return new Set(result.rows.map((row) => row.filename));
};

const runMigration = async (client, filename) => {
  const migrationPath = path.join(migrationsDir, filename);
  const sql = fs.readFileSync(migrationPath, 'utf8');

  console.log(`Running migration ${filename}...`);
  await client.query('BEGIN');

  try {
    await client.query(sql);
    await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [filename]);
    await client.query('COMMIT');
    console.log(`Applied ${filename}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
};

const run = async () => {
  if (!fs.existsSync(migrationsDir)) {
    console.log('No database/migrations directory found. Nothing to migrate.');
    return;
  }

  const migrations = fs
    .readdirSync(migrationsDir)
    .filter((filename) => filename.endsWith('.sql'))
    .sort();

  if (migrations.length === 0) {
    console.log('No migration files found. Nothing to migrate.');
    return;
  }

  const client = await pool.connect();

  try {
    await ensureMigrationsTable(client);
    const applied = await getAppliedMigrations(client);
    const pending = migrations.filter((filename) => !applied.has(filename));

    if (pending.length === 0) {
      console.log('Database is already up to date.');
      return;
    }

    for (const filename of pending) {
      await runMigration(client, filename);
    }

    console.log('Migrations completed successfully.');
  } finally {
    client.release();
    await pool.end();
  }
};

run().catch((error) => {
  console.error('Migration failed:');
  console.error(error.message);
  process.exit(1);
});
