const express = require("express");
const router = express.Router();

const { submitTest } = require("../controllers/resultController");
const { protect } = require("../middleware/authMiddleware");

router.post("/submit", protect, submitTest);

module.exports = router;