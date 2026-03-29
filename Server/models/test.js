const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  // 🔥 CRITICAL FIX
  type: {
    type: String,
    enum: ["transcription", "dictation"],
    required: true
  },

  passage: {
    type: String
  },

  duration: {
    type: Number,
    default: 5
  },

  difficulty: {
    type: String,
    default: "medium"
  },

  category: {
    type: String
  },

  tags: [
    {
      type: String
    }
  ],

  audio: {
    type: String
  }

}, { timestamps: true });

module.exports = mongoose.model("Test", testSchema);