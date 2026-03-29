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
  errors: Number,

  //breakdown
  omissions: Number,
  additions: Number,
  spelling: Number,
  capitalization: Number,

  backspaces: Number,
  keystrokes: Number,

  timeTaken: Number,

  settings: {
    backspace: Boolean,
    spellingMode: String,
    ignoreCase: Boolean,
    ignorePunctuation: Boolean,
    timeLimit: Number
  }

}, { timestamps: true });

module.exports = mongoose.model("Result", resultSchema);