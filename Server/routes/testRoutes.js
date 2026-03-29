const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload"); // ✅ IMPORTANT

const { protect, isAdmin } = require("../middleware/authMiddleware");

const {
    createTest,
    getTests,
    getTestById,
} = require("../controllers/testController");

// ✅ CREATE
router.post("/", protect, isAdmin, upload.single("audio"), createTest);

// ✅ GET ALL
router.get("/", getTests);

// ✅ GET BY ID
router.get("/:id", getTestById);

module.exports = router;