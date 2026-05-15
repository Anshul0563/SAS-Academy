const User = require("../models/user");
const Result = require("../models/result");

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password -otp -resetOtp")
            .sort({ createdAt: -1 });

        const performance = await Result.aggregate([
            {
                $group: {
                    _id: "$userId",
                    testsTaken: { $sum: 1 },
                    avgScore: { $avg: "$netWPM" },
                    avgAccuracy: { $avg: "$accuracy" }
                }
            }
        ]);

        const performanceByUser = new Map(
            performance.map((item) => [String(item._id), item])
        );

        res.json(users.map((user) => {
            const stats = performanceByUser.get(String(user._id)) || {};

            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
                testsTaken: stats.testsTaken || 0,
                avgScore: stats.avgScore ? Number(stats.avgScore.toFixed(1)) : null,
                avgAccuracy: stats.avgAccuracy ? Number(stats.avgAccuracy.toFixed(1)) : null
            };
        }));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUserStatus = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: Boolean(req.body.isActive) },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
