require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const historyRoutes = require("./routes/history.routes");

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));


const frontendPath = path.resolve(__dirname, "..", "frontend");
app.use(express.static(frontendPath));

/* ✅ FORCE ROOT TO GO TO LOGIN PAGE */
app.get("/", (req, res) => {
  return res.redirect("/pages/login.html");
});

/* APIs */
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);
app.get("/test-phone", (req, res) => {
  console.log("📱 PHONE TEST HIT");
  console.log("IP:", req.ip);
  console.log("UA:", req.headers["user-agent"]);
  res.json({ message: "Phone successfully connected to backend" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`SERVER STARTED → ${PORT}`);
});
