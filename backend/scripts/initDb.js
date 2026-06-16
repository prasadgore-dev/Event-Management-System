const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/database');

const rootDir = path.resolve(__dirname, '../..');
const scripts = [
  path.join(rootDir, 'database/schema.sql'),
  path.join(rootDir, 'database/seed_events.sql'),
];

const run = async () => {
  const client = await pool.connect();

  try {
    for (const scriptPath of scripts) {
      const sql = fs.readFileSync(scriptPath, 'utf8');
      console.log(`Running ${path.relative(rootDir, scriptPath)}...`);
      await client.query(sql);
    }

    console.log('Database initialized successfully.');
  } finally {
    client.release();
    await pool.end();
  }
};

run().catch((error) => {
  console.error('Database initialization failed:');
  console.error(error.message);
  process.exit(1);
});
