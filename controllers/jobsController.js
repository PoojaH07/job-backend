const db = require("../config/db");

// GET all jobs
exports.getJobs = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM jobs");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Error fetching jobs");
  }
};

// POST job (admin only)
exports.createJob = async (req, res) => {
  try {
    const { company, position, type, location } = req.body;

    const result = await db.query(
      "INSERT INTO jobs (company, position, type, location, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [company, position, type, location, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating job");
  }
};

// UPDATE job
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { company, position, type, location } = req.body;

    const result = await db.query(
      "UPDATE jobs SET company=$1, position=$2, type=$3, location=$4 WHERE id=$5 RETURNING *",
      [company, position, type, location, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send("Error updating job");
  }
};

// DELETE job
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM jobs WHERE id=$1", [id]);

    res.send("Job deleted");
  } catch (err) {
    res.status(500).send("Error deleting job");
  }
};