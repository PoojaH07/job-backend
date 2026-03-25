const db = require("../config/db");

// ✅ APPLY JOB
exports.applyJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const result = await db.query(
      "INSERT INTO applications (user_id, job_id) VALUES ($1, $2) RETURNING *",
      [userId, jobId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error applying job");
  }
};

// ✅ GET APPLICATIONS
exports.getApplications = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM applications");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Error fetching applications");
  }
};