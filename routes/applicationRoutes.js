const express = require("express");
const router = express.Router();

const appController = require("../controllers/applicationController");
const { verifyToken } = require("../middleware/authMiddleware");

// APPLY
router.post("/jobs/:id/apply", verifyToken, appController.applyJob);

// GET APPLICATIONS
router.get("/applications", verifyToken, appController.getApplications);

module.exports = router;