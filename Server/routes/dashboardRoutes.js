const express = require("express");
const router = express.Router();

const { protect, isAdmin } = require("../middleware/authMiddleware");
const { getAdminDashboard, getAdminSummary } = require("../controllers/dashboardControllers");

router.get("/admin-dashboard", protect, isAdmin, getAdminDashboard);
router.get("/admin-summary", protect, isAdmin, getAdminSummary);

module.exports = router;
