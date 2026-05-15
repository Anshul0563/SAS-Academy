const Test = require("../models/test");
const Result = require("../models/result");
const calculateResult = require("../utils/resultCalculator");

exports.submitTest = async (req, res) => {
    try {
        const { testId, typedText, timeTaken } = req.body;

        // original text fetch
        const test = await Test.findById(testId);

        const resultData = calculateResult(
            test.passage,
            typedText,
            timeTaken
        );

        // save result
        const result = await Result.create({
            userId: req.user.id,
            testId,
            typedText,
            originalText: test.passage,
            ...resultData,
            timeTaken
        });

        res.json(result);

    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.getResults = async (req, res) => {
    try {
        const results = await Result.find()
            .sort({ createdAt: -1 })
            .limit(100)
            .populate("userId", "name email")
            .populate("testId", "title type");

        res.json(results.map((result) => ({
            _id: result._id,
            userName: result.userId?.name || "Unknown",
            userEmail: result.userId?.email || "",
            testTitle: result.testId?.title || "Test",
            testType: result.testId?.type || "",
            grossWPM: result.grossWPM || 0,
            netWPM: result.netWPM || 0,
            accuracy: result.accuracy || 0,
            score: result.accuracy || 0,
            timeTaken: result.timeTaken || 0,
            createdAt: result.createdAt
        })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getResultStats = async (req, res) => {
    try {
        const totalResults = await Result.countDocuments();
        const recentSince = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentResults = await Result.countDocuments({ createdAt: { $gte: recentSince } });

        const aggregate = await Result.aggregate([
            {
                $group: {
                    _id: null,
                    avgScore: { $avg: "$netWPM" },
                    avgAccuracy: { $avg: "$accuracy" },
                    passCount: {
                        $sum: { $cond: [{ $gte: ["$accuracy", 80] }, 1, 0] }
                    }
                }
            }
        ]);

        const stats = aggregate[0] || {};

        res.json({
            totalResults,
            recentResults,
            avgScore: stats.avgScore || 0,
            avgAccuracy: stats.avgAccuracy || 0,
            passRate: totalResults ? Math.round((stats.passCount / totalResults) * 100) : 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
