const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// ✅ Routes
const authRoutes = require("./routes/authRoutes");
const jobsRoutes = require("./routes/jobsRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api", applicationRoutes);

// ✅ DB connection check
db.query("SELECT NOW()")
  .then(() => console.log("✅ DB Connected"))
  .catch(err => console.error("❌ DB Error:", err.message));

// ✅ Handle unknown routes (VERY IMPORTANT)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Global error handler (GOOD PRACTICE)
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});