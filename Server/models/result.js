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

  grossWPM: Number,
  netWPM: Number,

  accuracy: Number,
  totalWords: Number,
  correctWords: Number,
  errorsDetails: Number,

  timeTaken: Number,

}, { timestamps: true });

resultSchema.index({ createdAt: -1 });
resultSchema.index({ accuracy: -1, netWPM: -1, grossWPM: -1, createdAt: -1 });
resultSchema.index({ userId: 1, createdAt: -1 });
resultSchema.index({ userId: 1, accuracy: -1, netWPM: -1, grossWPM: -1, createdAt: -1 });

module.exports = mongoose.model("Result", resultSchema);
