const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const { adminRegister, adminLogin } = require("../controllers/authController");


router.post("/register", register);
router.post("/login", login);
router.post("/admin-register", adminRegister);
router.post("/admin-login", adminLogin);

module.exports = router;

