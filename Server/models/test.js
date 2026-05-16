const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  //  FIXED
  type: {
    type: String,
    enum: ["transcription", "dictation"],
    required: true,
    lowercase: true,
    trim: true
  },

  passage: {
    type: String
  },

  duration: {
    type: Number,
    default: 50
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
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

  audioURL: {
    type: String
  }

}, { timestamps: true });

testSchema.index({ createdAt: -1 });
testSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model("Test", testSchema);
