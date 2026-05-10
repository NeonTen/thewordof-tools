const { Client } = require('pg');

async function check() {
  const connectionString = "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable";
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    const res = await client.query('SELECT id, email, role FROM "User"');
    console.log("DB_USERS:", res.rows);
  } catch (err) {
    console.error("DB_ERROR:", err.message);
  } finally {
    await client.end();
  }
}

check();
