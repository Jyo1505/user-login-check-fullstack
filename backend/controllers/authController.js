const db = require("../config/db");
const bcrypt = require("bcryptjs");
const saveLoginHistory = require("../utils/saveLoginHistory");
const { generateOTP } = require("../utils/otpGenerator");
const { isAllowedTime } = require("../utils/timeCheck");
const UAParser = require("ua-parser-js");
const transporter = require("../config/mail");
const resend = require("../config/resend");

/* ================= REGISTER ================= */

exports.register = async (req, res) => {
  try {
    console.log("🔥 REGISTER API HIT 🔥");
    console.log("FROM IP:", req.ip);
    console.log("HEADERS:", req.headers["content-type"]);
    console.log("BODY RECEIVED:", req.body);

    const { name, email, password } = req.body || {};

    // ✅ Check body parsing
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No data received from client" });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ✅ Check if user exists
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email=?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "User already exists with this email" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert user
    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    console.log("✅ USER REGISTERED:", email);
    res.status(201).json({ message: "Registration successful" });

  } catch (err) {
    console.log("❌ REGISTER ERROR FULL:", err);
    res.status(500).json({ 
      message: "Server error during registration",
      error: err.message 
    });
  }
};


/* ================= LOGIN ================= */

exports.login = async (req, res) => {
  try {
    console.log("📱 LOGIN HIT FROM:", req.ip);
    console.log("📱 USER AGENT:", req.headers["user-agent"]);
    console.log("📩 BODY:", req.body);

    const { email, password } = req.body;

    const [users] = await db.query(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    if (users.length === 0)
      return res.status(404).json({ message: "User not registered" });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password" });

    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();

    const browser = result.browser.name || "Unknown";
    const os = result.os.name || "Unknown";
    const deviceType = result.device.type ? "Mobile" : "Desktop";
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    console.log("🖥️ DETECTED:", { browser, os, deviceType, ip });

    /* ===== MOBILE TIME RESTRICTION ===== */
    if (deviceType === "Mobile" && !isAllowedTime()) {
      return res.status(403).json({
        message: "Mobile access allowed only between 10 AM and 1 PM"
      });
    }

    /* ===== CHROME → OTP ===== */
   const userAgent = req.headers["user-agent"].toLowerCase();

const isChrome =
  userAgent.includes("chrome") &&
  !userAgent.includes("edg") &&     // Edge
  !userAgent.includes("opr");       // Opera
// if (isChrome) {
//   const otp = generateOTP();

//   // 1️⃣ Save OTP
//   await db.query(
//     "INSERT INTO otp_verification (user_id, otp, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE))",
//     [user.id, otp]
//   );

//   // 2️⃣ Send response immediately (VERY IMPORTANT)
//   res.json({ otpRequired: true, userId: user.id });

//   // 3️⃣ Send email asynchronously (NON-BLOCKING)
//   transporter.sendMail({
//     from: `"Secure Login System" <${process.env.EMAIL}>`,
//     to: email,
//     subject: "Your Login OTP",
//     text: `Your OTP is ${otp}. It is valid for 5 minutes.`
//   }).catch(err => {
//     console.error("❌ OTP EMAIL ERROR:", err);
//   });

//   return; // 🔥 STOP execution here
// }

if (isChrome) {
  const otp = generateOTP();

  // 1️⃣ Save OTP in DB
  await db.query(
    "INSERT INTO otp_verification (user_id, otp, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE))",
    [user.id, otp]
  );

  // 2️⃣ SEND RESPONSE FIRST (VERY IMPORTANT)
  res.json({ otpRequired: true, userId: user.id });

  // 3️⃣ SEND EMAIL IN BACKGROUND (NON-BLOCKING)
  resend.emails
    .send({
      from: "Secure Login <onboarding@resend.dev>",
      to: email,
      subject: "Your Login OTP",
      html: `<h2>Your OTP is ${otp}</h2><p>Valid for 5 minutes</p>`
    })
    .catch(err => {
      console.error("RESEND ERROR:", err);
    });

  return; // 🔥 stop further execution
}

    /* ===== DIRECT LOGIN ===== */
    await saveLoginHistory(user.id, ip, browser, os, deviceType);

    res.json({ message: "Login successful", userId: user.id });

  } catch (err) {
    console.log("❌ LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= OTP VERIFY ================= */

exports.verifyOTP = async (req, res) => {
  try {
    console.log("🔐 OTP VERIFY:", req.body);

    const { userId, otp } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM otp_verification WHERE user_id=? AND otp=? AND expires_at > NOW()",
      [userId, otp]
    );

    if (rows.length === 0)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();

    const browser = result.browser.name || "Unknown";
    const os = result.os.name || "Unknown";
    const deviceType = result.device.type ? "Mobile" : "Desktop";
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    await saveLoginHistory(userId, ip, browser, os, deviceType);

    await db.query(
      "DELETE FROM otp_verification WHERE user_id=?",
      [userId]
    );

    res.json({ message: "OTP verified. Login successful." });

  } catch (err) {
    console.log("❌ OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
