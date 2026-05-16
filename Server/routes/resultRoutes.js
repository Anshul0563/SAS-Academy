const express = require("express");
const router = express.Router();

const { submitTest, saveCompactResult, getResults, getLeaderboard, getResultStats } = require("../controllers/resultController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.post("/submit", protect, submitTest);
router.post("/compact", protect, saveCompactResult);
router.get("/leaderboard", protect, getLeaderboard);
router.get("/", protect, isAdmin, getResults);
router.get("/stats", protect, isAdmin, getResultStats);

module.exports = router;
