const cors = require("cors");

const express = require("express");
const db = require("./config/db"); 
const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
app.post("/add-user", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const { email, password, role } = req.body;

    const result = await db.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *",
      [email, password, role]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).send("Error inserting user");
  }
});

app.get("/users", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

const jobsRoutes = require("./routes/jobsRoutes");

app.use("/api/jobs", jobsRoutes);

const applicationRoutes = require("./routes/applicationRoutes");

app.use("/api", applicationRoutes);


const db = require("./config/db");

db.query("SELECT NOW()")
  .then(() => console.log("✅ DB Connected"))
  .catch(err => console.error("❌ DB Error:", err));