<<<<<<< HEAD
const express = require("express");
const router = express.Router();

const { protect, isAdmin } = require("../middleware/authMiddleware");
const { getAdminDashboard } = require("../controllers/dashboardControllers");

//  ADMIN DASHBOARD
router.get("/admin-dashboard", protect, isAdmin, adminDashboard);
//  USER DASHBOARD
router.get("/dashboard", protect, (req, res) => {

    const mockData = {
        totalTests: 12,
        avgAccuracy: 92.5,
        bestSpeed: 85,
        rank: "#47",
        bestTest: {
            wpm: 85,
            accuracy: 95,
            passageName: "Medical Transcription Test"
        },
        recentTests: [
            { wpm: 78, accuracy: 91, passageName: "Legal Test", createdAt: "2024-01-15" },
            { wpm: 82, accuracy: 93, passageName: "Practice", createdAt: "2024-01-14" },
            { wpm: 85, accuracy: 95, passageName: "Medical", createdAt: "2024-01-13" }
        ]
    };

    res.json(mockData);
});

=======
const express = require("express");
const router = express.Router();

const { protect, isAdmin } = require("../middleware/authMiddleware");
const { getAdminDashboard } = require("../controllers/dashboardControllers");

//  ADMIN DASHBOARD
router.get("/admin-dashboard", protect, isAdmin, getAdminDashboard);
//  USER DASHBOARD
router.get("/dashboard", protect, (req, res) => {

    const mockData = {
        totalTests: 12,
        avgAccuracy: 92.5,
        bestSpeed: 85,
        rank: "#47",
        bestTest: {
            wpm: 85,
            accuracy: 95,
            passageName: "Medical Transcription Test"
        },
        recentTests: [
            { wpm: 78, accuracy: 91, passageName: "Legal Test", createdAt: "2024-01-15" },
            { wpm: 82, accuracy: 93, passageName: "Practice", createdAt: "2024-01-14" },
            { wpm: 85, accuracy: 95, passageName: "Medical", createdAt: "2024-01-13" }
        ]
    };

    res.json(mockData);
});

>>>>>>> d6c1bf3 (Complete MERN setup: backend APIs, MongoDB integration, authentication, admin dashboard, frontend pages, and bug fixes)
module.exports = router;