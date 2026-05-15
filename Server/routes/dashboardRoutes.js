const express = require("express");
const router = express.Router();

const { protect, isAdmin } = require("../middleware/authMiddleware");
const { getAdminDashboard } = require("../controllers/dashboardControllers");

//  IMPORTANT (NO brackets)
router.get("/admin-dashboard", protect, isAdmin, getAdminDashboard);

module.exports = router;