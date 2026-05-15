const Test = require("../models/test");
const User = require("../models/user");
const Attempt = require("../models/attempt");
const Result = require("../models/result");

const getAdminDashboard = async (req, res) => {
    try {
        const totalTests = await Test.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalAttempts = await Attempt.countDocuments();
        
        const avgResult = await Result.aggregate([
          { $group: { _id: null, avgNetWPM: { $avg: '$netWPM' } } }
        ]);
        const avgScore = avgResult[0]?.avgNetWPM || 0;

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

        // DYNAMIC GROWTH - 30 days ago
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        const studentGrowthData = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        const testGrowthData = await Test.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        
        const studentGrowth = totalUsers > 0 ? Math.round((studentGrowthData / totalUsers) * 100 * 10) / 10 : 0;
        const testGrowth = totalTests > 0 ? Math.round((testGrowthData / totalTests) * 100 * 10) / 10 : 0;

        // TREND DATA for charts (last 6 months)
        const months = 6;
        const trendData = [];
        for (let i = months - 1; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            
            const monthlyTests = await Test.countDocuments({ 
                createdAt: { $gte: monthStart, $lte: monthEnd } 
            });
            const monthlyUsers = await User.countDocuments({ 
                createdAt: { $gte: monthStart, $lte: monthEnd } 
            });
            const monthlyAvgScore = await Result.aggregate([
                { $match: { createdAt: { $gte: monthStart, $lte: monthEnd } } },
                { $group: { _id: null, avg: { $avg: '$netWPM' } } }
            ]);
            
            trendData.push({
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                tests: monthlyTests,
                students: monthlyUsers,
                avgScore: monthlyAvgScore[0]?.avg || 0
            });
        }

        res.json({
            totalTests,
            totalStudents: totalUsers,
            totalUsers,
            totalAttempts,
            avgScore,
            studentGrowth,
            testGrowth,
            adminName: req.user?.name || 'Admin',
            dictationTests,
            transcriptionTests,
            recentTests,
            trendData  // NEW: for charts!
        });

    } catch (err) {
        console.error("Dashboard Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};


module.exports = { getAdminDashboard };
