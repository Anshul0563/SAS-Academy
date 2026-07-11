const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Announcement", announcementSchema);
