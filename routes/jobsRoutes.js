const express = require("express");
const router = express.Router();

const jobsController = require("../controllers/jobsController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// GET jobs
router.get("/", jobsController.getJobs);

// POST job (admin only)
router.post("/", verifyToken, isAdmin, jobsController.createJob);

// UPDATE job
router.put("/:id", verifyToken, isAdmin, jobsController.updateJob);

// DELETE job
router.delete("/:id", verifyToken, isAdmin, jobsController.deleteJob);

module.exports = router;



