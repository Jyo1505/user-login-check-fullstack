const db = require("../config/db");

module.exports = async (userId, ip, browser, os, deviceType) => {
  await db.query(
    "INSERT INTO login_history (user_id, ip_address, browser, os, device_type) VALUES (?,?,?,?,?)",
    [userId, ip, browser, os, deviceType]
  );
};
