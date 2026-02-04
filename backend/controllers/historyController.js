const db = require("../config/db");

exports.getHistory = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM login_history WHERE user_id=? ORDER BY login_time DESC",
    [req.params.userId]
  );
  res.json(rows);
};
