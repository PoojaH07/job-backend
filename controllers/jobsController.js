const db = require("../config/db");

// ✅ GET ALL JOBS
exports.getJobs = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM jobs ORDER BY id DESC");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Get Jobs Error:", err.message);
    res.status(500).json({ error: "Error fetching jobs" });
  }
};

// ✅ CREATE JOB
exports.createJob = async (req, res) => {
  try {
    const { company, position, type, location } = req.body;

    // 🔴 validation
    if (!company || !position) {
      return res.status(400).json({ error: "Company and position are required" });
    }

    const result = await db.query(
      `INSERT INTO jobs (company, position, type, location, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [company, position, type, location, req.user?.id]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("Create Job Error:", err.message);
    res.status(500).json({ error: "Error creating job" });
  }
};

// ✅ UPDATE JOB
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { company, position, type, location } = req.body;

    const result = await db.query(
      `UPDATE jobs 
       SET company=$1, position=$2, type=$3, location=$4 
       WHERE id=$5 
       RETURNING *`,
      [company, position, type, location, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json(result.rows[0]);

  } catch (err) {
    console.error("Update Job Error:", err.message);
    res.status(500).json({ error: "Error updating job" });
  }
};

// ✅ DELETE JOB
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "DELETE FROM jobs WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json({ message: "Job deleted successfully" });

  } catch (err) {
    console.error("Delete Job Error:", err.message);
    res.status(500).json({ error: "Error deleting job" });
  }
};