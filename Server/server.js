require("dotenv").config();

const express = require("express");
const cors = require("cors");
const dns = require("dns");
const path = require("path");

const connectDB = require("./config/db");

//  Routes
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const resultRoutes = require("./routes/resultRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const { protect } = require("./middleware/authMiddleware");

//  Models (register once)
require("./models/user");
require("./models/test");
require("./models/result");
require("./models/attempt");

// DNS fix
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
const PORT = process.env.PORT || 5000;

//  IMPORTANT: Middleware FIRST
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

//  Static
app.use("/uploads", express.static("uploads"));

//  Protected test route
app.get("/api/protected", protect, (req, res) => {
    res.json({
        message: "access granted",
        user: req.user
    });
});

//  Routes (AFTER middleware)
app.use("/api/auth", authRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);

//  Root
app.get("/", (req, res) => {
    res.send("API running...");
});

//  Start server
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server ❌", error.message);
        process.exit(1);
    }
};

startServer();