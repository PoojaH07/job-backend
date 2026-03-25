const express = require("express");
const router = express.Router();

const {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobsController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// ✅ GET jobs
router.get("/", getJobs);

// ✅ POST job
router.post("/", verifyToken, isAdmin, createJob);

// ✅ UPDATE job
router.put("/:id", verifyToken, isAdmin, updateJob);

// ✅ DELETE job
router.delete("/:id", verifyToken, isAdmin, deleteJob);

module.exports = router;