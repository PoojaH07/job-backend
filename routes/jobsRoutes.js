const express = require("express");
const router = express.Router();

const jobsController = require("../controllers/jobsController");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ GET jobs
router.get("/", jobsController.getJobs);

// ✅ POST job
router.post("/", authMiddleware.verifyToken, authMiddleware.isAdmin, jobsController.createJob);

// ✅ UPDATE job
router.put("/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, jobsController.updateJob);

// ✅ DELETE job
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, jobsController.deleteJob);

module.exports = router;