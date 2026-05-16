const mongoose = require("mongoose");
const TypingResult = require("../models/typingResult");

const toObjectId = (user) => {
  const userId = user?._id || user?.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error("Valid user id was not found on the auth session");
    error.statusCode = 401;
    throw error;
  }

  return new mongoose.Types.ObjectId(String(userId));
};

const number = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);

const normalizeResult = (body = {}) => {
  const weakKeys = Array.isArray(body.weakKeys)
    ? body.weakKeys
        .slice(0, 12)
        .map((item) => ({
          key: String(item.key || "").slice(0, 4),
          count: Math.max(0, Math.round(number(item.count))),
        }))
        .filter((item) => item.key && item.count > 0)
    : [];

  const mistakeSamples = Array.isArray(body.mistakeSamples)
    ? body.mistakeSamples.slice(0, 20).map((item) => ({
        expected: String(item.expected || "").slice(0, 8),
        typed: String(item.typed || "").slice(0, 8),
        index: Math.max(0, Math.round(number(item.index))),
      }))
    : [];

  return {
    mode: body.mode || "practice",
    language: body.language || "english",
    passageTitle: String(body.passageTitle || "Typing practice").slice(0, 120),
    durationSeconds: Math.max(0, Math.round(number(body.durationSeconds))),
    timeTaken: Math.max(1, Math.round(number(body.timeTaken) || 1)),
    typedCharacters: Math.max(0, Math.round(number(body.typedCharacters))),
    totalCharacters: Math.max(0, Math.round(number(body.totalCharacters))),
    correctCharacters: Math.max(0, Math.round(number(body.correctCharacters))),
    errors: Math.max(0, Math.round(number(body.errors))),
    accuracy: Math.max(0, Math.min(100, number(body.accuracy))),
    wpm: Math.max(0, number(body.wpm)),
    rawWPM: Math.max(0, number(body.rawWPM)),
    backspaceDisabled: Boolean(body.backspaceDisabled),
    backspaces: Math.max(0, Math.round(number(body.backspaces))),
    weakKeys,
    mistakeSamples,
  };
};

const buildCoach = (results = []) => {
  if (!results.length) {
    return {
      headline: "Start with a short accuracy drill.",
      tips: [
        "Keep your eyes on the text, not the keyboard.",
        "Use the finger placement lesson before speed practice.",
        "Run one SSC simulation after two practice drills.",
      ],
      weakKeys: [],
      trend: "No saved practice yet",
    };
  }

  const latest = results[0];
  const previous = results[1];
  const keyMap = new Map();

  results.forEach((result) => {
    (result.weakKeys || []).forEach((item) => {
      keyMap.set(item.key, (keyMap.get(item.key) || 0) + item.count);
    });
  });

  const weakKeys = Array.from(keyMap.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const improving =
    previous && Number(latest.wpm || 0) >= Number(previous.wpm || 0);
  const accuracyLow = Number(latest.accuracy || 0) < 90;

  return {
    headline: accuracyLow
      ? "Accuracy needs attention before pushing speed."
      : improving
        ? "Speed trend is moving in the right direction."
        : "Stabilize rhythm with a timed practice block.",
    tips: [
      weakKeys.length
        ? `Focus on ${weakKeys
            .slice(0, 3)
            .map((item) => item.key)
            .join(", ")} for the next drill.`
        : "No repeated weak keys yet. Keep collecting practice data.",
      accuracyLow
        ? "Use Accuracy Training with backspace disabled for one round."
        : "Move to Speed Training and keep accuracy above 92%.",
      latest.backspaces > 0
        ? "Reduce correction dependency by trying one no-backspace attempt."
        : "Good discipline: no backspace reliance in the latest attempt.",
    ],
    weakKeys,
    trend: previous
      ? `${improving ? "Up" : "Down"} from ${Number(previous.wpm || 0).toFixed(
          1,
        )} to ${Number(latest.wpm || 0).toFixed(1)} WPM`
      : "First saved practice recorded",
  };
};

exports.saveTypingResult = async (req, res) => {
  try {
    const payload = normalizeResult(req.body);
    const saved = await TypingResult.create({
      userId: toObjectId(req.user),
      ...payload,
    });

    res.status(201).json({ saved: true, _id: saved._id, ...payload });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: "Typing result could not be saved.",
      detail: error.message,
    });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const userId = toObjectId(req.user);
    const results = await TypingResult.find({ userId })
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();

    const totals = results.reduce(
      (summary, result) => ({
        attempts: summary.attempts + 1,
        wpm: summary.wpm + Number(result.wpm || 0),
        accuracy: summary.accuracy + Number(result.accuracy || 0),
        errors: summary.errors + Number(result.errors || 0),
      }),
      { attempts: 0, wpm: 0, accuracy: 0, errors: 0 },
    );

    res.json({
      attempts: totals.attempts,
      averageWPM: totals.attempts ? totals.wpm / totals.attempts : 0,
      averageAccuracy: totals.attempts
        ? totals.accuracy / totals.attempts
        : 0,
      totalErrors: totals.errors,
      bestWPM: results.reduce(
        (best, result) => Math.max(best, Number(result.wpm || 0)),
        0,
      ),
      bestAccuracy: results.reduce(
        (best, result) => Math.max(best, Number(result.accuracy || 0)),
        0,
      ),
      recent: results,
      coach: buildCoach(results),
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const userId = toObjectId(req.user);
    const results = await TypingResult.find({ userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    res.json({
      coach: buildCoach(results),
      trend: results
        .slice()
        .reverse()
        .map((result) => ({
          date: result.createdAt,
          wpm: result.wpm || 0,
          accuracy: result.accuracy || 0,
          mode: result.mode,
        })),
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await TypingResult.aggregate([
      { $sort: { accuracy: -1, wpm: -1, createdAt: -1 } },
      { $group: { _id: "$userId", bestResult: { $first: "$$ROOT" } } },
      { $replaceRoot: { newRoot: "$bestResult" } },
      { $sort: { accuracy: -1, wpm: -1, createdAt: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          userName: { $ifNull: ["$user.name", "Unknown"] },
          mode: 1,
          language: 1,
          accuracy: { $ifNull: ["$accuracy", 0] },
          wpm: { $ifNull: ["$wpm", 0] },
          rawWPM: { $ifNull: ["$rawWPM", 0] },
          errors: { $ifNull: ["$errors", 0] },
          passageTitle: 1,
          createdAt: 1,
        },
      },
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
