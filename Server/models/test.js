<<<<<<< HEAD
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

=======
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

>>>>>>> d6c1bf3 (Complete MERN setup: backend APIs, MongoDB integration, authentication, admin dashboard, frontend pages, and bug fixes)
module.exports = mongoose.model("Test", testSchema);