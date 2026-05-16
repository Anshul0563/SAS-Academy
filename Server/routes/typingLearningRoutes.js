const express = require("express");
const router = express.Router();

const {
  saveTypingResult,
  getProgress,
  getAnalytics,
  getLeaderboard,
} = require("../controllers/typingLearningController");
const { protect } = require("../middleware/authMiddleware");

router.post("/results", protect, saveTypingResult);
router.get("/progress", protect, getProgress);
router.get("/analytics", protect, getAnalytics);
router.get("/leaderboard", protect, getLeaderboard);

module.exports = router;
