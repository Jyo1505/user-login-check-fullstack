const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  ssl: {
    rejectUnauthorized: false
  },
  connectTimeout: 15000
});

// Test connection once at startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL Pool Error:", err);
  } else {
    console.log("✅ MySQL Pool Connected (Railway)");
    connection.release();
  }
});

module.exports = pool.promise();
