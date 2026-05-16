const Test = require("../models/test");
const User = require("../models/user");
const Attempt = require("../models/attempt");
const Result = require("../models/result");

const getAdminDashboard = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const now = new Date();
        const months = 6;
        const monthRanges = [];

        for (let i = months - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setMonth(date.getMonth() - i);
            monthRanges.push({
                label: date.toLocaleDateString('en-US', { month: 'short' }),
                start: new Date(date.getFullYear(), date.getMonth(), 1),
                end: new Date(date.getFullYear(), date.getMonth() + 1, 1)
            });
        }

        const trendStart = monthRanges[0].start;

        const [
            totalTests,
            totalUsers,
            totalAttempts,
            avgResult,
            dictationTests,
            transcriptionTests,
            recentTests,
            studentGrowthData,
            testGrowthData,
            monthlyTests,
            monthlyUsers,
            monthlyScores
        ] = await Promise.all([
            Test.countDocuments(),
            User.countDocuments(),
            Attempt.countDocuments(),
            Result.aggregate([{ $group: { _id: null, avgNetWPM: { $avg: '$netWPM' } } }]),
            Test.countDocuments({ type: "dictation" }),
            Test.countDocuments({ type: "transcription" }),
            Test.find()
                .select("title type createdBy createdAt")
                .sort({ createdAt: -1 })
                .limit(5)
                .populate("createdBy", "name")
                .lean(),
            User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
            Test.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
            Test.aggregate([
                { $match: { createdAt: { $gte: trendStart } } },
                { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } }
            ]),
            User.aggregate([
                { $match: { createdAt: { $gte: trendStart } } },
                { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } }
            ]),
            Result.aggregate([
                { $match: { createdAt: { $gte: trendStart } } },
                { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, avg: { $avg: "$netWPM" } } }
            ])
        ]);

        const avgScore = avgResult[0]?.avgNetWPM || 0;
        
        const studentGrowth = totalUsers > 0 ? Math.round((studentGrowthData / totalUsers) * 100 * 10) / 10 : 0;
        const testGrowth = totalTests > 0 ? Math.round((testGrowthData / totalTests) * 100 * 10) / 10 : 0;

        const keyFor = (date) => `${date.getFullYear()}-${date.getMonth() + 1}`;
        const aggregateMap = (items, valueKey = "count") => items.reduce((acc, item) => {
            acc[`${item._id.year}-${item._id.month}`] = item[valueKey] || 0;
            return acc;
        }, {});
        const testsByMonth = aggregateMap(monthlyTests);
        const usersByMonth = aggregateMap(monthlyUsers);
        const scoreByMonth = aggregateMap(monthlyScores, "avg");
        const trendData = monthRanges.map((range) => {
            const key = keyFor(range.start);
            return {
                month: range.label,
                tests: testsByMonth[key] || 0,
                students: usersByMonth[key] || 0,
                avgScore: scoreByMonth[key] || 0
            };
        });

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

const getAdminSummary = async (req, res) => {
    try {
        const [totalTests, totalStudents] = await Promise.all([
            Test.countDocuments(),
            User.countDocuments()
        ]);

        res.json({ totalTests, totalStudents });
    } catch (err) {
        console.error("Dashboard Summary Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getAdminDashboard, getAdminSummary };
