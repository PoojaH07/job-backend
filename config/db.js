const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "jobapp",
  password: "pooja", // ⚠️ replace this
  port: 5432,
});

pool.connect()
  .then(() => console.log("PostgreSQL Connected ✅"))
  .catch(err => console.error("Connection error:", err));

module.exports = pool;