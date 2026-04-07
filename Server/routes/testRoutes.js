<<<<<<< HEAD
const express = require("express");
const router = express.Router();

// Middleware
const upload = require("../middleware/upload");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Controller
const testController = require("../controllers/testController");

//   Safe destructuring (debug friendly)
const createTest = testController.createTest;
const getTests = testController.getTests;
const getTestById = testController.getTestById;

console.log("Routes Loaded:", {
    createTest: typeof createTest,
    getTests: typeof getTests,
    getTestById: typeof getTestById,
});

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

router.post("/", protect, isAdmin, upload.single("audio"), createTest);

=======
const express = require("express");
const router = express.Router();

// Middleware
const upload = require("../middleware/upload");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Controller
const testController = require("../controllers/testController");

//   Safe destructuring (debug friendly)
const createTest = testController.createTest;
const getTests = testController.getTests;
const getTestById = testController.getTestById;

console.log("Routes Loaded:", {
    createTest: typeof createTest,
    getTests: typeof getTests,
    getTestById: typeof getTestById,
});

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

router.post("/", protect, isAdmin, upload.single("audio"), createTest);

>>>>>>> d6c1bf3 (Complete MERN setup: backend APIs, MongoDB integration, authentication, admin dashboard, frontend pages, and bug fixes)
module.exports = router;