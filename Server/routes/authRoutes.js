const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const { adminRegister, adminLogin } = require("../controllers/authController");
const { forgotPassword, verifyResetOtp, resetPassword } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/admin-register", adminRegister);
router.post("/admin-login", adminLogin);

// Forgot Password Routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

module.exports = router;