const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();

// ✅ CORS FIX (VERY IMPORTANT FOR VERCEL)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://job-frontend-ua5r.vercel.app", // 🔴 replace with YOUR Vercel URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Middleware
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
  .catch((err) => console.error("❌ DB Error:", err.message));

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});