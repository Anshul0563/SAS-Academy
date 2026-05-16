const Test = require("../models/test");
const Result = require("../models/result");
const calculateResult = require("../utils/resultCalculator");
const mongoose = require("mongoose");

exports.submitTest = async (req, res) => {
    try {
        const { testId, typedText = "", timeTaken, backspaces = 0, keystrokes, settings = {} } = req.body;

        if (!mongoose.Types.ObjectId.isValid(testId)) {
            return res.status(400).json({ message: "Please start a real transcription test before submitting." });
        }

        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ message: "Test not found" });
        }

        if (!test.passage) {
            return res.status(400).json({ message: "This test does not have a passage to score" });
        }

        const resultData = calculateResult(
            test.passage,
            typedText,
            timeTaken,
            {
                ignoreCase: settings.ignoreCase || settings.caps === "none",
                ignorePunctuation: settings.ignorePunctuation || settings.punctuation === "none"
            }
        );

        const result = await Result.create({
            userId: req.user.id,
            testId,
            typedText,
            originalText: test.passage,
            ...resultData,
            backspaces: Number(backspaces) || 0,
            keystrokes: Number(keystrokes) || typedText.length,
            timeTaken: Math.max(1, Number(timeTaken) || 1),
            settings: {
                backspace: Boolean(settings.backspace),
                spellingMode: settings.spelling || settings.spellingMode || "full",
                ignoreCase: Boolean(settings.ignoreCase || settings.caps === "none"),
                ignorePunctuation: Boolean(settings.ignorePunctuation || settings.punctuation === "none"),
                timeLimit: Number(settings.timeLimit || settings.time) || undefined
            }
        });

        res.json(result);

    } catch (error) {
        console.error("Result submit error:", error);
        res.status(500).json({ message: "Result could not be saved. Your score was calculated locally." });
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

exports.getLeaderboard = async (req, res) => {
    try {
        const results = await Result.find()
            .sort({ accuracy: -1, netWPM: -1, grossWPM: -1, createdAt: -1 })
            .limit(50)
            .populate("userId", "name email")
            .populate("testId", "title type");

        const seenUsers = new Set();
        const leaderboard = [];

        for (const result of results) {
            const userKey = result.userId?._id?.toString() || result.userId?.toString();
            if (!userKey || seenUsers.has(userKey)) continue;

            seenUsers.add(userKey);
            leaderboard.push({
                _id: result._id,
                userName: result.userId?.name || "Unknown",
                testTitle: result.testId?.title || "Test",
                testType: result.testId?.type || "",
                grossWPM: result.grossWPM || 0,
                netWPM: result.netWPM || 0,
                accuracy: result.accuracy || 0,
                correctWords: result.correctWords || 0,
                totalWords: result.totalWords || 0,
                errors: result.errorsDetails || 0,
                timeTaken: result.timeTaken || 0,
                createdAt: result.createdAt
            });

            if (leaderboard.length === 5) break;
        }

        res.json(leaderboard);
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
