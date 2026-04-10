const Test = require("../models/test");
const User = require("../models/user");

const getAdminDashboard = async (req, res) => {
    try {
        const totalTests = await Test.countDocuments();
        const totalUsers = await User.countDocuments();

        const dictationTests = await Test.countDocuments({
            type: { $regex: /^dictation$/i }
        });

        const transcriptionTests = await Test.countDocuments({
            type: { $regex: /^transcription$/i }
        });

        const recentTests = await Test.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("createdBy", "name");

        res.json({
            totalTests,
            totalUsers,
            dictationTests,
            transcriptionTests,
            recentTests
        });

    } catch (err) {
        console.error("Dashboard Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getAdminDashboard };