const express = require("express");
const router = express.Router();

// Middleware
const upload = require("../middleware/upload");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Controller
const testController = require("../controllers/testController");

const createTest = testController.createTest;
const getTests = testController.getTests;
const getTestById = testController.getTestById;
const updateTest = testController.updateTest;
const deleteTest = testController.deleteTest;

// ================= ROUTES =================

//   CREATE TEST (Admin only)
router.post(
    "/",
    protect,
    isAdmin,
    upload.single("audio"),
    createTest
);

//   GET ALL TESTS
router.get("/", getTests);

//   GET SINGLE TEST
router.get("/:id", getTestById);

//   UPDATE TEST (Admin only)
router.put(
    "/:id",
    protect,
    isAdmin,
    upload.single("audio"),
    updateTest
);

//   DELETE TEST (Admin only)
router.delete("/:id", protect, isAdmin, deleteTest);


module.exports = router;
