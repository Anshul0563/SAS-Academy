const mongoose = require("mongoose");

const typingResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    mode: {
      type: String,
      enum: ["practice", "ssc", "accuracy", "speed", "challenge"],
      default: "practice",
    },
    language: {
      type: String,
      enum: ["english", "hindi"],
      default: "english",
    },
    passageTitle: String,
    durationSeconds: Number,
    timeTaken: Number,
    typedCharacters: Number,
    totalCharacters: Number,
    correctCharacters: Number,
    errors: Number,
    accuracy: Number,
    wpm: Number,
    rawWPM: Number,
    backspaceDisabled: Boolean,
    backspaces: Number,
    weakKeys: [
      {
        key: String,
        count: Number,
      },
    ],
    mistakeSamples: [
      {
        expected: String,
        typed: String,
        index: Number,
      },
    ],
  },
  { timestamps: true },
);

typingResultSchema.index({ accuracy: -1, wpm: -1, createdAt: -1 });
typingResultSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("TypingResult", typingResultSchema);
