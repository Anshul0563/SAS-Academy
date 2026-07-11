const Announcement = require("../models/announcement");

const getLatestAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findOne()
      .sort({ updatedAt: -1 })
      .populate("createdBy", "name")
      .lean();

    res.json({
      announcement: announcement || {
        text: "",
        enabled: false,
        createdBy: null,
      },
    });
  } catch (err) {
    console.error("Announcement fetch error:", err);
    res.status(500).json({ message: "Failed to fetch announcement" });
  }
};

const getActiveAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findOne({
      enabled: true,
      text: { $ne: "" },
    })
      .sort({ updatedAt: -1 })
      .populate("createdBy", "name")
      .lean();

    res.json({ announcement: announcement || null });
  } catch (err) {
    console.error("Active announcement fetch error:", err);
    res.status(500).json({ message: "Failed to fetch announcement" });
  }
};

const saveAnnouncement = async (req, res) => {
  try {
    const text = String(req.body.text || "").trim();
    const enabled = Boolean(req.body.enabled);

    if (enabled && !text) {
      return res.status(400).json({ message: "Announcement text is required" });
    }

    const announcement = await Announcement.findOneAndUpdate(
      {},
      {
        text,
        enabled,
        createdBy: req.user?._id || null,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    ).populate("createdBy", "name");

    res.json({
      message: enabled ? "Announcement published" : "Announcement saved",
      announcement,
    });
  } catch (err) {
    console.error("Announcement save error:", err);
    res.status(500).json({ message: "Failed to save announcement" });
  }
};

module.exports = {
  getLatestAnnouncement,
  getActiveAnnouncement,
  saveAnnouncement,
};
