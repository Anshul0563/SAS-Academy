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
const userRoutes = require("./routes/userRoutes");

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
const allowedOrigins = (process.env.CLIENT_URLS || "http://localhost:3000,http://localhost:3002,http://localhost:5173,http://127.0.0.1:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const requiredEnv = ["MONGO_URI", "JWT_SECRET"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.warn(`Missing required environment variables: ${missingEnv.join(", ")}`);
}

//  IMPORTANT: Middleware FIRST
app.use(cors({
  origin(origin, callback) {

    console.log("Request Origin:", origin);

    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});
app.use(express.json({ limit: process.env.JSON_LIMIT || "2mb" }));

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
app.use("/api/users", userRoutes);

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        service: "sas-academy-api",
        timestamp: new Date().toISOString()
    });
});

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
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();

// Global Error Handler
app.use((err, req, res, next) => {

  console.error("🔥 SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});