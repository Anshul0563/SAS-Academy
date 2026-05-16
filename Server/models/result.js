const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test"
  },

  typedText: String,
  originalText: String,

  grossWPM: Number,
  netWPM: Number,

  accuracy: Number,
  totalWords: Number,
  typedWords: Number,
  correctWords: Number,
  errorsDetails: Number,
  typedCharacters: Number,
  expectedCharacters: Number,
  correctCharacters: Number,
  errorPenaltyCharacters: Number,

  //breakdown
  omissions: Number,
  additions: Number,
  spelling: Number,
  capitalization: Number,

  backspaces: Number,
  keystrokes: Number,
  comparison: [
    {
      expected: String,
      typed: String,
      word: String,
      type: String
    }
  ],

  timeTaken: Number,

  settings: {
    backspace: Boolean,
    spellingMode: String,
    ignoreCase: Boolean,
    ignorePunctuation: Boolean,
    timeLimit: Number
  }

}, { timestamps: true });

resultSchema.index({ createdAt: -1 });
resultSchema.index({ accuracy: -1, netWPM: -1, grossWPM: -1, createdAt: -1 });
resultSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Result", resultSchema);
