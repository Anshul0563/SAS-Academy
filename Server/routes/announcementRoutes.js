const express = require("express");
const router = express.Router();

const { protect, isAdmin } = require("../middleware/authMiddleware");
const {
  getLatestAnnouncement,
  getActiveAnnouncement,
  saveAnnouncement,
} = require("../controllers/announcementController");

router.get("/active", getActiveAnnouncement);
router.get("/", protect, isAdmin, getLatestAnnouncement);
router.put("/", protect, isAdmin, saveAnnouncement);

module.exports = router;
