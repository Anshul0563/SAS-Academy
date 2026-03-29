const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test"
  },

  startTime: Date,
  endTime: Date,

  status: {
    type: String,
    enum: ["started", "completed", "incomplete"],
    default: "started"
  }

}, { timestamps: true });

module.exports = mongoose.model("Attempt", attemptSchema);