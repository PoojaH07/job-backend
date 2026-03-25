const express = require("express");
const router = express.Router();

const {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobsController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// ✅ GET all jobs
router.get("/", getJobs);

// ✅ CREATE job (admin only)
router.post("/", verifyToken, isAdmin, createJob);

// ✅ UPDATE job (admin only)
router.put("/:id", verifyToken, isAdmin, updateJob);

// ✅ DELETE job (admin only)
router.delete("/:id", verifyToken, isAdmin, deleteJob);

module.exports = router;