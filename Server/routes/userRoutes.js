const express = require("express");
const router = express.Router();

const { protect, isAdmin } = require("../middleware/authMiddleware");
const { getUsers, updateUserStatus } = require("../controllers/userController");

router.get("/", protect, isAdmin, getUsers);
router.patch("/:id/status", protect, isAdmin, updateUserStatus);

module.exports = router;
