const express = require("express");
const router = express.Router();

const {
  register: registerUser,
  login: loginUser,
  adminRegister,
  adminLogin,
} = require("../controllers/authController");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin-register", adminRegister);
router.post("/admin-login", adminLogin);

module.exports = router;

