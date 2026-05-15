const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const normalizeEmail = (email = "") => String(email).trim().toLowerCase();
const sanitizeName = (name = "") => String(name).trim();
const validatePassword = (password = "") => String(password).length >= 8;

const createToken = (payload) => {
    if (!process.env.JWT_SECRET) {
        const error = new Error("JWT secret is not configured");
        error.statusCode = 500;
        throw error;
    }

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const canRegisterAdmin = async () => {
    if (process.env.ALLOW_ADMIN_REGISTRATION === "true") return true;
    const adminCount = await User.countDocuments({ role: "admin" });
    return adminCount === 0;
};

// Register
exports.register = async (req, res) => {
    try {
        const { password } = req.body;
        const name = sanitizeName(req.body.name);
        const email = normalizeEmail(req.body.email);
        if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });
        if (!validatePassword(password)) return res.status(400).json({ message: "Password must be at least 8 characters" });

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
        const { password } = req.body;
        const email = normalizeEmail(req.body.email);
        const user = await User.findOne({ email });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (user.isActive === false) {
            return res.status(403).json({ message: "Account is disabled" });
        }

        const token = createToken({ id: user._id });
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
        const { password } = req.body;
        const email = normalizeEmail(req.body.email);

        const user = await User.findOne({ email });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Admin required" });
        }

        if (user.isActive === false) {
            return res.status(403).json({ message: "Account is disabled" });
        }

        const token = createToken({ id: user._id, role: "admin" });

        res.json({
            message: "Admin login successful",
            token,
            user: { id: user._id, name: user.name, email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.adminRegister = async (req, res) => {
    try {
        const { password } = req.body;
        const name = sanitizeName(req.body.name);
        const email = normalizeEmail(req.body.email);
        if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });
        if (!validatePassword(password)) return res.status(400).json({ message: "Password must be at least 8 characters" });

        if (!await canRegisterAdmin()) {
            return res.status(403).json({ message: "Admin registration is disabled" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role: "admin" });

        res.status(201).json({
            message: "Admin registered successfully",
            user: { id: user._id, name, email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: "Admin registration failed" });
    }
};

