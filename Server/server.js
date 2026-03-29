require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/authMiddleware");
const testRoutes = require("./routes/testRoutes")
const resultRoutes = require("./routes/resultRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

require("./models/user");
require("./models/test");
require("./models/result");
require("./models/attempt");

const app = express();
const path = require("path");

const PORT = process.env.PORT || 5000;

//Token protection
app.get("/api/protected", protect, (req, res) => {
    res.json({
        message: "access granted",
        user: req.user
    });
});


app.use("/uploads", express.static("uploads"));

app.use("/api/dashboard", dashboardRoutes);

// Middleware
app.use(cors());
app.use(express.json());

//upload Routes
app.use("/api/upload", uploadRoutes);

//result Routes
app.use("/api/results", resultRoutes);

// Routes
app.use("/api/auth", authRoutes);

//test Routes
app.use("/api/tests", testRoutes);


app.use("/uploads", express.static);

app.use("/api/auth", authRoutes);

// Start server after DB connect
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