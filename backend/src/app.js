// console.log("🔥 THIS IS THE APP.JS THAT IS RUNNING 🔥");
// require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const useragent = require("express-useragent");
// const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
// app.use(useragent.express());

/* 🔥 Correct Frontend Path (frontend is outside backend) */
const frontendPath = path.resolve(__dirname, "../../frontend");
console.log("📁 FRONTEND PATH USED:", frontendPath);


/* Serve frontend files */
app.use(express.static(frontendPath));

/* APIs */
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

/* Default page */
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "register.html"));
});

module.exports = app;
