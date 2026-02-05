require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const historyRoutes = require("./routes/history.routes");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);

app.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`SERVER STARTED → ${PORT}`));


// // require("dotenv").config();
// const express = require("express");
// const path = require("path");

// const app = express();

// const publicPath = path.join(__dirname, "public");
// app.use(express.static(publicPath));

// app.get("/", (req, res) => {
//   res.sendFile(path.join(publicPath, "index.html"));
// });

// app.get("/health", (req, res) => {
//   res.json({ ok: true });
// });

// module.exports = app;

