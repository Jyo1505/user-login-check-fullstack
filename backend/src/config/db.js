const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "152005",
  database: "login_tracking_system",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err.message);
  } else {
    console.log("✅ MySQL Connected Successfully");
    connection.release();
  }
});

module.exports = db.promise();
