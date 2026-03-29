const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../config/mailer");

// Register
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // check user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // remove password from response
        user.password = undefined;

        res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        //compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        //JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
// 🔐 ADMIN REGISTER
exports.adminRegister = async (req, res) => {
    try {
        console.log("BODY:", req.body); // 🔥 DEBUG

        const { name, email, password } = req.body;

        // ✅ check empty
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        // ✅ check existing
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        // ✅ hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ create admin
        const admin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin"
        });

        res.status(201).json({
            message: "Admin created successfully",
            admin
        });

    } catch (error) {
        console.log("ADMIN ERROR:", error.message); // 🔥 IMPORTANT
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};
// 🔐 ADMIN LOGIN
exports.adminLogin = async (req, res) => {
    try {
        console.log("LOGIN BODY:", req.body); // debug

        const { email, password } = req.body;

        // ✅ check fields
        if (!email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        // ✅ find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // ✅ check role
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access denied (Not admin)" });
        }

        // ✅ compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // ✅ generate token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Admin login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log("ADMIN LOGIN ERROR:", error.message);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.otp = otp;
        user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 min

        await user.save();

        await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}`);

        res.json({ msg: "OTP sent to email" });

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (
            !user ||
            user.otp !== otp ||
            user.otpExpire < Date.now()
        ) {
            return res.status(400).json({ msg: "Invalid or expired OTP" });
        }

        res.json({ msg: "OTP verified" });

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
exports.resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const hashed = await bcrypt.hash(password, 10);

        user.password = hashed;
        user.otp = null;
        user.otpExpire = null;

        await user.save();

        res.json({ msg: "Password reset successful" });

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};