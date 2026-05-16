const Test = require("../models/test");
const Result = require("../models/result");
const calculateResult = require("../utils/resultCalculator");
const mongoose = require("mongoose");

const getUserObjectId = (user) => {
  const userId = user?._id || user?.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error("Valid user id was not found on the auth session");
    error.statusCode = 401;
    throw error;
  }

  return new mongoose.Types.ObjectId(String(userId));
};

const toCompactResult = ({ userId, testId, resultData, timeTaken }) => ({
  userId: getUserObjectId({ _id: userId }),
  ...(mongoose.Types.ObjectId.isValid(testId)
    ? { testId: new mongoose.Types.ObjectId(String(testId)) }
    : {}),
  accuracy: resultData.accuracy,
  netWPM: resultData.netWPM,
  grossWPM: resultData.grossWPM,
  correctWords: resultData.correctWords,
  totalWords: resultData.totalWords,
  errorsDetails: resultData.errorsDetails,
  symbols: resultData.symbols,
  timeTaken: Math.max(1, Number(timeTaken) || 1),
});

const compactFromRequest = (body = {}) => {
  const resultData = body.resultData || body;
  const number = (value) =>
    Number.isFinite(Number(value)) ? Number(value) : 0;

  return {
    accuracy: Math.max(0, Math.min(100, number(resultData.accuracy))),
    netWPM: Math.max(0, number(resultData.netWPM)),
    grossWPM: Math.max(0, number(resultData.grossWPM)),
    correctWords: Math.max(0, Math.round(number(resultData.correctWords))),
    totalWords: Math.max(0, Math.round(number(resultData.totalWords))),
    errorsDetails: Math.max(
      0,
      Math.round(number(resultData.errorsDetails ?? resultData.errors)),
    ),
    symbols: Math.max(0, Math.round(number(resultData.symbols))),
  };
};

const saveCompactDocument = async (document) => {
  const payload = {
    ...document,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    return await Result.create(payload);
  } catch (createError) {
    console.error("Result.create failed:", createError);

    console.error(createError.errors);

    const inserted = await Result.collection.insertOne(payload);

    return {
      _id: inserted.insertedId,
      ...payload,
    };
  }
};

exports.submitTest = async (req, res) => {
  try {
    const {
      testId,
      typedText = "",
      timeTaken,
      backspaces = 0,
      keystrokes,
      settings = {},
    } = req.body;

    if (
      req.body.resultData ||
      req.body.accuracy !== undefined ||
      req.body.netWPM !== undefined
    ) {
      const compactResult = compactFromRequest(req.body);
      const savedResult = await saveCompactDocument(
        toCompactResult({
          userId: getUserObjectId(req.user),
          testId,
          resultData: compactResult,
          timeTaken: timeTaken || req.body.resultData?.timeTaken,
        }),
      );

      return res.json({
        _id: savedResult._id,
        saved: true,
        ...compactResult,
        timeTaken: savedResult.timeTaken,
        createdAt: savedResult.createdAt,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res
        .status(400)
        .json({
          message: "Please start a real transcription test before submitting.",
        });
    }

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    if (!test.passage) {
      return res
        .status(400)
        .json({ message: "This test does not have a passage to score" });
    }

    const resultData = calculateResult(test.passage, typedText, timeTaken, {
      ignoreCase: settings.ignoreCase || settings.caps === "none",
      ignorePunctuation:
        settings.ignorePunctuation || settings.punctuation === "none",
    });

    const savedResult = await saveCompactDocument(
      toCompactResult({
        userId: getUserObjectId(req.user),
        testId,
        resultData,
        timeTaken,
      }),
    );

    res.json({
      _id: savedResult._id,
      ...resultData,
      backspaces: Number(backspaces) || 0,
      keystrokes: Number(keystrokes) || typedText.length,
      timeTaken: savedResult.timeTaken,
      saved: true,
    });
  } catch (error) {
    console.error("Result submit error:", error);
    res.status(error.statusCode || 500).json({
      message: "Result could not be saved. Your score was calculated locally.",
      detail: error.message,
      code: error.code || error.name,
    });
  }
};

exports.saveCompactResult = async (req, res) => {
  try {
    const compactResult = compactFromRequest(req.body);
    const savedResult = await saveCompactDocument(
      toCompactResult({
        userId: getUserObjectId(req.user),
        testId: req.body.testId,
        resultData: compactResult,
        timeTaken: req.body.timeTaken || req.body.resultData?.timeTaken,
      }),
    );

    res.json({
      _id: savedResult._id,
      saved: true,
      ...compactResult,
      timeTaken: savedResult.timeTaken,
      createdAt: savedResult.createdAt,
    });
  } catch (error) {
    console.error("Compact result save error:", error);
    res.status(error.statusCode || 500).json({
      message: "Result could not be saved.",
      detail: error.message,
      code: error.code || error.name,
    });
  }
};

exports.getResults = async (req, res) => {
  try {
    const results = await Result.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("userId", "name email")
      .populate("testId", "title type");

    res.json(
      results.map((result) => ({
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
        createdAt: result.createdAt,
      })),
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Result.aggregate([
      { $match: { userId: { $ne: null } } },
      { $sort: { accuracy: -1, netWPM: -1, grossWPM: -1, createdAt: -1 } },
      { $group: { _id: "$userId", bestResult: { $first: "$$ROOT" } } },
      { $replaceRoot: { newRoot: "$bestResult" } },
      { $sort: { accuracy: -1, netWPM: -1, grossWPM: -1, createdAt: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "tests",
          localField: "testId",
          foreignField: "_id",
          as: "test",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$test", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          userName: { $ifNull: ["$user.name", "Unknown"] },
          testTitle: { $ifNull: ["$test.title", "Test"] },
          testType: { $ifNull: ["$test.type", ""] },
          grossWPM: { $ifNull: ["$grossWPM", 0] },
          netWPM: { $ifNull: ["$netWPM", 0] },
          accuracy: { $ifNull: ["$accuracy", 0] },
          correctWords: { $ifNull: ["$correctWords", 0] },
          totalWords: { $ifNull: ["$totalWords", 0] },
          errors: { $ifNull: ["$errorsDetails", 0] },
          timeTaken: { $ifNull: ["$timeTaken", 0] },
          createdAt: 1,
        },
      },
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getResultStats = async (req, res) => {
  try {
    const totalResults = await Result.countDocuments();
    const recentSince = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentResults = await Result.countDocuments({
      createdAt: { $gte: recentSince },
    });

    const aggregate = await Result.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: "$netWPM" },
          avgAccuracy: { $avg: "$accuracy" },
          passCount: {
            $sum: { $cond: [{ $gte: ["$accuracy", 80] }, 1, 0] },
          },
        },
      },
    ]);

    const stats = aggregate[0] || {};

    res.json({
      totalResults,
      recentResults,
      avgScore: stats.avgScore || 0,
      avgAccuracy: stats.avgAccuracy || 0,
      passRate: totalResults
        ? Math.round((stats.passCount / totalResults) * 100)
        : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
