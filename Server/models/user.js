const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },
  otp:{
    type: String,
  },
  otpExpire:{
    type:Date,
  },
  password: {
    type: String,
    required: true
  },

  // Forgot Password Fields
  resetOtp: {
    type: String,
    default: null
  },
  resetOtpExpiry: {
    type: Date,
    default: null
  },
  resetAttempts: {
    type: Number,
    default: 0
  },
  lastOtpSentAt: {
    type: Date,
    default: null
  },
  lastResetAttemptAt: {
    type: Date,
    default: null
  },

  role: {
    type: String,
    enum: ["admin", "student"],
    default: "student"
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);