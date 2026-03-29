const Test = require("../models/test");
const User = require("../models/user");

exports.getAdminDashboard = async (req, res) => {
    try {
        const totalTests = await Test.countDocuments();
        const totalUsers = await User.countDocuments();

        const dictationTests = await Test.countDocuments({ type: "dictation" });
        const transcriptionTests = await Test.countDocuments({ type: "transcription" });

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

    } catch (error) {
        res.status(500).json({ message: "Dashboard error" });
    }
};