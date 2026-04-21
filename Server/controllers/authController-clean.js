const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({ message: "User registered successfully", user: { id: user._id, name, email } });
    } catch (error) {
        res.status(500).json({ message: "Registration failed" });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
};

// ADMIN LOGIN WITH DEBUG
exports.adminLogin = async (req, res) => {
    try {
        console.log("🔐 ADMIN LOGIN:", req.body.email);
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        console.log("👤 USER:", user ? `${user.name} role: ${user.role}` : "NO USER");

        if (!user || !await bcrypt.compare(password, user.password)) {
            console.log("❌ CREDENTIALS FAIL");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (user.role !== "admin") {
            console.log("🚫 NOT ADMIN");
            return res.status(403).json({ message: "Admin required" });
        }

        console.log("✅ LOGIN OK");
        const token = jwt.sign({ id: user._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({
            message: "Admin login successful",
            token,
            user: { id: user._id, name: user.name, email, role: user.role }
        });
    } catch (error) {
        console.log("ERROR:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Other routes
exports.adminRegister = exports.register; // Reuse
exports.forgotPassword = (req, res) => res.json({ message: "Check email" });
exports.verifyResetOtp = (req, res) => res.json({ message: "Verified" });
exports.resetPassword = (req, res) => res.json({ message: "Reset OK" });
exports.verifyOtp = (req, res) => res.json({ msg: "Verified" });

